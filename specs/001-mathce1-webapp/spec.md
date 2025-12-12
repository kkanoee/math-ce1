# Feature Specification: MathCE1 - Webapp Exercices Méthode Singapour

**Feature Branch**: `001-mathce1-webapp`  
**Created**: 2025-12-07  
**Status**: Draft  
**Input**: User description: "Webapp pour travailler des exercices de CE1 à la maison en Français avec la Méthode de Singapour. Les réponses doivent pouvoir être données en vocal et acceptées dès que la valeur est détectée pour une expérience dynamique."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Répondre à un Exercice par la Voix (Priority: P1)

Un enfant de CE1 (6-7 ans) ouvre l'application et choisit un exercice de calcul. L'exercice affiche "2 + 3 = ?". L'enfant dit "cinq" à voix haute. Immédiatement, sans appuyer sur aucun bouton, l'application reconnaît la réponse et valide avec une animation joyeuse car la réponse est correcte.

**Why this priority**: L'entrée vocale dynamique est la fonctionnalité différenciante principale demandée. Elle rend l'apprentissage plus naturel et fluide pour les jeunes enfants qui ne maîtrisent pas encore bien le clavier.

**Independent Test**: Peut être testé en ouvrant un exercice simple, en activant le microphone et en disant la réponse à voix haute. La valeur ajoutée est immédiate : les mains libres, l'enfant peut manipuler des objets réels tout en répondant.

**Acceptance Scenarios**:

1. **Given** un exercice affiché avec une question numérique, **When** l'enfant prononce le nombre correct en français, **Then** la réponse est validée automatiquement avec feedback positif
2. **Given** la reconnaissance vocale active, **When** l'enfant dit un nombre (ex: "douze", "vingt-trois"), **Then** le système affiche le nombre reconnu en temps réel dans le champ de réponse
3. **Given** un bruit ambiant ou une réponse mal prononcée, **When** le système ne comprend pas, **Then** il affiche un message encourageant pour réessayer sans pénalité
4. **Given** l'enfant prononce une réponse incorrecte, **When** le système la détecte, **Then** il fournit un indice visuel (méthode CPA) plutôt qu'un simple "faux"

---

### User Story 2 - Pratiquer des Exercices Méthode Singapour (Priority: P1)

Un parent lance l'application pour son enfant. L'enfant choisit le domaine "Addition" et commence une série d'exercices. Chaque exercice suit l'approche CPA : d'abord des cubes virtuels à manipuler, puis des représentations en barres, enfin le calcul abstrait. L'enfant progresse naturellement.

**Why this priority**: C'est le cœur pédagogique de l'application, sans quoi elle n'a pas de valeur éducative différenciante.

**Independent Test**: Peut être testé en complétant une série de 5 exercices d'addition et vérifiant que chaque niveau présente une approche différente (manipulation → images → abstrait).

**Acceptance Scenarios**:

1. **Given** l'écran d'accueil, **When** l'enfant sélectionne un domaine (Numération, Calcul, Géométrie, Mesures, Problèmes), **Then** il accède à des exercices adaptés à la méthode Singapour
2. **Given** un exercice de calcul, **When** l'enfant est en phase "Concret", **Then** il voit des objets virtuels manipulables (cubes, jetons)
3. **Given** un exercice de problème, **When** l'enfant doit résoudre "Paul a 5 bonbons, il en donne 2...", **Then** le système propose un modèle en barres (bar model) pour visualiser
4. **Given** l'enfant a réussi 3 exercices au niveau "Concret", **When** il continue, **Then** le système propose le niveau "Pictural" (images/schémas)

---

### User Story 3 - Répondre au Clavier ou Tactilement (Priority: P2)

Un enfant préfère taper sa réponse ou utiliser un clavier numérique tactile plutôt que de parler. Il tape "15" avec le clavier à l'écran. Dès qu'il a tapé le bon nombre de chiffres, la réponse est validée automatiquement (validation dynamique).

**Why this priority**: Alternative indispensable à la voix pour les environnements bruyants ou si l'enfant préfère écrire. La validation dynamique maintient la fluidité.

**Independent Test**: Tester en tapant une réponse numérique et vérifier qu'elle est validée dès que complète, sans bouton "Valider".

**Acceptance Scenarios**:

1. **Given** un exercice où la réponse attendue est "25", **When** l'enfant tape "2" puis "5", **Then** la réponse est validée automatiquement après le "5"
2. **Given** un exercice avec réponse à un chiffre, **When** l'enfant tape "7", **Then** validation immédiate
3. **Given** l'enfant a commencé à taper "1", **When** il se corrige avec la touche effacer, **Then** il peut retaper sans pénalité

---

### User Story 4 - Suivre sa Progression (Priority: P2)

L'enfant termine une session d'exercices. Il voit un tableau récapitulatif avec ses étoiles gagnées, son niveau actuel par domaine, et les badges obtenus. Un parent peut également accéder à ce tableau pour suivre les progrès.

**Why this priority**: La motivation et le suivi sont essentiels pour l'engagement à long terme, mais l'application reste utile sans cette fonctionnalité.

**Independent Test**: Compléter 5 exercices et vérifier l'affichage des étoiles et du niveau.

**Acceptance Scenarios**:

1. **Given** l'enfant a complété des exercices, **When** il accède à "Mes Progrès", **Then** il voit ses étoiles, badges et niveaux par domaine
2. **Given** l'enfant progresse dans un domaine, **When** il atteint 80% de réussite sur 10 exercices, **Then** il débloque le niveau suivant
3. **Given** un parent souhaite voir les progrès, **When** il accède au tableau de bord parent, **Then** il voit les statistiques détaillées par domaine et par session

---

### User Story 5 - Personnaliser son Avatar (Priority: P3)

L'enfant gagne des étoiles et peut les utiliser pour débloquer des accessoires pour son avatar (chapeau, couleur, animal mascotte). Cela renforce sa motivation à pratiquer.

**Why this priority**: Fonctionnalité de gamification qui améliore l'engagement mais n'est pas essentielle au MVP.

**Independent Test**: Gagner des étoiles et vérifier qu'on peut les dépenser pour personnaliser l'avatar.

**Acceptance Scenarios**:

1. **Given** l'enfant a accumulé 50 étoiles, **When** il accède à la boutique d'avatars, **Then** il voit les éléments débloquables
2. **Given** l'enfant sélectionne un élément débloquable, **When** il a assez d'étoiles, **Then** l'élément s'ajoute à son avatar


### User Story 6 - Gestion des Profils & Famille (Priority: P2)

Une famille avec deux enfants (Léo en CE1, Mia en CP) utilise la même tablette. Le parent peut créer un profil pour chacun. Au démarrage, Léo choisit sa photo et retrouve sa propre progression. Le parent peut accéder à une zone protégée pour gérer les profils.

**Why this priority**: Essentiel pour l'usage familial partagé, une contrainte forte des tablettes à la maison.

**Independent Test**: Créer deux profils, faire des exercices sur le premier, changer de profil, vérifier que le second est vierge.

**Acceptance Scenarios**:
1. **Given** l'écran d'accueil, **When** on clique sur "Changer de profil", **Then** la liste des enfants enregistrés s'affiche
2. **Given** un parent dans la zone de gestion, **When** il crée un nouveau profil, **Then** il peut définir un nom et un avatar initial
3. **Given** un parent veut supprimer un profil, **When** il confirme la suppression, **Then** toutes les données associées sont effacées

---

### User Story 7 - Outils d'Aide à l'Apprentissage (Priority: P2)

Pendant un exercice difficile, l'enfant a un trou de mémoire. Il peut ouvrir un panneau latéral "Outils" pour consulter une table d'addition ou de multiplication interactive sans quitter l'exercice.

**Why this priority**: Renforce l'autonomie et l'apprentissage par l'étayage (scaffolding) plutôt que l'échec.

**Independent Test**: Ouvrir un exercice, cliquer sur le bouton "Outils", vérifier l'affichage de la table d'addition.

**Acceptance Scenarios**:
1. **Given** un exercice en cours, **When** l'enfant clique sur "Aide / Tables", **Then** un panneau latéral s'ouvre avec les tables de référence
2. **Given** le panneau d'aide ouvert, **When** l'enfant clique sur une case de la table, **Then** le résultat est mis en évidence
3. **Given** l'enfant utilise l'aide, **When** il a trouvé sa réponse, **Then** il peut refermer le panneau et reprendre l'exercice immédiatement

---


### Edge Cases

- **Reconnaissance vocale non disponible** : Si le navigateur ne supporte pas l'API vocale, un message clair propose l'alternative clavier/tactile
- **Réponse vocale ambiguë** : "Cent" vs "Sans" → le système privilégie l'interprétation numérique dans le contexte mathématique
- **Nombres complexes en français** : "Quatre-vingts", "Soixante-dix-sept" doivent être correctement interprétés
- **Coupure micro pendant la réponse** : L'enfant peut réessayer sans pénalité
- **Réponse partielle au clavier** : L'enfant tape "1" pour une réponse attendue "15" → attendre la suite (timeout de 10 secondes) puis afficher message encourageant "Tu peux continuer !" sans pénalité
- **Session interrompue** : La progression est sauvegardée automatiquement pour reprendre plus tard

## Requirements *(mandatory)*

### Functional Requirements

#### Entrée Vocale Dynamique
- **FR-001**: Le système DOIT permettre d'activer la reconnaissance vocale en un seul clic/tap sur une icône microphone
- **FR-002**: Le système DOIT reconnaître les nombres de 0 à 100 prononcés en français (incluant les formes complexes : "quatre-vingts", "soixante-dix")
- **FR-003**: Le système DOIT valider automatiquement la réponse dès que le nombre prononcé correspond à la réponse attendue
- **FR-004**: Le système DOIT afficher en temps réel le nombre reconnu pendant que l'enfant parle
- **FR-005**: Le système DOIT fournir un feedback visuel indiquant que le microphone écoute (animation)

#### Validation Dynamique (Non-vocale)
- **FR-006**: Le système DOIT valider automatiquement une réponse tapée dès que le nombre de chiffres correspond à la réponse attendue
- **FR-007**: Le système DOIT permettre la correction (touche effacer) avant validation
- **FR-008**: Le système DOIT proposer un clavier numérique tactile adapté aux enfants (gros boutons)

#### Contenu Pédagogique Méthode Singapour
- **FR-009**: Le système DOIT proposer des exercices dans 5 domaines : Numération, Calcul, Géométrie, Mesures, Résolution de Problèmes
- **FR-010**: Chaque exercice DOIT suivre l'approche CPA (Concret → Pictural → Abstrait)
- **FR-011**: Le système DOIT proposer des manipulables virtuels (cubes, jetons, réglettes) pour la phase Concrète
- **FR-012**: Le système DOIT proposer des schémas en barres (bar models) pour la résolution de problèmes
- **FR-013**: Le système DOIT adapter la difficulté selon le niveau de maîtrise de l'enfant (≥80% de réussite pour progresser)

#### Feedback et Encouragement
- **FR-014**: Le système DOIT fournir un feedback positif immédiat (animation, son optionnel) pour chaque bonne réponse
- **FR-015**: Le système DOIT fournir un indice visuel CPA après 2 erreurs consécutives, sans message d'échec
- **FR-016**: Le système NE DOIT JAMAIS afficher de message de type "Game Over" ou "Échec"

#### Progression et Gamification
- **FR-017**: Le système DOIT attribuer des étoiles pour chaque exercice réussi
- **FR-018**: Le système DOIT sauvegarder la progression localement (sans compte obligatoire)
- **FR-019**: Le système DOIT permettre l'accès à un tableau de bord de progression
- **FR-020**: Le système DOIT proposer des badges pour les accomplissements

#### Accessibilité et UX Enfant
- **FR-021**: L'interface DOIT utiliser des polices lisibles de minimum 18px
- **FR-022**: Les éléments interactifs DOIVENT avoir une taille minimale de 44x44 pixels pour le tactile
- **FR-023**: Le système DOIT fonctionner sur desktop, tablette et mobile (responsive)
- **FR-024**: Le système DOIT fonctionner hors-ligne pour les exercices de base après chargement initial

#### Administration & Outils
- **FR-025**: Le système DOIT supporter la création et la gestion de multiples profils utilisateurs sur le même appareil
- **FR-026**: Le système DOIT protéger l'accès aux paramètres et à la gestion des profils par un mécanisme simple (Calcul parental ou Code PIN)
- **FR-027**: Le système DOIT proposer des outils d'aide contextuels (Table d'addition, Table de multiplication) accessibles pendant l'exercice
- **FR-028**: L'affichage des outils d'aide NE DOIT PAS masquer la zone de travail principale de l'exercice
- **FR-029**: Le système DOIT permettre de choisir le type de voix pour la synthèse vocale (Système ou "Naturelle" via service externe si disponible)
- **FR-030**: Le système DOIT permettre de régler le volume des effets sonores et de la voix indépendamment


### Key Entities

- **Enfant** : Utilisateur principal, identifié par un pseudo local, possède un niveau par domaine, des étoiles, des badges
- **Exercice** : Question mathématique avec type (CPA), domaine, niveau de difficulté, réponse attendue
- **Session** : Série d'exercices avec date, durée, nombre d'exercices complétés, taux de réussite
- **Progression** : État de maîtrise par domaine et niveau, historique des sessions
- **Badge** : Récompense débloquée selon des critères (ex: 10 additions correctes)
- **Avatar** : Représentation visuelle de l'enfant, personnalisable avec des éléments débloqués

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% des enfants de 6-7 ans réussissent à répondre vocalement à un exercice en moins de 30 secondes lors du premier essai
- **SC-002**: La reconnaissance vocale identifie correctement les nombres français (0-100) dans 95% des cas en environnement calme
- **SC-003**: Le temps entre la prononciation correcte et le feedback de validation est inférieur à 1 seconde
- **SC-004**: 80% des enfants complètent une session de 10 exercices sans assistance parentale
- **SC-005**: Le taux de complétion des exercices augmente de 30% par rapport à une version sans entrée vocale (si mesurable)
- **SC-006**: L'application se charge et est utilisable en moins de 3 secondes sur une connexion standard
- **SC-007**: L'interface est utilisable par des enfants de 6-7 ans sans formation préalable (test utilisateur)
- **SC-008**: Les exercices couvrent au minimum 80% du programme CE1 de mathématiques français

## Assumptions

- L'appareil (tablette/PC/mobile) dispose d'un microphone fonctionnel pour la reconnaissance vocale
- Le navigateur utilisé supporte l'API Web Speech (Chrome, Edge, Safari)
- Les parents supervisent l'installation initiale et l'autorisation du microphone
- Les exercices ciblent le niveau CE1 français (6-7 ans), pas d'adaptation multi-niveaux dans le MVP
- La langue de l'interface et des exercices est le français exclusivement
- Le stockage local (localStorage) est suffisant pour la progression (pas de synchronisation cloud initiale)
