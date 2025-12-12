/**
 * MathCE1 - Progression Service
 * Tracks child progress by domain and level
 * @module services/progression
 */

import { CONFIG } from '../data/config.js';
import { getStorage } from '../core/storage.js';

/**
 * Progression tracking service
 */
export class ProgressionService {
    constructor() {
        this.storage = getStorage();
    }

    /**
     * Get progression for a child
     * @param {string} childId - Child ID
     * @returns {Object} Progression data
     */
    getProgression(childId) {
        const progressions = this.storage.get('progressions') || {};
        return progressions[childId] || this.createDefaultProgression();
    }

    /**
     * Create default progression object
     * @returns {Object} Default progression
     */
    createDefaultProgression() {
        const progression = {
            domains: {},
            lastUpdated: new Date().toISOString(),
        };

        // Initialize each domain
        Object.values(CONFIG.DOMAINS).forEach(domain => {
            progression.domains[domain.id] = {
                level: 1,
                currentPhase: 'concrete',
                exercisesInLevel: 0,
                correctInLevel: 0,
                totalExercises: 0,
                totalCorrect: 0,
                streakBest: 0,
                lastPlayed: null,
            };
        });

        return progression;
    }

    /**
     * Update progression after exercise completion
     * @param {string} childId - Child ID
     * @param {string} domain - Domain ID
     * @param {boolean} isCorrect - Whether answer was correct
     * @param {string} phase - CPA phase
     * @returns {Object} Updated progression with any achievements
     */
    updateProgression(childId, domain, isCorrect, phase = 'abstract') {
        const progressions = this.storage.get('progressions') || {};

        if (!progressions[childId]) {
            progressions[childId] = this.createDefaultProgression();
        }

        const progression = progressions[childId];
        const domainProg = progression.domains[domain];

        if (!domainProg) {
            console.warn(`Unknown domain: ${domain}`);
            return { progression, levelUp: false, phaseUp: false };
        }

        // Update counts
        domainProg.totalExercises++;
        domainProg.exercisesInLevel++;
        domainProg.lastPlayed = new Date().toISOString();
        domainProg.currentPhase = phase;

        if (isCorrect) {
            domainProg.totalCorrect++;
            domainProg.correctInLevel++;
        }

        // Check for level up
        const levelUp = this.checkLevelUp(domainProg);

        // Check for phase transition
        const phaseUp = this.checkPhaseTransition(domainProg, isCorrect);

        // Save
        progression.lastUpdated = new Date().toISOString();
        progressions[childId] = progression;
        this.storage.set('progressions', progressions);

        return {
            progression: domainProg,
            levelUp,
            phaseUp,
            newLevel: domainProg.level,
            newPhase: domainProg.currentPhase,
        };
    }

    /**
     * Check if child should level up
     * @param {Object} domainProg - Domain progression
     * @returns {boolean} Whether leveled up
     */
    checkLevelUp(domainProg) {
        const { exercisesInLevel, correctInLevel, level } = domainProg;

        // Need minimum exercises and success rate
        if (exercisesInLevel >= CONFIG.EXERCISES_TO_ADVANCE) {
            const successRate = (correctInLevel / exercisesInLevel) * 100;

            if (successRate >= CONFIG.MASTERY_THRESHOLD && level < CONFIG.DIFFICULTY.MAX) {
                domainProg.level++;
                domainProg.exercisesInLevel = 0;
                domainProg.correctInLevel = 0;
                return true;
            }
        }

        return false;
    }

    /**
     * Check for CPA phase transition
     * @param {Object} domainProg - Domain progression
     * @param {boolean} isCorrect - Was this attempt correct
     * @returns {boolean} Whether phase changed
     */
    checkPhaseTransition(domainProg, isCorrect) {
        // Simple phase progression: after mastering concrete, move to pictorial, then abstract
        // This is simplified - could be more sophisticated based on performance
        return false;
    }

    /**
     * Get overall stats for a child
     * @param {string} childId - Child ID
     * @returns {Object} Overall stats
     */
    getOverallStats(childId) {
        const progression = this.getProgression(childId);

        let totalExercises = 0;
        let totalCorrect = 0;
        let domainsPlayed = 0;

        Object.values(progression.domains).forEach(domain => {
            totalExercises += domain.totalExercises;
            totalCorrect += domain.totalCorrect;
            if (domain.totalExercises > 0) {
                domainsPlayed++;
            }
        });

        return {
            totalExercises,
            totalCorrect,
            successRate: totalExercises > 0 ? Math.round((totalCorrect / totalExercises) * 100) : 0,
            domainsPlayed,
            bestStreak: Math.max(...Object.values(progression.domains).map(d => d.streakBest || 0)),
        };
    }

    /**
     * Get domain-specific stats
     * @param {string} childId - Child ID
     * @param {string} domain - Domain ID
     * @returns {Object} Domain stats
     */
    getDomainStats(childId, domain) {
        const progression = this.getProgression(childId);
        const domainProg = progression.domains[domain];

        if (!domainProg) {
            return null;
        }

        return {
            ...domainProg,
            successRate: domainProg.totalExercises > 0
                ? Math.round((domainProg.totalCorrect / domainProg.totalExercises) * 100)
                : 0,
            progressToNextLevel: Math.min(100, Math.round(
                (domainProg.exercisesInLevel / CONFIG.EXERCISES_TO_ADVANCE) * 100
            )),
        };
    }

    /**
     * Update streak
     * @param {string} childId - Child ID
     * @param {string} domain - Domain ID
     * @param {number} streak - Current streak
     */
    updateStreak(childId, domain, streak) {
        const progressions = this.storage.get('progressions') || {};

        if (!progressions[childId]?.domains?.[domain]) {
            return;
        }

        if (streak > progressions[childId].domains[domain].streakBest) {
            progressions[childId].domains[domain].streakBest = streak;
            this.storage.set('progressions', progressions);
        }
    }

    /**
     * Reset domain progression
     * @param {string} childId - Child ID
     * @param {string} domain - Domain ID
     */
    resetDomain(childId, domain) {
        const progressions = this.storage.get('progressions') || {};

        if (progressions[childId]?.domains?.[domain]) {
            progressions[childId].domains[domain] = {
                level: 1,
                currentPhase: 'concrete',
                exercisesInLevel: 0,
                correctInLevel: 0,
                totalExercises: 0,
                totalCorrect: 0,
                streakBest: 0,
                lastPlayed: null,
            };
            this.storage.set('progressions', progressions);
        }
    }
}

// Export singleton
let progressionInstance = null;

export function getProgressionService() {
    if (!progressionInstance) {
        progressionInstance = new ProgressionService();
    }
    return progressionInstance;
}
