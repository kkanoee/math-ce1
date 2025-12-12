# Quickstart: MathCE1 - Webapp Exercices Méthode Singapour

**Feature**: 001-mathce1-webapp  
**Date**: 2025-12-07

## Prérequis

- **Node.js** 18+ (pour les outils de développement et tests)
- **Navigateur moderne** : Chrome 90+, Edge 90+, Safari 15+ (pour Web Speech API)
- **Microphone** (optionnel, pour la reconnaissance vocale)

## Installation

```bash
# Cloner le repository
git clone <repository-url>
cd MathCE1

# Installer les dépendances de développement
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Structure du Projet

```
src/
├── index.html          # Point d'entrée
├── css/                # Styles
├── js/
│   ├── app.js          # Initialisation
│   ├── core/           # Modules fondamentaux (speech, storage)
│   ├── modules/        # Exercices par domaine
│   ├── components/     # Composants UI réutilisables
│   └── pages/          # Pages de l'application
└── assets/             # Images, sons
```

## Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement avec hot-reload |
| `npm run build` | Génère la version production dans `dist/` |
| `npm run test` | Lance les tests unitaires |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run serve` | Sert la version production localement |

## Tester les Fonctionnalités Clés

### 1. Reconnaissance Vocale

1. Ouvrir l'application dans Chrome ou Edge
2. Sélectionner un domaine (ex: "Calcul")
3. Démarrer un exercice
4. Cliquer sur l'icône microphone 🎤
5. Autoriser l'accès au micro si demandé
6. Dire un nombre en français (ex: "cinq", "vingt-trois")
7. La réponse apparaît en temps réel et se valide automatiquement

### 2. Clavier Numérique

1. Sur un exercice, taper directement les chiffres
2. La validation est automatique dès que le nombre de chiffres correspond

### 3. Manipulables (Phase Concret)

1. Choisir un exercice en phase "Concret"
2. Glisser-déposer les cubes/jetons
3. Compter en tapant sur chaque objet

### 4. Mode Hors-ligne

1. Charger l'application une première fois
2. Couper la connexion internet
3. L'application reste fonctionnelle (sauf reconnaissance vocale sur certains navigateurs)

## Configuration

### Paramètres par Défaut

Modifier `src/js/data/config.js` :

```javascript
export const CONFIG = {
  SESSION_DURATION_MIN: 15,      // Durée recommandée session
  MASTERY_THRESHOLD: 0.8,        // 80% pour progresser
  EXERCISES_FOR_LEVEL_UP: 10,    // Exercices avant progression
  HINT_AFTER_ERRORS: 2,          // Indice après N erreurs
  VOICE_TIMEOUT_MS: 3000,        // Délai silence vocal
};
```

### Ajouter des Exercices

1. Éditer le fichier JSON du domaine dans `src/js/data/exercises/`
2. Suivre le format défini dans `data-model.md`
3. Ajouter des images/sons dans `src/assets/` si nécessaire

## Troubleshooting

### La reconnaissance vocale ne fonctionne pas

- **Firefox** : Non supporté par défaut, utiliser Chrome/Edge/Safari
- **HTTPS requis** : En production, l'API nécessite HTTPS
- **Permissions** : Vérifier que le micro est autorisé dans les paramètres navigateur

### L'application ne charge pas offline

- Vider le cache et recharger une première fois avec connexion
- Vérifier que le Service Worker est bien installé (DevTools > Application > Service Workers)

### Les exercices ne s'affichent pas

- Vérifier la console pour erreurs de parsing JSON
- Valider le format des fichiers d'exercices avec le schéma

## Déploiement

### Build Production

```bash
npm run build
```

Le dossier `dist/` contient l'application prête à déployer.

### Options de Déploiement

| Plateforme | Commande / Process |
|------------|-------------------|
| GitHub Pages | Push `dist/` sur branche `gh-pages` |
| Netlify | Drag & drop `dist/` ou connect repo |
| Vercel | `vercel --prod` |
| Serveur web | Copier `dist/` vers document root |

### HTTPS Obligatoire

La reconnaissance vocale (Web Speech API) nécessite HTTPS en production.
Tous les hébergeurs modernes (Netlify, Vercel, GitHub Pages) fournissent HTTPS automatiquement.

## Support

- Constitution du projet : `.specify/memory/constitution.md`
- Spécification : `specs/001-mathce1-webapp/spec.md`
- Plan technique : `specs/001-mathce1-webapp/plan.md`
