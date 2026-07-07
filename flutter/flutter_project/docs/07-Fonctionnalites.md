# 📱 Fonctionnalités de l'Application

## Introduction

**Senebus Live** est une application mobile développée afin d'améliorer l'accès aux informations relatives aux transports en commun. Elle met à disposition plusieurs fonctionnalités permettant aux utilisateurs de consulter les lignes de bus, les horaires et de personnaliser leur expérience.

Chaque fonctionnalité a été développée dans le but de proposer une application simple, rapide et intuitive.

---

# 🚀 Écran de démarrage (Splash Screen)

Le Splash Screen est le premier écran affiché lors du lancement de l'application.

Il permet :

* d'afficher le logo de Senebus Live ;
* de charger les ressources nécessaires ;
* de vérifier si l'utilisateur est déjà connecté.

Une fois le chargement terminé, l'utilisateur est automatiquement redirigé vers l'écran approprié.

> **Capture d'écran à insérer ici :**
>
> `docs/images/splash_screen.png`

---

# 🔐 Authentification

## Connexion

L'utilisateur peut accéder à son compte grâce à son adresse électronique et à son mot de passe.

Fonctionnalités :

* saisie de l'adresse électronique ;
* saisie du mot de passe ;
* validation des informations ;
* connexion sécurisée via Firebase Authentication.

En cas d'erreur, un message explicatif est affiché.

> **Capture d'écran :**
>
> `docs/images/login_screen.png`

---

## Création d'un compte

Les nouveaux utilisateurs peuvent créer un compte directement depuis l'application.

Les informations demandées sont :

* nom ;
* prénom (si utilisé) ;
* adresse électronique ;
* mot de passe.

Après validation, le compte est enregistré dans Firebase Authentication et les informations complémentaires sont sauvegardées dans Cloud Firestore.

> **Capture d'écran :**
>
> `docs/images/register_screen.png`

---

## Réinitialisation du mot de passe

En cas d'oubli du mot de passe, l'utilisateur peut demander un lien de réinitialisation en renseignant son adresse électronique.

Cette fonctionnalité est gérée par Firebase Authentication.

---

# 🏠 Page d'accueil

La page d'accueil constitue le point central de l'application.

Elle permet notamment :

* d'accéder rapidement aux lignes de bus ;
* de lancer une recherche ;
* de consulter les favoris ;
* d'accéder aux paramètres.

L'interface a été pensée pour offrir une navigation simple et intuitive.

> **Capture d'écran :**
>
> `docs/images/home_screen.png`

---

# 🚌 Consultation des lignes de bus

Cette fonctionnalité permet d'afficher l'ensemble des lignes disponibles.

Pour chaque ligne, les informations suivantes sont présentées :

* numéro de la ligne ;
* nom de la ligne ;
* point de départ ;
* destination.

L'utilisateur peut sélectionner une ligne afin d'obtenir davantage de détails.

> **Capture d'écran :**
>
> `docs/images/bus_lines.png`

---

# 📍 Consultation des arrêts

Chaque ligne de bus dispose d'une liste des arrêts desservis.

Cette fonctionnalité permet à l'utilisateur de consulter facilement le parcours de la ligne.

Les informations peuvent inclure :

* nom de l'arrêt ;
* ordre de passage ;
* localisation (si disponible).

---

# 🕒 Consultation des horaires

Les horaires de passage sont récupérés depuis Cloud Firestore.

L'utilisateur peut consulter les prochains passages pour chaque ligne.

Cette fonctionnalité permet de mieux organiser les déplacements quotidiens.

> **Capture d'écran :**
>
> `docs/images/schedules.png`

---

# 🔎 Recherche

L'application intègre un moteur de recherche permettant de retrouver rapidement une ligne ou un arrêt.

La recherche est dynamique : les résultats s'affichent progressivement au fur et à mesure de la saisie.

Cette fonctionnalité améliore considérablement la rapidité d'accès aux informations.

> **Capture d'écran :**
>
> `docs/images/search.png`

---

# ⭐ Gestion des favoris

Les utilisateurs connectés peuvent enregistrer leurs lignes préférées.

Les favoris sont stockés dans Cloud Firestore et associés au compte de l'utilisateur.

Ils sont automatiquement synchronisés lors des connexions suivantes.

Fonctionnalités :

* ajout d'une ligne aux favoris ;
* suppression d'un favori ;
* consultation de la liste des favoris.

> **Capture d'écran :**
>
> `docs/images/favorites.png`

---

# 👤 Gestion du profil

Chaque utilisateur dispose d'un espace personnel lui permettant de gérer ses informations.

Les principales actions possibles sont :

* consulter ses informations ;
* modifier son nom ;
* modifier son adresse électronique (si autorisé) ;
* mettre à jour sa photo de profil.

Les images sont enregistrées dans Firebase Storage.

> **Capture d'écran :**
>
> `docs/images/profile.png`

---

# ⚙️ Paramètres

Le menu Paramètres permet de personnaliser certains aspects de l'application.

Selon les fonctionnalités disponibles, il peut inclure :

* changement du thème (clair/sombre) ;
* informations sur l'application ;
* politique de confidentialité ;
* déconnexion.

Cette page centralise les options de configuration de l'application.

> **Capture d'écran :**
>
> `docs/images/settings.png`

---

# 🔄 Navigation dans l'application

La navigation repose sur le système de routes de Flutter.

Le parcours utilisateur peut être résumé ainsi :

```text
Splash Screen
        │
        ▼
Connexion / Inscription
        │
        ▼
Accueil
   ├──────────────┐
   ▼              ▼
Lignes         Favoris
   │              │
   ▼              ▼
Détails       Profil
   │
   ▼
Horaires
```

Cette organisation garantit une navigation fluide et logique.

---

# 📊 Résumé des fonctionnalités

| Fonctionnalité          | Description                                       |
| ----------------------- | ------------------------------------------------- |
| Authentification        | Création de compte, connexion et déconnexion      |
| Consultation des lignes | Liste complète des lignes de bus                  |
| Consultation des arrêts | Affichage des arrêts desservis                    |
| Horaires                | Consultation des horaires de passage              |
| Recherche               | Recherche rapide par ligne ou arrêt               |
| Favoris                 | Enregistrement des lignes préférées               |
| Profil                  | Gestion des informations utilisateur              |
| Paramètres              | Personnalisation et informations de l'application |

---

# 🎯 Conclusion

Les fonctionnalités développées dans **Senebus Live** répondent aux objectifs fixés au début du projet. Elles permettent aux utilisateurs d'accéder rapidement aux informations essentielles concernant les transports en commun, tout en bénéficiant d'une interface moderne et intuitive.

L'architecture adoptée avec Flutter et Firebase facilite également l'ajout de nouvelles fonctionnalités pour les futures versions de l'application.
