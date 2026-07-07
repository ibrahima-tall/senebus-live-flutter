# 🚌 Senebus Live

<div align="center">

# Application de Gestion des Horaires de Bus

### Projet de Fin de Stage

Développé avec **Flutter** et **Firebase**

---

![Flutter](https://img.shields.io/badge/Flutter-3.x-blue?logo=flutter)
![Dart](https://img.shields.io/badge/Dart-3.x-0175C2?logo=dart)
![Firebase](https://img.shields.io/badge/Firebase-Backend-orange?logo=firebase)
![GitHub](https://img.shields.io/badge/GitHub-Repository-black?logo=github)
![License](https://img.shields.io/badge/License-Educational-green)

</div>

---

# 📚 Table des matières

* Présentation du projet
* Contexte
* Problématique
* Objectifs
* Description de l'application
* Fonctionnalités
* Technologies utilisées
* Pourquoi Flutter ?
* Pourquoi Firebase ?
* Architecture générale
* Organisation du développement

---

# 📖 Présentation du projet

**Senebus Live** est une application mobile développée dans le cadre de mon projet de fin de stage pour l'obtention du diplôme de **Technicien Supérieur en Développement Web et Mobile**.

Cette application a été conçue afin de faciliter les déplacements des usagers des transports en commun en leur permettant d'accéder rapidement aux informations relatives aux lignes de bus, aux arrêts ainsi qu'aux horaires de passage.

L'objectif principal est d'offrir une plateforme moderne, simple d'utilisation et performante permettant aux utilisateurs de consulter les informations des bus directement depuis leur téléphone.

Le projet repose sur une architecture moderne utilisant Flutter pour le développement mobile et Firebase pour la gestion du backend.

---

# 🌍 Contexte

À Dakar, les usagers des transports publics rencontrent régulièrement plusieurs difficultés :

* difficulté à connaître les horaires de passage des bus ;
* manque d'informations sur certaines lignes ;
* absence d'une plateforme centralisée ;
* difficultés pour planifier les déplacements.

Ces problèmes entraînent une perte de temps importante pour les voyageurs.

Face à cette situation, il est apparu nécessaire de développer une solution numérique capable de simplifier l'accès aux informations concernant les transports publics.

Senebus Live répond précisément à ce besoin.

---

# ❓ Problématique

Comment permettre aux usagers des transports en commun de consulter rapidement les informations des lignes de bus afin de mieux organiser leurs déplacements quotidiens ?

Cette question constitue le point de départ de la conception de l'application.

---

# 🎯 Objectifs du projet

Le développement de Senebus Live poursuit plusieurs objectifs.

## Objectif général

Concevoir une application mobile moderne permettant de consulter facilement les horaires et les lignes de bus.

## Objectifs spécifiques

* améliorer l'accès aux informations des transports ;
* simplifier la recherche d'une ligne de bus ;
* afficher les horaires disponibles ;
* permettre la consultation des arrêts ;
* proposer une interface intuitive ;
* assurer une bonne expérience utilisateur ;
* stocker les données dans une base de données cloud ;
* offrir une application rapide et sécurisée.

---

# 📱 Description de l'application

L'application permet aux utilisateurs de :

* consulter les différentes lignes de bus ;
* rechercher une ligne spécifique ;
* consulter les arrêts disponibles ;
* afficher les horaires ;
* créer un compte utilisateur ;
* se connecter ;
* enregistrer leurs lignes favorites ;
* gérer leur profil.

Toutes les données sont synchronisées avec Firebase.

Grâce à cette architecture, les informations sont accessibles en temps réel.

---

# ⭐ Fonctionnalités principales

L'application dispose des fonctionnalités suivantes.

## Authentification

* Création de compte
* Connexion
* Déconnexion
* Réinitialisation du mot de passe

---

## Gestion des lignes

* consultation des lignes ;
* affichage des informations détaillées ;
* description de chaque ligne.

---

## Recherche

L'utilisateur peut rechercher :

* une ligne ;
* un arrêt.

La recherche est instantanée afin d'améliorer l'expérience utilisateur.

---

## Consultation des horaires

Les horaires sont récupérés depuis Firebase puis affichés dynamiquement dans l'application.

---

## Gestion des favoris

Chaque utilisateur connecté peut enregistrer ses lignes favorites.

Cette fonctionnalité permet d'accéder rapidement aux lignes utilisées quotidiennement.

---

## Gestion du profil

Chaque utilisateur dispose d'un espace personnel permettant de :

* modifier son nom ;
* modifier son adresse électronique ;
* changer sa photo de profil ;
* consulter ses informations.

---

## Paramètres

L'application propose plusieurs paramètres afin de personnaliser l'expérience utilisateur.

---

# 💻 Technologies utilisées

Le projet utilise plusieurs technologies modernes.

| Technologie             | Utilisation                           |
| ----------------------- | ------------------------------------- |
| Flutter                 | Développement de l'application mobile |
| Dart                    | Langage de programmation              |
| Firebase Authentication | Gestion des comptes utilisateurs      |
| Cloud Firestore         | Base de données NoSQL                 |
| Firebase Storage        | Stockage des images                   |
| Firebase Hosting        | Hébergement                           |
| Git                     | Gestion des versions                  |
| GitHub                  | Hébergement du code source            |
| Android Studio          | Développement                         |
| Visual Studio Code      | Éditeur de code                       |

---

# 🚀 Pourquoi Flutter ?

Flutter a été choisi pour plusieurs raisons.

* Développement multiplateforme.

* Une seule base de code.

* Excellentes performances.

* Interface moderne.

* Widgets riches.

* Développement rapide grâce au Hot Reload.

* Grande communauté.

* Maintenance facilitée.

Flutter permet ainsi de développer simultanément une application Android, iOS, Windows, Linux, macOS et Web.

---

# 🔥 Pourquoi Firebase ?

Firebase constitue le backend de l'application.

Il fournit plusieurs services indispensables :

* Authentification sécurisée ;
* Base de données Cloud Firestore ;
* Stockage des fichiers ;
* Hébergement ;
* Synchronisation en temps réel.

Grâce à Firebase, aucune infrastructure serveur complexe n'est nécessaire.

Les données sont automatiquement synchronisées entre tous les utilisateurs.

---

# 🏗️ Architecture générale

L'application est organisée selon une architecture modulaire.

```
Utilisateur

        │

        ▼

Interface Flutter

        │

        ▼

Services

        │

        ▼

Firebase Authentication

Cloud Firestore

Firebase Storage

        │

        ▼

Base de données Cloud
```

Cette architecture facilite :

* la maintenance ;

* l'évolution du projet ;

* l'ajout de nouvelles fonctionnalités.

---

# 👨‍💻 Organisation du développement

Le développement du projet s'est déroulé selon plusieurs étapes :

* analyse des besoins ;
* conception de l'application ;
* création du projet Flutter ;
* configuration de Firebase ;
* développement des interfaces ;
* intégration de Firebase Authentication ;
* création des modèles de données ;
* connexion avec Cloud Firestore ;
* développement des fonctionnalités principales ;
* tests de l'application ;
* correction des anomalies ;
* optimisation des performances ;
* préparation de la documentation ;
* publication du code sur GitHub.

---

