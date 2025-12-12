/**
 * MathCE1 - Exercise Engine
 * Manages exercise loading, progression, and CPA phases
 * @module services/exercise-engine
 */

import { CONFIG } from '../data/config.js';
import { getCalculModule } from '../modules/calcul/index.js';
import { getNumerationModule } from '../modules/numeration/index.js';
import { getProgressionService } from './progression.js';
import { getSessionService } from './session.js';
import { getBadgeService } from './badge-service.js';
import { getHintSystem } from './hint-system.js';

/**
 * Exercise engine
 * Central controller for exercises
 */
export class ExerciseEngine {
    constructor() {
        this.modules = {
            calcul: getCalculModule(),
            numeration: getNumerationModule(),
        };

        this.progressionService = getProgressionService();
        this.sessionService = getSessionService();
        this.badgeService = getBadgeService();
        this.hintSystem = getHintSystem();

        this.currentExercise = null;
        this.currentDomain = null;
        this.currentPhase = 'abstract';
        this.exerciseCount = 0;
        this.sessionExercises = [];

        // Callbacks
        this.onExerciseLoaded = null;
        this.onCorrectAnswer = null;
        this.onIncorrectAnswer = null;
        this.onLevelUp = null;
        this.onBadgeEarned = null;
        this.onSessionComplete = null;
    }

    /**
     * Start a new exercise session
     * @param {string} childId - Child ID
     * @param {string} domain - Domain to practice
     * @param {Object} options - Session options
     */
    startSession(childId, domain, options = {}) {
        const {
            exerciseCount = 5,
            phase = 'abstract',
            difficulty = null,
        } = options;

        this.currentDomain = domain;
        this.currentPhase = phase;
        this.exerciseCount = 0;
        this.targetExerciseCount = exerciseCount;
        this.sessionExercises = [];
        this.childId = childId;

        // Get current difficulty from progression or use default
        const progression = this.progressionService.getProgression(childId);
        this.currentDifficulty = difficulty || progression.domains[domain]?.level || 1;

        // Start session tracking
        this.sessionService.startSession(childId, domain);

        // Load first exercise
        return this.loadNextExercise();
    }

    /**
     * Load the next exercise
     * @returns {Object} Exercise object
     */
    loadNextExercise() {
        if (this.exerciseCount >= this.targetExerciseCount) {
            return this.endSession();
        }

        const module = this.modules[this.currentDomain];
        if (!module) {
            console.error(`Unknown domain: ${this.currentDomain}`);
            return null;
        }

        // Determine exercise type (for variety)
        const types = module.getExerciseTypes();
        const type = types[Math.floor(Math.random() * types.length)].id;

        // Generate exercise
        this.currentExercise = module.generateExercise({
            difficulty: this.currentDifficulty,
            type,
            phase: this.currentPhase,
        });

        // Setup hint system
        this.hintSystem.setExercise(this.currentExercise);

        // Track
        this.exerciseCount++;

        // Notify
        if (this.onExerciseLoaded) {
            this.onExerciseLoaded(this.currentExercise, this.exerciseCount, this.targetExerciseCount);
        }

        return this.currentExercise;
    }

    /**
     * Submit an answer
     * @param {number} answer - User's answer
     * @returns {Object} Result object
     */
    submitAnswer(answer) {
        if (!this.currentExercise) {
            return null;
        }

        const isCorrect = answer === this.currentExercise.answer;
        const startTime = this.currentExercise.startTime || Date.now();
        const responseTime = Date.now() - startTime;

        // Record in session
        this.sessionService.recordExercise({
            exerciseId: this.currentExercise.id,
            isCorrect,
            responseTime,
            hintsUsed: this.hintSystem.getHintsGiven(),
            answer,
            expected: this.currentExercise.answer,
        });

        // Track exercise in session
        this.sessionExercises.push({
            ...this.currentExercise,
            userAnswer: answer,
            isCorrect,
            responseTime,
        });

        // Update progression
        const progressResult = this.progressionService.updateProgression(
            this.childId,
            this.currentDomain,
            isCorrect,
            this.currentPhase
        );

        // Check for badges
        const stats = this.getStats();
        const newBadges = this.badgeService.checkAndAwardBadges(this.childId, stats);

        const result = {
            isCorrect,
            correctAnswer: this.currentExercise.answer,
            userAnswer: answer,
            exercise: this.currentExercise,
            progressResult,
            newBadges,
            hint: null,
        };

        if (isCorrect) {
            this.hintSystem.recordSuccess();

            if (this.onCorrectAnswer) {
                this.onCorrectAnswer(result);
            }

            // Check for level up
            if (progressResult.levelUp) {
                this.currentDifficulty = progressResult.newLevel;

                if (this.onLevelUp) {
                    this.onLevelUp(progressResult);
                }
            }

            // Notify about badges
            if (newBadges.length > 0 && this.onBadgeEarned) {
                newBadges.forEach(badge => this.onBadgeEarned(badge));
            }
        } else {
            // Record error and potentially get hint
            const hint = this.hintSystem.recordError();
            result.hint = hint;

            if (this.onIncorrectAnswer) {
                this.onIncorrectAnswer(result);
            }
        }

        return result;
    }

    /**
     * End the current session
     * @returns {Object} Session summary
     */
    endSession() {
        const session = this.sessionService.endSession();

        const summary = {
            domain: this.currentDomain,
            totalExercises: this.sessionExercises.length,
            correctAnswers: this.sessionExercises.filter(e => e.isCorrect).length,
            incorrectAnswers: this.sessionExercises.filter(e => !e.isCorrect).length,
            exercises: this.sessionExercises,
            session,
            starsEarned: session?.starsEarned || 0,
            bestStreak: session?.bestStreak || 0,
        };

        summary.successRate = summary.totalExercises > 0
            ? Math.round((summary.correctAnswers / summary.totalExercises) * 100)
            : 0;

        if (this.onSessionComplete) {
            this.onSessionComplete(summary);
        }

        // Reset
        this.currentExercise = null;
        this.sessionExercises = [];

        return summary;
    }

    /**
     * Get current stats (for badge checking)
     */
    getStats() {
        const sessionStats = this.sessionService.getCurrentStats() || {};
        const child = window.MathCE1?.state?.get('currentChild');

        return {
            stars: child?.stars || 0,
            totalCorrect: sessionStats.correctAnswers || 0,
            bestStreak: sessionStats.bestStreak || 0,
            maxLevel: this.currentDifficulty,
            domainExercises: {
                [this.currentDomain]: sessionStats.totalExercises || 0,
            },
        };
    }

    /**
     * Get hint for current exercise
     * @returns {Object|null} Hint object
     */
    getHint() {
        return this.hintSystem.generateHint();
    }

    /**
     * Skip current exercise
     */
    skipExercise() {
        return this.loadNextExercise();
    }

    /**
     * Get current exercise
     * @returns {Object|null}
     */
    getCurrentExercise() {
        return this.currentExercise;
    }

    /**
     * Get progress (current / total)
     * @returns {Object}
     */
    getProgress() {
        return {
            current: this.exerciseCount,
            total: this.targetExerciseCount,
            percentage: Math.round((this.exerciseCount / this.targetExerciseCount) * 100),
        };
    }

    /**
     * Check if session is active
     * @returns {boolean}
     */
    isSessionActive() {
        return this.sessionService.isActive();
    }

    /**
     * Get available domains
     * @returns {Object[]}
     */
    getAvailableDomains() {
        return Object.values(CONFIG.DOMAINS);
    }

    /**
     * Get module for a domain
     * @param {string} domain - Domain ID
     * @returns {Object|null}
     */
    getModule(domain) {
        return this.modules[domain] || null;
    }
}

// Export singleton
let exerciseEngineInstance = null;

export function getExerciseEngine() {
    if (!exerciseEngineInstance) {
        exerciseEngineInstance = new ExerciseEngine();
    }
    return exerciseEngineInstance;
}
