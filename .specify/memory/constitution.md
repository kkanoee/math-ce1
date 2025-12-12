<!--
Sync Impact Report
===================
Version Change: 1.0.0 → 2.0.0
Bump Type: MAJOR (Complete redesign - from casino games to educational platform)

Modified Principles:
- "Provably Fair & Verifiable" → "Pédagogie Singapour Authentique"
- "Visual Excellence & Immersion" → "Expérience Enfant-Centrée"
- "Security & Integrity" → "Progression & Maîtrise"
- "Mobile-First & Responsive" → "Accessibilité Famille"
- "Modular Game Architecture" → "Architecture Modulaire Éducative"

Added Sections:
- Nouvelle section "Méthode de Singapour" avec principes CPA
- Section "Contenu Pédagogique CE1"
- Section "Gamification Positive"
- Section "Implication Parentale"

Removed Sections:
- Toutes références aux jeux de casino
- Algorithmes "Provably Fair"
- Références aux paris et soldes

Templates Requiring Updates:
- plan-template.md: ✅ Compatible (générique)
- spec-template.md: ✅ Compatible (générique)
- tasks-template.md: ✅ Compatible (générique)

Follow-up TODOs: None
-->

# MathCE1 - Constitution du Projet

## Vision du Projet

**MathCE1** est une application web éducative conçue pour aider les enfants de CE1 (6-7 ans) à pratiquer les mathématiques à la maison en suivant la **Méthode de Singapour**. L'application offre des exercices interactifs, ludiques et progressifs qui renforcent les apprentissages scolaires.

## Principes Fondamentaux

### I. Pédagogie Singapour Authentique

Chaque exercice DOIT respecter l'approche **Concret → Pictural → Abstrait (CPA)**.

- **Concret** : Manipulations visuelles interactives (cubes, jetons, réglettes).
- **Pictural** : Représentations graphiques (barres de modèles, schémas).
- **Abstrait** : Notation mathématique formelle uniquement après maîtrise des étapes précédentes.
- L'enfant DOIT pouvoir manipuler virtuellement des objets avant de passer aux calculs abstraits.
- Les "barres de modèles" (bar models) DOIVENT être utilisées pour la résolution de problèmes.

### II. Expérience Enfant-Centrée

L'interface DOIT être conçue pour des enfants de 6-7 ans.

- Instructions vocales ou texte simple avec police lisible (minimum 18px).
- Personnages/mascottes encourageants pour guider l'apprentissage.
- Animations fluides (60 FPS) pour maintenir l'engagement.
- Couleurs vives mais non agressives (palette adaptée aux enfants).
- Feedback immédiat et positif pour chaque action.
- Aucun élément frustrant : les erreurs sont des opportunités d'apprentissage.

### III. Progression & Maîtrise

Le système DOIT adapter la difficulté selon la maîtrise de l'enfant.

- Progression spirale : révision régulière des concepts déjà appris.
- Système de niveaux clair avec objectifs atteignables.
- Pas de passage au niveau suivant sans maîtrise du niveau actuel (≥80% de réussite).
- Exercices variés pour un même concept (éviter la mémorisation mécanique).
- Temps de pratique recommandé : sessions de 10-15 minutes maximum.

### IV. Accessibilité Famille

L'application DOIT être accessible à toute la famille.

- Fonctionne sur tous les appareils (desktop, tablette, mobile).
- Interface tactile intuitive pour les tablettes (cible privilégiée).
- Mode hors-ligne pour les exercices de base.
- Aucun compte obligatoire pour commencer (friction minimale).
- Interface parent pour suivre les progrès (optionnel).

### V. Architecture Modulaire Éducative

Chaque domaine mathématique DOIT être un module indépendant.

- Modules séparés : Numération, Calcul, Géométrie, Mesures, Problèmes.
- Composants réutilisables : manipulables virtuels, système de récompenses, tableau de bord.
- Logique d'exercice séparée de l'affichage (testabilité).
- Facile d'ajouter de nouveaux types d'exercices sans refactoring.

## Contenu Pédagogique CE1

### Domaines Mathématiques Couverts

Conformes au programme français de CE1 et à la méthode de Singapour :

1. **Numération** (0-100+)
   - Compter, lire, écrire les nombres jusqu'à 100
   - Comparer, ranger, encadrer
   - Dizaines et unités (décomposition)
   - Suites numériques

2. **Calcul**
   - Addition avec/sans retenue
   - Soustraction avec/sans retenue
   - Introduction à la multiplication (tables 2, 5, 10)
   - Calcul mental

3. **Géométrie**
   - Formes géométriques (carré, rectangle, triangle, cercle)
   - Alignement, repérage spatial
   - Symétrie

4. **Mesures**
   - Longueurs (cm, m)
   - Heures et durées
   - Monnaie (euros, centimes)

5. **Résolution de Problèmes**
   - Modèles en barres (bar models)
   - Problèmes additifs et soustractifs
   - Problèmes multiplicatifs simples

## Gamification Positive

### Système de Motivation

- **Étoiles/Points** pour chaque exercice réussi (pas de punition pour les erreurs).
- **Badges** pour les accomplissements (ex: "As de l'addition", "Expert dizaines").
- **Personnalisation** : débloquer des avatars ou thèmes.
- **Séries** : récompenser la pratique régulière (pas la perfection).

### Philosophie Anti-Frustration

- Jamais de "Game Over" ou écran d'échec.
- Indices progressifs après 2-3 erreurs consécutives.
- Célébration des progrès, pas seulement des bonnes réponses.
- Option de revisiter des niveaux maîtrisés pour renforcer la confiance.

## Implication Parentale

### Tableau de Bord Parent (Optionnel)

- Vue d'ensemble des progrès par domaine.
- Identification des points forts et axes d'amélioration.
- Suggestions d'exercices ciblés.
- Historique des sessions (durée, exercices complétés).

### Communication

- Notifications optionnelles de progression.
- Résumé hebdomadaire par email (si inscrit).
- Conseils pédagogiques pour accompagner à la maison.

## Standards Techniques

### Stack Technologique

- **Frontend** : HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Rendu** : DOM pour l'UI principale, Canvas pour les manipulables interactifs.
- **Stockage local** : localStorage pour progression hors-ligne.
- **Responsive** : CSS Grid/Flexbox, breakpoints tablette et mobile.

### Qualité du Code

- Code propre et documenté.
- Typage strict pour la logique pédagogique (JSDoc).
- Constantes pour tous les paramètres d'exercice (pas de "magic numbers").
- Tests pour la logique de correction et de progression.

### Performance

- Temps de chargement initial < 3 secondes.
- Animations 60 FPS.
- Fonctionne sur tablettes d'entrée de gamme (2+ Go RAM).

## Gouvernance

### Décisions de Conception

- Cette constitution est la source de vérité pour toutes les décisions architecturales et pédagogiques.
- Tout nouveau type d'exercice DOIT suivre l'approche CPA.
- L'expérience utilisateur enfant est prioritaire sur les fonctionnalités secondaires.

### Procédure de Modification

- Modifications mineures (clarifications) : version PATCH.
- Nouvelles fonctionnalités ou domaines : version MINOR.
- Changements fondamentaux de pédagogie ou architecture : version MAJOR.

### Conformité

- Chaque exercice doit être testé avec le public cible (enfants 6-7 ans) ou simulé.
- L'accessibilité (contraste, taille des éléments tactiles) doit être validée.
- La conformité au programme CE1 doit être vérifiée par un enseignant ou parent.

**Version** : 2.0.0 | **Ratifiée** : 2025-12-07 | **Dernière modification** : 2025-12-07
