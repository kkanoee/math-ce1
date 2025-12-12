/**
 * MathCE1 - Calcul Module
 * Addition and subtraction exercise logic
 * @module modules/calcul
 */

import { CONFIG } from '../../data/config.js';

/**
 * Calcul domain module
 * Handles addition and subtraction exercises
 */
export class CalculModule {
    constructor() {
        this.domain = CONFIG.DOMAINS.CALCUL;
    }

    /**
     * Generate an exercise based on difficulty and type
     * @param {Object} options - Generation options
     * @returns {Object} Exercise object
     */
    generateExercise(options = {}) {
        const {
            difficulty = 1,
            type = 'addition',
            phase = 'abstract',
        } = options;

        const range = CONFIG.NUMBER_RANGES[difficulty] || CONFIG.NUMBER_RANGES[1];

        switch (type) {
            case 'addition':
                return this.generateAddition(range, difficulty, phase);
            case 'subtraction':
                return this.generateSubtraction(range, difficulty, phase);
            default:
                return this.generateAddition(range, difficulty, phase);
        }
    }

    /**
     * Generate an addition exercise
     * @param {Object} range - Number range { min, max }
     * @param {number} difficulty - Difficulty level
     * @param {string} phase - CPA phase
     * @returns {Object} Exercise
     */
    generateAddition(range, difficulty, phase) {
        let a, b, answer;

        // Generate appropriate numbers based on difficulty
        if (difficulty <= 2) {
            // Simple addition, result <= 20
            const maxResult = difficulty === 1 ? 10 : 20;
            a = this.randomInt(1, Math.min(range.max, maxResult - 1));
            b = this.randomInt(1, Math.min(maxResult - a, range.max));
        } else if (difficulty <= 4) {
            // Medium, result <= 50
            a = this.randomInt(range.min, Math.floor(range.max / 2));
            b = this.randomInt(range.min, Math.floor(range.max / 2));
        } else {
            // Hard, any result in range
            a = this.randomInt(range.min, range.max);
            b = this.randomInt(range.min, range.max - a);
        }

        answer = a + b;

        return {
            id: `add_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: 'addition',
            domain: 'calcul',
            phase,
            difficulty,
            a,
            b,
            operator: '+',
            answer,
            question: `${a} + ${b} = ?`,
            questionText: `Combien font ${a} plus ${b} ?`,
            hint: this.getAdditionHint(a, b, answer),
        };
    }

    /**
     * Generate a subtraction exercise
     * @param {Object} range - Number range
     * @param {number} difficulty - Difficulty level
     * @param {string} phase - CPA phase
     * @returns {Object} Exercise
     */
    generateSubtraction(range, difficulty, phase) {
        let a, b, answer;

        // Ensure positive result
        if (difficulty <= 2) {
            a = this.randomInt(2, Math.min(range.max, 20));
            b = this.randomInt(1, a - 1);
        } else {
            a = this.randomInt(range.min + 5, range.max);
            b = this.randomInt(range.min, a - 1);
        }

        answer = a - b;

        return {
            id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: 'subtraction',
            domain: 'calcul',
            phase,
            difficulty,
            a,
            b,
            operator: '-',
            answer,
            question: `${a} - ${b} = ?`,
            questionText: `Combien font ${a} moins ${b} ?`,
            hint: this.getSubtractionHint(a, b, answer),
        };
    }

    /**
     * Get hint for addition
     */
    getAdditionHint(a, b, answer) {
        if (a + b > 10) {
            // Make 10 strategy
            const larger = Math.max(a, b);
            const smaller = Math.min(a, b);
            const complement = 10 - larger;

            if (complement <= smaller) {
                return `Fais un 10 ! ${larger} + ${complement} = 10, puis ajoute ${smaller - complement}.`;
            }
        }

        return `Commence par ${a} et ajoute ${b}.`;
    }

    /**
     * Get hint for subtraction
     */
    getSubtractionHint(a, b, answer) {
        return `Commence à ${a} et compte à rebours de ${b}.`;
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
            { id: 'addition', name: 'Addition', icon: '➕' },
            { id: 'subtraction', name: 'Soustraction', icon: '➖' },
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
let calculModuleInstance = null;

export function getCalculModule() {
    if (!calculModuleInstance) {
        calculModuleInstance = new CalculModule();
    }
    return calculModuleInstance;
}
