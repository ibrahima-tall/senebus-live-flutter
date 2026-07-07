# 🔥 Intégration et Utilisation de Firebase

## Introduction

Pour assurer le fonctionnement du backend de **Senebus Live**, la plateforme **Firebase** a été retenue. Développée par Google, Firebase fournit un ensemble de services permettant de créer des applications modernes sans avoir à gérer un serveur traditionnel.

Grâce à cette plateforme, les données sont centralisées, sécurisées et synchronisées en temps réel entre les différents utilisateurs de l'application.

---

# Pourquoi Firebase ?

Le choix de Firebase repose sur plusieurs avantages :

* intégration simple avec Flutter ;
* synchronisation des données en temps réel ;
* authentification sécurisée ;
* stockage des fichiers dans le cloud ;
* haute disponibilité des services ;
* réduction du temps de développement ;
* absence de gestion d'un serveur dédié.

Cette solution a permis de concentrer les efforts sur le développement des fonctionnalités de l'application plutôt que sur l'administration d'une infrastructure backend.

---

# Services Firebase utilisés

Le projet exploite plusieurs services complémentaires.

| Service                 | Rôle dans le projet                     |
| ----------------------- | --------------------------------------- |
| Firebase Authentication | Gestion des utilisateurs                |
| Cloud Firestore         | Base de données                         |
| Firebase Storage        | Stockage des images                     |
| Firebase Hosting        | Hébergement (prévu pour la version Web) |

---

# Firebase Authentication

## Présentation

Firebase Authentication est utilisé pour gérer les comptes utilisateurs.

Chaque utilisateur possède un identifiant unique (UID) généré automatiquement par Firebase.

Cette solution garantit une authentification sécurisée et simplifie la gestion des accès.

---

## Fonctionnalités mises en place

Les principales fonctionnalités sont :

* création d'un compte utilisateur ;
* connexion avec une adresse électronique et un mot de passe ;
* déconnexion ;
* récupération du mot de passe ;
* maintien de la session utilisateur.

---

## Cycle d'authentification

Le fonctionnement général est le suivant :

```text
Utilisateur
      │
      ▼
Saisie des informations
      │
      ▼
Firebase Authentication
      │
      ▼
Validation des identifiants
      │
      ▼
Connexion acceptée ou refusée
      │
      ▼
Accès à l'application
```

Ce processus garantit que seuls les utilisateurs autorisés peuvent accéder aux fonctionnalités protégées.

---

# Cloud Firestore

## Présentation

Cloud Firestore est une base de données NoSQL orientée documents.

Contrairement aux bases de données relationnelles, Firestore organise les données en collections et documents.

Cette approche est particulièrement adaptée aux applications mobiles.

---

## Organisation des données

Les principales collections du projet sont les suivantes :

```text
Firestore

users

bus_lines

bus_stops

schedules

favorites
```

Chaque collection contient les informations nécessaires au fonctionnement de l'application.

---

# Collection users

Cette collection regroupe les informations relatives aux utilisateurs.

Exemple :

```text
users

UID_001

nom

prenom

email

photo

telephone
```

Ces informations sont utilisées pour afficher et mettre à jour le profil de l'utilisateur.

---

# Collection bus_lines

Cette collection contient les lignes de bus disponibles.

Chaque document peut comprendre :

* numéro de ligne ;
* nom de la ligne ;
* description ;
* point de départ ;
* destination.

---

# Collection bus_stops

Elle regroupe les différents arrêts desservis par les lignes de bus.

Chaque document contient notamment :

* nom de l'arrêt ;
* ligne associée ;
* localisation (si disponible).

---

# Collection schedules

Cette collection enregistre les horaires de passage des bus.

Les informations sont récupérées et affichées dynamiquement dans l'application.

---

# Collection favorites

Chaque utilisateur peut enregistrer des lignes de bus en favoris.

Les favoris sont associés à son identifiant Firebase afin d'être retrouvés lors des connexions suivantes.

---

# Firebase Storage

## Présentation

Firebase Storage est utilisé pour stocker les fichiers de l'application.

Les principaux éléments enregistrés sont :

* photos de profil ;
* images des lignes de bus ;
* ressources graphiques.

Le stockage dans le cloud garantit un accès rapide et sécurisé aux fichiers.

---

# Synchronisation des données

L'un des principaux avantages de Firebase est la synchronisation en temps réel.

Lorsqu'une donnée est ajoutée, modifiée ou supprimée dans Firestore :

1. la modification est enregistrée dans le cloud ;
2. Firebase notifie automatiquement les clients connectés ;
3. l'application met à jour l'affichage sans redémarrage.

Cette fonctionnalité améliore considérablement l'expérience utilisateur.

---

# Sécurité des données

La protection des données constitue un élément essentiel du projet.

Les mécanismes suivants sont utilisés :

* authentification obligatoire pour les fonctionnalités privées ;
* accès aux données selon les droits de l'utilisateur ;
* stockage sécurisé des informations dans Firebase.

En production, il est recommandé de mettre en place des **règles de sécurité Firestore** limitant les opérations de lecture et d'écriture aux utilisateurs autorisés.

---

# Avantages obtenus grâce à Firebase

L'utilisation de Firebase apporte plusieurs bénéfices :

* développement plus rapide ;
* architecture simplifiée ;
* synchronisation des données en temps réel ;
* sécurité intégrée ;
* évolutivité du projet ;
* maintenance réduite.

Ces avantages ont permis de développer une application moderne répondant aux besoins des utilisateurs.

---

# Limites rencontrées

Malgré ses nombreux avantages, Firebase présente certaines contraintes :

* nécessité d'une connexion Internet pour profiter pleinement de la synchronisation ;
* structure NoSQL qui demande une réflexion différente de celle des bases de données relationnelles ;
* configuration des règles de sécurité pouvant être complexe au début.

Ces contraintes ont été prises en compte durant le développement.

---

# Conclusion

Firebase constitue un élément central de l'architecture de **Senebus Live**. Son intégration avec Flutter a permis de développer une application fiable, sécurisée et évolutive.

Grâce aux services d'authentification, de base de données et de stockage, l'application répond efficacement aux besoins des utilisateurs tout en offrant une excellente expérience de développement.

---

