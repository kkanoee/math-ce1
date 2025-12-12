/**
 * MathCE1 - App Configuration
 * Constants and configuration values
 * @module data/config
 */

/**
 * Application configuration
 */
export const CONFIG = {
    // App info
    APP_NAME: 'MathCE1',
    APP_VERSION: '1.0.0',

    // Progression thresholds (per constitution)
    MASTERY_THRESHOLD: 80,          // % required to advance level
    EXERCISES_TO_ADVANCE: 10,       // Exercises needed at 80% to advance
    EXERCISES_FOR_DIFFICULTY: 5,    // Exercises at abstract to increase difficulty

    // Session limits (per constitution - 10-15 minutes)
    SESSION_DURATION_MIN: 10,       // Minutes
    SESSION_DURATION_MAX: 15,       // Minutes
    SESSION_DURATION_DEFAULT: 15,   // Minutes
    SESSION_AUTO_SAVE_INTERVAL: 30, // Seconds

    // Hint system
    ERRORS_BEFORE_HINT: 2,          // Consecutive errors before showing hint

    // Voice recognition
    VOICE_RECOGNITION_TIMEOUT: 10000, // ms before timeout
    VOICE_INTERIM_RESULTS: true,
    VOICE_LANGUAGE: 'fr-FR',

    // Keyboard input
    KEYBOARD_TIMEOUT: 10000,        // ms before encouraging message on partial input

    // Stars and rewards
    STARS_PER_EXERCISE: 1,          // Stars earned per correct answer
    STARS_STREAK_BONUS: 3,          // Bonus stars for streak of 5
    STREAK_LENGTH_FOR_BONUS: 5,

    // CPA Levels
    CPA_LEVELS: {
        CONCRETE: 'concrete',
        PICTORIAL: 'pictorial',
        ABSTRACT: 'abstract',
    },

    // Math domains (5 per constitution) - IDs match module folder names
    DOMAINS: {
        NUMERATION: {
            id: 'numeration',
            name: 'Numération',
            icon: '🔢',
            color: '#9B59B6',
            description: 'Compter, comparer, ranger les nombres',
        },
        CALCUL: {
            id: 'calcul',
            name: 'Calcul',
            icon: '➕',
            color: '#3498DB',
            description: 'Addition, soustraction, multiplication',
        },
        GEOMETRIE: {
            id: 'geometrie',
            name: 'Géométrie',
            icon: '🔷',
            color: '#E74C3C',
            description: 'Formes, symétrie, repérage',
        },
        MESURES: {
            id: 'mesures',
            name: 'Mesures',
            icon: '📏',
            color: '#27AE60',
            description: 'Longueurs, temps, monnaie',
        },
        PROBLEMES: {
            id: 'problemes',
            name: 'Problèmes',
            icon: '💡',
            color: '#F39C12',
            description: 'Résolution avec modèles en barres',
        },
    },

    // Difficulty levels (1-10)
    DIFFICULTY: {
        MIN: 1,
        MAX: 10,
        DEFAULT: 1,
    },

    // Number range per difficulty
    NUMBER_RANGES: {
        1: { min: 1, max: 10 },
        2: { min: 1, max: 20 },
        3: { min: 1, max: 30 },
        4: { min: 1, max: 50 },
        5: { min: 1, max: 100 },
        6: { min: 10, max: 100 },
        7: { min: 20, max: 100 },
        8: { min: 1, max: 100 },   // With carrying
        9: { min: 1, max: 100 },   // Mixed operations
        10: { min: 1, max: 100 },  // Complex problems
    },

    // Animation durations
    ANIMATION: {
        FEEDBACK_DISPLAY_MS: 2000,
        SUCCESS_ANIMATION_MS: 1500,
        HINT_DELAY_MS: 1000,
        PAGE_TRANSITION_MS: 300,
    },

    // Touch targets (per constitution - 44px minimum)
    TOUCH: {
        MIN_TARGET_SIZE: 44,
        COMFORTABLE_SIZE: 56,
        LARGE_SIZE: 72,
    },

    // Typography (per constitution - 18px minimum)
    TYPOGRAPHY: {
        MIN_FONT_SIZE: 18,
        BASE_FONT_SIZE: 18,
        LARGE_FONT_SIZE: 22,
        HEADING_FONT_SIZE: 28,
    },

    // Storage keys
    STORAGE_KEYS: {
        CHILDREN: 'children',
        ACTIVE_CHILD: 'activeChildId',
        PROGRESSIONS: 'progressions',
        SESSIONS: 'sessions',
        BADGES: 'badges',
        AVATAR_ITEMS: 'avatarItems',
        SETTINGS: 'settings',
        CURRENT_SESSION: 'currentSession',
        VERSION: 'version',
    },

    // Maximum limits
    LIMITS: {
        MAX_CHILDREN: 5,
        MAX_SESSIONS_STORED: 20,
        MAX_NAME_LENGTH: 20,
    },

    // Mascot messages
    MASCOT_MESSAGES: {
        WELCOME: [
            'Bonjour ! Prêt à apprendre ?',
            'Salut champion ! On commence ?',
            'Hello ! Quelle aventure aujourd\'hui ?',
        ],
        SUCCESS: [
            'Bravo ! 🎉',
            'Super ! Tu gères !',
            'Excellent ! Continue !',
            'Parfait ! 👏',
            'Génial ! Tu es le meilleur !',
        ],
        ENCOURAGEMENT: [
            'Tu peux le faire !',
            'Essaie encore, je crois en toi !',
            'Presque ! Réfléchis bien...',
            'Pas de souci, on réessaie !',
            'C\'est en s\'entraînant qu\'on devient fort !',
        ],
        HINT: [
            'Regarde bien les cubes...',
            'Compte doucement...',
            'Utilise tes doigts si tu veux !',
        ],
        STREAK: [
            'Woah ! Tu es en feu ! 🔥',
            'Incroyable série !',
            'Tu es inarrêtable !',
        ],
        LEVEL_UP: [
            'Niveau suivant débloqué ! 🌟',
            'Tu progresses super bien !',
            'Bravo, tu montes de niveau !',
        ],
    },
};

// Make config immutable
Object.freeze(CONFIG);
Object.freeze(CONFIG.CPA_LEVELS);
Object.freeze(CONFIG.DOMAINS);
Object.keys(CONFIG.DOMAINS).forEach(key => Object.freeze(CONFIG.DOMAINS[key]));
Object.freeze(CONFIG.DIFFICULTY);
Object.freeze(CONFIG.NUMBER_RANGES);
Object.freeze(CONFIG.ANIMATION);
Object.freeze(CONFIG.TOUCH);
Object.freeze(CONFIG.TYPOGRAPHY);
Object.freeze(CONFIG.STORAGE_KEYS);
Object.freeze(CONFIG.LIMITS);
Object.freeze(CONFIG.MASCOT_MESSAGES);

export default CONFIG;
