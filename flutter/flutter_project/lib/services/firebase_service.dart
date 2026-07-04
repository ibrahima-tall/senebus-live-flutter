import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/bus_route.dart';

class FirebaseService extends ChangeNotifier {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  
  List<BusRoute> _routes = [];
  List<BusRoute> get routes => _routes;
  
  bool _isLoading = true;
  bool get isLoading => _isLoading;

  String? _fcmToken;
  String? get fcmToken => _fcmToken;

  List<String> _favoriteLineNums = [];
  List<String> get favoriteLineNums => _favoriteLineNums;

  List<Map<String, String>> _searchHistory = [];
  List<Map<String, String>> get searchHistory => _searchHistory;

  SharedPreferences? _prefs;

  FirebaseService() {
    _initFirebase();
  }

  Future<void> _initFirebase() async {
    try {
      // Charger les SharedPreferences pour les favoris et l'historique de recherche
      _prefs = await SharedPreferences.getInstance();
      _loadFavoritesAndHistory();

      // Demander l'autorisation pour les notifications push
      NotificationSettings settings = await _fcm.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );

      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        if (kDebugMode) {
          print('Utilisateur a autorisé les notifications');
        }
        
        // Récupérer le jeton de notification FCM
        _fcmToken = await _fcm.getToken();
        notifyListeners();
      }

      // Écouter les messages FCM en premier plan
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        if (kDebugMode) {
          print('Message reçu en premier plan : ${message.notification?.title}');
        }
      });

      // Écouter les mises à jour des trajets en temps réel depuis Firestore
      _db.collection('bus_routes').snapshots().listen((snapshot) {
        _routes = snapshot.docs.map((doc) {
          return BusRoute.fromMap(doc.id, doc.data());
        }).toList();
        
        _isLoading = false;
        notifyListeners();
      }, onError: (error) {
        if (kDebugMode) {
          print('Erreur Firestore: $error');
        }
        _isLoading = false;
        notifyListeners();
      });
    } catch (e) {
      if (kDebugMode) {
        print('Erreur d\'initialisation Firebase: $e');
      }
      _isLoading = false;
      notifyListeners();
    }
  }

  // S'abonner à une ligne de bus spécifique pour recevoir des notifications d'alerte de retard
  Future<void> subscribeToBusLine(String lineNum) async {
    try {
      await _fcm.subscribeToTopic('bus_line_$lineNum');
      if (kDebugMode) {
        print('Abonné avec succès aux notifications pour la ligne $lineNum');
      }
    } catch (e) {
      if (kDebugMode) {
        print('Erreur abonnement topic: $e');
      }
    }
  }

  // Se désabonner d'une ligne de bus
  Future<void> unsubscribeFromBusLine(String lineNum) async {
    try {
      await _fcm.unsubscribeFromTopic('bus_line_$lineNum');
      if (kDebugMode) {
        print('Désabonné de la ligne $lineNum');
      }
    } catch (e) {
      if (kDebugMode) {
        print('Erreur désabonnement topic: $e');
      }
    }
  }

  // Mettre à jour la position du bus en temps réel (pour l'application conducteur / admin)
  Future<void> updateBusLocation(String routeId, double lat, double lng, String status, int delay) async {
    try {
      await _db.collection('bus_routes').doc(routeId).update({
        'currentLat': lat,
        'currentLng': lng,
        'status': status,
        'delayMinutes': delay,
        'lastUpdated': DateTime.now().toIso8601String(),
      });
    } catch (e) {
      if (kDebugMode) {
        print('Erreur mise à jour position: $e');
      }
    }
  }

  // --- Gestion locale des favoris et de l'historique ---

  void _loadFavoritesAndHistory() {
    if (_prefs == null) return;

    // Favoris
    _favoriteLineNums = _prefs!.getStringList('favorite_bus_lines') ?? [];

    // Historique
    List<String> historyStrings = _prefs!.getStringList('search_history_v2') ?? [];
    _searchHistory = historyStrings.map((item) {
      try {
        final Map<String, dynamic> decoded = json.decode(item);
        return {
          'origin': decoded['origin']?.toString() ?? '',
          'destination': decoded['destination']?.toString() ?? '',
          'timestamp': decoded['timestamp']?.toString() ?? '',
        };
      } catch (e) {
        return <String, String>{};
      }
    }).where((element) => element.isNotEmpty).toList();

    notifyListeners();
  }

  Future<void> toggleFavorite(String lineNum) async {
    if (_favoriteLineNums.contains(lineNum)) {
      _favoriteLineNums.remove(lineNum);
    } else {
      _favoriteLineNums.add(lineNum);
    }
    notifyListeners();
    if (_prefs != null) {
      await _prefs!.setStringList('favorite_bus_lines', _favoriteLineNums);
    }
  }

  bool isFavorite(String lineNum) {
    return _favoriteLineNums.contains(lineNum);
  }

  Future<void> addToSearchHistory(String origin, String destination) async {
    if (origin.trim().isEmpty && destination.trim().isEmpty) return;

    // Éviter les doublons exacts récents
    _searchHistory.removeWhere((item) =>
        item['origin']!.toLowerCase() == origin.trim().toLowerCase() &&
        item['destination']!.toLowerCase() == destination.trim().toLowerCase());

    _searchHistory.insert(0, {
      'origin': origin.trim(),
      'destination': destination.trim(),
      'timestamp': DateTime.now().toIso8601String(),
    });

    // Limiter l'historique à 10 entrées
    if (_searchHistory.length > 10) {
      _searchHistory = _searchHistory.sublist(0, 10);
    }

    notifyListeners();

    if (_prefs != null) {
      List<String> historyStrings = _searchHistory.map((item) => json.encode(item)).toList();
      await _prefs!.setStringList('search_history_v2', historyStrings);
    }
  }

  Future<void> clearSearchHistory() async {
    _searchHistory.clear();
    notifyListeners();
    if (_prefs != null) {
      await _prefs!.remove('search_history_v2');
    }
  }

  // --- Moteur de recherche d'itinéraires interrogeant Firebase ---
  // Recherche les trajets dont l'origine (ou un arrêt) correspond au point de départ,
  // et la destination (ou un arrêt ultérieur) correspond au point d'arrivée.
  Future<List<BusRoute>> searchRoutesFirebase(String originText, String destinationText) async {
    if (originText.trim().isEmpty && destinationText.trim().isEmpty) {
      return _routes;
    }

    // Ajouter la recherche à l'historique persistant local
    await addToSearchHistory(originText, destinationText);

    try {
      // Interroge Firebase directement
      QuerySnapshot querySnapshot = await _db.collection('bus_routes').get();
      List<BusRoute> allRoutes = querySnapshot.docs.map((doc) {
        return BusRoute.fromMap(doc.id, doc.data() as Map<String, dynamic>);
      }).toList();

      final originLower = originText.trim().toLowerCase();
      final destLower = destinationText.trim().toLowerCase();

      return allRoutes.where((route) {
        // Validation départ (soit l'origine finale, soit un arrêt intermédiaire)
        bool originMatches = originLower.isEmpty ||
            route.origin.toLowerCase().contains(originLower) ||
            route.stops.any((stop) => stop.name.toLowerCase().contains(originLower));

        // Validation arrivée (soit la destination finale, soit un arrêt intermédiaire)
        bool destMatches = destLower.isEmpty ||
            route.destination.toLowerCase().contains(destLower) ||
            route.stops.any((stop) => stop.name.toLowerCase().contains(destLower));

        // Si départ et arrivée sont fournis, vérifier la cohérence directionnelle (départ avant l'arrivée)
        if (originMatches && destMatches && originLower.isNotEmpty && destLower.isNotEmpty) {
          int originIdx = route.origin.toLowerCase().contains(originLower)
              ? 0
              : route.stops.indexWhere((stop) => stop.name.toLowerCase().contains(originLower)) + 1;

          int destIdx = route.destination.toLowerCase().contains(destLower)
              ? route.stops.length + 1
              : route.stops.indexWhere((stop) => stop.name.toLowerCase().contains(destLower)) + 1;

          return originIdx < destIdx;
        }

        return originMatches && destMatches;
      }).toList();
    } catch (e) {
      if (kDebugMode) {
        print('Erreur de recherche Firestore directe: $e. Utilisation du cache local.');
      }
      
      // Fallback sur le cache de la liste temps réel synchronisée
      final originLower = originText.trim().toLowerCase();
      final destLower = destinationText.trim().toLowerCase();

      return _routes.where((route) {
        bool originMatches = originLower.isEmpty ||
            route.origin.toLowerCase().contains(originLower) ||
            route.stops.any((stop) => stop.name.toLowerCase().contains(originLower));

        bool destMatches = destLower.isEmpty ||
            route.destination.toLowerCase().contains(destLower) ||
            route.stops.any((stop) => stop.name.toLowerCase().contains(destLower));

        if (originMatches && destMatches && originLower.isNotEmpty && destLower.isNotEmpty) {
          int originIdx = route.origin.toLowerCase().contains(originLower)
              ? 0
              : route.stops.indexWhere((stop) => stop.name.toLowerCase().contains(originLower)) + 1;

          int destIdx = route.destination.toLowerCase().contains(destLower)
              ? route.stops.length + 1
              : route.stops.indexWhere((stop) => stop.name.toLowerCase().contains(destLower)) + 1;

          return originIdx < destIdx;
        }

        return originMatches && destMatches;
      }).toList();
    }
  }
}
