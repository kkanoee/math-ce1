/**
 * MathCE1 - Badge Service
 * Manages badge achievements
 * @module services/badge-service
 */

import { getStorage } from '../core/storage.js';

/**
 * Badge definitions
 */
const BADGE_DEFINITIONS = {
    // Progress badges
    first_exercise: {
        id: 'first_exercise',
        name: 'Premier Pas',
        description: 'Réussir ton premier exercice',
        icon: '🎯',
        check: (stats) => stats.totalCorrect >= 1,
    },
    star_10: {
        id: 'star_10',
        name: 'Collectionneur',
        description: 'Gagner 10 étoiles',
        icon: '⭐',
        check: (stats) => stats.stars >= 10,
    },
    star_50: {
        id: 'star_50',
        name: 'Super Star',
        description: 'Gagner 50 étoiles',
        icon: '🌟',
        check: (stats) => stats.stars >= 50,
    },
    star_100: {
        id: 'star_100',
        name: 'Légende',
        description: 'Gagner 100 étoiles',
        icon: '✨',
        check: (stats) => stats.stars >= 100,
    },

    // Streak badges
    streak_5: {
        id: 'streak_5',
        name: 'En feu !',
        description: 'Faire une série de 5 bonnes réponses',
        icon: '🔥',
        check: (stats) => stats.bestStreak >= 5,
    },
    streak_10: {
        id: 'streak_10',
        name: 'Inarrêtable',
        description: 'Faire une série de 10 bonnes réponses',
        icon: '💫',
        check: (stats) => stats.bestStreak >= 10,
    },
    streak_20: {
        id: 'streak_20',
        name: 'Champion',
        description: 'Faire une série de 20 bonnes réponses',
        icon: '🏆',
        check: (stats) => stats.bestStreak >= 20,
    },

    // Level badges
    level_up: {
        id: 'level_up',
        name: 'Progression',
        description: 'Monter d\'un niveau',
        icon: '📈',
        check: (stats) => stats.maxLevel >= 2,
    },
    level_5: {
        id: 'level_5',
        name: 'Expert',
        description: 'Atteindre le niveau 5',
        icon: '🧠',
        check: (stats) => stats.maxLevel >= 5,
    },

    // Domain mastery badges
    calcul_master: {
        id: 'calcul_master',
        name: 'As du Calcul',
        description: 'Réussir 50 exercices de calcul',
        icon: '➕',
        check: (stats) => (stats.domainExercises?.calcul || 0) >= 50,
    },
    numeration_master: {
        id: 'numeration_master',
        name: 'Expert Nombres',
        description: 'Réussir 50 exercices de numération',
        icon: '🔢',
        check: (stats) => (stats.domainExercises?.numeration || 0) >= 50,
    },

    // Activity badges
    daily_player: {
        id: 'daily_player',
        name: 'Assidu',
        description: 'Jouer 3 jours consécutifs',
        icon: '📅',
        check: (stats) => stats.consecutiveDays >= 3,
    },
    morning_star: {
        id: 'morning_star',
        name: 'Lève-tôt',
        description: 'Jouer avant 9h',
        icon: '🌅',
        check: (stats) => stats.morningPlay === true,
    },
};

/**
 * Badge service
 */
export class BadgeService {
    constructor() {
        this.storage = getStorage();
        this.definitions = BADGE_DEFINITIONS;
    }

    /**
     * Get all badges for a child
     * @param {string} childId - Child ID
     * @returns {Object[]} Array of badge objects with earned status
     */
    getAllBadges(childId) {
        const earnedBadges = this.getEarnedBadges(childId);

        return Object.values(this.definitions).map(badge => ({
            ...badge,
            earned: earnedBadges.includes(badge.id),
        }));
    }

    /**
     * Get earned badge IDs for a child
     * @param {string} childId - Child ID
     * @returns {string[]} Array of badge IDs
     */
    getEarnedBadges(childId) {
        const badges = this.storage.get('badges') || {};
        return badges[childId] || [];
    }

    /**
     * Check and award new badges
     * @param {string} childId - Child ID
     * @param {Object} stats - Current stats
     * @returns {Object[]} Array of newly earned badges
     */
    checkAndAwardBadges(childId, stats) {
        const earnedBadges = this.getEarnedBadges(childId);
        const newBadges = [];

        Object.values(this.definitions).forEach(badge => {
            // Skip if already earned
            if (earnedBadges.includes(badge.id)) {
                return;
            }

            // Check if badge should be awarded
            if (badge.check(stats)) {
                newBadges.push(badge);
                earnedBadges.push(badge.id);
            }
        });

        // Save if there are new badges
        if (newBadges.length > 0) {
            const badges = this.storage.get('badges') || {};
            badges[childId] = earnedBadges;
            this.storage.set('badges', badges);
        }

        return newBadges;
    }

    /**
     * Award a specific badge
     * @param {string} childId - Child ID
     * @param {string} badgeId - Badge ID
     * @returns {Object|null} Badge object if newly awarded, null if already had
     */
    awardBadge(childId, badgeId) {
        const earnedBadges = this.getEarnedBadges(childId);

        if (earnedBadges.includes(badgeId)) {
            return null;
        }

        earnedBadges.push(badgeId);

        const badges = this.storage.get('badges') || {};
        badges[childId] = earnedBadges;
        this.storage.set('badges', badges);

        return this.definitions[badgeId] || null;
    }

    /**
     * Get badge count for a child
     * @param {string} childId - Child ID
     * @returns {Object} Counts
     */
    getBadgeCounts(childId) {
        const earned = this.getEarnedBadges(childId).length;
        const total = Object.keys(this.definitions).length;

        return {
            earned,
            total,
            percentage: Math.round((earned / total) * 100),
        };
    }

    /**
     * Reset badges for a child
     * @param {string} childId - Child ID
     */
    resetBadges(childId) {
        const badges = this.storage.get('badges') || {};
        badges[childId] = [];
        this.storage.set('badges', badges);
    }
}

// Export singleton
let badgeServiceInstance = null;

export function getBadgeService() {
    if (!badgeServiceInstance) {
        badgeServiceInstance = new BadgeService();
    }
    return badgeServiceInstance;
}

// Export badge definitions for reference
export { BADGE_DEFINITIONS };
