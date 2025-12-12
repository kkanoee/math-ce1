/**
 * MathCE1 - Addition Exercise Logic
 * Specific logic for addition exercises
 * @module modules/calcul/addition
 */

import { CONFIG } from '../../data/config.js';

/**
 * Addition exercise generator and validator
 */
export class AdditionExercise {
    /**
     * Generate addition exercise
     * @param {Object} options - Generation options
     * @returns {Object} Exercise object
     */
    static generate(options = {}) {
        const {
            difficulty = 1,
            phase = 'abstract',
            minSum = 2,
            maxSum = null,
        } = options;

        const range = CONFIG.NUMBER_RANGES[difficulty] || CONFIG.NUMBER_RANGES[1];
        const maxResult = maxSum || this.getMaxSumForDifficulty(difficulty);

        let a, b, answer;

        // Generate appropriate numbers
        if (difficulty <= 2) {
            // Simple addition with result <= maxResult
            a = this.randomInt(1, Math.min(range.max, maxResult - 1));
            b = this.randomInt(1, Math.min(maxResult - a, range.max));
        } else {
            // More complex, allow larger numbers
            a = this.randomInt(range.min, Math.floor(range.max * 0.6));
            b = this.randomInt(range.min, Math.floor(range.max * 0.6));
        }

        answer = a + b;

        return {
            id: `add_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: 'addition',
            subtype: this.getSubtype(a, b, answer),
            domain: 'calcul',
            phase,
            difficulty,
            a,
            b,
            operator: '+',
            answer,
            expectedDigits: String(answer).length,
            question: `${a} + ${b} = ?`,
            questionText: `Combien font ${a} plus ${b} ?`,
            hints: this.generateHints(a, b, answer),
            strategies: this.getSuggestedStrategies(a, b),
        };
    }

    /**
     * Get max sum for difficulty level
     */
    static getMaxSumForDifficulty(difficulty) {
        const maxSums = {
            1: 10,
            2: 20,
            3: 50,
            4: 100,
            5: 100,
        };
        return maxSums[difficulty] || 20;
    }

    /**
     * Get exercise subtype for tracking
     */
    static getSubtype(a, b, answer) {
        if (answer <= 10) return 'singleDigit';
        if (answer <= 20 && (a <= 10 || b <= 10)) return 'bridgeTen';
        if (answer <= 20) return 'doubleDigitSimple';
        if (answer <= 50) return 'doubleDigit';
        return 'advanced';
    }

    /**
     * Generate progressive hints
     */
    static generateHints(a, b, answer) {
        const hints = [];

        // Level 1: General hint
        hints.push({
            level: 1,
            text: 'Compte tous les éléments ensemble.',
            type: 'conceptual',
        });

        // Level 2: Strategy hint
        if (a + b > 10) {
            const larger = Math.max(a, b);
            const smaller = Math.min(a, b);
            const complement = 10 - larger;

            if (complement <= smaller && complement > 0) {
                hints.push({
                    level: 2,
                    text: `Fais un 10 ! ${larger} + ${complement} = 10`,
                    type: 'make10',
                    visual: {
                        step1: `${larger} + ${complement} = 10`,
                        step2: `10 + ${smaller - complement} = ${answer}`,
                    },
                });
            } else {
                hints.push({
                    level: 2,
                    text: `Commence par ${larger} et ajoute ${smaller}.`,
                    type: 'countOn',
                });
            }
        } else {
            hints.push({
                level: 2,
                text: `Pose ${a} doigts, puis ajoute ${b} doigts.`,
                type: 'fingers',
            });
        }

        // Level 3: Partial answer
        const firstDigit = String(answer)[0];
        hints.push({
            level: 3,
            text: `La réponse commence par "${firstDigit}"...`,
            type: 'partial',
            firstDigit,
        });

        return hints;
    }

    /**
     * Get suggested strategies for the problem
     */
    static getSuggestedStrategies(a, b) {
        const strategies = [];

        // Count all
        if (a + b <= 10) {
            strategies.push('countAll');
        }

        // Count on from larger
        strategies.push('countOn');

        // Make 10 strategy
        const larger = Math.max(a, b);
        const smaller = Math.min(a, b);
        if (a + b > 10 && 10 - larger <= smaller) {
            strategies.push('make10');
        }

        // Doubles
        if (a === b) {
            strategies.push('doubles');
        }

        // Near doubles
        if (Math.abs(a - b) === 1) {
            strategies.push('nearDoubles');
        }

        return strategies;
    }

    /**
     * Validate answer
     */
    static validate(exercise, userAnswer) {
        const isCorrect = userAnswer === exercise.answer;

        return {
            isCorrect,
            expectedAnswer: exercise.answer,
            userAnswer,
            difference: Math.abs(exercise.answer - userAnswer),
            feedback: this.getFeedback(exercise, userAnswer, isCorrect),
        };
    }

    /**
     * Get specific feedback
     */
    static getFeedback(exercise, userAnswer, isCorrect) {
        if (isCorrect) {
            return {
                type: 'success',
                message: 'Bravo !',
            };
        }

        const diff = exercise.answer - userAnswer;

        if (Math.abs(diff) === 1) {
            return {
                type: 'close',
                message: 'Presque ! Tu es très proche.',
            };
        }

        if (userAnswer === exercise.a || userAnswer === exercise.b) {
            return {
                type: 'partial',
                message: 'Tu n\'as compté qu\'un seul groupe. Additionne les deux !',
            };
        }

        return {
            type: 'incorrect',
            message: 'Réessaie !',
        };
    }

    /**
     * Random integer helper
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

/**
 * Subtraction exercise generator
 */
export class SubtractionExercise {
    /**
     * Generate subtraction exercise
     */
    static generate(options = {}) {
        const {
            difficulty = 1,
            phase = 'abstract',
        } = options;

        const range = CONFIG.NUMBER_RANGES[difficulty] || CONFIG.NUMBER_RANGES[1];

        let a, b, answer;

        // Ensure positive result
        if (difficulty <= 2) {
            a = AdditionExercise.randomInt(3, Math.min(range.max, 20));
            b = AdditionExercise.randomInt(1, a - 1);
        } else {
            a = AdditionExercise.randomInt(range.min + 5, range.max);
            b = AdditionExercise.randomInt(range.min, Math.floor(a * 0.6));
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
            expectedDigits: String(answer).length,
            question: `${a} - ${b} = ?`,
            questionText: `Combien font ${a} moins ${b} ?`,
            hints: this.generateHints(a, b, answer),
        };
    }

    /**
     * Generate hints for subtraction
     */
    static generateHints(a, b, answer) {
        return [
            {
                level: 1,
                text: 'Enlève les éléments et compte ce qui reste.',
                type: 'conceptual',
            },
            {
                level: 2,
                text: `Commence à ${a} et compte ${b} en arrière.`,
                type: 'countBack',
            },
            {
                level: 3,
                text: `La réponse commence par "${String(answer)[0]}"...`,
                type: 'partial',
            },
        ];
    }

    /**
     * Validate answer
     */
    static validate(exercise, userAnswer) {
        return AdditionExercise.validate(exercise, userAnswer);
    }
}
