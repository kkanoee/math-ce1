/**
 * MathCE1 - Problem Solving Module
 * Word problems for CE1
 * @module modules/problemes
 */

import { CONFIG } from '../../data/config.js';

/**
 * Problem templates for generating word problems
 */
const PROBLEM_TEMPLATES = {
    addition: [
        {
            id: 'add_fruits',
            template: '{name} a {a} {object.plural}. {nom2} lui donne {b} {object.plural}. Combien a-t-il de {object.plural} maintenant ?',
            objects: [
                { singular: 'pomme', plural: 'pommes' },
                { singular: 'orange', plural: 'oranges' },
                { singular: 'banane', plural: 'bananes' },
            ],
        },
        {
            id: 'add_toys',
            template: 'Il y a {a} {object.plural} sur la table. Maman en pose {b} de plus. Combien y a-t-il de {object.plural} sur la table ?',
            objects: [
                { singular: 'jouet', plural: 'jouets' },
                { singular: 'crayon', plural: 'crayons' },
                { singular: 'bille', plural: 'billes' },
            ],
        },
        {
            id: 'add_animals',
            template: 'Au parc, {name} voit {a} {object.plural}. Puis {b} autres {object.plural} arrivent. Combien de {object.plural} voit-il ?',
            objects: [
                { singular: 'oiseau', plural: 'oiseaux' },
                { singular: 'écureuil', plural: 'écureuils' },
                { singular: 'canard', plural: 'canards' },
            ],
        },
    ],
    subtraction: [
        {
            id: 'sub_candies',
            template: '{name} a {a} {object.plural}. Il en mange {b}. Combien lui reste-t-il de {object.plural} ?',
            objects: [
                { singular: 'bonbon', plural: 'bonbons' },
                { singular: 'gâteau', plural: 'gâteaux' },
                { singular: 'biscuit', plural: 'biscuits' },
            ],
        },
        {
            id: 'sub_leave',
            template: 'Il y a {a} enfants dans la cour. {b} enfants rentrent en classe. Combien d\'enfants reste-t-il dans la cour ?',
            objects: [{ singular: 'enfant', plural: 'enfants' }],
        },
        {
            id: 'sub_balloons',
            template: '{name} a {a} {object.plural}. {b} s\'envolent. Combien lui reste-t-il de {object.plural} ?',
            objects: [
                { singular: 'ballon', plural: 'ballons' },
                { singular: 'cerf-volant', plural: 'cerfs-volants' },
            ],
        },
    ],
};

const NAMES = ['Lucas', 'Emma', 'Léo', 'Chloé', 'Hugo', 'Jade', 'Arthur', 'Louise'];
const NAMES_2 = ['son ami', 'sa sœur', 'son frère', 'sa maman'];

/**
 * Problemes domain module
 */
export class ProblemesModule {
    constructor() {
        this.domain = CONFIG.DOMAINS.PROBLEMES;
    }

    /**
     * Generate an exercise
     */
    generateExercise(options = {}) {
        const {
            difficulty = 1,
            type = null,
            phase = 'pictorial',
        } = options;

        // Choose type randomly if not specified
        const problemType = type || (Math.random() > 0.5 ? 'addition' : 'subtraction');

        switch (problemType) {
            case 'addition':
                return this.generateAdditionProblem(difficulty, phase);
            case 'subtraction':
                return this.generateSubtractionProblem(difficulty, phase);
            default:
                return this.generateAdditionProblem(difficulty, phase);
        }
    }

    /**
     * Generate addition word problem
     */
    generateAdditionProblem(difficulty, phase) {
        const range = CONFIG.NUMBER_RANGES[difficulty] || CONFIG.NUMBER_RANGES[1];
        const maxSum = difficulty <= 2 ? 20 : 50;

        const a = this.randomInt(1, Math.floor(maxSum / 2));
        const b = this.randomInt(1, maxSum - a);
        const answer = a + b;

        const templates = PROBLEM_TEMPLATES.addition;
        const template = templates[Math.floor(Math.random() * templates.length)];
        const object = template.objects[Math.floor(Math.random() * template.objects.length)];
        const name = NAMES[Math.floor(Math.random() * NAMES.length)];
        const nom2 = NAMES_2[Math.floor(Math.random() * NAMES_2.length)];

        const problemText = this.fillTemplate(template.template, {
            a, b, name, nom2,
            'object.singular': object.singular,
            'object.plural': object.plural,
        });

        return {
            id: `prob_add_${Date.now()}`,
            type: 'addition',
            subtype: 'wordProblem',
            domain: 'problemes',
            phase,
            difficulty,
            a,
            b,
            answer,
            expectedDigits: String(answer).length,
            question: problemText,
            questionText: problemText,
            operator: '+',
            equation: `${a} + ${b} = ?`,
            object,
            hint: `${a} + ${b} = ?`,
            strategy: 'Trouve les deux nombres dans le texte et additionne-les.',
        };
    }

    /**
     * Generate subtraction word problem
     */
    generateSubtractionProblem(difficulty, phase) {
        const range = CONFIG.NUMBER_RANGES[difficulty] || CONFIG.NUMBER_RANGES[1];
        const maxNum = difficulty <= 2 ? 20 : 50;

        const a = this.randomInt(5, maxNum);
        const b = this.randomInt(1, a - 1);
        const answer = a - b;

        const templates = PROBLEM_TEMPLATES.subtraction;
        const template = templates[Math.floor(Math.random() * templates.length)];
        const object = template.objects[Math.floor(Math.random() * template.objects.length)];
        const name = NAMES[Math.floor(Math.random() * NAMES.length)];

        const problemText = this.fillTemplate(template.template, {
            a, b, name,
            'object.singular': object.singular,
            'object.plural': object.plural,
        });

        return {
            id: `prob_sub_${Date.now()}`,
            type: 'subtraction',
            subtype: 'wordProblem',
            domain: 'problemes',
            phase,
            difficulty,
            a,
            b,
            answer,
            expectedDigits: String(answer).length,
            question: problemText,
            questionText: problemText,
            operator: '-',
            equation: `${a} - ${b} = ?`,
            object,
            hint: `${a} - ${b} = ?`,
            strategy: 'Trouve les deux nombres dans le texte et fais une soustraction.',
        };
    }

    /**
     * Fill template with values
     */
    fillTemplate(template, values) {
        let result = template;
        for (const [key, value] of Object.entries(values)) {
            result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
        }
        return result;
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
            feedback: isCorrect
                ? { type: 'success', message: 'Bravo !' }
                : { type: 'incorrect', message: `La réponse était : ${exercise.equation.replace('?', exercise.answer)}` },
        };
    }

    /**
     * Get exercise types
     */
    getExerciseTypes() {
        return [
            { id: 'addition', name: 'Addition', icon: '➕' },
            { id: 'subtraction', name: 'Soustraction', icon: '➖' },
        ];
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Export singleton
let problemesModuleInstance = null;

export function getProblemesModule() {
    if (!problemesModuleInstance) {
        problemesModuleInstance = new ProblemesModule();
    }
    return problemesModuleInstance;
}
