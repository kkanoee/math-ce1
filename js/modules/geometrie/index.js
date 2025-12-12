/**
 * MathCE1 - Geometry Module
 * Shape recognition and basic geometry exercises
 * @module modules/geometrie
 */

import { CONFIG } from '../../data/config.js';

/**
 * Available shapes for exercises
 */
const SHAPES = [
    { id: 'circle', name: 'cercle', icon: '⭕', sides: 0 },
    { id: 'square', name: 'carré', icon: '🟥', sides: 4 },
    { id: 'rectangle', name: 'rectangle', icon: '🟦', sides: 4 },
    { id: 'triangle', name: 'triangle', icon: '🔺', sides: 3 },
    { id: 'pentagon', name: 'pentagone', icon: '⬠', sides: 5 },
    { id: 'hexagon', name: 'hexagone', icon: '⬡', sides: 6 },
];

/**
 * Geometry domain module
 */
export class GeometrieModule {
    constructor() {
        this.domain = CONFIG.DOMAINS.GEOMETRIE;
        this.shapes = SHAPES;
    }

    /**
     * Generate an exercise
     * @param {Object} options - Generation options
     * @returns {Object} Exercise object
     */
    generateExercise(options = {}) {
        const {
            difficulty = 1,
            type = 'recognition',
            phase = 'pictorial',
        } = options;

        switch (type) {
            case 'recognition':
                return this.generateRecognition(difficulty, phase);
            case 'countSides':
                return this.generateCountSides(difficulty, phase);
            case 'countShapes':
                return this.generateCountShapes(difficulty, phase);
            default:
                return this.generateRecognition(difficulty, phase);
        }
    }

    /**
     * Generate shape recognition exercise
     */
    generateRecognition(difficulty, phase) {
        const availableShapes = this.getShapesForDifficulty(difficulty);
        const targetShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];

        // Generate options (including correct answer)
        const options = this.generateOptions(targetShape, availableShapes, 4);

        return {
            id: `geo_recog_${Date.now()}`,
            type: 'recognition',
            domain: 'geometrie',
            phase,
            difficulty,
            targetShape,
            options,
            answer: targetShape.name,
            answerIndex: options.findIndex(o => o.id === targetShape.id),
            question: `Quel est le nom de cette forme ?`,
            questionText: `Comment s'appelle cette forme ?`,
            isMultipleChoice: true,
            hint: `Cette forme a ${targetShape.sides === 0 ? 'aucun coin' : targetShape.sides + ' côtés'}.`,
        };
    }

    /**
     * Generate count sides exercise
     */
    generateCountSides(difficulty, phase) {
        const availableShapes = this.getShapesForDifficulty(difficulty)
            .filter(s => s.sides > 0); // Exclude circle
        const shape = availableShapes[Math.floor(Math.random() * availableShapes.length)];

        return {
            id: `geo_sides_${Date.now()}`,
            type: 'countSides',
            domain: 'geometrie',
            phase,
            difficulty,
            shape,
            answer: shape.sides,
            expectedDigits: 1,
            question: `Combien de côtés a un ${shape.name} ?`,
            questionText: `Combien de côtés a un ${shape.name} ?`,
            hint: `Compte chaque côté du ${shape.name}.`,
        };
    }

    /**
     * Generate count shapes exercise
     */
    generateCountShapes(difficulty, phase) {
        const availableShapes = this.getShapesForDifficulty(difficulty);
        const targetShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
        const count = this.randomInt(2, Math.min(8, difficulty + 4));

        // Generate distractor shapes
        const distractorCount = this.randomInt(1, 4);
        const distractors = availableShapes
            .filter(s => s.id !== targetShape.id)
            .slice(0, distractorCount);

        return {
            id: `geo_count_${Date.now()}`,
            type: 'countShapes',
            domain: 'geometrie',
            phase,
            difficulty,
            targetShape,
            count,
            distractors,
            distractorCounts: distractors.map(() => this.randomInt(1, 3)),
            answer: count,
            expectedDigits: String(count).length,
            question: `Combien de ${targetShape.name}s vois-tu ?`,
            questionText: `Compte les ${targetShape.name}s. Combien y en a-t-il ?`,
            hint: `Touche chaque ${targetShape.name} en comptant.`,
        };
    }

    /**
     * Get shapes for difficulty level
     */
    getShapesForDifficulty(difficulty) {
        if (difficulty <= 2) {
            return SHAPES.slice(0, 4); // circle, square, rectangle, triangle
        }
        return SHAPES;
    }

    /**
     * Generate multiple choice options
     */
    generateOptions(correct, available, count = 4) {
        const options = [correct];
        const others = available.filter(s => s.id !== correct.id);

        while (options.length < count && others.length > 0) {
            const idx = Math.floor(Math.random() * others.length);
            options.push(others.splice(idx, 1)[0]);
        }

        // Shuffle
        return options.sort(() => Math.random() - 0.5);
    }

    /**
     * Validate answer
     */
    validateAnswer(exercise, userAnswer) {
        let isCorrect;

        if (exercise.isMultipleChoice) {
            isCorrect = userAnswer === exercise.answer || userAnswer === exercise.answerIndex;
        } else {
            isCorrect = userAnswer === exercise.answer;
        }

        return {
            isCorrect,
            expectedAnswer: exercise.answer,
            userAnswer,
        };
    }

    /**
     * Get exercise types
     */
    getExerciseTypes() {
        return [
            { id: 'recognition', name: 'Reconnaître', icon: '👁️' },
            { id: 'countSides', name: 'Compter les côtés', icon: '📐' },
            { id: 'countShapes', name: 'Compter les formes', icon: '🔢' },
        ];
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Export singleton
let geometrieModuleInstance = null;

export function getGeometrieModule() {
    if (!geometrieModuleInstance) {
        geometrieModuleInstance = new GeometrieModule();
    }
    return geometrieModuleInstance;
}
