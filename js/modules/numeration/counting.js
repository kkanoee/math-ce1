/**
 * MathCE1 - Counting Exercise Logic
 * Specific logic for counting exercises
 * @module modules/numeration/counting
 */

import { CONFIG } from '../../data/config.js';

/**
 * Counting exercise generator and validator
 */
export class CountingExercise {
    /**
     * Generate counting exercise
     * @param {Object} options - Generation options
     * @returns {Object} Exercise object
     */
    static generate(options = {}) {
        const {
            difficulty = 1,
            phase = 'concrete',
            arrangement = 'random', // random, line, groups
        } = options;

        const range = CONFIG.NUMBER_RANGES[difficulty] || CONFIG.NUMBER_RANGES[1];
        const count = this.randomInt(range.min, Math.min(range.max, 20));

        // Choose object type for visual
        const objects = this.getObjectsForDifficulty(difficulty);
        const object = objects[Math.floor(Math.random() * objects.length)];

        return {
            id: `count_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: 'counting',
            subtype: arrangement,
            domain: 'numeration',
            phase,
            difficulty,
            count,
            answer: count,
            expectedDigits: String(count).length,
            object,
            arrangement: this.getArrangement(count, arrangement),
            question: `Combien y a-t-il de ${object.plural} ?`,
            questionText: `Compte les ${object.plural}. Combien y en a-t-il ?`,
            hints: this.generateHints(count, object),
        };
    }

    /**
     * Get objects for visual representation
     */
    static getObjectsForDifficulty(difficulty) {
        const objects = [
            { icon: '🔵', name: 'jeton', plural: 'jetons' },
            { icon: '⭐', name: 'étoile', plural: 'étoiles' },
            { icon: '🍎', name: 'pomme', plural: 'pommes' },
            { icon: '🏀', name: 'ballon', plural: 'ballons' },
            { icon: '🌸', name: 'fleur', plural: 'fleurs' },
        ];

        if (difficulty >= 3) {
            objects.push(
                { icon: '🧊', name: 'cube', plural: 'cubes' },
                { icon: '📦', name: 'boîte', plural: 'boîtes' }
            );
        }

        return objects;
    }

    /**
     * Get arrangement of objects
     */
    static getArrangement(count, type) {
        if (type === 'line') {
            return {
                type: 'line',
                rows: 1,
                cols: count,
            };
        }

        if (type === 'groups') {
            // Groups of 5
            const groups = Math.ceil(count / 5);
            return {
                type: 'groups',
                groupSize: 5,
                groups,
                lastGroupSize: count % 5 || 5,
            };
        }

        // Random arrangement - grid with some variation
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);

        return {
            type: 'grid',
            rows,
            cols,
            positions: this.generateRandomPositions(count, rows, cols),
        };
    }

    /**
     * Generate random positions for objects
     */
    static generateRandomPositions(count, rows, cols) {
        const positions = [];
        let remaining = count;

        for (let row = 0; row < rows && remaining > 0; row++) {
            const rowPositions = [];
            const maxInRow = Math.min(cols, remaining);

            for (let col = 0; col < maxInRow; col++) {
                // Add small offset for visual interest
                rowPositions.push({
                    x: col + (Math.random() * 0.3 - 0.15),
                    y: row + (Math.random() * 0.3 - 0.15),
                });
                remaining--;
            }
            positions.push(rowPositions);
        }

        return positions;
    }

    /**
     * Generate hints
     */
    static generateHints(count, object) {
        const hints = [
            {
                level: 1,
                text: `Touche chaque ${object.name} en comptant à voix haute.`,
                type: 'touchCount',
            },
        ];

        if (count > 5) {
            hints.push({
                level: 2,
                text: `Groupe les ${object.plural} par 5 pour aller plus vite.`,
                type: 'groupBy5',
            });
        }

        hints.push({
            level: 3,
            text: `Il y a entre ${count - 2} et ${count + 2} ${object.plural}.`,
            type: 'range',
        });

        return hints;
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
            feedback: isCorrect
                ? { type: 'success', message: 'Bravo ! Tu as bien compté !' }
                : { type: 'incorrect', message: `Il y a ${exercise.answer} ${exercise.object?.plural || 'éléments'}.` },
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
 * Comparison exercise generator
 */
export class ComparisonExercise {
    /**
     * Generate comparison exercise
     */
    static generate(options = {}) {
        const {
            difficulty = 1,
            phase = 'abstract',
            comparisonType = null, // greater, smaller, or random
        } = options;

        const range = CONFIG.NUMBER_RANGES[difficulty] || CONFIG.NUMBER_RANGES[1];

        // Generate two different numbers
        const a = CountingExercise.randomInt(range.min, range.max);
        let b;
        do {
            b = CountingExercise.randomInt(range.min, range.max);
        } while (Math.abs(a - b) < 2);

        const type = comparisonType || (Math.random() > 0.5 ? 'greater' : 'smaller');
        const answer = type === 'greater' ? Math.max(a, b) : Math.min(a, b);
        const questionWord = type === 'greater' ? 'le plus grand' : 'le plus petit';

        return {
            id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: 'comparison',
            subtype: type,
            domain: 'numeration',
            phase,
            difficulty,
            a,
            b,
            comparisonType: type,
            answer,
            expectedDigits: String(answer).length,
            question: `Quel nombre est ${questionWord} : ${a} ou ${b} ?`,
            questionText: `Quel nombre est ${questionWord} : ${a} ou ${b} ?`,
            hints: [
                {
                    level: 1,
                    text: type === 'greater'
                        ? 'Le plus grand nombre représente plus d\'éléments.'
                        : 'Le plus petit nombre représente moins d\'éléments.',
                    type: 'conceptual',
                },
                {
                    level: 2,
                    text: `Compare : ${a} et ${b}. Lequel vient ${type === 'greater' ? 'après' : 'avant'} quand tu comptes ?`,
                    type: 'sequence',
                },
                {
                    level: 3,
                    text: `C'est ${answer}.`,
                    type: 'answer',
                },
            ],
        };
    }

    /**
     * Validate answer
     */
    static validate(exercise, userAnswer) {
        const isCorrect = userAnswer === exercise.answer;
        const other = userAnswer === exercise.a ? exercise.b : exercise.a;

        return {
            isCorrect,
            expectedAnswer: exercise.answer,
            userAnswer,
            feedback: isCorrect
                ? { type: 'success', message: 'Exact !' }
                : {
                    type: 'incorrect',
                    message: exercise.comparisonType === 'greater'
                        ? `${exercise.answer} est plus grand que ${other}.`
                        : `${exercise.answer} est plus petit que ${other}.`,
                },
        };
    }
}

/**
 * Ordering exercise (before/after)
 */
export class OrderingExercise {
    /**
     * Generate ordering exercise
     */
    static generate(options = {}) {
        const {
            difficulty = 1,
            phase = 'abstract',
        } = options;

        const range = CONFIG.NUMBER_RANGES[difficulty] || CONFIG.NUMBER_RANGES[1];
        const isAfter = Math.random() > 0.5;

        // Ensure we have room for before/after
        const n = CountingExercise.randomInt(
            range.min + (isAfter ? 0 : 1),
            range.max - (isAfter ? 1 : 0)
        );

        const answer = isAfter ? n + 1 : n - 1;
        const questionWord = isAfter ? 'après' : 'avant';

        return {
            id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: 'ordering',
            subtype: isAfter ? 'after' : 'before',
            domain: 'numeration',
            phase,
            difficulty,
            n,
            orderType: isAfter ? 'after' : 'before',
            answer,
            expectedDigits: String(answer).length,
            question: `Quel nombre vient ${questionWord} ${n} ?`,
            questionText: `Quel nombre vient ${questionWord} ${n} ?`,
            hints: [
                {
                    level: 1,
                    text: isAfter
                        ? `Compte : ${n}, puis...`
                        : `Compte à rebours : ${n}, puis...`,
                    type: 'sequence',
                },
                {
                    level: 2,
                    text: `${n - 1}, ${n}, ${n + 1}`,
                    type: 'context',
                },
                {
                    level: 3,
                    text: `C'est ${answer}.`,
                    type: 'answer',
                },
            ],
        };
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
            feedback: isCorrect
                ? { type: 'success', message: 'Parfait !' }
                : { type: 'incorrect', message: `Le nombre ${exercise.orderType === 'after' ? 'après' : 'avant'} ${exercise.n} est ${exercise.answer}.` },
        };
    }
}
