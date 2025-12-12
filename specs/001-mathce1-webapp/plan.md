# Implementation Plan: MathCE1 - Webapp Exercices Méthode Singapour

**Branch**: `001-mathce1-webapp` | **Date**: 2025-12-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-mathce1-webapp/spec.md`

## Summary

Application web éducative pour enfants de CE1 (6-7 ans) permettant de pratiquer les mathématiques avec la **Méthode de Singapour** (approche CPA). Fonctionnalité différenciante : **entrée vocale dynamique** avec validation automatique dès détection du nombre correct, offrant une expérience fluide et mains-libres.

L'application couvre 5 domaines mathématiques (Numération, Calcul, Géométrie, Mesures, Problèmes) avec :
- Manipulables virtuels interactifs (cubes, jetons, réglettes)
- Schémas en barres (bar models) pour la résolution de problèmes
- Progression adaptative basée sur la maîtrise (≥80%)
- Gamification positive (étoiles, badges, avatar)

## Technical Context

**Language/Version**: JavaScript ES6+ avec HTML5/CSS3 (Vanilla, sans framework)  
**Primary Dependencies**: 
- Web Speech API (reconnaissance vocale native du navigateur)
- Canvas API (manipulables interactifs)
- Service Worker (mode hors-ligne)

**Storage**: localStorage (progression, préférences, badges)  
**Testing**: Jest pour les tests unitaires de logique pédagogique  
**Target Platform**: Navigateurs modernes (Chrome, Edge, Safari, Firefox) - Desktop, Tablette, Mobile  
**Project Type**: Single web application (pas de backend)  
**Performance Goals**: 
- Chargement < 3 secondes
- Animations 60 FPS
- Réponse vocale < 1 seconde

**Constraints**: 
- Offline-capable pour exercices de base
- Fonctionne sur tablettes d'entrée de gamme (2+ Go RAM)
- Éléments tactiles ≥ 44x44 pixels
- Police ≥ 18px

**Scale/Scope**: 
- ~50 types d'exercices initiaux
- 5 domaines mathématiques
- 3 niveaux CPA par exercice

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Conformité | Implémentation |
|----------|------------|----------------|
| **I. Pédagogie Singapour (CPA)** | ✅ Conforme | Chaque exercice a 3 phases : Concret (manipulables), Pictural (schémas), Abstrait (calcul) |
| **II. Expérience Enfant-Centrée** | ✅ Conforme | Police 18px+, éléments 44px+, animations 60fps, feedback positif, pas de "Game Over" |
| **III. Progression & Maîtrise** | ✅ Conforme | Validation à 80%, progression spirale, indices après 2 erreurs |
| **IV. Accessibilité Famille** | ✅ Conforme | Responsive, tactile, hors-ligne, pas de compte obligatoire |
| **V. Architecture Modulaire** | ✅ Conforme | Modules par domaine, composants réutilisables |

**Résultat** : ✅ Tous les gates passés - prêt pour Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-mathce1-webapp/
├── plan.md              # Ce fichier
├── research.md          # Recherche technique (Web Speech API, CPA)
├── data-model.md        # Modèle de données (Enfant, Exercice, Progression)
├── quickstart.md        # Guide de démarrage rapide
├── contracts/           # Non applicable (pas de backend API)
│   └── README.md        # Explication du choix frontend-only
├── checklists/
│   └── requirements.md  # Checklist de qualité spec
└── tasks.md             # Tâches d'implémentation (généré par /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── index.html                 # Point d'entrée HTML
├── manifest.json              # PWA manifest
├── service-worker.js          # Cache offline
│
├── css/
│   ├── main.css               # Variables CSS, design system
│   ├── components.css         # Styles des composants
│   ├── exercises.css          # Styles spécifiques exercices
│   └── animations.css         # Keyframes et transitions
│
├── js/
│   ├── app.js                 # Initialisation application
│   ├── router.js              # Navigation SPA simple
│   │
│   ├── core/
│   │   ├── speech.js          # Module reconnaissance vocale
│   │   ├── storage.js         # Abstraction localStorage
│   │   ├── audio.js           # Sons et feedback audio
│   │   └── state.js           # État global réactif
│   │
│   ├── modules/
│   │   ├── numeration/        # Exercices de numération
│   │   │   ├── index.js
│   │   │   ├── counting.js
│   │   │   ├── comparing.js
│   │   │   └── decomposition.js
│   │   ├── calcul/            # Addition, soustraction, multiplication
│   │   │   ├── index.js
│   │   │   ├── addition.js
│   │   │   ├── subtraction.js
│   │   │   └── multiplication.js
│   │   ├── geometry/          # Formes, symétrie
│   │   │   ├── index.js
│   │   │   ├── shapes.js
│   │   │   └── symmetry.js
│   │   ├── measures/          # Longueurs, temps, monnaie
│   │   │   ├── index.js
│   │   │   ├── lengths.js
│   │   │   ├── time.js
│   │   │   └── money.js
│   │   └── problems/          # Résolution avec bar models
│   │       ├── index.js
│   │       └── bar-model.js
│   │
│   ├── components/
│   │   ├── manipulables/      # Cubes, jetons, réglettes
│   │   │   ├── cube.js
│   │   │   ├── token.js
│   │   │   └── rod.js
│   │   ├── keyboard.js        # Clavier numérique tactile
│   │   ├── mic-button.js      # Bouton microphone avec animation
│   │   ├── answer-display.js  # Affichage réponse en temps réel
│   │   ├── feedback.js        # Animations succès/encouragement
│   │   ├── progress-bar.js    # Barre de progression
│   │   ├── star-counter.js    # Compteur d'étoiles
│   │   └── avatar.js          # Avatar personnalisable
│   │
│   ├── pages/
│   │   ├── home.js            # Écran d'accueil
│   │   ├── domain-select.js   # Sélection du domaine
│   │   ├── exercise.js        # Page d'exercice (générique)
│   │   ├── progress.js        # Tableau de bord progression
│   │   ├── avatar-shop.js     # Boutique avatar
│   │   └── parent-dashboard.js# Vue parent
│   │
│   └── data/
│       ├── exercises/         # Banque d'exercices par domaine
│       │   ├── numeration.json
│       │   ├── calcul.json
│       │   ├── geometry.json
│       │   ├── measures.json
│       │   └── problems.json
│       ├── badges.json        # Définition des badges
│       └── french-numbers.js  # Mapping nombres français (0-100)
│
├── assets/
│   ├── images/
│   │   ├── mascot/            # Mascotte guide
│   │   ├── badges/            # Icônes badges
│   │   └── avatars/           # Éléments avatar
│   └── sounds/
│       ├── success.mp3
│       ├── encouragement.mp3
│       └── click.mp3
│
tests/
├── unit/
│   ├── speech.test.js         # Tests reconnaissance vocale
│   ├── french-numbers.test.js # Tests conversion nombres
│   ├── progression.test.js    # Tests logique progression
│   └── validation.test.js     # Tests validation réponses
└── integration/
    └── exercise-flow.test.js  # Tests parcours exercice
```

**Structure Decision**: Application web frontend-only (single project) car :
- Pas de données sensibles nécessitant un backend
- Stockage localStorage suffisant pour la progression
- Reconnaissance vocale via API native du navigateur
- Mode hors-ligne critique pour l'usage familial

## Complexity Tracking

> Aucune violation de constitution détectée. Pas de complexité additionnelle requise.

| Aspect | Choix | Justification |
|--------|-------|---------------|
| Pas de framework JS | Vanilla JS | Performance, taille bundle, simplicité pour projet éducatif |
| Pas de backend | Frontend-only | Évite friction compte, simplifie déploiement, offline-first |
| Web Speech API | API native | Pas de dépendance externe, fonctionne offline (limité), RGPD-friendly |
