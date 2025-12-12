/**
 * MathCE1 - Feedback Component
 * Success and encouragement animations
 * @module components/feedback
 */

import { CONFIG } from '../data/config.js';

/**
 * Feedback manager for displaying success/encouragement animations
 */
export class Feedback {
    constructor() {
        this.overlay = document.getElementById('feedback-overlay');
        this.content = document.getElementById('feedback-content');
        this.isShowing = false;
    }

    /**
     * Show success feedback
     * @param {string} [customMessage] - Optional custom message
     */
    showSuccess(customMessage = null) {
        const messages = CONFIG.MASCOT_MESSAGES.SUCCESS;
        const message = customMessage || messages[Math.floor(Math.random() * messages.length)];

        this.show({
            type: 'success',
            icon: '⭐',
            message: message,
            animate: 'celebrate',
        });

        // Also trigger star burst
        this.triggerStarBurst();
    }

    /**
     * Show encouragement feedback (after error)
     * @param {string} [customMessage] - Optional custom message
     */
    showEncouragement(customMessage = null) {
        const messages = CONFIG.MASCOT_MESSAGES.ENCOURAGEMENT;
        const message = customMessage || messages[Math.floor(Math.random() * messages.length)];

        this.show({
            type: 'encouragement',
            icon: '💪',
            message: message,
            animate: 'bounce',
            duration: 1500,
        });
    }

    /**
     * Show streak feedback
     * @param {number} streakCount - Current streak count
     */
    showStreak(streakCount) {
        const messages = CONFIG.MASCOT_MESSAGES.STREAK;
        const message = messages[Math.floor(Math.random() * messages.length)];

        this.show({
            type: 'streak',
            icon: '🔥',
            message: `${message} x${streakCount}`,
            animate: 'celebrate',
            showConfetti: true,
        });
    }

    /**
     * Show level up feedback
     */
    showLevelUp() {
        const messages = CONFIG.MASCOT_MESSAGES.LEVEL_UP;
        const message = messages[Math.floor(Math.random() * messages.length)];

        this.show({
            type: 'levelup',
            icon: '🌟',
            message: message,
            animate: 'celebrate',
            duration: 3000,
            showConfetti: true,
        });
    }

    /**
     * Show badge earned feedback
     * @param {Object} badge - Badge object
     */
    showBadgeEarned(badge) {
        this.show({
            type: 'badge',
            icon: badge.icon || '🏆',
            message: `Badge obtenu : ${badge.name}`,
            animate: 'celebrate',
            duration: 3000,
            showConfetti: true,
        });
    }

    /**
     * Show custom feedback
     * @param {Object} options - Feedback options
     */
    show(options) {
        if (!this.overlay || !this.content || this.isShowing) {
            return;
        }

        const {
            type = 'info',
            icon = '✨',
            message = '',
            animate = 'scale-in',
            duration = CONFIG.ANIMATION.FEEDBACK_DISPLAY_MS,
            showConfetti = false,
        } = options;

        this.isShowing = true;

        // Build content
        this.content.innerHTML = `
      <div class="feedback-inner ${type} ${animate}">
        <span class="feedback-icon">${icon}</span>
        <p class="feedback-message">${message}</p>
      </div>
    `;

        // Show overlay
        this.overlay.hidden = false;

        // Show confetti if requested
        if (showConfetti) {
            this.triggerConfetti();
        }

        // Auto hide after duration
        setTimeout(() => this.hide(), duration);
    }

    /**
     * Hide feedback overlay
     */
    hide() {
        if (!this.overlay) {
            return;
        }

        this.content.querySelector('.feedback-inner')?.classList.add('scale-out');

        setTimeout(() => {
            this.overlay.hidden = true;
            this.isShowing = false;
        }, 200);
    }

    /**
     * Trigger star burst effect around the star counter
     */
    triggerStarBurst() {
        const starDisplay = document.querySelector('.star-display');
        if (starDisplay) {
            starDisplay.classList.add('star-burst');
            setTimeout(() => starDisplay.classList.remove('star-burst'), 1000);
        }
    }

    /**
     * Trigger confetti effect
     */
    triggerConfetti() {
        const colors = ['#FFD700', '#FF6B6B', '#4ADE80', '#60A5FA', '#F472B6'];
        const count = 50;

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';

            document.body.appendChild(confetti);

            // Remove after animation
            setTimeout(() => confetti.remove(), 4000);
        }
    }

    /**
     * Show hint feedback (CPA-based visual hint)
     * @param {string} hintType - Type of hint
     * @param {string} hintContent - Hint content
     */
    showHint(hintType, hintContent) {
        const messages = CONFIG.MASCOT_MESSAGES.HINT;
        const mascotHint = messages[Math.floor(Math.random() * messages.length)];

        // Show mascot bubble with hint
        const mascotBubble = document.getElementById('mascot-bubble');
        const mascotMessage = document.getElementById('mascot-message');
        const mascotContainer = document.getElementById('mascot-container');

        if (mascotBubble && mascotMessage && mascotContainer) {
            mascotMessage.textContent = mascotHint;
            mascotContainer.hidden = false;
            mascotBubble.hidden = false;
            mascotBubble.classList.add('bounce');

            setTimeout(() => {
                mascotBubble.classList.remove('bounce');
                mascotBubble.hidden = true;
            }, 3000);
        }
    }
}

// Export singleton
let feedbackInstance = null;

export function getFeedback() {
    if (!feedbackInstance) {
        feedbackInstance = new Feedback();
    }
    return feedbackInstance;
}

// Add feedback styles
const feedbackStyles = `
  .feedback-inner {
    text-align: center;
    padding: var(--space-8);
    background: rgba(255, 255, 255, 0.95);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    max-width: 90vw;
    width: 300px;
  }

  .feedback-icon {
    font-size: 64px;
    display: block;
    margin-bottom: var(--space-4);
  }

  .feedback-message {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    line-height: var(--line-height-tight);
  }

  .feedback-inner.success .feedback-message {
    color: var(--color-success-dark);
  }

  .feedback-inner.encouragement .feedback-message {
    color: var(--color-primary);
  }

  .feedback-inner.streak .feedback-message {
    color: var(--color-secondary-dark);
  }

  .feedback-inner.levelup .feedback-message {
    color: var(--color-primary);
  }

  .feedback-inner.badge .feedback-message {
    color: var(--color-secondary-dark);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = feedbackStyles;
    document.head.appendChild(styleSheet);
}
