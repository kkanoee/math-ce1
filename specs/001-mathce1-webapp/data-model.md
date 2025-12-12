# Data Model: MathCE1 - Webapp Exercices Méthode Singapour

**Feature**: 001-mathce1-webapp  
**Date**: 2025-12-07  
**Storage**: localStorage (JSON serialization)

## Overview

Ce document définit le modèle de données pour l'application MathCE1. Toutes les données sont stockées localement dans le navigateur (localStorage) sans backend.

## Entities

### 1. Child (Enfant)

Représente l'utilisateur principal de l'application.

```javascript
{
  "id": "string",              // UUID généré automatiquement
  "name": "string",            // Pseudo choisi (ex: "Léa")
  "avatar": {
    "base": "string",          // ID avatar de base (ex: "fox", "cat", "robot")
    "accessories": ["string"]  // IDs accessoires débloqués et équipés
  },
  "stars": "number",           // Total d'étoiles accumulées
  "createdAt": "ISO8601",      // Date création profil
  "lastActiveAt": "ISO8601"    // Dernière activité
}
```

**Règles de Validation**:
- `name`: 1-20 caractères, lettres et espaces uniquement
- `stars`: ≥ 0, incrémenté à chaque exercice réussi
- Maximum 5 profils enfants par appareil

---

### 2. Progression

État de maîtrise de l'enfant par domaine et niveau CPA.

```javascript
{
  "childId": "string",         // Référence à Child.id
  "domain": "enum",            // "numeration" | "calcul" | "geometry" | "measures" | "problems"
  "cpaLevel": "enum",          // "concrete" | "pictorial" | "abstract"
  "difficulty": "number",      // 1-10, augmente progressivement
  "exercisesCompleted": "number",
  "exercisesSuccessful": "number",
  "successRate": "number",     // (successful / completed) * 100
  "lastExerciseAt": "ISO8601",
  "unlockedAt": "ISO8601"      // Quand ce niveau a été débloqué
}
```

**Règles de Progression**:
- `successRate` ≥ 80% sur 10 exercices → déblocage niveau suivant
- Ordre de déblocage : concrete → pictorial → abstract
- Chaque domaine a sa propre progression indépendante

**Transitions d'État**:
```
[concrete]  --80%+, 10 exercices-->  [pictorial]
[pictorial] --80%+, 10 exercices-->  [abstract]
[abstract]  --80%+, 5 exercices-->   [difficulty + 1]
```

---

### 3. Exercise

Définition d'un exercice (données statiques, chargées depuis JSON).

```javascript
{
  "id": "string",              // Identifiant unique (ex: "add-001")
  "domain": "enum",            // Domaine mathématique
  "type": "string",            // Sous-type (ex: "addition-sans-retenue")
  "cpaLevel": "enum",          // Phase CPA ciblée
  "difficulty": "number",      // 1-10
  "question": {
    "text": "string",          // Texte affiché (ex: "Combien font 3 + 2 ?")
    "audio": "string?",        // URL audio optionnel
    "visual": {
      "type": "string",        // "equation" | "manipulables" | "bar-model" | "image"
      "data": "object"         // Données spécifiques au type visuel
    }
  },
  "expectedAnswer": "number | string | object", // Réponse attendue
  "hints": [                   // Indices progressifs
    {
      "level": 1,              // Après 1ère erreur
      "type": "string",        // "text" | "visual" | "audio"
      "content": "any"
    }
  ],
  "tags": ["string"]           // Pour filtrage (ex: ["tables-2", "mental"])
}
```

**Types de Réponses**:
| Type | Format | Exemple |
|------|--------|---------|
| Nombre simple | `number` | `5` |
| Plusieurs nombres | `number[]` | `[2, 3, 5]` (suite) |
| Choix multiple | `string` | `"rectangle"` |
| Position | `{x, y}` | Placement sur grille |

---

### 4. Session

Une séance de travail (série d'exercices).

```javascript
{
  "id": "string",
  "childId": "string",
  "domain": "enum",
  "startedAt": "ISO8601",
  "endedAt": "ISO8601?",       // null si en cours
  "duration": "number",        // En secondes
  "exercises": [
    {
      "exerciseId": "string",
      "cpaLevel": "enum",
      "attempts": [
        {
          "answer": "any",
          "isCorrect": "boolean",
          "inputMethod": "enum", // "voice" | "keyboard" | "touch"
          "responseTimeMs": "number",
          "timestamp": "ISO8601"
        }
      ],
      "hintsUsed": "number",
      "result": "enum"         // "success" | "skipped" | "helped"
    }
  ],
  "summary": {
    "total": "number",
    "successful": "number",
    "starsEarned": "number"
  }
}
```

**Règles**:
- Maximum 15 minutes par session (recommandation pédagogique)
- Sauvegarde automatique toutes les 30 secondes
- Reprise possible si session interrompue

---

### 5. Badge

Récompense débloquée selon des critères d'accomplissement.

```javascript
{
  "id": "string",              // Ex: "addition-master"
  "name": "string",            // "As de l'Addition"
  "description": "string",     // "Tu as réussi 50 additions !"
  "icon": "string",            // URL icône
  "criteria": {
    "type": "enum",            // "count" | "streak" | "mastery" | "special"
    "target": "number",        // Objectif à atteindre
    "domain": "string?",       // Domaine concerné (optionnel)
    "exerciseType": "string?"  // Type d'exercice (optionnel)
  },
  "reward": {
    "stars": "number",         // Étoiles bonus
    "avatarItem": "string?"    // Accessoire avatar débloqué
  }
}
```

**Types de Critères**:
| Type | Description | Exemple |
|------|-------------|---------|
| `count` | Nombre total d'exercices réussis | 50 additions |
| `streak` | Série consécutive | 10 réussites d'affilée |
| `mastery` | Niveau CPA atteint | Abstract en numération |
| `special` | Événement spécial | 1ère connexion, 7 jours consécutifs |

---

### 6. ChildBadge

Association enfant ↔ badge débloqué.

```javascript
{
  "childId": "string",
  "badgeId": "string",
  "unlockedAt": "ISO8601",
  "seen": "boolean"            // Animation de déblocage vue
}
```

---

### 7. AvatarItem

Élément de personnalisation d'avatar.

```javascript
{
  "id": "string",              // Ex: "hat-wizard"
  "category": "enum",          // "hat" | "accessory" | "background" | "pet"
  "name": "string",            // "Chapeau de Magicien"
  "image": "string",           // URL image
  "cost": "number",            // Coût en étoiles (0 si gratuit)
  "unlockCriteria": {          // Alternatif au coût
    "type": "string",          // "badge" | "level" | "free"
    "value": "string?"         // ID badge ou niveau requis
  }
}
```

---

### 8. Settings

Préférences de l'application.

```javascript
{
  "soundEnabled": "boolean",   // Sons activés
  "volume": "number",          // 0-100
  "voiceInputEnabled": "boolean", // Reconnaissance vocale
  "autoValidation": "boolean", // Validation automatique
  "sessionDuration": "number", // Durée session recommandée (minutes)
  "parentPin": "string?",      // PIN accès tableau parent (4 chiffres)
  "theme": "enum"              // "light" | "dark" | "colorful"
}
```

---

## Storage Schema (localStorage)

```javascript
{
  // Profils enfants
  "mathce1_children": [Child],
  
  // Enfant actif
  "mathce1_activeChildId": "string",
  
  // Progressions (indexées par childId)
  "mathce1_progressions": {
    "[childId]": [Progression]
  },
  
  // Sessions (les 20 dernières par enfant)
  "mathce1_sessions": {
    "[childId]": [Session]
  },
  
  // Badges débloqués
  "mathce1_badges": {
    "[childId]": [ChildBadge]
  },
  
  // Avatars possédés
  "mathce1_avatarItems": {
    "[childId]": ["itemId"]
  },
  
  // Paramètres globaux
  "mathce1_settings": Settings,
  
  // Session en cours (pour reprise)
  "mathce1_currentSession": Session?
}
```

---

## Entity Relationships

```
┌─────────┐      1:N      ┌─────────────┐
│  Child  │──────────────▶│ Progression │
└────┬────┘               └─────────────┘
     │
     │ 1:N      ┌─────────┐
     ├─────────▶│ Session │
     │          └────┬────┘
     │               │ contains
     │               ▼
     │          ┌──────────┐ refs  ┌──────────┐
     │          │ Attempt  │──────▶│ Exercise │ (static)
     │          └──────────┘       └──────────┘
     │
     │ N:M      ┌───────────┐       ┌───────┐
     ├─────────▶│ChildBadge│──────▶│ Badge │ (static)
     │          └───────────┘       └───────┘
     │
     │ N:M      ┌────────────┐
     └─────────▶│ AvatarItem │ (static catalog)
                └────────────┘
```

---

## Data Validation Rules

| Entity | Field | Rule |
|--------|-------|------|
| Child | name | 1-20 chars, letters/spaces only |
| Child | stars | ≥ 0 |
| Progression | successRate | 0-100, recalculated on each exercise |
| Progression | difficulty | 1-10 |
| Session | duration | ≤ 900 (15 min) before warning |
| Session | exercises | ≤ 20 per session |

---

## Migration Strategy

Pour les futures versions, utiliser un champ `version` dans le localStorage :

```javascript
{
  "mathce1_version": 1,  // Incrémenter à chaque changement de schéma
  // ... autres données
}

// Au chargement
function migrateData(storedVersion) {
  if (storedVersion < 2) {
    // Migration v1 → v2
  }
}
```
