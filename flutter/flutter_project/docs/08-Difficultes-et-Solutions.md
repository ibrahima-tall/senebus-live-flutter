# ⚠️ Difficultés Rencontrées et Solutions Apportées

## Introduction

Le développement de **Senebus Live** a constitué une expérience enrichissante, mais il a également présenté plusieurs défis techniques. Chaque difficulté rencontrée a été analysée afin de trouver une solution adaptée.

Cette démarche m'a permis de renforcer mes compétences en développement mobile, en gestion de projet et en résolution de problèmes.

---

# 🔥 Intégration de Firebase

## Difficulté

L'une des premières difficultés a été la configuration de Firebase avec Flutter.

La mise en place de **Firebase Authentication**, **Cloud Firestore** et **Firebase Storage** nécessitait une configuration précise afin d'assurer la communication entre l'application et les services Firebase.

Des erreurs de configuration pouvaient empêcher l'application de démarrer correctement.

## Solution

Pour résoudre ce problème, plusieurs actions ont été réalisées :

* installation de FlutterFire CLI ;
* création d'un projet Firebase ;
* ajout des plateformes Android et iOS ;
* génération du fichier `firebase_options.dart` ;
* vérification de l'initialisation de Firebase dans `main.dart`.

Une fois ces étapes terminées, la connexion avec Firebase a été correctement établie.

---

# 🔐 Authentification des utilisateurs

## Difficulté

La gestion des comptes utilisateurs demandait une authentification fiable et sécurisée.

Il fallait garantir :

* une création de compte correcte ;
* une connexion sécurisée ;
* une gestion des erreurs ;
* une récupération du mot de passe.

## Solution

Firebase Authentication a été utilisé afin de gérer automatiquement :

* l'inscription ;
* la connexion ;
* la déconnexion ;
* la réinitialisation du mot de passe.

Des messages d'erreur clairs ont également été affichés afin d'améliorer l'expérience utilisateur.

---

# ☁️ Gestion des données avec Cloud Firestore

## Difficulté

La modélisation des données représentait un défi important.

Il était nécessaire d'organiser correctement les collections afin de faciliter les recherches et les mises à jour.

## Solution

Une structure simple et cohérente a été adoptée.

Les principales collections créées sont :

* `users`
* `bus_lines`
* `bus_stops`
* `schedules`
* `favorites`

Cette organisation facilite la maintenance et les évolutions futures.

---

# 🎨 Conception de l'interface utilisateur

## Difficulté

Créer une interface claire, moderne et facile à utiliser nécessitait une attention particulière.

L'application devait être agréable à utiliser sur différentes tailles d'écran.

## Solution

L'interface a été développée avec les widgets Flutter en privilégiant :

* une navigation intuitive ;
* une hiérarchie visuelle claire ;
* des couleurs harmonieuses ;
* des composants réutilisables.

Des ajustements ont été réalisés après plusieurs phases de test afin d'améliorer l'ergonomie.

---

# 🔎 Recherche des lignes de bus

## Difficulté

Mettre en place une recherche rapide nécessitait une bonne gestion des données récupérées depuis Firestore.

## Solution

Une recherche dynamique a été développée afin d'afficher progressivement les résultats pendant la saisie de l'utilisateur.

Cette approche améliore la rapidité d'accès aux informations.

---

# ⭐ Gestion des favoris

## Difficulté

Les lignes favorites devaient être enregistrées pour chaque utilisateur sans être visibles par les autres.

## Solution

Les favoris ont été associés à l'identifiant unique (UID) de chaque utilisateur.

Ainsi, chaque utilisateur retrouve automatiquement ses favoris après connexion.

---

# 🖼️ Gestion des images

## Difficulté

Le stockage et l'affichage des photos de profil demandaient une solution fiable.

## Solution

Firebase Storage a été utilisé pour héberger les images.

Les liens de téléchargement sont enregistrés dans Cloud Firestore afin de pouvoir afficher les images dans l'application.

---

# 🌐 Gestion des versions avec Git

## Difficulté

Au cours du développement, plusieurs modifications successives ont été apportées au projet.

Sans un outil de gestion de versions, il aurait été difficile de suivre les évolutions.

## Solution

Git a été utilisé pour :

* enregistrer chaque étape importante ;
* revenir à une version précédente en cas de problème ;
* conserver un historique du développement ;
* publier le projet sur GitHub.

Cette méthode a permis de sécuriser le développement.

---

# 🐞 Correction des erreurs

Pendant le développement, plusieurs erreurs ont été rencontrées.

Parmi les plus fréquentes :

* erreurs de compilation Flutter ;
* dépendances incompatibles ;
* erreurs de configuration Firebase ;
* erreurs de navigation ;
* erreurs liées aux permissions Android.

Chaque problème a été analysé grâce aux messages affichés dans la console et corrigé progressivement.

---

# 🧪 Phase de tests

Avant chaque nouvelle version, plusieurs tests ont été réalisés.

Les vérifications portaient notamment sur :

* l'inscription ;
* la connexion ;
* la récupération des données ;
* la navigation ;
* les favoris ;
* le profil utilisateur ;
* les horaires ;
* les images.

Ces tests ont permis d'améliorer la stabilité générale de l'application.

---

# 📚 Compétences développées

Ce projet m'a permis de développer de nombreuses compétences, notamment :

### Développement mobile

* Flutter
* Dart
* Architecture d'application

### Backend

* Firebase Authentication
* Cloud Firestore
* Firebase Storage

### Gestion de projet

* organisation du développement ;
* planification des tâches ;
* suivi des versions avec Git.

### Qualités professionnelles

* autonomie ;
* capacité d'analyse ;
* résolution de problèmes ;
* rigueur ;
* travail méthodique.

---

# 🎯 Leçons retenues

La réalisation de Senebus Live m'a permis de comprendre l'importance :

* d'une bonne architecture logicielle ;
* d'une documentation claire ;
* de tests réguliers ;
* d'une organisation rigoureuse du projet ;
* de la gestion des versions avec Git.

Ces bonnes pratiques constituent désormais une base solide pour mes futurs projets.

---

# ✅ Conclusion

Les difficultés rencontrées tout au long du développement ont été progressivement résolues grâce à des recherches, des expérimentations et des tests.

Chaque obstacle surmonté a contribué à renforcer mes compétences techniques et professionnelles.

Au terme de ce projet, Senebus Live est devenu une application fonctionnelle, structurée et évolutive, répondant aux objectifs fixés au début du stage.

Les solutions mises en œuvre ont permis de garantir la stabilité de l'application et d'offrir une expérience utilisateur satisfaisante.
