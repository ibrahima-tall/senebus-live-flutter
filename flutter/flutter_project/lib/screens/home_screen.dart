import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
importer '../models/bus_route.dart';
importer '../services/firebase_service.dart';

classe HomeScreen étend StatefulWidget {
  const HomeScreen({super.key});
  @outrepasser
  État<Écran d'accueil> créerÉtat() => _ÉtatÉcran d'accueil();
}

classe _HomeScreenState étend State<HomeScreen> {
  Chaîne _searchQuery = '';
  Chaîne _selectedType = 'Tous';
  final Set<String> _subscribedLines = {};

  @outrepasser
  Widget build(BuildContext context) {
    final firebaseService = Provider.of<FirebaseService>(context);
    
    final filteredRoutes = firebaseService.routes.where((route) {
      final matchesSearch = route.lineNum.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          route.origin.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          route.destination.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesType = _selectedType == 'Tous' || route.type == _selectedType;
      retourner matchesSearch && matchesType;
    }).toList();

    retourner Scaffold(
      couleur de fond : const Color(0xFFF4F6F9),
      appBar : AppBar(
        backgroundColor: const Color(0xFF0F5132), // Vert Sénégal
        titre: Text('Sénégal Bus Horaires', style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      corps : Colonne(
        enfants: [
          // En-tête de recherche & filtres
          Récipient(
            couleur : const Color(0xFF0F5132),
            marge intérieure : const EdgeInsets.all(16),
            enfant : TextField(
              onChanged : (val) => setState(() => _searchQuery = val),
              décoration : InputDecoration(
                soupçonText: 'Rechercher une ligne...',
                couleur de remplissage : Couleurs.blanc,
                rempli : vrai,
                préfixeIcon: const Icon(Icons.search, color: Color(0xFF0F5132)),
                bordure : OutlineInputBorder(borderRadius : BorderRadius.circular(12), borderSide : BorderSide.none),
              ),
            ),
          ),
          // Liste des bus
          Étendu(
            enfant : firebaseService.isLoading
              ? const Center(enfant : CircularProgressIndicator())
              : ListView.builder(
                  nombre d'éléments : longueur des routes filtrées,
                  itemBuilder : (contexte, idx) {
                    route finale = routesfiltrées[idx];
                    retourner ListTile(
                      titre : Texte('${route.type} ${route.lineNum}'),
                      sous-titre : Texte('${route.origin} -> ${route.destination}'),
                    );
                  },
                ),
          )
        ],
      ),
    );
  }
}