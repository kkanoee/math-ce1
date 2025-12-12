/**
 * MathCE1 - Measurements Module
 * Length, time, and money exercises
 * @module modules/mesures
 */

import { CONFIG } from '../../data/config.js';

/**
 * Measurement units
 */
const UNITS = {
    length: [
        { id: 'cm', name: 'centimètre', plural: 'centimètres', abbr: 'cm' },
        { id: 'm', name: 'mètre', plural: 'mètres', abbr: 'm' },
    ],
    time: [
        { id: 'hour', name: 'heure', plural: 'heures', abbr: 'h' },
        { id: 'minute', name: 'minute', plural: 'minutes', abbr: 'min' },
    ],
    money: [
        { id: 'euro', name: 'euro', plural: 'euros', abbr: '€' },
        { id: 'centime', name: 'centime', plural: 'centimes', abbr: 'c' },
    ],
};

/**
 * Mesures domain module
 */
export class MesuresModule {
    constructor() {
        this.domain = CONFIG.DOMAINS.MESURES;
    }

    /**
     * Generate an exercise
     */
    generateExercise(options = {}) {
        const {
            difficulty = 1,
            type = 'length',
            phase = 'pictorial',
        } = options;

        switch (type) {
            case 'length':
                return this.generateLengthExercise(difficulty, phase);
            case 'time':
                return this.generateTimeExercise(difficulty, phase);
            case 'money':
                return this.generateMoneyExercise(difficulty, phase);
            case 'comparison':
                return this.generateComparisonExercise(difficulty, phase);
            default:
                return this.generateLengthExercise(difficulty, phase);
        }
    }

    /**
     * Generate length measurement exercise
     */
    generateLengthExercise(difficulty, phase) {
        const length = this.randomInt(5, difficulty <= 2 ? 20 : 50);

        return {
            id: `mes_length_${Date.now()}`,
            type: 'length',
            domain: 'mesures',
            phase,
            difficulty,
            length,
            unit: 'cm',
            answer: length,
            expectedDigits: String(length).length,
            question: `Quelle est la longueur de cette ligne ?`,
            questionText: `Mesure cette ligne. Combien de centimètres mesure-t-elle ?`,
            visual: {
                type: 'ruler',
                length,
                showMarks: phase !== 'abstract',
            },
            hint: `Compte les graduations sur la règle.`,
        };
    }

    /**
     * Generate time reading exercise
     */
    generateTimeExercise(difficulty, phase) {
        let hours, minutes;

        if (difficulty <= 2) {
            // Hours only or half hours
            hours = this.randomInt(1, 12);
            minutes = [0, 30][Math.floor(Math.random() * 2)];
        } else {
            hours = this.randomInt(1, 12);
            minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        }

        return {
            id: `mes_time_${Date.now()}`,
            type: 'time',
            subtype: 'readClock',
            domain: 'mesures',
            phase,
            difficulty,
            hours,
            minutes,
            answer: hours, // For simple exercises, just ask for hours
            expectedDigits: String(hours).length,
            question: `Quelle heure est-il ?`,
            questionText: `Regarde l'horloge. Quelle heure est-il ?`,
            visual: {
                type: 'clock',
                hours,
                minutes,
            },
            hint: `La petite aiguille indique les heures.`,
        };
    }

    /**
     * Generate money counting exercise
     */
    generateMoneyExercise(difficulty, phase) {
        // Create a set of coins/bills to count
        const coins = [];
        let total = 0;

        const availableCoins = difficulty <= 2
            ? [1, 2, 5]
            : [1, 2, 5, 10, 20];

        const numCoins = this.randomInt(2, Math.min(5, difficulty + 2));

        for (let i = 0; i < numCoins; i++) {
            const coin = availableCoins[Math.floor(Math.random() * availableCoins.length)];
            coins.push(coin);
            total += coin;
        }

        return {
            id: `mes_money_${Date.now()}`,
            type: 'money',
            subtype: 'countCoins',
            domain: 'mesures',
            phase,
            difficulty,
            coins,
            total,
            answer: total,
            expectedDigits: String(total).length,
            question: `Combien d'euros au total ?`,
            questionText: `Compte toutes les pièces. Combien d'euros y a-t-il au total ?`,
            visual: {
                type: 'coins',
                coins,
            },
            hint: `Additionne toutes les pièces.`,
        };
    }

    /**
     * Generate comparison exercise
     */
    generateComparisonExercise(difficulty, phase) {
        const types = ['length', 'money'];
        const measureType = types[Math.floor(Math.random() * types.length)];
        const a = this.randomInt(5, 30);
        const b = this.randomInt(5, 30);
        const isMore = Math.random() > 0.5;
        const answer = isMore ? Math.max(a, b) : Math.min(a, b);

        // Use appropriate vocabulary based on measurement type
        let questionWord;
        if (measureType === 'length') {
            questionWord = isMore ? 'plus long' : 'plus court';
        } else {
            // For money, use "plus grand" / "plus petit"
            questionWord = isMore ? 'plus grand' : 'plus petit';
        }

        const unit = measureType === 'length' ? 'cm' : '€';

        return {
            id: `mes_comp_${Date.now()}`,
            type: 'comparison',
            measureType,
            domain: 'mesures',
            phase,
            difficulty,
            a,
            b,
            comparisonType: isMore ? 'more' : 'less',
            answer,
            expectedDigits: String(answer).length,
            question: `Quel est le ${questionWord} : ${a}${unit} ou ${b}${unit} ?`,
            questionText: `Quel est le ${questionWord} : ${a}${unit} ou ${b}${unit} ?`,
            hint: `Compare les deux nombres.`,
        };
    }

    /**
     * Validate answer
     */
    validateAnswer(exercise, userAnswer) {
        const isCorrect = userAnswer === exercise.answer;

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
            { id: 'length', name: 'Longueurs', icon: '📏' },
            { id: 'time', name: 'L\'heure', icon: '🕐' },
            { id: 'money', name: 'La monnaie', icon: '💰' },
            { id: 'comparison', name: 'Comparer', icon: '⚖️' },
        ];
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Export singleton
let mesuresModuleInstance = null;

export function getMesuresModule() {
    if (!mesuresModuleInstance) {
        mesuresModuleInstance = new MesuresModule();
    }
    return mesuresModuleInstance;
}
