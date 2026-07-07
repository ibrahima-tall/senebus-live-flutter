import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart' as latlong;
import '../models/bus_route.dart';
import '../services/firebase_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  late final MapController _mapController;
  int _currentTab = 0;
  String _searchQuery = '';
  String _selectedType = 'Tous';
  BusRoute? _selectedRouteForMap;

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

  void _centerMapOnSelected() {
    if (_selectedRouteForMap != null) {
      _mapController.move(latlong.LatLng(_selectedRouteForMap!.currentLat, _selectedRouteForMap!.currentLng), 13.5);
    } else {
      _mapController.move(const latlong.LatLng(14.72, -17.45), 11.5);
    }
  }

  Color _getCategoryColor(String type) {
    switch (type) {
      case 'Dakar Dem Dikk': return Colors.blue;
      case 'AFTU Tata': return Colors.orange;
      case 'Interurbain': return Colors.purple;
      default: return Colors.green;
    }
  }

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

    if (_selectedRouteForMap == null && firebaseService.routes.isNotEmpty) {
      _selectedRouteForMap = firebaseService.routes.first;
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF4F6F9),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0F5132),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(color: const Color(0xFFE9A200), borderRadius: BorderRadius.circular(6)),
              child: const Text('SENE', style: TextStyle(color: Color(0xFF0F5132), fontWeight: FontWeight.w900, fontSize: 13)),
            ),
            const SizedBox(width: 10),
            Text('Bus Live Sénégal', style: GoogleFonts.spaceGrotesk(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 18)),
          ],
        ),
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
        onTap: (index) => setState(() => _currentTab = index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Carte'),
          BottomNavigationBarItem(icon: Icon(Icons.route), label: 'Recherche'),
          BottomNavigationBarItem(icon: Icon(Icons.favorite), label: 'Favoris'),
        ],
      ),
    );
  }

  Widget _buildDirectTab(List<BusRoute> filteredRoutes, FirebaseService service) {
    return Column(
      children: [
        Expanded(
          flex: 4,
          child: FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: _selectedRouteForMap != null
                  ? latlong.LatLng(_selectedRouteForMap!.currentLat, _selectedRouteForMap!.currentLng)
                  : const latlong.LatLng(14.7167, -17.4677),
              initialZoom: 12.0,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.senebus.senebus_live',
              ),
              if (_selectedRouteForMap != null)
                PolylineLayer(polylines: [
                  Polyline(
                    points: _selectedRouteForMap!.stops.map((s) => latlong.LatLng(s.latitude, s.longitude)).toList(),
                    strokeWidth: 4.5,
                    color: _getCategoryColor(_selectedRouteForMap!.type),
                  ),
                ]),
              MarkerLayer(markers: service.routes.map((route) {
                return Marker(
                  point: latlong.LatLng(route.currentLat, route.currentLng),
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedRouteForMap = route),
                    child: const Icon(Icons.directions_bus, color: Colors.green),
                  ),
                );
              }).toList()),
            ],
          ),
        ),
        Expanded(
          flex: 5,
          child: ListView.builder(
            itemCount: filteredRoutes.length,
            itemBuilder: (context, i) => _buildBusCard(filteredRoutes[i], false, service),
          ),
        ),
      ],
    );
  }

  Widget _buildBusCard(BusRoute route, bool isSelected, FirebaseService service) {
    return Card(
      child: ListTile(
        title: Text('${route.origin} → ${route.destination}'),
        subtitle: Text('Ligne: ${route.lineNum}'),
        trailing: IconButton(
          icon: Icon(service.isFavorite(route.lineNum) ? Icons.favorite : Icons.favorite_border),
          onPressed: () => service.toggleFavorite(route.lineNum),
        ),
      ),
    );
  }

  Widget _buildSearchTab(FirebaseService service) => Container();
  Widget _buildFavoritesTab(FirebaseService service) => Container();
}