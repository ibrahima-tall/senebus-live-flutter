# 🏗️ Architecture du Projet

## Introduction

Le développement de **Senebus Live** a été réalisé en adoptant une architecture modulaire. Cette organisation permet de séparer les différentes responsabilités de l'application afin de faciliter sa maintenance, son évolution et sa compréhension.

L'application repose principalement sur deux technologies :

* **Flutter**, utilisé pour le développement de l'interface utilisateur.
* **Firebase**, utilisé comme backend pour l'authentification, la base de données et le stockage.

Cette séparation entre le frontend et le backend garantit une meilleure évolutivité et une maintenance simplifiée.

---

# 🏛️ Architecture générale

L'architecture de Senebus Live peut être représentée comme suit :

```text
                  Utilisateur
                        │
                        ▼
             Interface Flutter (UI)
                        │
                        ▼
                Logique Métier (Services)
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
 Firebase Auth   Cloud Firestore   Firebase Storage
        │               │                │
        └───────────────┴────────────────┘
                        │
                        ▼
                  Données Cloud
```

Chaque couche possède un rôle bien défini.

---

# 🎨 Frontend

Le frontend représente toute la partie visible par l'utilisateur.

Il a été développé entièrement avec Flutter.

Il comprend notamment :

* les écrans de connexion ;
* l'inscription ;
* l'accueil ;
* les lignes de bus ;
* les détails d'une ligne ;
* les favoris ;
* le profil utilisateur ;
* les paramètres.

Flutter utilise des **Widgets** pour construire chaque interface.

Cette approche facilite la création d'interfaces modernes et réactives.

---

# ⚙️ Backend

Le backend est assuré par Firebase.

Contrairement à une architecture traditionnelle utilisant un serveur PHP ou Node.js, Firebase fournit directement les services nécessaires.

Les principales fonctionnalités utilisées sont :

* Firebase Authentication
* Cloud Firestore
* Firebase Storage

Cette architecture dite **Serverless** réduit la complexité du projet.

---

# 🔐 Firebase Authentication

Firebase Authentication permet de gérer les utilisateurs.

Fonctionnalités :

* création de compte ;
* connexion ;
* déconnexion ;
* récupération du mot de passe ;
* sécurisation des accès.

Chaque utilisateur possède un identifiant unique (UID).

Les informations sont sécurisées par Firebase.

---

# 🗄️ Cloud Firestore

Cloud Firestore est la base de données principale.

Elle stocke notamment :

* les lignes de bus ;
* les arrêts ;
* les horaires ;
* les profils utilisateurs ;
* les favoris.

Les données sont organisées en **collections** et **documents**.

Exemple :

```text
users
    |
    |--- uid_001
    |      |
    |      |-- nom
    |      |-- email
    |      |-- photo
    |
    |--- uid_002
```

---

# 🖼️ Firebase Storage

Firebase Storage permet de stocker :

* les photos de profil ;
* les images des lignes de bus ;
* les icônes personnalisées.

Les fichiers sont hébergés dans le cloud et récupérés automatiquement par l'application.

---

# 📁 Organisation du projet Flutter

Le projet Flutter suit une organisation claire.

```text
lib/

├── constants/
├── models/
├── screens/
├── services/
├── widgets/
├── providers/
├── utils/
├── routes/
├── themes/
└── main.dart
```

Chaque dossier possède une responsabilité précise.

---

# 📂 Le dossier lib

Le dossier **lib** contient tout le code source de l'application.

C'est le dossier le plus important du projet.

Il rassemble :

* les modèles de données ;
* les écrans ;
* les services ;
* les composants réutilisables ;
* les thèmes ;
* les constantes.

---

# 📁 constants

Ce dossier contient toutes les constantes utilisées dans l'application.

Exemples :

* couleurs ;
* dimensions ;
* textes ;
* clés de configuration.

Avantages :

* éviter les duplications ;
* faciliter les modifications ;
* améliorer la lisibilité.

---

# 📁 models

Les modèles représentent les objets manipulés par l'application.

Exemples :

* User
* Bus
* Ligne
* Arrêt
* Horaire
* Favori

Chaque modèle permet de convertir les données provenant de Firebase en objets Dart.

---

# 📁 screens

Le dossier **screens** contient toutes les pages de l'application.

Exemple :

```text
screens/

login/

register/

home/

bus/

favorites/

profile/

settings/
```

Chaque écran correspond à une fonctionnalité.

---

# 📁 services

Les services regroupent toute la logique métier.

Ils assurent notamment :

* la connexion à Firebase ;
* la récupération des données ;
* l'enregistrement des informations ;
* la gestion des favoris ;
* l'authentification.

Cette séparation permet d'avoir un code plus propre.

---

# 📁 widgets

Les widgets personnalisés sont regroupés dans ce dossier.

Ils permettent de réutiliser les mêmes composants sur plusieurs pages.

Exemples :

* carte d'une ligne de bus ;
* bouton personnalisé ;
* barre de recherche ;
* carte des favoris.

Cette approche évite la duplication du code.

---

# 📁 providers

Le dossier **providers** contient les gestionnaires d'état.

Ils permettent de partager les données entre plusieurs écrans sans les dupliquer.

Cette méthode améliore les performances et facilite la maintenance.

---

# 📁 routes

Ce dossier centralise toute la navigation de l'application.

Il définit les chemins entre les différents écrans.

Exemple :

* Splash
* Login
* Register
* Home
* Profile
* Settings

---

# 📁 themes

Le dossier **themes** contient :

* le thème clair ;
* le thème sombre ;
* les styles communs.

Grâce à cette organisation, l'apparence de l'application reste homogène.

---

# 📁 utils

Le dossier **utils** regroupe les fonctions utilitaires.

Par exemple :

* validation des formulaires ;
* formatage des dates ;
* messages d'erreur ;
* outils de conversion.

---

# 🚀 Cycle de fonctionnement

Lorsqu'un utilisateur utilise l'application, le processus est le suivant :

1. L'utilisateur ouvre l'application.
2. Flutter affiche l'interface.
3. Une requête est envoyée vers Firebase.
4. Firebase vérifie les droits d'accès.
5. Les données sont récupérées depuis Firestore.
6. Flutter transforme les données en objets Dart.
7. Les informations sont affichées à l'écran.
8. Toute modification est immédiatement synchronisée avec Firebase.

Ce fonctionnement garantit une expérience fluide et des données toujours à jour.

---

# ✅ Avantages de cette architecture

Cette architecture présente plusieurs bénéfices :

* séparation claire des responsabilités ;
* code plus lisible ;
* maintenance simplifiée ;
* évolutivité facilitée ;
* réutilisation des composants ;
* performances améliorées ;
* intégration native avec Firebase.

---

# 📌 Conclusion

L'architecture de Senebus Live a été pensée pour être évolutive, performante et facile à maintenir. L'utilisation conjointe de Flutter et Firebase permet de développer une application moderne répondant aux besoins des utilisateurs tout en garantissant une bonne organisation du code.

---

