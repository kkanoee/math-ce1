# Research: MathCE1 - Webapp Exercices Méthode Singapour

**Feature**: 001-mathce1-webapp  
**Date**: 2025-12-07  
**Status**: Complete

## Table of Contents

1. [Web Speech API pour la Reconnaissance Vocale](#1-web-speech-api-pour-la-reconnaissance-vocale)
2. [Conversion Nombres Français (0-100)](#2-conversion-nombres-français-0-100)
3. [Validation Dynamique des Réponses](#3-validation-dynamique-des-réponses)
4. [Méthode de Singapour - Approche CPA](#4-méthode-de-singapour---approche-cpa)
5. [Manipulables Virtuels Interactifs](#5-manipulables-virtuels-interactifs)
6. [Progressive Web App (PWA) et Mode Hors-ligne](#6-progressive-web-app-pwa-et-mode-hors-ligne)

---

## 1. Web Speech API pour la Reconnaissance Vocale

### Decision
Utiliser l'API native **Web Speech API** (SpeechRecognition) intégrée aux navigateurs modernes.

### Rationale
- **Pas de dépendance externe** : Fonctionne nativement dans Chrome, Edge, Safari
- **Gratuit** : Pas de coûts d'API cloud (Google Speech, AWS Transcribe)
- **RGPD-friendly** : Traitement côté client pour Chrome/Edge (sauf Safari qui envoie à Apple)
- **Latence faible** : Résultats en temps réel (< 500ms)
- **Support français** : `lang: 'fr-FR'` supporte bien les nombres français

### Alternatives Considered
| Alternative | Rejetée car |
|-------------|-------------|
| Google Cloud Speech-to-Text | Coût, nécessite backend, latence réseau |
| Mozilla DeepSpeech | Installation complexe, modèle français limité |
| Whisper (OpenAI) | Nécessite serveur, pas de streaming temps réel |

### Implementation Notes

```javascript
// Exemple d'implémentation
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'fr-FR';
recognition.continuous = false;
recognition.interimResults = true; // Résultats en temps réel

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  const number = frenchToNumber(transcript); // Conversion
  if (number === expectedAnswer) {
    validateAnswer(); // Validation dynamique
  }
};
```

### Browser Support
| Navigateur | Support | Notes |
|------------|---------|-------|
| Chrome | ✅ Complet | Traitement cloud Google |
| Edge | ✅ Complet | Traitement cloud Microsoft |
| Safari | ✅ Complet | Traitement cloud Apple |
| Firefox | ⚠️ Limité | Nécessite flag, pas en production |

**Fallback** : Clavier numérique tactile si API non disponible.

---

## 2. Conversion Nombres Français (0-100)

### Decision
Créer un module de mapping bidirectionnel nombres français ↔ nombres pour gérer les particularités linguistiques.

### Rationale
Le français a des formes irrégulières (soixante-dix, quatre-vingts) que la Web Speech API retourne en texte.

### Particularités Françaises

| Plage | Particularité | Exemples |
|-------|---------------|----------|
| 0-16 | Formes uniques | zéro, un, deux... seize |
| 17-19 | Dix-sept, dix-huit, dix-neuf | |
| 20-69 | Régulier (vingt-et-un, trente-deux...) | |
| 70-79 | **Soixante-dix** + unité | soixante-dix, soixante-et-onze, soixante-douze... |
| 80 | **Quatre-vingts** (avec s) | |
| 81-99 | **Quatre-vingt-** + unité | quatre-vingt-un, quatre-vingt-dix-sept |

### Implementation

```javascript
const FRENCH_NUMBERS = {
  'zéro': 0, 'un': 1, 'deux': 2, 'trois': 3, 'quatre': 4,
  'cinq': 5, 'six': 6, 'sept': 7, 'huit': 8, 'neuf': 9,
  'dix': 10, 'onze': 11, 'douze': 12, 'treize': 13, 'quatorze': 14,
  'quinze': 15, 'seize': 16, 'dix-sept': 17, 'dix-huit': 18, 'dix-neuf': 19,
  'vingt': 20, 'trente': 30, 'quarante': 40, 'cinquante': 50, 'soixante': 60,
  'soixante-dix': 70, 'quatre-vingts': 80, 'quatre-vingt': 80, 'cent': 100
};

function frenchToNumber(text) {
  const normalized = text.toLowerCase().trim();
  
  // Cas directs
  if (FRENCH_NUMBERS[normalized] !== undefined) {
    return FRENCH_NUMBERS[normalized];
  }
  
  // Cas composés : "vingt-trois", "soixante-dix-sept", "quatre-vingt-douze"
  // Parsing avec règles de composition française
  // ... (voir implémentation complète dans french-numbers.js)
}
```

### Edge Cases à Gérer
- "un" vs "une" → traiter comme 1
- "quatre-vingts" (avec s) vs "quatre-vingt" (sans s avant unité)
- "et" optionnel : "vingt et un" = "vingt-un" = 21
- Variations reconnaissance vocale : "cent" vs "sans" → privilégier interprétation numérique

---

## 3. Validation Dynamique des Réponses

### Decision
Implémenter une validation **automatique instantanée** dès que la réponse correspond, sans bouton "Valider".

### Rationale
- Fluidité de l'expérience enfant
- Réduction des clics/taps
- Feedback immédiat = apprentissage renforcé

### Patterns de Validation

#### Validation Vocale
```javascript
recognition.onresult = (event) => {
  const interim = event.results[0][0].transcript;
  displayInterimResult(interim); // Affichage temps réel
  
  const number = frenchToNumber(interim);
  if (number === expectedAnswer) {
    recognition.stop();
    showSuccess(); // Animation + son
  }
};
```

#### Validation Clavier
```javascript
function onKeyInput(digit) {
  currentInput += digit;
  displayInput(currentInput);
  
  const inputNumber = parseInt(currentInput, 10);
  
  // Validation quand nombre de chiffres atteint
  if (currentInput.length === expectedAnswer.toString().length) {
    if (inputNumber === expectedAnswer) {
      showSuccess();
    } else {
      showEncouragement(); // Pas d'échec, indice
    }
  }
}
```

### Timing Considerations
| Événement | Délai Max | Action si dépassé |
|-----------|-----------|-------------------|
| Silence vocal | 3 secondes | Afficher "Je t'écoute..." |
| Clavier inactif | 5 secondes | Pas d'action (l'enfant réfléchit) |
| Après erreur | Immédiat | Indice CPA après 2 erreurs |

---

## 4. Méthode de Singapour - Approche CPA

### Decision
Chaque exercice DOIT implémenter les 3 phases CPA dans l'ordre, avec progression basée sur la maîtrise.

### Les 3 Phases

#### Phase 1 : Concret (Manipulables)
- **Objectif** : Comprendre par la manipulation physique virtuelle
- **Éléments** : Cubes, jetons, réglettes Cuisenaire, pièces de monnaie
- **Interaction** : Drag & drop, tap pour compter
- **Exemple** : "Combien font 3 + 2 ?" → L'enfant déplace 3 cubes, puis 2 cubes, puis compte le total

#### Phase 2 : Pictural (Représentations)
- **Objectif** : Abstraction partielle via images/schémas
- **Éléments** : Bar models, tableaux de dizaines/unités, horloges
- **Interaction** : Cliquer sur les parties du schéma
- **Exemple** : "Combien font 3 + 2 ?" → Barre de 3 cases + barre de 2 cases à compléter

#### Phase 3 : Abstrait (Symbolique)
- **Objectif** : Maîtrise de la notation mathématique
- **Éléments** : Équations, chiffres seuls
- **Interaction** : Saisie numérique (vocal ou clavier)
- **Exemple** : "3 + 2 = ?" → L'enfant répond "5"

### Progression Entre Phases
```javascript
const MASTERY_THRESHOLD = 0.8; // 80% de réussite

function getNextPhase(domain, currentPhase, successRate) {
  if (successRate >= MASTERY_THRESHOLD) {
    if (currentPhase === 'concrete') return 'pictorial';
    if (currentPhase === 'pictorial') return 'abstract';
  }
  return currentPhase; // Rester au même niveau
}
```

---

## 5. Manipulables Virtuels Interactifs

### Decision
Implémenter les manipulables avec **Canvas API** pour performance, avec événements touch/mouse unifiés.

### Types de Manipulables

| Manipulable | Usage | Implémentation |
|-------------|-------|----------------|
| **Cubes unitaires** | Comptage, addition | Canvas + drag & drop |
| **Jetons** | Comptage, comparaison | Canvas + tap |
| **Réglettes Cuisenaire** | Décomposition, mesure | Canvas + snap-to-grid |
| **Blocs base 10** | Dizaines/unités | Canvas avec groupage auto |
| **Pièces/Billets** | Monnaie | Images + drag & drop |
| **Horloge** | Heures | Canvas interactif avec aiguilles |

### Touch-Friendly Design
```javascript
class Manipulable {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Événements unifiés touch/mouse
    canvas.addEventListener('pointerdown', this.onStart.bind(this));
    canvas.addEventListener('pointermove', this.onMove.bind(this));
    canvas.addEventListener('pointerup', this.onEnd.bind(this));
  }
  
  // Taille minimale 44x44px pour accessibilité tactile
  static MIN_SIZE = 44;
}
```

### Animations
- **Pick up** : Légère augmentation de taille + ombre
- **Drop** : Rebond léger
- **Count** : Highlight séquentiel avec son
- **Success** : Particules + célébration

---

## 6. Progressive Web App (PWA) et Mode Hors-ligne

### Decision
Implémenter comme PWA avec Service Worker pour cache des exercices et fonctionnement offline.

### Stratégie de Cache

| Ressource | Stratégie | Raison |
|-----------|-----------|--------|
| HTML/CSS/JS | Cache-first, update in background | Performance |
| Exercices JSON | Cache-first | Fonctionnement offline |
| Images badges/avatars | Cache-first | UX fluide |
| Sons | Cache on first use | Économie bande passante |

### Service Worker

```javascript
// service-worker.js
const CACHE_NAME = 'mathce1-v1';
const OFFLINE_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/app.js',
  '/js/data/exercises/numeration.json',
  '/js/data/exercises/calcul.json',
  // ...
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(OFFLINE_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### Limitations Offline
- **Reconnaissance vocale** : Dépend du navigateur
  - Chrome : Nécessite connexion (envoie audio à Google)
  - Safari : Nécessite connexion (envoie audio à Apple)
  - **Fallback** : Clavier numérique toujours disponible offline

---

## Summary of Decisions

| Domaine | Décision | Impact |
|---------|----------|--------|
| Reconnaissance vocale | Web Speech API native | Pas de coût, RGPD-friendly, latence faible |
| Nombres français | Module de mapping custom | Support complet 0-100 avec formes irrégulières |
| Validation | Automatique dès détection | UX fluide, pas de bouton "Valider" |
| Approche pédagogique | CPA strict (Concret→Pictural→Abstrait) | Conformité Méthode Singapour |
| Manipulables | Canvas API + Pointer Events | Performance 60fps, touch-friendly |
| Offline | PWA avec Service Worker | Usage sans connexion (sauf voix) |
