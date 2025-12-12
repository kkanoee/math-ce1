/**
 * MathCE1 - Numeration Module
 * Counting, comparing, and ordering exercises
 * @module modules/numeration
 */

import { CONFIG } from '../../data/config.js';

/**
 * Numeration domain module
 * Handles counting, comparison, and ordering exercises
 */
export class NumerationModule {
    constructor() {
        this.domain = CONFIG.DOMAINS.NUMERATION;
    }

    /**
     * Generate an exercise based on type and difficulty
     * @param {Object} options - Generation options
     * @returns {Object} Exercise object
     */
    generateExercise(options = {}) {
        const {
            difficulty = 1,
            type = 'counting',
            phase = 'concrete',
        } = options;

        const range = CONFIG.NUMBER_RANGES[difficulty] || CONFIG.NUMBER_RANGES[1];

        switch (type) {
            case 'counting':
                return this.generateCounting(range, difficulty, phase);
            case 'comparison':
                return this.generateComparison(range, difficulty, phase);
            case 'ordering':
                return this.generateOrdering(range, difficulty, phase);
            case 'decomposition':
                return this.generateDecomposition(range, difficulty, phase);
            default:
                return this.generateCounting(range, difficulty, phase);
        }
    }

    /**
     * Generate a counting exercise
     */
    generateCounting(range, difficulty, phase) {
        const count = this.randomInt(range.min, Math.min(range.max, 20));

        return {
            id: `count_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: 'counting',
            domain: 'numeration',
            phase,
            difficulty,
            count,
            answer: count,
            question: 'Combien y a-t-il d\'éléments ?',
            questionText: `Compte les éléments. Combien y en a-t-il ?`,
            hint: 'Touche chaque élément en comptant à voix haute.',
            icon: phase === 'concrete' ? '🔵' : '⭐',
        };
    }

    /**
     * Generate a comparison exercise
     */
    generateComparison(range, difficulty, phase) {
        const a = this.randomInt(range.min, range.max);
        let b;

        // Ensure different numbers with some distance
        do {
            b = this.randomInt(range.min, range.max);
        } while (Math.abs(a - b) < 2);

        const isGreater = Math.random() > 0.5;
        const answer = isGreater ? Math.max(a, b) : Math.min(a, b);
        const questionWord = isGreater ? 'le plus grand' : 'le plus petit';

        return {
            id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: 'comparison',
            domain: 'numeration',
            phase,
            difficulty,
            a,
            b,
            comparisonType: isGreater ? 'greater' : 'smaller',
            answer,
            question: `Quel nombre est ${questionWord} : ${a} ou ${b} ?`,
            questionText: `Quel nombre est ${questionWord} : ${a} ou ${b} ?`,
            hint: isGreater
                ? 'Le plus grand nombre a plus d\'éléments.'
                : 'Le plus petit nombre a moins d\'éléments.',
        };
    }

    /**
     * Generate an ordering exercise (what comes before/after)
     */
    generateOrdering(range, difficulty, phase) {
        const isAfter = Math.random() > 0.5;
        const n = this.randomInt(range.min + (isAfter ? 0 : 1), range.max - (isAfter ? 1 : 0));
        const answer = isAfter ? n + 1 : n - 1;
        const questionWord = isAfter ? 'après' : 'avant';

        return {
            id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: 'ordering',
            domain: 'numeration',
            phase,
            difficulty,
            n,
            orderType: isAfter ? 'after' : 'before',
            answer,
            question: `Quel nombre vient ${questionWord} ${n} ?`,
            questionText: `Quel nombre vient ${questionWord} ${n} ?`,
            hint: isAfter
                ? `Compte : ${n}, puis...`
                : `Compte à rebours : ${n}, puis...`,
        };
    }

    /**
     * Generate a decomposition exercise (tens and units)
     */
    generateDecomposition(range, difficulty, phase) {
        const n = this.randomInt(Math.max(10, range.min), Math.min(99, range.max));
        const isTens = Math.random() > 0.5;

        const tens = Math.floor(n / 10);
        const units = n % 10;
        const answer = isTens ? tens : units;
        const questionWord = isTens ? 'dizaines' : 'unités';

        return {
            id: `decomp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: 'decomposition',
            domain: 'numeration',
            phase,
            difficulty,
            n,
            decompType: isTens ? 'tens' : 'units',
            answer,
            question: `Combien de ${questionWord} dans ${n} ?`,
            questionText: `Combien de ${questionWord} y a-t-il dans ${n} ?`,
            hint: isTens
                ? `Une dizaine = 10 unités. ${n} = ${tens} dizaines et ${units} unités.`
                : `Les unités sont les chiffres à droite. ${n} = ${tens}${units}.`,
        };
    }

    /**
     * Validate an answer
     * @param {Object} exercise - Exercise object
     * @param {number} userAnswer - User's answer
     * @returns {Object} Validation result
     */
    validateAnswer(exercise, userAnswer) {
        const isCorrect = userAnswer === exercise.answer;

        return {
            isCorrect,
            expectedAnswer: exercise.answer,
            userAnswer,
            exercise,
        };
    }

    /**
     * Get exercise types for this domain
     * @returns {Object[]} Exercise types
     */
    getExerciseTypes() {
        return [
            { id: 'counting', name: 'Comptage', icon: '🔢' },
            { id: 'comparison', name: 'Comparaison', icon: '⚖️' },
            { id: 'ordering', name: 'Suite', icon: '➡️' },
            { id: 'decomposition', name: 'Dizaines/Unités', icon: '🧮' },
        ];
    }

    /**
     * Random integer helper
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Export singleton
let numerationModuleInstance = null;

export function getNumerationModule() {
    if (!numerationModuleInstance) {
        numerationModuleInstance = new NumerationModule();
    }
    return numerationModuleInstance;
}
