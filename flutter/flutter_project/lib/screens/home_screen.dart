import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong2.dart' as latlong;
import '../models/bus_route.dart';
import '../services/firebase_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  late final MapController _mapController;
  int _currentTab = 0; // 0: Direct & Carte, 1: Recherche d'Itinéraires, 2: Favoris

  // Contrôles de filtrage / recherche générale (Tab 0)
  String _searchQuery = '';
  String _selectedType = 'Tous'; // 'Tous', 'Dakar Dem Dikk', 'AFTU Tata', 'Interurbain'
  BusRoute? _selectedRouteForMap;

  // Contrôles de recherche multicritère (Tab 1)
  final TextEditingController _originController = TextEditingController();
  final TextEditingController _destinationController = TextEditingController();
  List<BusRoute> _searchResults = [];
  bool _hasSearched = false;
  bool _isSearchingDirectly = false;

  @override
  void initState() {
    super.initState();
    _mapController = MapController();
  }

  @override
  void dispose() {
    _originController.dispose();
    _destinationController.dispose();
    super.dispose();
  }

  // Se recentrer sur les coordonnées par défaut de Dakar ou sur le bus sélectionné
  void _centerMapOnSelected() {
    if (_selectedRouteForMap != null) {
      _mapController.move(
        latlong.LatLng(_selectedRouteForMap!.currentLat, _selectedRouteForMap!.currentLng),
        13.5,
      );
    } else {
      // Point central de Dakar (Médina/Plateau/VDN)
      _mapController.move(latlong.LatLng(14.72, -17.45), 11.5);
    }
  }

  @override
  Widget build(BuildContext context) {
    final firebaseService = Provider.of<FirebaseService>(context);

    // Filtrage simple pour l'onglet principal "Direct"
    final filteredRoutes = firebaseService.routes.where((route) {
      final matchesSearch = route.lineNum.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          route.origin.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          route.destination.toLowerCase().contains(_searchQuery.toLowerCase());
      
      final matchesType = _selectedType == 'Tous' || route.type == _selectedType;
      
      return matchesSearch && matchesType;
    }).toList();

    // S'assurer qu'un trajet est sélectionné par défaut si la liste change
    if (_selectedRouteForMap == null && firebaseService.routes.isNotEmpty) {
      _selectedRouteForMap = firebaseService.routes.first;
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F9),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F5132), // Vert Sénégal
        elevation: 2,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFFE9A200), // Jaune Sénégal
                borderRadius: BorderRadius.circular(6),
              ),
              child: const Text(
                'SENE',
                style: TextStyle(
                  color: Color(0xFF0F5132),
                  fontWeight: FontWeight.black,
                  fontSize: 13,
                  letterSpacing: 1,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Text(
              'Bus Live Sénégal',
              style: GoogleFonts.spaceGrotesk(
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontSize: 18,
              ),
            ),
          ],
        ),
        actions: [
          // Statut de synchronisation Firebase
          Container(
            margin: const EdgeInsets.only(right: 12),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.15),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Colors.emeraldAccent,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 6),
                const Text(
                  'FCM Actif',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentTab,
        children: [
          _buildDirectTab(filteredRoutes, firebaseService),
          _buildSearchTab(firebaseService),
          _buildFavoritesTab(firebaseService),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentTab,
        selectedItemColor: const Color(0xFF0F5132),
        unselectedItemColor: Colors.grey.shade600,
        selectedLabelStyle: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 12),
        unselectedLabelStyle: GoogleFonts.poppins(fontSize: 11),
        onTap: (index) {
          setState(() {
            _currentTab = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.map),
            label: 'Direct & Carte',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.route),
            label: 'Recherche',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            label: 'Favoris',
          ),
        ],
      ),
    );
  }

  // ================= TAB 0: DIRECT & INTERACTIVE MAP =================
  Widget _buildDirectTab(List<BusRoute> filteredRoutes, FirebaseService service) {
    return Column(
      children: [
        // Carte Interactive du Sénégal
        Expanded(
          flex: 4,
          child: Stack(
            children: [
              FlutterMap(
                mapController: _mapController,
                options: MapOptions(
                  initialCenter: _selectedRouteForMap != null
                      ? latlong.LatLng(_selectedRouteForMap!.currentLat, _selectedRouteForMap!.currentLng)
                      : const latlong.LatLng(14.7167, -17.4677),
                  initialZoom: 12.0,
                ),
                children: [
                  // Couche OpenStreetMap
                  TileLayer(
                    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'com.senegal.bus.horaires',
                  ),
                  
                  // Tracer de polyligne pour l'itinéraire du bus sélectionné
                  if (_selectedRouteForMap != null && _selectedRouteForMap!.stops.isNotEmpty)
                    PolylineLayer(
                      polylines: [
                        Polyline(
                          points: _selectedRouteForMap!.stops
                              .map((s) => latlong.LatLng(s.latitude, s.longitude))
                              .toList(),
                          strokeWidth: 4.5,
                          color: _getCategoryColor(_selectedRouteForMap!.type),
                        ),
                      ],
                    ),

                  // Couche des Arrêts principaux (Seulement pour le bus sélectionné)
                  if (_selectedRouteForMap != null)
                    MarkerLayer(
                      markers: _selectedRouteForMap!.stops.map((stop) {
                        return Marker(
                          point: latlong.LatLng(stop.latitude, stop.longitude),
                          width: 45,
                          height: 45,
                          child: Tooltip(
                            message: '${stop.name} (${stop.estimatedTime})',
                            child: Column(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(4),
                                    boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 2)],
                                    border: Border.all(color: Colors.grey.shade400, width: 0.5),
                                  ),
                                  child: Text(
                                    stop.name,
                                    style: const TextStyle(fontSize: 7, fontWeight: FontWeight.bold, color: Colors.black),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                const Icon(
                                  Icons.location_on,
                                  color: Colors.redAccent,
                                  size: 16,
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),

                  // Couche des Positions des Bus en Temps Réel
                  MarkerLayer(
                    markers: service.routes.map((route) {
                      final isSelected = _selectedRouteForMap?.id == route.id;
                      return Marker(
                        point: latlong.LatLng(route.currentLat, route.currentLng),
                        width: isSelected ? 50.0 : 40.0,
                        height: isSelected ? 50.0 : 40.0,
                        child: GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedRouteForMap = route;
                            });
                            _centerMapOnSelected();
                          },
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              // Badge de numéro de ligne au-dessus du bus
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                                decoration: BoxDecoration(
                                  color: isSelected ? const Color(0xFFE9A200) : const Color(0xFF0F5132),
                                  borderRadius: BorderRadius.circular(4),
                                  boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 3)],
                                ),
                                child: Text(
                                  route.lineNum,
                                  style: TextStyle(
                                    color: isSelected ? Colors.black : Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 9,
                                  ),
                                ),
                              ),
                              AnimatedContainer(
                                duration: const Duration(milliseconds: 500),
                                padding: EdgeInsets.all(isSelected ? 6 : 4),
                                decoration: BoxDecoration(
                                  color: isSelected ? const Color(0xFFE9A200) : Colors.white,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: _getCategoryColor(route.type), width: 2),
                                  boxShadow: [
                                    BoxShadow(
                                      color: _getCategoryColor(route.type).withOpacity(0.4),
                                      blurRadius: 6,
                                      spreadRadius: 2,
                                    )
                                  ],
                                ),
                                child: Icon(
                                  Icons.directions_bus,
                                  color: isSelected ? Colors.black : _getCategoryColor(route.type),
                                  size: isSelected ? 18 : 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ),
              
              // Boutons flottants de contrôle de la carte
              Positioned(
                top: 12,
                right: 12,
                child: Column(
                  children: [
                    FloatingActionButton.small(
                      heroTag: 'zoomInBtn',
                      backgroundColor: Colors.white,
                      onPressed: () => _mapController.move(_mapController.camera.center, _mapController.camera.zoom + 1),
                      child: const Icon(Icons.add, color: Color(0xFF0F5132)),
                    ),
                    const SizedBox(height: 6),
                    FloatingActionButton.small(
                      heroTag: 'zoomOutBtn',
                      backgroundColor: Colors.white,
                      onPressed: () => _mapController.move(_mapController.camera.center, _mapController.camera.zoom - 1),
                      child: const Icon(Icons.remove, color: Color(0xFF0F5132)),
                    ),
                    const SizedBox(height: 6),
                    FloatingActionButton.small(
                      heroTag: 'recenterBtn',
                      backgroundColor: const Color(0xFFE9A200),
                      onPressed: _centerMapOnSelected,
                      child: const Icon(Icons.my_location, color: Colors.black),
                    ),
                  ],
                ),
              ),

              // Bannière d'info-bulle du trajet sélectionné
              if (_selectedRouteForMap != null)
                Positioned(
                  bottom: 12,
                  left: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.95),
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8, spreadRadius: 1)],
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          backgroundColor: _getCategoryColor(_selectedRouteForMap!.type),
                          radius: 18,
                          child: const Icon(Icons.directions_bus, color: Colors.white, size: 18),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'Ligne ${_selectedRouteForMap!.lineNum} - ${_selectedRouteForMap!.type}',
                                style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.black87),
                              ),
                              Text(
                                '${_selectedRouteForMap!.origin} → ${_selectedRouteForMap!.destination}',
                                style: const TextStyle(fontSize: 11, color: Colors.black54),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: _selectedRouteForMap!.status == 'Retardé'
                                ? const Color(0xFFFFF3CD)
                                : const Color(0xFFD1E7DD),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            _selectedRouteForMap!.status,
                            style: TextStyle(
                              color: _selectedRouteForMap!.status == 'Retardé'
                                  ? const Color(0xFF664D03)
                                  : const Color(0xFF0F5132),
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),

        // Filtres & Liste de bus en bas
        Expanded(
          flex: 5,
          child: Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(24),
                topRight: Radius.circular(24),
              ),
              boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, spreadRadius: 1)],
            ),
            child: Column(
              children: [
                // Barre de recherche de lignes de bus
                Padding(
                  padding: const EdgeInsets.only(left: 16, right: 16, top: 16),
                  child: TextField(
                    onChanged: (val) {
                      setState(() {
                        _searchQuery = val;
                      });
                    },
                    decoration: InputDecoration(
                      hintText: 'Rechercher une ligne, ville, arrêt...',
                      prefixIcon: const Icon(Icons.search, color: Color(0xFF0F5132)),
                      fillColor: const Color(0xFFF4F6F9),
                      filled: true,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(vertical: 0),
                    ),
                  ),
                ),

                // Boutons de filtres horizontaux
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  child: SizedBox(
                    height: 34,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      children: [
                        _buildFilterTab('Tous'),
                        const SizedBox(width: 6),
                        _buildFilterTab('Dakar Dem Dikk'),
                        const SizedBox(width: 6),
                        _buildFilterTab('AFTU Tata'),
                        const SizedBox(width: 6),
                        _buildFilterTab('Interurbain'),
                      ],
                    ),
                  ),
                ),

                const Divider(height: 1, color: Colors.black12),

                // Liste de bus
                Expanded(
                  child: service.isLoading
                      ? const Center(
                          child: CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFE9A200)),
                          ),
                        )
                      : filteredRoutes.isEmpty
                          ? Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(Icons.search_off, size: 48, color: Colors.grey),
                                  const SizedBox(height: 12),
                                  Text(
                                    'Aucun bus disponible avec ces critères.',
                                    style: GoogleFonts.poppins(color: Colors.grey.shade600, fontSize: 13),
                                  ),
                                ],
                              ),
                            )
                          : ListView.builder(
                              padding: const EdgeInsets.all(12),
                              itemCount: filteredRoutes.length,
                              itemBuilder: (context, index) {
                                final route = filteredRoutes[index];
                                final isSelected = _selectedRouteForMap?.id == route.id;
                                return _buildBusCard(route, isSelected, service);
                              },
                            ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildFilterTab(String label) {
    final isSelected = _selectedType == label;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedType = label;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0F5132) : const Color(0xFFF4F6F9),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Center(
          child: Text(
            label,
            style: GoogleFonts.poppins(
              color: isSelected ? Colors.white : Colors.black87,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              fontSize: 11,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBusCard(BusRoute route, bool isSelected, FirebaseService service) {
    final isFav = service.isFavorite(route.lineNum);
    return Card(
      color: isSelected ? const Color(0xFFF1F7F4) : Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: isSelected ? const Color(0xFF0F5132).withOpacity(0.3) : Colors.black12,
          width: isSelected ? 1.5 : 0.5,
        ),
      ),
      elevation: isSelected ? 1 : 0,
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
        onTap: () {
          setState(() {
            _selectedRouteForMap = route;
          });
          _centerMapOnSelected();
        },
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: _getCategoryColor(route.type),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Center(
            child: Text(
              route.lineNum,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.black, fontSize: 15),
            ),
          ),
        ),
        title: Text(
          '${route.origin} → ${route.destination}',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.black87),
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${route.type} • ${route.status}',
              style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
            ),
            const SizedBox(height: 2),
            Text(
              'Prochain: ${route.stops.isNotEmpty ? route.stops.first.name : "Aucun"} (${route.stops.isNotEmpty ? route.stops.first.estimatedTime : "-"})',
              style: const TextStyle(fontSize: 10, color: Color(0xFF0F5132), fontWeight: FontWeight.w500),
            ),
          ],
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Bouton favori (coeur)
            IconButton(
              icon: Icon(
                isFav ? Icons.favorite : Icons.favorite_border,
                color: isFav ? Colors.red : Colors.grey,
                size: 20,
              ),
              onPressed: () => service.toggleFavorite(route.lineNum),
            ),
            const Icon(Icons.arrow_forward_ios, size: 12, color: Colors.grey),
          ],
        ),
      ),
    );
  }

  // ================= TAB 1: ADVANCED ROUTE SEARCH ENGINE =================
  Widget _buildSearchTab(FirebaseService service) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Bloc de recherche d'itinéraires
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            elevation: 1,
            color: Colors.white,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Recherche d\'itinéraire Sénégal',
                    style: GoogleFonts.spaceGrotesk(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF0F5132),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Entrez vos points d\'arrêt pour interroger Firebase et trouver les lignes adaptées.',
                    style: TextStyle(color: Colors.grey.shade600, fontSize: 11),
                  ),
                  const SizedBox(height: 16),

                  // Champ Départ
                  TextField(
                    controller: _originController,
                    decoration: InputDecoration(
                      labelText: 'Point de départ (ex: Pikine, Grand Yoff...)',
                      prefixIcon: const Icon(Icons.my_location, color: Color(0xFF0F5132)),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Champ Arrivée
                  TextField(
                    controller: _destinationController,
                    decoration: InputDecoration(
                      labelText: 'Point d\'arrivée (ex: Medina, Plateau...)',
                      prefixIcon: const Icon(Icons.pin_drop, color: Color(0xFFE9A200)),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Bouton de recherche Firebase
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0F5132),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      icon: _isSearchingDirectly
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                            )
                          : const Icon(Icons.search),
                      label: Text(
                        'Interroger Firebase',
                        style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      onPressed: _isSearchingDirectly ? null : () async {
                        setState(() {
                          _isSearchingDirectly = true;
                        });
                        
                        // Exécution de la recherche sur Firebase
                        final results = await service.searchRoutesFirebase(
                          _originController.text,
                          _destinationController.text,
                        );

                        setState(() {
                          _searchResults = results;
                          _hasSearched = true;
                          _isSearchingDirectly = false;
                        });
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 20),

          // Historique de recherche persistant
          if (service.searchHistory.isNotEmpty) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Historique récent',
                  style: GoogleFonts.spaceGrotesk(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.black87),
                ),
                TextButton(
                  onPressed: () => service.clearSearchHistory(),
                  child: const Text('Effacer tout', style: TextStyle(color: Colors.red, fontSize: 11)),
                ),
              ],
            ),
            const SizedBox(height: 6),
            SizedBox(
              height: 44,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: service.searchHistory.length,
                itemBuilder: (context, index) {
                  final hist = service.searchHistory[index];
                  final label = '${hist['origin']} → ${hist['destination']}';
                  return Container(
                    margin: const EdgeInsets.only(right: 8),
                    child: ActionChip(
                      backgroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                        side: const BorderSide(color: Colors.black12),
                      ),
                      avatar: const Icon(Icons.history, size: 14, color: Colors.grey),
                      label: Text(
                        label,
                        style: const TextStyle(fontSize: 11, color: Colors.black87),
                      ),
                      onPressed: () {
                        _originController.text = hist['origin'] ?? '';
                        _destinationController.text = hist['destination'] ?? '';
                        // Lancer la recherche instantanément
                        setState(() {
                          _isSearchingDirectly = true;
                        });
                        service.searchRoutesFirebase(
                          _originController.text,
                          _destinationController.text,
                        ).then((results) {
                          setState(() {
                            _searchResults = results;
                            _hasSearched = true;
                            _isSearchingDirectly = false;
                          });
                        });
                      },
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 16),
          ],

          // Résultats de recherche
          if (_hasSearched) ...[
            Text(
              'Résultats de recherche (${_searchResults.length})',
              style: GoogleFonts.spaceGrotesk(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.black87),
            ),
            const SizedBox(height: 10),
            _searchResults.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        children: [
                          const Icon(Icons.info_outline, size: 40, color: Colors.grey),
                          const SizedBox(height: 10),
                          Text(
                            'Aucune ligne directe trouvée entre ces arrêts.\nEssayez de rechercher "Dakar" ou de simplifier la saisie.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _searchResults.length,
                    itemBuilder: (context, index) {
                      final route = _searchResults[index];
                      return _buildSearchResultCard(route, service);
                    },
                  ),
          ],
        ],
      ),
    );
  }

  Widget _buildSearchResultCard(BusRoute route, FirebaseService service) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      margin: const EdgeInsets.only(bottom: 12),
      color: Colors.white,
      elevation: 0.5,
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getCategoryColor(route.type),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    route.lineNum,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    '${route.origin} → ${route.destination}',
                    style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 13),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            // Indication des arrêts intermédiaires
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(8)),
              child: Row(
                children: [
                  const Icon(Icons.timeline, color: Colors.black45, size: 16),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'Arrêts intermédiaires : ${route.stops.map((s) => s.name).join(' → ')}',
                      style: const TextStyle(fontSize: 10, color: Colors.black54),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ================= TAB 2: FAVORITES & PERSISTED LINES =================
  Widget _buildFavoritesTab(FirebaseService service) {
    final favorites = service.routes.where((route) => service.isFavorite(route.lineNum)).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F5132), Color(0xFF1E3A2F)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  backgroundColor: Color(0xFFE9A200),
                  radius: 22,
                  child: Icon(Icons.star, color: Color(0xFF0F5132), size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Vos favoris persistés',
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'Ces lignes sont enregistrées localement et prêtes pour les alertes push instantanées.',
                        style: TextStyle(color: Colors.white70, fontSize: 11),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          favorites.isEmpty
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 40.0),
                    child: Column(
                      children: [
                        const Icon(Icons.favorite_border, size: 56, color: Colors.grey),
                        const SizedBox(height: 12),
                        Text(
                          'Aucune ligne de bus en favori pour l\'instant.',
                          style: GoogleFonts.poppins(color: Colors.grey.shade600, fontSize: 13),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Cliquez sur l\'icône de cœur d\'un bus pour l\'ajouter ici.',
                          style: TextStyle(color: Colors.grey, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                )
              : ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: favorites.length,
                  itemBuilder: (context, index) {
                    final route = favorites[index];
                    return Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      color: Colors.white,
                      elevation: 0.5,
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: _getCategoryColor(route.type),
                          child: Text(route.lineNum, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        ),
                        title: Text(
                          '${route.origin} → ${route.destination}',
                          style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        subtitle: Text(
                          'Type: ${route.type} • Statut: ${route.status}',
                          style: const TextStyle(fontSize: 11),
                        ),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () => service.toggleFavorite(route.lineNum),
                        ),
                      ),
                    );
                  },
                ),
        ],
      ),
    );
  }

  Color _getCategoryColor(String type) {
    switch (type) {
      case 'Dakar Dem Dikk':
        return const Color(0xFF0F5132); // Vert Sénégal
      case 'AFTU Tata':
        return const Color(0xFFE9A200); // Jaune Sénégal
      case 'Interurbain':
        return Colors.deepPurple;
      case 'BRT Dakar':
        return const Color(0xFFE00000); // Rouge Sénégal
      default:
        return const Color(0xFF0F5132);
    }
  }
}
