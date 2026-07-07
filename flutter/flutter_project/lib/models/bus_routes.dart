class BusStop {
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
}
