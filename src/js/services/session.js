/**
 * MathCE1 - Session Service
 * Manages exercise sessions
 * @module services/session
 */

import { CONFIG } from '../data/config.js';
import { getStorage } from '../core/storage.js';

/**
 * Session manager
 */
export class SessionService {
    constructor() {
        this.storage = getStorage();
        this.currentSession = null;
        this.sessionTimer = null;
        this.onSessionEnd = null;
    }

    /**
     * Start a new session
     * @param {string} childId - Child ID
     * @param {string} domain - Domain being practiced
     * @returns {Object} Session object
     */
    startSession(childId, domain) {
        const session = {
            id: `session_${Date.now()}`,
            childId,
            domain,
            startedAt: new Date().toISOString(),
            endedAt: null,
            exercises: [],
            totalExercises: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
            hintsUsed: 0,
            streak: 0,
            bestStreak: 0,
            starsEarned: 0,
            duration: 0,
            isComplete: false,
        };

        this.currentSession = session;
        this.saveCurrentSession();

        // Start session timer (reminder after max duration)
        this.startSessionTimer();

        console.log('📝 Session started:', session.id);

        return session;
    }

    /**
     * Record an exercise result
     * @param {Object} result - Exercise result
     */
    recordExercise(result) {
        if (!this.currentSession) {
            console.warn('No active session');
            return;
        }

        const { exerciseId, isCorrect, responseTime, hintsUsed, answer, expected } = result;

        // Add exercise record
        this.currentSession.exercises.push({
            exerciseId,
            isCorrect,
            responseTime,
            hintsUsed: hintsUsed || 0,
            answer,
            expected,
            timestamp: new Date().toISOString(),
        });

        // Update stats
        this.currentSession.totalExercises++;

        if (isCorrect) {
            this.currentSession.correctAnswers++;
            this.currentSession.streak++;

            if (this.currentSession.streak > this.currentSession.bestStreak) {
                this.currentSession.bestStreak = this.currentSession.streak;
            }

            // Award stars
            this.currentSession.starsEarned += CONFIG.STARS_PER_EXERCISE;

            // Streak bonus
            if (this.currentSession.streak >= CONFIG.STREAK_LENGTH_FOR_BONUS &&
                this.currentSession.streak % CONFIG.STREAK_LENGTH_FOR_BONUS === 0) {
                this.currentSession.starsEarned += CONFIG.STARS_STREAK_BONUS;
            }
        } else {
            this.currentSession.incorrectAnswers++;
            this.currentSession.streak = 0;
        }

        this.currentSession.hintsUsed += hintsUsed || 0;

        this.saveCurrentSession();
    }

    /**
     * End the current session
     * @returns {Object} Final session data
     */
    endSession() {
        if (!this.currentSession) {
            return null;
        }

        this.clearSessionTimer();

        this.currentSession.endedAt = new Date().toISOString();
        this.currentSession.isComplete = true;

        // Calculate duration in seconds
        const start = new Date(this.currentSession.startedAt);
        const end = new Date(this.currentSession.endedAt);
        this.currentSession.duration = Math.round((end - start) / 1000);

        // Save to session history
        this.saveSessionToHistory();

        // Clear current session
        const finalSession = { ...this.currentSession };
        this.currentSession = null;
        this.storage.remove('currentSession');

        console.log('📝 Session ended:', finalSession.id);

        return finalSession;
    }

    /**
     * Save current session to storage
     */
    saveCurrentSession() {
        if (this.currentSession) {
            this.storage.set('currentSession', this.currentSession);
        }
    }

    /**
     * Save completed session to history
     */
    saveSessionToHistory() {
        if (!this.currentSession) {
            return;
        }

        const sessions = this.storage.get('sessions') || {};
        const childId = this.currentSession.childId;

        if (!sessions[childId]) {
            sessions[childId] = [];
        }

        sessions[childId].push({
            id: this.currentSession.id,
            domain: this.currentSession.domain,
            startedAt: this.currentSession.startedAt,
            endedAt: this.currentSession.endedAt,
            duration: this.currentSession.duration,
            totalExercises: this.currentSession.totalExercises,
            correctAnswers: this.currentSession.correctAnswers,
            bestStreak: this.currentSession.bestStreak,
            starsEarned: this.currentSession.starsEarned,
        });

        // Keep only last 20 sessions per child
        if (sessions[childId].length > 20) {
            sessions[childId] = sessions[childId].slice(-20);
        }

        this.storage.set('sessions', sessions);
    }

    /**
     * Resume a session if one exists
     * @returns {Object|null} Existing session or null
     */
    resumeSession() {
        const saved = this.storage.get('currentSession');

        if (saved && !saved.isComplete) {
            this.currentSession = saved;
            this.startSessionTimer();
            console.log('📝 Session resumed:', saved.id);
            return saved;
        }

        return null;
    }

    /**
     * Get session history for a child
     * @param {string} childId - Child ID
     * @returns {Object[]} Session history
     */
    getSessionHistory(childId) {
        const sessions = this.storage.get('sessions') || {};
        return sessions[childId] || [];
    }

    /**
     * Get current session stats
     * @returns {Object|null} Current session stats
     */
    getCurrentStats() {
        if (!this.currentSession) {
            return null;
        }

        return {
            totalExercises: this.currentSession.totalExercises,
            correctAnswers: this.currentSession.correctAnswers,
            incorrectAnswers: this.currentSession.incorrectAnswers,
            successRate: this.currentSession.totalExercises > 0
                ? Math.round((this.currentSession.correctAnswers / this.currentSession.totalExercises) * 100)
                : 0,
            streak: this.currentSession.streak,
            bestStreak: this.currentSession.bestStreak,
            starsEarned: this.currentSession.starsEarned,
        };
    }

    /**
     * Start session timer (for duration reminder)
     */
    startSessionTimer() {
        this.clearSessionTimer();

        const maxDuration = CONFIG.SESSION_DURATION_MAX * 60 * 1000; // Convert minutes to ms

        this.sessionTimer = setTimeout(() => {
            console.log('⏰ Session time limit reached');

            if (this.onSessionEnd) {
                this.onSessionEnd('time_limit');
            }
        }, maxDuration);
    }

    /**
     * Clear session timer
     */
    clearSessionTimer() {
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
            this.sessionTimer = null;
        }
    }

    /**
     * Check if session is active
     * @returns {boolean}
     */
    isActive() {
        return this.currentSession !== null && !this.currentSession.isComplete;
    }

    /**
     * Get current streak
     * @returns {number}
     */
    getStreak() {
        return this.currentSession?.streak || 0;
    }

    /**
     * Cleanup
     */
    destroy() {
        this.clearSessionTimer();
    }
}

// Export singleton
let sessionInstance = null;

export function getSessionService() {
    if (!sessionInstance) {
        sessionInstance = new SessionService();
    }
    return sessionInstance;
}
