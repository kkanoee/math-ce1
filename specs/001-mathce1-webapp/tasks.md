# Tasks: MathCE1 - Webapp Exercices Méthode Singapour

**Input**: Design documents from `/specs/001-mathce1-webapp/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Stack: Vanilla JavaScript ES6+, HTML5, CSS3

---

## Phase 1: Setup (Shared Infrastructure) ✅ 100%

**Purpose**: Project initialization and basic structure

- [X] T001 Create project folder structure per plan.md in src/
- [X] T002 [P] Create src/index.html with HTML5 boilerplate and meta tags (viewport, charset, PWA)
- [X] T003 [P] Create src/manifest.json for PWA (name, icons, theme_color, display: standalone)
- [X] T004 [P] Create src/css/main.css with CSS variables (colors, fonts, spacing) and design system
- [X] T005 [P] Create src/css/components.css with base component styles (buttons, cards, inputs)
- [X] T006 [P] Create src/css/animations.css with keyframes (fadeIn, slideUp, bounce, pulse)
- [X] T007 Create package.json with dev dependencies (jest, eslint, live-server)
- [X] T008 [P] Create .eslintrc.json with JavaScript ES6+ rules
- [X] T009 Create src/service-worker.js with cache-first strategy for offline support

**Checkpoint**: ✅ Project structure ready, dev server can start

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ 100%

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T010 Create src/js/app.js with application initialization and DOM ready handler
- [X] T011 Create src/js/router.js with simple hash-based SPA routing
- [X] T012 Create src/js/core/storage.js with localStorage abstraction (get, set, remove, prefix)
- [X] T013 Create src/js/core/state.js with reactive state management (subscribe, update, getState)
- [X] T014 [P] Create src/js/data/french-numbers.js with French number mapping (0-100, all forms)
- [X] T015 [P] Create src/js/data/config.js with app constants (MASTERY_THRESHOLD, SESSION_DURATION, etc.)
- [X] T016 Create src/js/core/audio.js with sound loading and playback (success, encouragement, click)
- [X] T017 [P] Create src/assets/sounds/ directory with placeholder audio files
- [X] T018 Create src/js/pages/home.js with home page component (welcome, child selection, start)
- [X] T019 Register service worker in src/js/app.js for offline capability
- [X] T020 Create src/js/components/feedback.js with success/encouragement animation components

**Checkpoint**: ✅ Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Répondre par la Voix (Priority: P1) 🎯 MVP ✅ 100%

**Goal**: L'enfant peut répondre à un exercice par la voix et la réponse est validée automatiquement.

- [X] T021 [P] [US1] Create src/js/core/speech.js with Web Speech API wrapper
- [X] T022 [P] [US1] Create src/js/components/mic-button.js with microphone button component
- [X] T023 [P] [US1] Create src/js/components/answer-display.js with real-time answer display
- [X] T024 [US1] Implement frenchToNumber() function in french-numbers.js
- [X] T025 [US1] Create src/js/services/voice-input.js combining speech with French parsing
- [X] T026 [US1] Create src/js/services/answer-validator.js with validation logic
- [X] T027 [US1] Create src/js/pages/exercise.js with exercise page layout
- [X] T028 [US1] Integrate voice input into exercise.js with auto-validation
- [X] T029 [US1] Add interim results display in answer-display.js
- [X] T030 [US1] Add error handling for unsupported browsers
- [X] T031 [US1] Add listening animation to mic-button.js
- [X] T032 [US1] Integrate feedback.js success animation

**Checkpoint**: ✅ Voice input fully functional

---

## Phase 4: User Story 2 - Exercices Méthode Singapour (Priority: P1) 🎯 MVP ✅ 100%

**Goal**: L'enfant pratique des exercices CPA (Concret → Pictural → Abstrait).

- [X] T033 [P] [US2] Create src/js/data/exercises/calcul.json
- [X] T034 [P] [US2] Create src/js/data/exercises/numeration.json
- [X] T035 [P] [US2] Create src/js/components/manipulables/cube.js
- [X] T036 [P] [US2] Create src/js/components/manipulables/token.js
- [X] T037 [US2] Create src/js/components/manipulables/index.js
- [X] T038 [US2] Create src/css/exercises.css with CPA-specific styles
- [X] T039 [US2] Create src/js/modules/calcul/index.js
- [X] T040 [US2] Create src/js/modules/calcul/addition.js
- [X] T041 [P] [US2] Create src/js/modules/numeration/index.js
- [X] T042 [P] [US2] Create src/js/modules/numeration/counting.js
- [X] T043 [US2] Create src/js/services/exercise-engine.js
- [X] T044 [US2] Create src/js/pages/domain-select.js
- [X] T045 [US2] Update exercise.js for CPA phases
- [X] T046 [US2] Implement concrete phase rendering
- [X] T047 [US2] Implement pictorial phase rendering
- [X] T048 [US2] Implement abstract phase rendering
- [X] T049 [US2] Create src/js/components/bar-model.js
- [X] T050 [US2] Create src/js/services/hint-system.js
- [X] T051 [US2] Integrate hint system into exercise.js
- [X] T052 [US2] Create src/js/components/mascot.js
- [X] T053 [US2] Integrate mascot into exercise.js
- [X] T054 [US2] Add audio instructions service
- [X] T055 [US2] Add "Lire la question" button

**Checkpoint**: ✅ Core CPA exercises functional

---

## Phase 5: User Story 3 - Répondre au Clavier (Priority: P2) ✅ 100%

**Goal**: L'enfant peut répondre avec un clavier numérique tactile.

- [X] T056 [P] [US3] Create src/js/components/keyboard.js
- [X] T057 [US3] Add keyboard input handling to answer-validator.js
- [X] T058 [US3] Integrate keyboard.js into exercise.js
- [X] T059 [US3] Add input mode toggle in exercise.js
- [X] T060 [US3] Style keyboard buttons (44x44px minimum)
- [X] T061 [US3] Add backspace functionality
- [X] T062 [US3] Add visual feedback for typed digits

**Checkpoint**: ✅ Keyboard input fully functional

---

## Phase 6: User Story 4 - Suivre sa Progression (Priority: P2) ✅ 100%

**Goal**: L'enfant et les parents peuvent voir les progrès.

- [X] T063 [P] [US4] Create src/js/data/badges.json (20 badges)
- [X] T064 [P] [US4] Create src/js/components/star-counter.js
- [X] T065 [P] [US4] Create src/js/components/progress-bar.js
- [X] T066 [US4] Create src/js/services/progression.js
- [X] T067 [US4] Create src/js/services/badge-system.js
- [X] T068 [US4] Create src/js/services/session-tracker.js
- [X] T069 [US4] Create src/js/pages/progress.js
- [X] T070 [US4] Create src/js/pages/parent-dashboard.js
- [X] T071 [US4] Add session summary display in exercise.js
- [X] T072 [US4] Integrate star earning into exercise flow
- [X] T073 [US4] Add badge unlock animation in feedback.js
- [X] T074 [US4] Add progression auto-save

**Checkpoint**: ✅ Progression tracking fully functional

---

## Phase 7: User Story 5 - Personnaliser son Avatar (Priority: P3) ✅ 100%

**Goal**: L'enfant peut personnaliser son avatar avec des accessoires.

- [X] T075 [P] [US5] Create src/js/data/avatar-items.json (20+ items)
- [X] T076 [P] [US5] Create src/assets/images/avatars/ with base avatars
- [X] T077 [US5] Create src/js/components/avatar.js
- [X] T078 [US5] Create src/js/services/avatar-manager.js
- [X] T079 [US5] Create src/js/pages/avatar-shop.js
- [X] T080 [US5] Integrate avatar display into home.js and progress.js
- [X] T081 [US5] Add star deduction on purchase

**Checkpoint**: ✅ Avatar customization fully functional

---

## Phase 8: Additional Domains & Content ✅ 100%

**Goal**: Full curriculum coverage with 5 math domains.

- [X] T083 [P] Create src/js/data/exercises/geometrie.json
- [X] T084 [P] Create src/js/modules/geometrie/index.js
- [X] T085 [P] Create src/js/data/exercises/mesures.json
- [X] T086 [P] Create src/js/modules/mesures/index.js
- [X] T088 [P] Create src/js/data/exercises/problemes.json
- [X] T091 [P] Create src/js/modules/problemes/index.js
- [X] T087 Create src/js/components/shape.js (SVG shapes)
- [X] T089 Create src/js/components/cuisenaire-rod.js
- [X] T090 Create src/js/components/clock.js (interactive clock)
- [X] T092 Create src/js/components/measurement-visuals.js
- [X] T093 Create visual components for all 5 domains
- [X] T094 Update config.js with French domain IDs

**Checkpoint**: ✅ All 5 domains implemented and functional

---

## Phase 9: Polish & Quality Assurance ✅ 100%

**Goal**: Application polished and ready for deployment.

- [X] T095 [P] Create src/assets/images/mascot/ with mascot images
- [X] T096 [P] Create src/assets/images/badges/ with badge icons
- [X] T097 Add responsive breakpoints in main.css
- [X] T098 Add touch gesture support for manipulables
- [X] T099 Optimize Canvas rendering
- [X] T100 Add session auto-save
- [X] T101 Add session resume functionality
- [X] T102 Add localStorage migration utility
- [X] T103 Create src/js/services/settings.js
- [X] T104 Add settings page with toggles and parent PIN
- [X] T105 [P] Add JSDoc comments to core modules
- [X] T106 Run ESLint and fix warnings
- [X] T107 Test offline functionality
- [X] T108 Verify touch targets (≥44x44px)
- [X] T109 Verify font sizes (≥18px)
- [X] T110 Create audio file placeholders
- [X] T111 Final integration test completed

**Checkpoint**: ✅ Application polished and ready for deployment

---

## Summary: All Tasks Completed ✅

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Setup | ✅ 100% |
| Phase 2 | Foundational | ✅ 100% |
| Phase 3 | US1 - Voice Input | ✅ 100% |
| Phase 4 | US2 - CPA Exercises | ✅ 100% |
| Phase 5 | US3 - Keyboard | ✅ 100% |
| Phase 6 | US4 - Progression | ✅ 100% |
| Phase 7 | US5 - Avatar | ✅ 100% |
| Phase 8 | Additional Domains | ✅ 100% |
| Phase 9 | Polish | ✅ 100% |
| **TOTAL** | **111/111 tasks** | **✅ 100%** |

---

## Phase 10: Family & Helper Features (New)
**Goal**: Gestion multi-profils, outils d'aide (tables) et réglages audio avancés.

- [X] T112 [P] [US6] Create src/js/services/profile-manager.js (CRUD profiles)
- [X] T113 [US6] Create src/js/pages/profile-select.js (Visual profile switcher)
- [X] T114 [US6] Update src/js/pages/settings.js with Parental Gate (Simple math challenge)
- [X] T115 [P] [US7] Create src/js/components/tools/addition-table.js
- [X] T116 [P] [US7] Create src/js/components/tools/multiplication-table.js
- [X] T117 [US7] Create src/js/components/tools-panel.js (Slide-out container)
- [X] T118 [US7] Integrate Tools Panel into exercise.js layout
- [X] T119 [US_Audio] Update src/js/core/audio.js to support independent volume channels
- [X] T120 [US_Audio] Update src/js/core/speech.js to allow voice selection (Natural/System)
- [X] T121 [US_Audio] Add Audio settings (Volume sliders, Voice select) to settings.js

**Checkpoint**: ✅ New features integrated (Profiles, Tables, Audio)

---

## 🎉 PROJECT COMPLETE

MathCE1 is now a fully functional Singapore Math webapp for CE1 children with:
- ✅ Voice recognition for French numbers (0-100)
- ✅ Numeric keyboard alternative
- ✅ CPA approach (Concrete → Pictorial → Abstract)
- ✅ 5 math domains (Numération, Calcul, Géométrie, Mesures, Problèmes)
- ✅ Progress tracking with stars and badges
- ✅ Avatar customization shop
- ✅ Parent dashboard
- ✅ Settings page with parental controls
- ✅ PWA with offline support
- ✅ Responsive design for tablets

To run the application:
```bash
cd MathCE1
npm start   
# Open http://127.0.0.1:3000
```
