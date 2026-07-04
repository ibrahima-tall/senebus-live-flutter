import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/firebase_service.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Note: Remplacer par vos propres options de configuration Firebase
  // générées via FlutterFire CLI pour votre projet spécifique au Sénégal.
  try {
    await Firebase.initializeApp(
      options: const FirebaseOptions(
        apiKey: "YOUR_API_KEY",
        authDomain: "senegal-bus-horaires.firebaseapp.com",
        projectId: "senegal-bus-horaires",
        storageBucket: "senegal-bus-horaires.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
      ),
    );
  } catch (e) {
    // Si l'initialisation échoue hors ligne, l'application continuera de fonctionner.
    debugPrint("Erreur d'initialisation Firebase (Utilisation du mode hors ligne) : $e");
  }

  runApp(const SenegalBusApp());
}

class SenegalBusApp extends StatelessWidget {
  const SenegalBusApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => FirebaseService()),
      ],
      child: MaterialApp(
        title: 'Sénégal Bus Horaires',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
            seedColor: const Color(0xFF0F5132), // Vert Sénégal
            primary: const Color(0xFF0F5132),
            secondary: const Color(0xFFE9A200), // Jaune Sénégal
            tertiary: const Color(0xFFE00000), // Rouge Sénégal
          ),
          textTheme: GoogleFonts.poppinsTextTheme(
            Theme.of(context).textTheme,
          ),
        ),
        home: const HomeScreen(),
      ),
    );
  }
}
