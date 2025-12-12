/**
 * MathCE1 - Hint System Service
 * Progressive hints based on CPA approach
 * @module services/hint-system
 */

import { CONFIG } from '../data/config.js';

/**
 * Hint system manager
 * Provides CPA-based hints after consecutive errors
 */
export class HintSystem {
    constructor() {
        this.errorCount = 0;
        this.hintsGiven = 0;
        this.currentExercise = null;
        this.threshold = CONFIG.ERRORS_BEFORE_HINT;
    }

    /**
     * Set the current exercise
     * @param {Object} exercise - Exercise object
     */
    setExercise(exercise) {
        this.currentExercise = exercise;
        this.errorCount = 0;
        this.hintsGiven = 0;
    }

    /**
     * Record an error and check if hint should be shown
     * @returns {Object|null} Hint object if threshold reached, null otherwise
     */
    recordError() {
        this.errorCount++;

        if (this.errorCount >= this.threshold) {
            return this.generateHint();
        }

        return null;
    }

    /**
     * Record a correct answer (resets error count)
     */
    recordSuccess() {
        this.errorCount = 0;
    }

    /**
     * Generate a hint based on current CPA phase
     * @returns {Object} Hint object with type and content
     */
    generateHint() {
        this.hintsGiven++;

        if (!this.currentExercise) {
            return this.getGenericHint();
        }

        const { type, phase, a, b, answer } = this.currentExercise;

        // Progressive hints: more specific each time
        switch (this.hintsGiven) {
            case 1:
                return this.getFirstHint(type, phase, a, b);
            case 2:
                return this.getSecondHint(type, phase, a, b, answer);
            default:
                return this.getDetailedHint(type, phase, a, b, answer);
        }
    }

    /**
     * Get first level hint (conceptual)
     */
    getFirstHint(type, phase, a, b) {
        switch (type) {
            case 'addition':
                return {
                    type: 'text',
                    content: 'Essaie de compter tous les éléments ensemble !',
                    visual: 'count',
                };

            case 'subtraction':
                return {
                    type: 'text',
                    content: 'Enlève les éléments et compte ce qui reste.',
                    visual: 'remove',
                };

            case 'counting':
                return {
                    type: 'text',
                    content: 'Touche chaque élément en comptant à voix haute.',
                    visual: 'touch',
                };

            case 'comparison':
                return {
                    type: 'text',
                    content: 'Compare les deux groupes. Lequel a plus d\'éléments ?',
                    visual: 'compare',
                };

            default:
                return this.getGenericHint();
        }
    }

    /**
     * Get second level hint (strategy)
     */
    getSecondHint(type, phase, a, b, answer) {
        switch (type) {
            case 'addition':
                if (a + b > 10) {
                    // Make 10 strategy
                    const complement = 10 - Math.max(a, b);
                    const remainder = Math.min(a, b) - complement;
                    return {
                        type: 'strategy',
                        content: `Fais un paquet de 10 ! ${Math.max(a, b)} + ${complement} = 10, puis ajoute ${remainder}.`,
                        visual: 'make10',
                    };
                }
                return {
                    type: 'strategy',
                    content: `Commence par ${Math.max(a, b)} et ajoute ${Math.min(a, b)}.`,
                    visual: 'countOn',
                };

            case 'subtraction':
                return {
                    type: 'strategy',
                    content: `Commence à ${a} et compte à rebours de ${b}.`,
                    visual: 'countBack',
                };

            default:
                return {
                    type: 'text',
                    content: 'Prends ton temps et réfléchis bien.',
                    visual: null,
                };
        }
    }

    /**
     * Get detailed hint (almost giving answer)
     */
    getDetailedHint(type, phase, a, b, answer) {
        // Give a very clear hint without directly saying the answer
        const firstDigit = String(answer)[0];

        return {
            type: 'detailed',
            content: `La réponse commence par "${firstDigit}"...`,
            visual: 'partial',
            firstDigit: firstDigit,
        };
    }

    /**
     * Get generic hint
     */
    getGenericHint() {
        const hints = CONFIG.MASCOT_MESSAGES.HINT;
        return {
            type: 'text',
            content: hints[Math.floor(Math.random() * hints.length)],
            visual: null,
        };
    }

    /**
     * Check if should show hint
     * @returns {boolean}
     */
    shouldShowHint() {
        return this.errorCount >= this.threshold;
    }

    /**
     * Get current error count
     * @returns {number}
     */
    getErrorCount() {
        return this.errorCount;
    }

    /**
     * Get hints given count
     * @returns {number}
     */
    getHintsGiven() {
        return this.hintsGiven;
    }

    /**
     * Reset for new exercise
     */
    reset() {
        this.errorCount = 0;
        this.hintsGiven = 0;
        this.currentExercise = null;
    }
}

// Export singleton
let hintSystemInstance = null;

export function getHintSystem() {
    if (!hintSystemInstance) {
        hintSystemInstance = new HintSystem();
    }
    return hintSystemInstance;
}
