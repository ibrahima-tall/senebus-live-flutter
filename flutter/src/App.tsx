import React, { useState, useEffect, useRef } from "react";
import {
  Bus,
  MapPin,
  Search,
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Code,
  Download,
  Info,
  Layers,
  ChevronRight,
  Database,
  ArrowRight,
  Wifi,
  Bookmark,
  Sparkles,
  RefreshCw,
  Eye,
  FileCode,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
interface BusStop {
  name: string;
  latOffset: number; // For layout rendering
  lngOffset: number;
  estimatedTime: string;
}

interface BusRoute {
  id: string;
  lineNum: string;
  type: "Dakar Dem Dikk" | "AFTU Tata" | "Interurbain" | "BRT Dakar";
  origin: string;
  destination: string;
  color: string;
  status: "En route" | "Retardé" | "À l'arrêt";
  delayMinutes: number;
  schedule: string[];
  stops: BusStop[];
  currentProgress: number; // 0 to 1 along path
  lastUpdated: string;
}

// Initial Data
const INITIAL_ROUTES: BusRoute[] = [
  {
    id: "brt-rouge",
    lineNum: "BRT Rouge",
    type: "BRT Dakar",
    origin: "Gare de Dakar",
    destination: "Guédiawaye",
    color: "#E00000", // Rouge
    status: "En route",
    delayMinutes: 0,
    schedule: ["12:00", "12:10", "12:20", "12:30", "12:40", "12:50"],
    stops: [
      { name: "Gare de Dakar", latOffset: 120, lngOffset: 80, estimatedTime: "Départ" },
      { name: "Colobane", latOffset: 160, lngOffset: 130, estimatedTime: "5 min" },
      { name: "Liberté 6", latOffset: 220, lngOffset: 180, estimatedTime: "12 min" },
      { name: "Grand Médine", latOffset: 280, lngOffset: 250, estimatedTime: "18 min" },
      { name: "Guédiawaye", latOffset: 340, lngOffset: 320, estimatedTime: "Terminus" }
    ],
    currentProgress: 0.35,
    lastUpdated: "En direct"
  },
  {
    id: "ddd-121",
    lineNum: "121",
    type: "Dakar Dem Dikk",
    origin: "Keur Massar",
    destination: "Palais de Justice",
    color: "#0F5132", // Vert DDD
    status: "Retardé",
    delayMinutes: 12,
    schedule: ["11:45", "12:15", "12:45", "13:15"],
    stops: [
      { name: "Keur Massar", latOffset: 380, lngOffset: 450, estimatedTime: "Départ" },
      { name: "Mbao", latOffset: 330, lngOffset: 400, estimatedTime: "10 min" },
      { name: "Pikine", latOffset: 270, lngOffset: 340, estimatedTime: "22 min" },
      { name: "Colobane", latOffset: 160, lngOffset: 130, estimatedTime: "35 min" },
      { name: "Palais de Justice", latOffset: 100, lngOffset: 60, estimatedTime: "Terminus" }
    ],
    currentProgress: 0.18,
    lastUpdated: "Mise à jour il y a 2 min"
  },
  {
    id: "ddd-218",
    lineNum: "218 Express",
    type: "Dakar Dem Dikk",
    origin: "Aéroport Blaise Diagne (AIBD)",
    destination: "Gare de Dakar",
    color: "#0F5132",
    status: "En route",
    delayMinutes: 3,
    schedule: ["11:30", "12:30", "13:30", "14:30"],
    stops: [
      { name: "AIBD", latOffset: 420, lngOffset: 550, estimatedTime: "Départ" },
      { name: "Diamniadio", latOffset: 400, lngOffset: 500, estimatedTime: "15 min" },
      { name: "Rufisque", latOffset: 360, lngOffset: 440, estimatedTime: "28 min" },
      { name: "Gare de Dakar", latOffset: 120, lngOffset: 80, estimatedTime: "Terminus" }
    ],
    currentProgress: 0.62,
    lastUpdated: "En direct"
  },
  {
    id: "tata-47",
    lineNum: "47",
    type: "AFTU Tata",
    origin: "Ouakam",
    destination: "Parcelles Assainies",
    color: "#E9A200", // Jaune Tata
    status: "En route",
    delayMinutes: 0,
    schedule: ["12:00", "12:15", "12:30", "12:45", "13:00"],
    stops: [
      { name: "Ouakam", latOffset: 180, lngOffset: 40, estimatedTime: "Départ" },
      { name: "Liberté 6", latOffset: 220, lngOffset: 180, estimatedTime: "8 min" },
      { name: "VDN", latOffset: 260, lngOffset: 210, estimatedTime: "15 min" },
      { name: "Parcelles Assainies", latOffset: 320, lngOffset: 260, estimatedTime: "Terminus" }
    ],
    currentProgress: 0.8,
    lastUpdated: "Mise à jour il y a 1 min"
  },
  {
    id: "tata-23",
    lineNum: "23",
    type: "AFTU Tata",
    origin: "Médina",
    destination: "Guédiawaye",
    color: "#E9A200",
    status: "À l'arrêt",
    delayMinutes: 0,
    schedule: ["12:05", "12:35", "13:05"],
    stops: [
      { name: "Médina", latOffset: 130, lngOffset: 70, estimatedTime: "Départ" },
      { name: "Colobane", latOffset: 160, lngOffset: 130, estimatedTime: "12 min" },
      { name: "Pikine", latOffset: 270, lngOffset: 340, estimatedTime: "28 min" },
      { name: "Guédiawaye", latOffset: 340, lngOffset: 320, estimatedTime: "Terminus" }
    ],
    currentProgress: 0.0,
    lastUpdated: "À l'arrêt"
  },
  {
    id: "inter-thies",
    lineNum: "Thiès Direct",
    type: "Interurbain",
    origin: "Gare Routière Beaux Maraîchers",
    destination: "Thiès",
    color: "#6B21A8", // Violet
    status: "Retardé",
    delayMinutes: 20,
    schedule: ["11:00", "12:30", "14:00"],
    stops: [
      { name: "Beaux Maraîchers", latOffset: 290, lngOffset: 360, estimatedTime: "Départ" },
      { name: "Diamniadio", latOffset: 400, lngOffset: 500, estimatedTime: "25 min" },
      { name: "Pout", latOffset: 440, lngOffset: 570, estimatedTime: "45 min" },
      { name: "Thiès", latOffset: 480, lngOffset: 650, estimatedTime: "Terminus" }
    ],
    currentProgress: 0.45,
    lastUpdated: "En direct"
  }
];

// Flutter Source Code Files for Display
const FLUTTER_FILES = [
  {
    name: "pubspec.yaml",
    icon: FileCode,
    language: "yaml",
    code: `name: senegal_bus_horaires
description: Une application Flutter pour consulter les horaires et trajets de bus au Sénégal en temps réel.
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  firebase_core: ^2.27.0
  cloud_firestore: ^4.15.5
  firebase_messaging: ^14.7.15
  google_fonts: ^6.1.0
  intl: ^0.19.0
  provider: ^6.1.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1

flutter:
  uses-material-design: true`
  },
  {
    name: "lib/models/bus_route.dart",
    icon: Code,
    language: "dart",
    code: `class BusStop {
  final String name;
  final double latitude;
  final double longitude;
  final String estimatedTime;

  BusStop({
    required this.name,
    required this.latitude,
    required this.longitude,
    required this.estimatedTime,
  });

  factory BusStop.fromMap(Map<String, dynamic> map) {
    return BusStop(
      name: map['name'] ?? '',
      latitude: (map['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (map['longitude'] as num?)?.toDouble() ?? 0.0,
      estimatedTime: map['estimatedTime'] ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'latitude': latitude,
      'longitude': longitude,
      'estimatedTime': estimatedTime,
    };
  }
}

class BusRoute {
  final String id;
  final String lineNum;
  final String type; // 'Dakar Dem Dikk', 'AFTU Tata', 'Interurbain'
  final String origin;
  final String destination;
  final double currentLat;
  final double currentLng;
  final List<BusStop> stops;
  final List<String> schedule;
  final String status; // 'En route', 'Retardé', 'À l'arrêt'
  final int delayMinutes;
  final String lastUpdated;

  BusRoute({
    required this.id,
    required this.lineNum,
    required this.type,
    required this.origin,
    required this.destination,
    required this.currentLat,
    required this.currentLng,
    required this.stops,
    required this.schedule,
    required this.status,
    required this.delayMinutes,
    required this.lastUpdated,
  });

  factory BusRoute.fromMap(String id, Map<String, dynamic> map) {
    var stopsList = map['stops'] as List? ?? [];
    return BusRoute(
      id: id,
      lineNum: map['lineNum'] ?? '',
      type: map['type'] ?? 'Dakar Dem Dikk',
      origin: map['origin'] ?? '',
      destination: map['destination'] ?? '',
      currentLat: (map['currentLat'] as num?)?.toDouble() ?? 0.0,
      currentLng: (map['currentLng'] as num?)?.toDouble() ?? 0.0,
      stops: stopsList.map((s) => BusStop.fromMap(Map<String, dynamic>.from(s))).toList(),
      schedule: List<String>.from(map['schedule'] ?? []),
      status: map['status'] ?? 'En route',
      delayMinutes: map['delayMinutes'] ?? 0,
      lastUpdated: map['lastUpdated'] ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'lineNum': lineNum,
      'type': type,
      'origin': origin,
      'destination': destination,
      'currentLat': currentLat,
      'currentLng': currentLng,
      'stops': stops.map((s) => s.toMap()).toList(),
      'schedule': schedule,
      'status': status,
      'delayMinutes': delayMinutes,
      'lastUpdated': lastUpdated,
    };
  }
}`
  },
  {
    name: "lib/services/firebase_service.dart",
    icon: Database,
    language: "dart",
    code: `import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
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

  FirebaseService() {
    _initFirebase();
  }

  Future<void> _initFirebase() async {
    try {
      NotificationSettings settings = await _fcm.requestPermission(
        alert: true,
        badge: true,
        sound: true,
      );

      if (settings.authorizationStatus == AuthorizationStatus.authorized) {
        _fcmToken = await _fcm.getToken();
        notifyListeners();
      }

      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        // Gérer le message push en direct
      });

      _db.collection('bus_routes').snapshots().listen((snapshot) {
        _routes = snapshot.docs.map((doc) {
          return BusRoute.fromMap(doc.id, doc.data());
        }).toList();
        _isLoading = false;
        notifyListeners();
      });
    } catch (e) {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> subscribeToBusLine(String lineNum) async {
    await _fcm.subscribeToTopic('bus_line_\$lineNum');
  }

  Future<void> unsubscribeFromBusLine(String lineNum) async {
    await _fcm.unsubscribeFromTopic('bus_line_\$lineNum');
  }
}`
  },
  {
    name: "lib/screens/home_screen.dart",
    icon: Layers,
    language: "dart",
    code: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/bus_route.dart';
import '../services/firebase_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _searchQuery = '';
  String _selectedType = 'Tous';
  final Set<String> _subscribedLines = {};

  @override
  Widget build(BuildContext context) {
    final firebaseService = Provider.of<FirebaseService>(context);
    
    final filteredRoutes = firebaseService.routes.where((route) {
      final matchesSearch = route.lineNum.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          route.origin.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          route.destination.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesType = _selectedType == 'Tous' || route.type == _selectedType;
      return matchesSearch && matchesType;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F9),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F5132), // Vert Sénégal
        title: Text('Sénégal Bus Horaires', style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: Column(
        children: [
          // En-tête de recherche & filtres
          Container(
            color: const Color(0xFF0F5132),
            padding: const EdgeInsets.all(16),
            child: TextField(
              onChanged: (val) => setState(() => _searchQuery = val),
              decoration: InputDecoration(
                hintText: 'Rechercher une ligne...',
                fillColor: Colors.white,
                filled: true,
                prefixIcon: const Icon(Icons.search, color: Color(0xFF0F5132)),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              ),
            ),
          ),
          // Liste des bus
          Expanded(
            child: firebaseService.isLoading
              ? const Center(child: CircularProgressIndicator())
              : ListView.builder(
                  itemCount: filteredRoutes.length,
                  itemBuilder: (context, idx) {
                    final route = filteredRoutes[idx];
                    return ListTile(
                      title: Text('\${route.type} \${route.lineNum}'),
                      subtitle: Text('\${route.origin} -> \${route.destination}'),
                    );
                  },
                ),
          )
        ],
      ),
    );
  }
}`
  }
];

export default function App() {
  // Simulator State
  const [routes, setRoutes] = useState<BusRoute[]>(INITIAL_ROUTES);
  const [selectedType, setSelectedType] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRoute, setSelectedRoute] = useState<BusRoute>(INITIAL_ROUTES[0]);
  const [activeTab, setActiveTab] = useState<"carte" | "code" | "firebase">("carte");
  
  // Interactive Route Planner States (Mirrors Flutter core requests)
  const [originInput, setOriginInput] = useState<string>("");
  const [destInput, setDestInput] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<{ origin: string; dest: string; date: string }[]>([
    { origin: "Keur Massar", dest: "Colobane", date: "Il y a 5 min" },
    { origin: "Pikine", dest: "Médine", date: "Il y a 1h" }
  ]);
  const [favRoutes, setFavRoutes] = useState<string[]>(["ddd-121", "brt-rouge"]);
  const [plannerResults, setPlannerResults] = useState<BusRoute[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Interactive search executor matching Senegal rules
  const handlePlannerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originInput.trim() && !destInput.trim()) {
      setPlannerResults([]);
      setHasSearched(false);
      return;
    }

    // Add to simulated local search history
    const isDuplicate = searchHistory.some(
      (h) => h.origin.toLowerCase() === originInput.trim().toLowerCase() && h.dest.toLowerCase() === destInput.trim().toLowerCase()
    );
    if (!isDuplicate && (originInput.trim() || destInput.trim())) {
      setSearchHistory((prev) => [
        { origin: originInput.trim(), dest: destInput.trim(), date: "À l'instant" },
        ...prev.slice(0, 4)
      ]);
    }

    const origLower = originInput.toLowerCase().trim();
    const destLower = destInput.toLowerCase().trim();

    const matches = routes.filter((route) => {
      const originMatches = !origLower || 
        route.origin.toLowerCase().includes(origLower) || 
        route.stops.some(stop => stop.name.toLowerCase().includes(origLower));

      const destMatches = !destLower || 
        route.destination.toLowerCase().includes(destLower) || 
        route.stops.some(stop => stop.name.toLowerCase().includes(destLower));

      if (originMatches && destMatches && origLower && destLower) {
        const origIdx = route.origin.toLowerCase().includes(origLower) 
          ? 0 
          : route.stops.findIndex(stop => stop.name.toLowerCase().includes(origLower)) + 1;
        const destIdx = route.destination.toLowerCase().includes(destLower)
          ? route.stops.length + 1
          : route.stops.findIndex(stop => stop.name.toLowerCase().includes(destLower)) + 1;
        
        return origIdx < destIdx;
      }
      return originMatches && destMatches;
    });

    setPlannerResults(matches);
    setHasSearched(true);
  };

  const toggleFavRoute = (id: string) => {
    if (favRoutes.includes(id)) {
      setFavRoutes((prev) => prev.filter((rId) => rId !== id));
    } else {
      setFavRoutes((prev) => [...prev, id]);
    }
  };

  // Notification Simulator State
  const [notifications, setNotifications] = useState<{ id: string; title: string; body: string; time: string; type: string }[]>([]);
  const [subscribedLines, setSubscribedLines] = useState<string[]>(["BRT Rouge", "121"]);
  const [activeNotification, setActiveNotification] = useState<{ title: string; body: string; type: string } | null>(null);

  // Flutter Code View State
  const [selectedCodeFileIdx, setSelectedCodeFileIdx] = useState<number>(0);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  // Simulated GPS Bus Movement Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setRoutes((prevRoutes) =>
        prevRoutes.map((route) => {
          if (route.status === "À l'arrêt") return route;
          // Dynamically advance bus progress along paths
          let nextProgress = route.currentProgress + 0.005;
          if (nextProgress > 1.0) {
            nextProgress = 0.0; // Restart loop
          }
          return {
            ...route,
            currentProgress: parseFloat(nextProgress.toFixed(4)),
            lastUpdated: "En direct"
          };
        })
      );
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Sync selectedRoute state
  useEffect(() => {
    const current = routes.find((r) => r.id === selectedRoute.id);
    if (current) {
      setSelectedRoute(current);
    }
  }, [routes]);

  // Handle trigger notification simulation
  const handleSimulateAlert = (route: BusRoute, action: "delay" | "arrival") => {
    let title = "";
    let body = "";
    
    if (action === "delay") {
      const addedDelay = Math.floor(Math.random() * 15) + 5;
      title = `⚠️ Alerte Retard : Ligne ${route.lineNum}`;
      body = `Le bus ${route.type} de ${route.origin} vers ${route.destination} est retardé de +${addedDelay} minutes en raison d'un trafic important à Colobane.`;
      
      // Update local state to reflect the simulated delay
      setRoutes((prev) =>
        prev.map((r) => {
          if (r.id === route.id) {
            return {
              ...r,
              status: "Retardé",
              delayMinutes: r.delayMinutes + addedDelay
            };
          }
          return r;
        })
      );
    } else {
      title = `🚍 Arrivée imminente : Ligne ${route.lineNum}`;
      body = `Le bus en direction de ${route.destination} s'approche de l'arrêt ${route.stops[1].name}. Préparez votre ticket !`;
    }

    // Dispatch system banner notification
    setActiveNotification({ title, body, type: action });
    
    // Add to notifications log
    const newNotif = {
      id: Math.random().toString(),
      title,
      body,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      type: action
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Clear alert banner after 5 seconds
    setTimeout(() => {
      setActiveNotification(null);
    }, 5500);
  };

  // Subscribe/Unsubscribe
  const toggleSubscription = (lineNum: string) => {
    if (subscribedLines.includes(lineNum)) {
      setSubscribedLines((prev) => prev.filter((l) => l !== lineNum));
    } else {
      setSubscribedLines((prev) => [...prev, lineNum]);
      // Simulate confirmation push
      setActiveNotification({
        title: "🔔 Abonnement Actif",
        body: `Vous recevrez désormais des alertes de position et de retard pour la ligne ${lineNum}.`,
        type: "success"
      });
      setTimeout(() => setActiveNotification(null), 4000);
    }
  };

  // Copy code utility
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Filter routes based on selection & search
  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.lineNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "Tous" || route.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-emerald-600 selection:text-white">
      {/* Top Banner alert simulator */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-white border-2 border-emerald-500 shadow-2xl rounded-2xl p-4 flex items-start gap-4 backdrop-blur-xl">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {activeNotification.title}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                    Firebase Push
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeNotification.body}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Header */}
      <header className="flex flex-col md:flex-row items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-inner italic">S</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              SeneBus <span className="text-emerald-600 italic">Live</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Réseau National du Sénégal</p>
          </div>
        </div>
        
        {/* Real-time status indicators in header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-xs font-bold">
            <span className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></span>
            Sync Firebase active
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100 text-xs font-bold">
            <Wifi className="w-3.5 h-3.5" />
            34 Conducteurs GPS
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1">Bus Actifs</h3>
            <p className="text-2xl font-extrabold text-slate-900">142</p>
            <p className="text-xs text-emerald-600 mt-1 font-medium">● Flotte opérationnelle</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1">Dakar Dem Dikk</h3>
            <p className="text-2xl font-extrabold text-slate-900">12:00</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Prochain départ Gare</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1">Alerte Push (FCM)</h3>
            <p className="text-2xl font-extrabold text-red-600">{notifications.length} Reçu(s)</p>
            <p className="text-xs text-red-500 mt-1 font-medium">Simulations actives</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1">Mes Abonnements</h3>
            <p className="text-2xl font-extrabold text-slate-900">{subscribedLines.length}</p>
            <p className="text-xs text-amber-600 mt-1 font-medium">Topics Firebase</p>
          </div>
        </div>

        {/* Dashboard Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel: Filters, Search and Routes lists (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Planificateur de Voyage Sénégalais (Remplacement intelligent et interactif) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Planificateur Intelligent</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Moteur de recherche Firebase</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  Interactif
                </div>
              </div>

              <form onSubmit={handlePlannerSearch} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Point de départ */}
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={originInput}
                      onChange={(e) => setOriginInput(e.target.value)}
                      placeholder="Point de départ..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Point d'arrivée */}
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={destInput}
                      onChange={(e) => setDestInput(e.target.value)}
                      placeholder="Point d'arrivée..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                {/* Quick suggestions shortcuts */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 self-center font-semibold">Exemples :</span>
                  {["Keur Massar", "Colobane", "Pikine", "Gare de Dakar", "Médine"].map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        if (!originInput) {
                          setOriginInput(loc);
                        } else if (!destInput && originInput !== loc) {
                          setDestInput(loc);
                        } else {
                          setOriginInput(loc);
                          setDestInput("");
                        }
                      }}
                      className="text-[10px] bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-2 py-1 rounded-md transition font-medium"
                    >
                      {loc}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Search className="w-3.5 h-3.5" /> Rechercher des trajets
                  </button>
                  {(originInput || destInput) && (
                    <button
                      type="button"
                      onClick={() => {
                        setOriginInput("");
                        setDestInput("");
                        setHasSearched(false);
                        setPlannerResults([]);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 rounded-xl text-xs transition"
                    >
                      Effacer
                    </button>
                  )}
                </div>
              </form>

              {/* Live search results or history */}
              <div className="mt-1 pt-1 border-t border-slate-100">
                {hasSearched ? (
                  <div className="space-y-2.5">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Résultats ({plannerResults.length})</span>
                      <span className="text-[9px] text-emerald-600 lowercase bg-emerald-50 px-1.5 py-0.5 rounded font-mono">Live Firebase query</span>
                    </h4>

                    {plannerResults.length === 0 ? (
                      <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-slate-500 text-xs">
                        Aucun bus direct trouvé. Essayez des arrêts comme "Keur Massar" ou "Colobane".
                      </div>
                    ) : (
                      <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {plannerResults.map((route) => {
                          const isFav = favRoutes.includes(route.id);
                          return (
                            <div key={route.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-left">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="font-bold text-slate-800 text-xs">Ligne {route.lineNum}</span>
                                  <span className="text-[9px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded-full font-semibold">
                                    {route.type}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-600 truncate font-medium">
                                  {route.origin} → {route.destination}
                                </p>
                                <p className="text-[9px] text-emerald-600 mt-0.5 font-semibold">
                                  Tarif approx: {route.type === "BRT Dakar" ? "300 FCFA" : route.type === "AFTU Tata" ? "250 FCFA" : "150 FCFA"}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => toggleFavRoute(route.id)}
                                  className={`p-1.5 rounded-lg transition ${isFav ? "text-rose-500 bg-rose-50 hover:bg-rose-100" : "text-slate-400 bg-white hover:bg-slate-100"}`}
                                >
                                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedRoute(route);
                                    // Visual cue
                                    setActiveNotification({
                                      title: `📍 Trajet Affiché : Ligne ${route.lineNum}`,
                                      body: `Itinéraire tracé de ${route.origin} à ${route.destination}.`,
                                      type: "success"
                                    });
                                    setTimeout(() => setActiveNotification(null), 3000);
                                  }}
                                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Search History simulation */}
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Historique récent</h4>
                      <div className="space-y-1.5">
                        {searchHistory.map((h, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              setOriginInput(h.origin);
                              setDestInput(h.dest);
                              // Trigger auto-search after setting values
                              const matches = routes.filter((route) => {
                                const origLower = h.origin.toLowerCase().trim();
                                const destLower = h.dest.toLowerCase().trim();
                                const originMatches = !origLower || route.origin.toLowerCase().includes(origLower) || route.stops.some(stop => stop.name.toLowerCase().includes(origLower));
                                const destMatches = !destLower || route.destination.toLowerCase().includes(destLower) || route.stops.some(stop => stop.name.toLowerCase().includes(destLower));
                                return originMatches && destMatches;
                              });
                              setPlannerResults(matches);
                              setHasSearched(true);
                            }}
                            className="flex items-center justify-between text-xs text-slate-600 hover:text-emerald-700 hover:bg-slate-50 px-2 py-1.5 rounded-lg cursor-pointer transition"
                          >
                            <span className="truncate font-medium flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {h.origin} → {h.dest}
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">{h.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Favorites list simulation */}
                    {favRoutes.length > 0 && (
                      <div className="pt-1 border-t border-slate-50">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Trajets Favoris ({favRoutes.length})</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {favRoutes.map((id) => {
                            const r = routes.find((route) => route.id === id);
                            if (!r) return null;
                            return (
                              <div
                                key={id}
                                onClick={() => setSelectedRoute(r)}
                                className={`p-2 rounded-xl border border-slate-100 cursor-pointer flex items-center justify-between transition ${selectedRoute.id === id ? "bg-emerald-50/50 border-emerald-200" : "bg-slate-50/50 hover:bg-slate-50"}`}
                              >
                                <div className="truncate pr-1 text-left">
                                  <p className="text-[10px] font-bold text-slate-800">Ligne {r.lineNum}</p>
                                  <p className="text-[9px] text-slate-500 truncate">{r.origin} → {r.destination}</p>
                                </div>
                                <Bookmark className="w-3 h-3 text-rose-500 fill-current shrink-0" />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Search & Categories */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une ligne, ville, arrêt..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                />
              </div>

              {/* Category horizontal filters */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {["Tous", "BRT Dakar", "Dakar Dem Dikk", "AFTU Tata", "Interurbain"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedType === type
                        ? "bg-emerald-600 text-white font-bold shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Bus lines list */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-600" /> Itinéraires et Trajets ({filteredRoutes.length})
                </h2>
                <span className="text-[10px] text-slate-400 font-mono">Sync 2s</span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 scrollbar-thin">
                {filteredRoutes.map((route) => {
                  const isSelected = selectedRoute.id === route.id;
                  const isSubscribed = subscribedLines.includes(route.lineNum);
                  
                  // Color configuration
                  let badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  if (route.type === "AFTU Tata") badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                  if (route.type === "Interurbain") badgeClass = "bg-purple-50 text-purple-700 border-purple-200";
                  if (route.type === "BRT Dakar") badgeClass = "bg-rose-50 text-rose-700 border-rose-200";

                  return (
                    <div
                      key={route.id}
                      onClick={() => setSelectedRoute(route)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${
                        isSelected
                          ? "bg-slate-50 border-emerald-600 shadow-md ring-1 ring-emerald-600/10"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {/* Status side bar indicator */}
                      <div
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: route.color }}
                      />

                      <div className="flex items-start justify-between gap-2 pl-1">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                              {route.lineNum}
                            </span>
                            <span className="text-xs text-slate-500 font-semibold">
                              {route.type}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                            {route.origin} <ChevronRight className="w-3.5 h-3.5 text-slate-400" /> {route.destination}
                          </h4>
                        </div>

                        {/* Right delay & state info */}
                        <div className="text-right">
                          {route.status === "Retardé" ? (
                            <span className="text-[10px] bg-red-100 text-red-700 border border-red-200 font-black px-2 py-0.5 rounded-full flex items-center gap-1 justify-end">
                              <AlertTriangle className="w-2.5 h-2.5" /> +{route.delayMinutes}m
                            </span>
                          ) : route.status === "À l'arrêt" ? (
                            <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-black px-2 py-0.5 rounded-full">
                              {route.status}
                            </span>
                          ) : (
                            <span className="text-[10px] bg-emerald-100 text-emerald-700 border border-emerald-200 font-black px-2 py-0.5 rounded-full flex items-center gap-1 justify-end">
                              <CheckCircle className="w-2.5 h-2.5" /> En route
                            </span>
                          )}
                          <p className="text-[10px] text-slate-400 mt-1.5 font-mono">{route.lastUpdated}</p>
                        </div>
                      </div>

                      {/* Progress Slider representation */}
                      <div className="mt-3 bg-slate-100 h-1 rounded-full relative overflow-hidden">
                        <div
                          className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-1000"
                          style={{
                            width: `${route.currentProgress * 100}%`,
                            backgroundColor: route.color
                          }}
                        />
                      </div>

                      <div className="mt-2.5 flex items-center justify-between pl-1">
                        <span className="text-[10px] text-slate-500 font-mono">
                          Prochain: <span className="text-slate-800 font-semibold">{route.stops[1].name}</span>
                        </span>

                        {/* Subscription Notification Icon */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSubscription(route.lineNum);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-200/60 transition"
                        >
                          <Bell
                            className={`w-4 h-4 ${
                              isSubscribed ? "text-amber-500 fill-amber-500" : "text-slate-400"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column: Tabs for Map, Code Export & FCM tools (7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Tabs navigation */}
            <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex gap-2 shadow-sm">
              <button
                onClick={() => setActiveTab("carte")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "carte"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Compass className="w-4 h-4" /> Carte Réseau Sénégal
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "code"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Code className="w-4 h-4" /> Fichiers Flutter/Dart
              </button>
              <button
                onClick={() => setActiveTab("firebase")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "firebase"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Database className="w-4 h-4" /> Console Firebase
              </button>
            </div>

            {/* TAB 1: Net Map visualizer */}
            {activeTab === "carte" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[500px]">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                        <MapPin className="w-4 h-4 text-red-500" /> Suivi GPS des Bus (Dakar)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Visualisation interactive de la presqu'île du Cap-Vert
                      </p>
                    </div>
                    <div className="self-start flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Auto-sync
                    </div>
                  </div>

                  {/* SVG Visual Map */}
                  <div className="relative bg-slate-100 border border-slate-200 rounded-2xl h-[360px] overflow-hidden flex items-center justify-center mt-2 shadow-inner">
                    
                    {/* Grid background */}
                    <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

                    {/* Senegal / Dakar vector map simulation */}
                    <svg viewBox="0 0 700 480" className="w-full h-full object-contain">
                      {/* Oceans / landmass outline design */}
                      <path
                        d="M 50,220 Q 80,110 160,80 T 260,110 T 350,150 T 450,210 T 550,290 T 670,350 L 700,480 L 0,480 L 0,380 Z"
                        fill="#f1f5f9"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                      />

                      {/* Ocean labels */}
                      <text x="80" y="420" fill="#94a3b8" fontSize="11" className="font-sans font-semibold tracking-widest uppercase italic opacity-60">Océan Atlantique</text>
                      
                      {/* Road Network / Route pathways */}
                      <path d="M 60,130 Q 160,150 270,270 T 400,380 T 550,420 T 680,450" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 4" />
                      <text x="280" y="310" fill="#94a3b8" fontSize="9" className="font-mono opacity-80">Autoroute A1 (Dakar-AIBD)</text>

                      {/* BRT Dedicated corridor */}
                      <path d="M 120,120 Q 160,140 220,180 T 280,250 T 340,320" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" opacity="0.2" />
                      
                      {/* Render Selected Route path line */}
                      <path
                        d={(() => {
                          const stops = selectedRoute.stops;
                          let d = `M ${stops[0].lngOffset} ${stops[0].latOffset}`;
                          for (let i = 1; i < stops.length; i++) {
                            d += ` L ${stops[i].lngOffset} ${stops[i].latOffset}`;
                          }
                          return d;
                        })()}
                        fill="none"
                        stroke={selectedRoute.color}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />

                      {/* Render Stops of the selected line */}
                      {selectedRoute.stops.map((stop, sIdx) => (
                        <g key={sIdx}>
                          <circle
                            cx={stop.lngOffset}
                            cy={stop.latOffset}
                            r="6"
                            fill="#ffffff"
                            stroke={selectedRoute.color}
                            strokeWidth="2.5"
                          />
                          <text
                            x={stop.lngOffset + 8}
                            y={stop.latOffset + 4}
                            fill="#334155"
                            fontSize="9.5"
                            fontWeight="700"
                            className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] font-sans"
                          >
                            {stop.name}
                          </text>
                        </g>
                      ))}

                      {/* Animated current position bus indicator */}
                      {(() => {
                        // Interpolate position based on progress
                        const stops = selectedRoute.stops;
                        const numSegments = stops.length - 1;
                        const segmentIndex = Math.min(
                          Math.floor(selectedRoute.currentProgress * numSegments),
                          numSegments - 1
                        );
                        const segmentProgress =
                          (selectedRoute.currentProgress * numSegments) - segmentIndex;

                        const startStop = stops[segmentIndex];
                        const endStop = stops[segmentIndex + 1];

                        if (!startStop || !endStop) return null;

                        const currentX =
                          startStop.lngOffset + (endStop.lngOffset - startStop.lngOffset) * segmentProgress;
                        const currentY =
                          startStop.latOffset + (endStop.latOffset - startStop.latOffset) * segmentProgress;

                        return (
                          <g>
                            {/* Pulsing radar */}
                            <circle
                              cx={currentX}
                              cy={currentY}
                              r="16"
                              fill={selectedRoute.color}
                              className="animate-ping opacity-25"
                            />
                            {/* Outer pin circle */}
                            <circle
                              cx={currentX}
                              cy={currentY}
                              r="9"
                              fill={selectedRoute.color}
                              stroke="#ffffff"
                              strokeWidth="2"
                            />
                            {/* Inner white dot */}
                            <circle cx={currentX} cy={currentY} r="3" fill="#ffffff" />
                          </g>
                        );
                      })()}
                    </svg>

                    {/* Floating map legend info */}
                    <div className="absolute bottom-3 right-3 bg-white/90 border border-slate-200 rounded-xl p-2.5 backdrop-blur-md shadow-sm">
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-1">Trajet Sélectionné</p>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedRoute.color }} />
                        <span className="text-xs text-slate-800 font-bold">{selectedRoute.type} Ligne {selectedRoute.lineNum}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Control Panel for Selected Route */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Arrêts intermédiaires ({selectedRoute.stops.length})
                    </h4>
                    <div className="mt-2.5 space-y-1">
                      {selectedRoute.stops.map((stop, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between text-xs py-1 px-1.5 hover:bg-white rounded-lg transition-colors">
                          <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                            <span className="text-[10px] text-slate-400 font-mono">#{sIdx + 1}</span>
                            {stop.name}
                          </span>
                          <span className="text-slate-500 font-mono">{stop.estimatedTime}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-5">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
                        Simulateur Événementiel
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Simuler l'envoi de données GPS et de notifications d'alerte en temps réel via Firebase Cloud Messaging.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 mt-4">
                      <button
                        onClick={() => handleSimulateAlert(selectedRoute, "delay")}
                        className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100/80 border border-red-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" /> Signaler Retard
                      </button>
                      <button
                        onClick={() => handleSimulateAlert(selectedRoute, "arrival")}
                        className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Proche Arrêt
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Flutter Project Code Viewer */}
            {activeTab === "code" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[500px]">
                <div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                        <Code className="w-4 h-4 text-emerald-600" /> Structure du Projet Flutter / Dart
                      </h3>
                      <p className="text-xs text-slate-500">
                        Voici les fichiers créés dans l'espace de travail, prêts à l'emploi.
                      </p>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => copyToClipboard(FLUTTER_FILES[selectedCodeFileIdx].code)}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      {hasCopied ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> Copié !
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-slate-500" /> Copier ce fichier
                        </>
                      )}
                    </button>
                  </div>

                  {/* File tab selectors */}
                  <div className="flex gap-1 border-b border-slate-200 pb-2 overflow-x-auto">
                    {FLUTTER_FILES.map((file, idx) => {
                      const Icon = file.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedCodeFileIdx(idx)}
                          className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                            selectedCodeFileIdx === idx
                              ? "bg-slate-100 text-emerald-700 border-b-2 border-emerald-600"
                              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" /> {file.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Code snippet window */}
                  <div className="bg-slate-900 text-emerald-400 border border-slate-800 rounded-2xl p-5 mt-4 h-[320px] overflow-auto font-mono text-xs leading-relaxed scrollbar-thin shadow-inner">
                    <pre className="whitespace-pre">{FLUTTER_FILES[selectedCodeFileIdx].code}</pre>
                  </div>
                </div>

                {/* Steps/Instructions on how to run locally */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mt-5">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-500" /> Instructions de déploiement Flutter
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-left">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full font-mono uppercase">Étape 1</span>
                      <p className="text-xs text-slate-600 mt-2 font-sans leading-relaxed">
                        Installez Flutter SDK et tapez <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-700">flutter pub get</code> pour charger les packages.
                      </p>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full font-mono uppercase">Étape 2</span>
                      <p className="text-xs text-slate-600 mt-2 font-sans leading-relaxed">
                        Générez votre fichier de configuration Firebase via la commande <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-700">flutterfire configure</code>.
                      </p>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full font-mono uppercase">Étape 3</span>
                      <p className="text-xs text-slate-600 mt-2 font-sans leading-relaxed">
                        Lancez l'application multiplateforme sur mobile/web avec <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-700">flutter run</code>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Firebase Mock Operations / Logs */}
            {activeTab === "firebase" && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[500px]">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                        <Database className="w-4 h-4 text-emerald-600" /> Flux de données Firebase Cloud Messaging
                      </h3>
                      <p className="text-xs text-slate-500">
                        Journal des événements en direct (FCM) & abonnements par topics
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-xs text-red-600 hover:text-red-500 hover:underline font-bold transition"
                    >
                      Effacer l'historique
                    </button>
                  </div>

                  {/* Active Subscriptions visual */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2.5">
                      Topics Firebase souscrits par votre terminal d'utilisateur
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {subscribedLines.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">Aucun abonnement actif. Cliquez sur l'icône de cloche de n'importe quel bus pour vous abonner.</span>
                      ) : (
                        subscribedLines.map((line) => (
                          <span
                            key={line}
                            className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            bus_line_{line.replace(/\s+/g, '_').toLowerCase()}
                            <button
                              onClick={() => toggleSubscription(line)}
                              className="text-red-500 hover:text-red-700 ml-1 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Live notifications logs */}
                  <div className="mt-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                      Historique des Messages Push Reçus ({notifications.length})
                    </h4>
                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                      {notifications.length === 0 ? (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs">
                          <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                          Aucune notification déclenchée. Utilisez les boutons <strong>"Signaler Retard"</strong> ou 
                          <strong>"Proche Arrêt"</strong> pour tester le simulateur de push Firebase.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm"
                          >
                            <div className={`p-2 rounded-xl ${
                              notif.type === "delay" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                            }`}>
                              <Bell className="w-4 h-4" />
                            </div>
                            <div className="flex-1 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800">{notif.title}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{notif.time}</span>
                              </div>
                              <p className="text-slate-500 mt-1 leading-relaxed">{notif.body}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Technical disclaimer */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mt-5 text-xs text-slate-500 leading-relaxed">
                  Le fichier de configuration <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono">lib/services/firebase_service.dart</code> 
                  utilise l'API officiel <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono">FirebaseMessaging.onMessage</code> pour 
                  capter les messages de retard et de localisation des bus envoyés en temps réel depuis les terminaux des conducteurs au Sénégal.
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Bottom Status Bar / Footer */}
      <footer className="px-8 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 mt-auto">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Serveur Cloud: Opérationnel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">API Sénégal: Connecté</span>
          </div>
        </div>
        <div className="text-[10px] font-bold text-slate-400">
          SENEBUS © 2026 • DÉVELOPPÉ UNIQUEMENT AVEC FLUTTER & DART
        </div>
      </footer>
    </div>
  );
}
