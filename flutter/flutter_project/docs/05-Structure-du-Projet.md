# 📂 Structure du Projet

## Introduction

L'application **Senebus Live** est développée avec Flutter en adoptant une architecture modulaire. Cette organisation permet de séparer les différentes responsabilités de l'application afin d'obtenir un code plus lisible, plus maintenable et plus évolutif.

Le dossier principal contenant le code source est **lib/**. Il regroupe l'ensemble des composants nécessaires au fonctionnement de l'application.

---

# 📁 Arborescence générale du projet

L'organisation générale du projet est la suivante :

```text
senebus_live/

├── android/
├── ios/
├── web/
├── windows/
├── linux/
├── macos/
├── assets/
├── docs/
├── lib/
├── test/
├── .gitignore
├── pubspec.yaml
├── pubspec.lock
├── firebase.json
├── analysis_options.yaml
└── README.md
```

Chaque dossier possède un rôle précis.

---

# 📁 Dossier android/

Ce dossier contient toute la configuration nécessaire à la compilation de l'application Android.

On y retrouve notamment :

* le manifeste Android ;
* les fichiers Gradle ;
* la configuration des permissions ;
* les icônes de l'application ;
* le fichier **google-services.json** permettant la connexion avec Firebase.

Ce dossier est généré automatiquement par Flutter mais peut être personnalisé selon les besoins du projet.

---

# 📁 Dossier ios/

Ce dossier contient les fichiers nécessaires à la version iOS.

Il comprend :

* les paramètres Xcode ;
* les ressources iOS ;
* le fichier **GoogleService-Info.plist** utilisé pour connecter l'application à Firebase.

---

# 📁 Dossier web/

Flutter permet également de générer une version Web de l'application.

Ce dossier contient :

* la page HTML principale ;
* les fichiers JavaScript ;
* les ressources Web.

---

# 📁 Dossier windows/

Ce dossier permet de compiler l'application sous Windows.

Il contient les fichiers spécifiques à cette plateforme.

---

# 📁 Dossier linux/

Ce dossier regroupe les fichiers nécessaires à la compilation de l'application sous Linux.

---

# 📁 Dossier macos/

Il contient les fichiers spécifiques à macOS.

Grâce à Flutter, une seule base de code permet de cibler plusieurs plateformes.

---

# 📁 Dossier assets/

Le dossier **assets** rassemble toutes les ressources graphiques utilisées dans l'application.

Sa structure est organisée comme suit :

```text
assets/

├── images/
├── icons/
├── logo/
├── animations/
├── fonts/
└── splash/
```

Les principaux éléments stockés sont :

* le logo de Senebus Live ;
* les icônes personnalisées ;
* les illustrations ;
* les polices de caractères ;
* les images utilisées dans les différentes pages.

Toutes ces ressources sont déclarées dans le fichier **pubspec.yaml** afin d'être accessibles depuis Flutter.

---

# 📁 Dossier docs/

Ce dossier contient toute la documentation technique du projet.

Exemple :

```text
docs/

01-Presentation.md

02-Architecture.md

03-Installation.md

04-Developpement.md

05-Structure-du-Projet.md

06-Firebase.md

07-Fonctionnalites.md

08-Difficultes.md

09-Conclusion.md
```

Cette documentation facilite la compréhension du projet par tout développeur souhaitant le reprendre.

---

# 📁 Dossier test/

Flutter génère automatiquement un dossier **test**.

Il est destiné aux tests unitaires et aux tests de widgets.

Même si peu de tests ont été réalisés dans le cadre du stage, cette structure permet d'ajouter facilement des tests pour les futures évolutions.

---

# 📁 Dossier lib/

Le dossier **lib** est le cœur de l'application.

Il contient tout le code développé.

Une organisation modulaire a été adoptée afin de séparer les responsabilités.

Exemple :

```text
lib/

├── main.dart
├── config/
├── constants/
├── models/
├── services/
├── providers/
├── screens/
├── widgets/
├── routes/
├── themes/
├── utils/
└── repositories/
```

---

# 📄 main.dart

Le fichier **main.dart** constitue le point d'entrée de l'application.

Il est responsable de :

* l'initialisation de Flutter ;
* l'initialisation de Firebase ;
* le chargement du thème ;
* la configuration des routes ;
* le lancement de l'application.

Sans ce fichier, l'application ne peut pas démarrer.

---

# 📁 config/

Ce dossier centralise les fichiers de configuration.

Par exemple :

* configuration Firebase ;
* variables globales ;
* paramètres de l'application.

Cette approche évite de disperser les paramètres dans plusieurs fichiers.

---

# 📁 constants/

Toutes les constantes du projet sont regroupées ici.

On y retrouve notamment :

* les couleurs ;
* les tailles ;
* les marges ;
* les textes communs ;
* les noms des collections Firestore.

L'utilisation de constantes améliore la cohérence du projet.

---

# 📁 models/

Les modèles représentent les objets manipulés par l'application.

Quelques exemples :

* UserModel
* BusModel
* BusLineModel
* ScheduleModel
* FavoriteModel

Chaque modèle facilite la conversion des documents Firestore en objets Dart.

---

# 📁 services/

Les services contiennent la logique métier.

Ils assurent notamment :

* l'authentification ;
* les requêtes Firestore ;
* le stockage des images ;
* les appels Firebase.

Cette séparation améliore la lisibilité du code.

---

# 📁 repositories/

Lorsque plusieurs services manipulent les mêmes données, le dossier **repositories** permet de centraliser les accès à la base de données.

Cette architecture rend le projet plus évolutif.

---

# 📁 providers/

Les providers permettent de partager les données entre plusieurs écrans.

Ils assurent notamment :

* la gestion de l'utilisateur connecté ;
* le chargement des lignes ;
* les favoris ;
* le thème de l'application.

Cette solution évite les duplications de données.

---

# 📁 screens/

Le dossier **screens** contient toutes les pages visibles de l'application.

Exemple :

```text
screens/

Splash

Login

Register

Forgot Password

Home

Bus Lines

Bus Details

Favorites

Profile

Settings

About
```

Chaque écran est indépendant afin de simplifier la maintenance.

---

# 📁 widgets/

Les widgets personnalisés regroupent les composants réutilisables.

Par exemple :

* carte d'une ligne ;
* bouton principal ;
* barre de recherche ;
* carte d'information ;
* champ de saisie personnalisé.

Cette approche évite de réécrire plusieurs fois le même code.

---

# 📁 routes/

La navigation est centralisée dans ce dossier.

Toutes les routes de l'application y sont définies afin de faciliter les déplacements entre les différentes pages.

---

# 📁 themes/

Le dossier **themes** contient la personnalisation graphique.

Il comprend :

* le thème clair ;
* le thème sombre ;
* les styles des boutons ;
* les styles des cartes ;
* les couleurs principales.

Cette organisation garantit une interface cohérente.

---

# 📁 utils/

Les fonctions utilitaires sont regroupées dans ce dossier.

On y trouve par exemple :

* les validations des formulaires ;
* le formatage des dates ;
* les messages d'erreur ;
* les outils de conversion.

Ces fonctions sont utilisées dans plusieurs parties de l'application.

---

# 📄 pubspec.yaml

Le fichier **pubspec.yaml** est l'un des plus importants du projet.

Il contient :

* les dépendances Flutter ;
* les versions des packages ;
* les assets ;
* les polices ;
* les informations générales du projet.

Toute nouvelle bibliothèque utilisée doit être ajoutée dans ce fichier.

---

# 📄 firebase.json

Ce fichier contient les paramètres de déploiement Firebase.

Il est utilisé notamment pour Firebase Hosting.

---

# 📄 .gitignore

Ce fichier indique à Git quels fichiers ne doivent pas être envoyés sur GitHub.

Il permet notamment d'exclure :

* les fichiers temporaires ;
* les caches ;
* certains fichiers générés automatiquement.

---

# 🔄 Cycle d'exécution de l'application

Le fonctionnement global de l'application peut être résumé ainsi :

```text
Utilisateur
      │
      ▼
Écran Flutter
      │
      ▼
Service
      │
      ▼
Firebase
      │
      ▼
Cloud Firestore
      │
      ▼
Retour des données
      │
      ▼
Affichage à l'écran
```

Cette architecture garantit un échange rapide et sécurisé entre l'application et la base de données.

---

# ✅ Conclusion

La structure adoptée pour **Senebus Live** respecte les bonnes pratiques de développement Flutter. La séparation des responsabilités, l'organisation modulaire des dossiers et l'utilisation de Firebase facilitent la maintenance, l'évolution du projet et la réutilisation du code.

Cette architecture permettra également d'ajouter de nouvelles fonctionnalités sans remettre en cause l'organisation générale de l'application.
