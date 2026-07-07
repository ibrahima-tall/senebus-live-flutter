# 👨‍💻 Développement de l'Application

## Introduction

Le développement de **Senebus Live** s'est déroulé de manière progressive, en suivant une approche structurée. Chaque fonctionnalité a été conçue, développée et testée avant d'être intégrée au projet.

L'objectif principal était de concevoir une application moderne, intuitive et performante, capable de répondre aux besoins des usagers des transports en commun.

Le choix de Flutter et Firebase a permis de bénéficier d'un environnement de développement rapide, flexible et adapté aux applications mobiles multiplateformes.

---

# 📌 Analyse des besoins

Avant le développement, une phase d'analyse a été réalisée afin d'identifier les attentes des futurs utilisateurs.

Les principaux besoins identifiés étaient :

* consulter facilement les lignes de bus ;
* connaître les horaires de passage ;
* rechercher une ligne ou un arrêt ;
* créer un compte utilisateur ;
* enregistrer des lignes en favoris ;
* disposer d'une interface simple et rapide.

Cette analyse a permis de définir les fonctionnalités essentielles de l'application.

---

# 📝 Conception de l'application

Après l'analyse, une phase de conception a été menée.

Elle consistait à définir :

* les écrans de l'application ;
* les parcours utilisateurs ;
* les données à stocker dans Firebase ;
* la structure des dossiers Flutter ;
* les modèles de données ;
* les services nécessaires.

Cette étape a facilité le développement en donnant une vision claire de l'architecture du projet.

---

# 📁 Création du projet Flutter

Le projet a été initialisé avec Flutter à l'aide de la commande :

```bash
flutter create senebus_live
```

Cette commande a généré automatiquement l'architecture de base du projet, comprenant notamment les dossiers `android`, `ios`, `lib`, `test` et les fichiers de configuration.

---

# 🔥 Intégration de Firebase

Une fois le projet Flutter créé, Firebase a été intégré.

Les principales étapes ont été :

* création d'un projet Firebase ;
* ajout des applications Android et iOS ;
* installation de FlutterFire CLI ;
* génération du fichier `firebase_options.dart` ;
* configuration de Firebase Authentication ;
* configuration de Cloud Firestore ;
* configuration de Firebase Storage.

Cette intégration permet à l'application de communiquer avec les services Firebase de manière sécurisée.

---

# 🎨 Développement de l'interface utilisateur

L'interface utilisateur a été développée avec Flutter en utilisant des widgets modernes.

Une attention particulière a été portée à :

* la simplicité de navigation ;
* la lisibilité des informations ;
* l'harmonisation des couleurs ;
* l'ergonomie générale ;
* l'adaptation à différentes tailles d'écran.

Chaque écran a été conçu afin d'offrir une expérience utilisateur fluide.

---

# 🔐 Développement de l'authentification

L'authentification constitue l'une des premières fonctionnalités développées.

Elle permet aux utilisateurs de :

* créer un compte ;
* se connecter ;
* réinitialiser leur mot de passe ;
* se déconnecter en toute sécurité.

Firebase Authentication prend en charge ces opérations tout en garantissant la sécurité des informations personnelles.

---

# 🚌 Gestion des lignes de bus

Une fonctionnalité centrale de l'application consiste à afficher les différentes lignes de bus.

Pour chaque ligne, l'utilisateur peut consulter :

* le numéro de la ligne ;
* le nom de la ligne ;
* les arrêts desservis ;
* les horaires disponibles.

Les données sont récupérées depuis Cloud Firestore et affichées dynamiquement dans l'application.

---

# 🔍 Mise en place de la recherche

Afin de faciliter l'accès aux informations, une fonctionnalité de recherche a été développée.

L'utilisateur peut rechercher :

* une ligne de bus ;
* un arrêt.

Les résultats sont affichés de manière instantanée, ce qui améliore la rapidité d'utilisation de l'application.

---

# ⭐ Gestion des favoris

L'application permet aux utilisateurs authentifiés d'enregistrer leurs lignes préférées.

Les favoris sont associés au compte utilisateur et enregistrés dans Cloud Firestore.

Ainsi, lors d'une nouvelle connexion, les favoris sont automatiquement restaurés.

---

# 👤 Gestion du profil utilisateur

Chaque utilisateur dispose d'un espace personnel lui permettant de :

* consulter ses informations ;
* modifier son nom ;
* mettre à jour sa photo de profil ;
* consulter son adresse électronique.

Les images sont stockées dans Firebase Storage.

---

# ☁️ Gestion des données

Toutes les informations manipulées par l'application sont stockées dans Cloud Firestore.

Les principales collections utilisées sont :

* `users`
* `bus_lines`
* `bus_stops`
* `schedules`
* `favorites`

Cette organisation facilite la gestion des données et leur évolution.

---

# 🧪 Tests réalisés

Tout au long du développement, des tests ont été effectués afin de vérifier le bon fonctionnement de l'application.

Les principaux tests concernaient :

* l'inscription des utilisateurs ;
* la connexion ;
* la récupération des données ;
* l'affichage des lignes ;
* la recherche ;
* les favoris ;
* le chargement des images ;
* la navigation entre les écrans.

Chaque anomalie détectée a été corrigée avant l'intégration de nouvelles fonctionnalités.

---

# ⚠️ Difficultés rencontrées

Comme tout projet de développement, Senebus Live a présenté plusieurs défis techniques.

Parmi les principales difficultés :

* configuration initiale de Firebase ;
* compréhension de Cloud Firestore ;
* gestion des dépendances Flutter ;
* synchronisation des données en temps réel ;
* résolution des conflits Git ;
* adaptation de l'interface à différentes tailles d'écran.

Ces difficultés ont constitué une opportunité d'apprentissage et ont permis d'approfondir les connaissances acquises durant le stage.

---

# ✅ Solutions apportées

Pour surmonter ces difficultés, plusieurs solutions ont été mises en œuvre :

* consultation de la documentation officielle de Flutter et Firebase ;
* réalisation de tests unitaires et fonctionnels ;
* organisation du projet en modules ;
* utilisation de Git pour suivre les modifications ;
* optimisation progressive du code ;
* amélioration continue de l'interface utilisateur.

Cette démarche a permis d'obtenir une application stable et fonctionnelle.

---

# 📈 Résultats obtenus

À l'issue du développement, les objectifs principaux ont été atteints.

L'application permet désormais :

* la création de comptes utilisateurs ;
* l'authentification sécurisée ;
* la consultation des lignes de bus ;
* la recherche d'informations ;
* la gestion des favoris ;
* la consultation des profils ;
* la synchronisation des données avec Firebase.

L'ensemble de ces fonctionnalités offre une solution numérique répondant aux besoins identifiés au début du projet.

---

# 🚀 Perspectives d'amélioration

Plusieurs évolutions pourront être envisagées dans les prochaines versions de Senebus Live :

* intégration de la géolocalisation en temps réel ;
* affichage des bus sur une carte interactive ;
* notifications des prochains passages ;
* achat de tickets en ligne ;
* mode hors connexion ;
* estimation des temps de trajet ;
* historique des recherches ;
* support multilingue (Français, Anglais, Wolof).

Ces améliorations permettront d'enrichir l'expérience utilisateur et de répondre à de nouveaux besoins.

---

# 🎯 Conclusion

Le développement de **Senebus Live** a permis de mettre en pratique les compétences acquises en développement mobile avec Flutter et en gestion de services cloud avec Firebase.

Ce projet a renforcé les connaissances en conception d'applications, en architecture logicielle, en gestion de bases de données NoSQL et en collaboration avec Git.

Au-delà de l'aspect technique, cette expérience a constitué une étape importante dans le développement de compétences professionnelles, en apportant une meilleure maîtrise des méthodes de travail, de l'organisation d'un projet logiciel et de la résolution de problèmes.
