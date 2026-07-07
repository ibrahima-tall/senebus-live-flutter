# 🚀 Installation et Configuration du Projet

## Introduction

Cette section décrit toutes les étapes nécessaires pour installer, configurer et exécuter le projet **Senebus Live** sur un poste de développement.

L'objectif est de permettre à tout développeur de cloner le dépôt GitHub, configurer l'environnement de travail et lancer l'application sans difficulté.

---

# 💻 Prérequis

Avant de commencer, les logiciels suivants doivent être installés sur la machine.

| Logiciel                 | Version recommandée            |
| ------------------------ | ------------------------------ |
| Flutter SDK              | 3.x ou supérieure              |
| Dart SDK                 | Inclus avec Flutter            |
| Android Studio           | Dernière version               |
| Visual Studio Code       | Dernière version               |
| Git                      | Dernière version               |
| Compte Firebase          | Obligatoire                    |
| Navigateur Google Chrome | Pour les tests Web (optionnel) |

---

# 📥 Installation de Flutter

Flutter est le framework principal utilisé pour développer l'application.

### Étape 1 : Télécharger Flutter

Télécharger le SDK Flutter correspondant à votre système d'exploitation :

* Windows
* Linux
* macOS

### Étape 2 : Décompresser Flutter

Exemple :

```text
C:\src\flutter
```

### Étape 3 : Ajouter Flutter au PATH

Ajouter le dossier :

```text
flutter\bin
```

aux variables d'environnement de Windows.

### Étape 4 : Vérifier l'installation

Ouvrir un terminal puis exécuter :

```bash
flutter doctor
```

Flutter vérifie automatiquement les composants installés.

---

# 🛠 Installation d'Android Studio

Android Studio est utilisé pour :

* créer les émulateurs Android ;
* compiler l'application ;
* installer les SDK Android ;
* déboguer le projet.

Pendant l'installation, il est important de sélectionner :

* Android SDK
* Android SDK Platform
* Android Virtual Device (AVD)

Une fois installé, créer un appareil virtuel Android afin de tester l'application.

---

# 💻 Installation de Visual Studio Code

Visual Studio Code est utilisé comme éditeur principal.

Les extensions suivantes sont recommandées :

* Flutter
* Dart
* GitLens
* Error Lens
* Material Icon Theme
* Pubspec Assist
* Awesome Flutter Snippets

Ces extensions facilitent le développement et améliorent la productivité.

---

# 🌐 Installation de Git

Git permet de gérer les différentes versions du projet.

Vérification :

```bash
git --version
```

Si Git est correctement installé, sa version s'affiche dans le terminal.

---

# 📂 Cloner le projet

Le projet est hébergé sur GitHub.

Pour récupérer le code source :

```bash
git clone https://github.com/VOTRE-NOM/senebus_live.git
```

Ensuite :

```bash
cd senebus_live
```

---

# 📦 Installation des dépendances

Toutes les dépendances Flutter sont définies dans le fichier :

```text
pubspec.yaml
```

Pour les installer :

```bash
flutter pub get
```

Flutter télécharge automatiquement tous les packages nécessaires.

---

# 🔥 Création du projet Firebase

Le backend de Senebus Live repose sur Firebase.

## Étape 1

Créer un compte Google.

## Étape 2

Accéder à Firebase Console.

## Étape 3

Créer un nouveau projet.

Exemple :

```
Senebus Live
```

---

# 📱 Ajout d'une application Android

Depuis Firebase :

Ajouter une application Android.

Renseigner :

* le nom du package Android ;
* le nom de l'application.

Firebase génère automatiquement le fichier :

```text
google-services.json
```

Ce fichier doit être placé dans :

```text
android/app/
```

---

# 🍎 Ajout d'une application iOS

Pour la version iPhone :

Firebase génère :

```text
GoogleService-Info.plist
```

Ce fichier doit être copié dans :

```text
ios/Runner/
```

---

# ⚙ Installation de FlutterFire CLI

FlutterFire simplifie la connexion entre Flutter et Firebase.

Installation :

```bash
dart pub global activate flutterfire_cli
```

Puis :

```bash
flutterfire configure
```

Cette commande génère automatiquement le fichier :

```text
firebase_options.dart
```

Celui-ci contient toutes les informations de connexion à Firebase.

---

# ▶ Initialisation de Firebase

Dans le fichier :

```text
main.dart
```

Firebase est initialisé avant le lancement de l'application.

Les principales étapes sont :

* initialisation de Flutter ;
* initialisation de Firebase ;
* démarrage de l'application.

Cette étape est indispensable au bon fonctionnement des services Firebase.

---

# 🗃 Configuration de Cloud Firestore

Créer les collections nécessaires.

Exemple :

```text
users

bus_lines

bus_stops

schedules

favorites
```

Chaque collection contient les documents correspondant aux données de l'application.

---

# 🔐 Activation de Firebase Authentication

Depuis Firebase :

Authentication

↓

Activer :

* Email / Password

Cette méthode permet :

* l'inscription ;
* la connexion ;
* la récupération du mot de passe.

---

# 🖼 Configuration de Firebase Storage

Firebase Storage est utilisé pour stocker :

* les photos de profil ;
* les images des lignes de bus ;
* les ressources graphiques.

---

# 📁 Configuration des Assets

Toutes les ressources graphiques sont enregistrées dans :

```text
assets/
```

Exemple :

```text
assets/

images/

icons/

logo/

animations/
```

Dans le fichier :

```yaml
pubspec.yaml
```

les assets sont déclarés afin que Flutter puisse les utiliser.

---

# ▶ Exécuter l'application

Après avoir terminé toutes les configurations :

```bash
flutter run
```

Flutter compile automatiquement le projet.

L'application démarre ensuite sur :

* un téléphone Android ;
* un émulateur ;
* Windows ;
* le Web (si configuré).

---

# 🧪 Vérification du projet

Avant chaque livraison, plusieurs vérifications ont été réalisées :

* compilation sans erreur ;
* connexion Firebase ;
* authentification ;
* lecture des données ;
* affichage des horaires ;
* gestion des favoris ;
* affichage des images ;
* navigation entre les écrans.

Ces tests garantissent le bon fonctionnement général de l'application.

---

# 📋 Dépendances principales

Le projet utilise plusieurs packages Flutter.

Parmi les plus importants :

| Package              | Rôle                       |
| -------------------- | -------------------------- |
| firebase_core        | Initialisation de Firebase |
| firebase_auth        | Authentification           |
| cloud_firestore      | Base de données            |
| firebase_storage     | Stockage des images        |
| provider             | Gestion de l'état          |
| cached_network_image | Mise en cache des images   |
| flutter_svg          | Affichage des icônes SVG   |
| shared_preferences   | Stockage local             |
| intl                 | Gestion des dates          |

Ces bibliothèques améliorent les performances et facilitent le développement.

---

# 🌿 Gestion des versions avec Git

Durant le développement, Git a été utilisé pour suivre l'évolution du projet.

Les principales commandes utilisées sont :

```bash
git status
git add .
git commit -m "Description des modifications"
git pull
git push
```

Cette approche permet de conserver un historique précis des évolutions du projet.

---

# 📦 Déploiement sur GitHub

Le code source est hébergé sur GitHub afin de :

* sauvegarder le projet ;
* faciliter le travail collaboratif ;
* suivre les différentes versions ;
* partager le code avec les encadreurs.

Chaque nouvelle fonctionnalité développée est enregistrée localement puis envoyée sur GitHub.

---

# ✅ Conclusion

Grâce à ces différentes étapes, l'environnement de développement est entièrement configuré et le projet peut être exécuté sur plusieurs plateformes.

L'utilisation conjointe de Flutter, Firebase et Git offre un environnement moderne, performant et adapté au développement d'applications mobiles multiplateformes.

---

