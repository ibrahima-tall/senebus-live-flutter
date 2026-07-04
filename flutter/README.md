# 🇸🇳 SeneBus Live — Système National d'Horaires & Suivi des Bus du Sénégal

Bienvenue dans le dépôt du projet **SeneBus Live**, une solution complète de suivi en temps réel, de planification d'itinéraires et d'alertes instantanées pour le réseau de transport national du Sénégal (BRT Dakar, Dakar Dem Dikk, AFTU Tata et liaisons Interurbaines).

Ce projet est structuré selon une architecture hybride intelligente :
1. **Application Flutter native (`/flutter_project`)** : Le code source de production prêt pour iOS, Android et le Web, intégrant le SDK Firebase, `flutter_map` et la persistence locale.
2. **Simulateur Compagnon React (`/src`)** : Une interface interactive hautement visuelle intégrée directement dans le navigateur pour simuler les flux de données en temps réel de Firebase, planifier les trajets, gérer l'historique et déclencher des notifications push simulées.

---

## 📱 Structure du Projet Flutter/Dart (`/flutter_project`)

Le dossier `/flutter_project` contient une application Flutter modulaire et performante, développée avec les meilleures pratiques de l'écosystème :

```text
/flutter_project
├── pubspec.yaml               # Dépendances (Firebase Core, Firestore, FCM, Flutter Map, SharedPreferences)
└── lib
    ├── main.dart              # Point d'entrée de l'application & Initialisation Firebase
    ├── models
    │   └── bus_route.dart     # Modèles de données typés (BusRoute, RouteStop) avec parseurs JSON/Firestore
    ├── services
    │   └── firebase_service.dart # Logique Firebase (Firestore en direct, FCM Topics, Recherche & Favoris)
    └── screens
        └── home_screen.dart   # Interface utilisateur fluide (Carte interactive, Recherche avancée, Favoris)
```

### 🔑 Fonctionnalités Clés Implémentées dans Flutter
* **Carte Interactive (`flutter_map`)** : Intégration complète d'une carte interactive OpenStreetMap avec affichage des lignes de bus dessinées en couleur, placement dynamique des arrêts de bus intermédiaires sous forme de repères et mise à jour de la position du bus en temps réel via Firebase Firestore.
* **Moteur de Recherche d'Itinéraires Firebase** : Algorithme intelligent de mise en correspondance recherchant les correspondances directes ou par arrêts intermédiaires ordonnés, interrogeant directement la base de données Firestore.
* **Historique Persistant & Favoris (`SharedPreferences`)** : Les trajets favoris marqués par l'utilisateur et son historique récent de recherche d'itinéraires sont stockés localement sur l'appareil et rechargés à chaque démarrage de l'application.
* **Notifications Push FCM (Firebase Cloud Messaging)** : Système de souscription par thèmes (topics) permettant de recevoir des alertes de retard ou d'approche en direct pour chaque ligne de bus spécifique.

---

## 💻 Simulateur Compagnon React (`/src`)

Pour que vous puissiez interagir et tester l'ensemble des fonctionnalités demandées directement dans votre navigateur sur Google AI Studio, l'interface Web simule fidèlement les interactions Firebase :

### 🗺️ Carte Interactive et Suivi en Direct (Onglet "Carte")
* **Tracés Précis** : Visualisation en direct des lignes sélectionnées avec l'itinéraire tracé sur la presqu'île du Cap-Vert (Dakar) de façon dynamique.
* **Animation GPS** : Le bus se déplace en douceur le long de son trajet réel grâce à l'interpolation de progression de l'état.
* **Déclencheur d'Événements Firebase** : Utilisez le panneau de contrôle en bas à droite pour simuler l'envoi de données GPS de retard ou d'approche d'arrêt, déclenchant des notifications push instantanées sur votre écran.

### 🧭 Planificateur Intelligent Interactif
* **Remplacement du panneau "Compagnon"** par un moteur de planification interactif à double entrée (Départ & Arrivée).
* **Raccourcis Intelligents** : Cliquez sur les puces de localisation (Keur Massar, Colobane, Pikine, etc.) pour remplir instantanément les champs et tester des scénarios de recherche.
* **Historique des Recherches Récentes** : Liste dynamique de vos dernières requêtes avec l'heure relative, cliquables pour relancer la recherche.
* **Gestion des Favoris** : Marquez une ligne d'une icône étoile/signet pour l'épingler dans votre tableau de bord des favoris locaux pour un accès rapide.

---

## 🛠️ Comment exécuter et déployer l'application Flutter

### Prérequis
* [Flutter SDK](https://docs.flutter.dev/get-started/install) (version `3.19.x` ou supérieure recommandée)
* Un projet [Firebase](https://console.firebase.google.com/) actif.

### Étape 1 : Configuration de Firebase
1. Installez le CLI FlutterFire :
   ```bash
   dart pub global activate flutterfire_cli
   ```
2. Configurez le projet dans le dossier de l'application :
   ```bash
   cd flutter_project
   flutterfire configure
   ```
   *Cela génèrera automatiquement le fichier `firebase_options.dart` contenant vos clés d'API sécurisées dans `/lib`.*

### Étape 2 : Lancement
1. Récupérez les dépendances définies dans `pubspec.yaml` :
   ```bash
   flutter pub get
   ```
2. Exécutez l'application sur un simulateur ou un appareil connecté :
   ```bash
   flutter run
   ```

---

*Développé avec passion pour moderniser et fluidifier la mobilité urbaine au Sénégal.*
