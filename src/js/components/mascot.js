/**
 * MathCE1 - Mascot Component
 * Animated mascot character for encouragement
 * @module components/mascot
 */

import { CONFIG } from '../data/config.js';

/**
 * Mascot manager
 * Handles mascot display and encouragement messages
 */
export class Mascot {
    constructor() {
        this.container = document.getElementById('mascot-container');
        this.character = document.querySelector('.mascot-character');
        this.bubble = document.getElementById('mascot-bubble');
        this.message = document.getElementById('mascot-message');

        this.currentMood = 'neutral';
        this.isVisible = false;
        this.hideTimeout = null;

        // Character emojis for different moods
        this.characters = {
            neutral: '🦊',
            happy: '🦊',
            excited: '🎉',
            thinking: '🤔',
            encouraging: '💪',
            celebrating: '🌟',
            hint: '💡',
        };
    }

    /**
     * Show the mascot
     * @param {boolean} withBubble - Show speech bubble
     */
    show(withBubble = false) {
        if (this.container) {
            this.container.hidden = false;
            this.isVisible = true;
        }

        if (this.bubble) {
            this.bubble.hidden = !withBubble;
        }
    }

    /**
     * Hide the mascot
     */
    hide() {
        if (this.container) {
            this.container.hidden = true;
            this.isVisible = false;
        }
    }

    /**
     * Set mascot mood/character
     * @param {'neutral'|'happy'|'excited'|'thinking'|'encouraging'|'celebrating'|'hint'} mood
     */
    setMood(mood) {
        this.currentMood = mood;

        if (this.character) {
            this.character.textContent = this.characters[mood] || this.characters.neutral;

            // Add animation based on mood
            this.character.classList.remove('wobble', 'bounce', 'pulse');

            switch (mood) {
                case 'excited':
                case 'celebrating':
                    this.character.classList.add('bounce');
                    break;
                case 'thinking':
                case 'hint':
                    this.character.classList.add('wobble');
                    break;
                case 'encouraging':
                    this.character.classList.add('pulse');
                    break;
            }
        }
    }

    /**
     * Say something (show speech bubble with message)
     * @param {string} text - Message to display
     * @param {number} duration - How long to show (ms)
     */
    say(text, duration = 3000) {
        this.clearHideTimeout();

        if (this.message) {
            this.message.textContent = text;
        }

        if (this.bubble) {
            this.bubble.hidden = false;
            this.bubble.classList.add('bounce-in');

            setTimeout(() => {
                this.bubble.classList.remove('bounce-in');
            }, 300);
        }

        this.show(true);

        // Auto hide after duration
        if (duration > 0) {
            this.hideTimeout = setTimeout(() => {
                this.hideBubble();
            }, duration);
        }
    }

    /**
     * Hide just the speech bubble
     */
    hideBubble() {
        if (this.bubble) {
            this.bubble.hidden = true;
        }
    }

    /**
     * Clear the hide timeout
     */
    clearHideTimeout() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    /**
     * Show welcome message
     */
    welcome() {
        const messages = CONFIG.MASCOT_MESSAGES.WELCOME;
        const message = messages[Math.floor(Math.random() * messages.length)];

        this.setMood('happy');
        this.say(message, 4000);
    }

    /**
     * Show success message
     */
    celebrate() {
        const messages = CONFIG.MASCOT_MESSAGES.SUCCESS;
        const message = messages[Math.floor(Math.random() * messages.length)];

        this.setMood('celebrating');
        this.say(message, 2500);
    }

    /**
     * Show encouragement message
     */
    encourage() {
        const messages = CONFIG.MASCOT_MESSAGES.ENCOURAGEMENT;
        const message = messages[Math.floor(Math.random() * messages.length)];

        this.setMood('encouraging');
        this.say(message, 3000);
    }

    /**
     * Show hint message
     * @param {string} customHint - Optional custom hint
     */
    giveHint(customHint = null) {
        const messages = CONFIG.MASCOT_MESSAGES.HINT;
        const message = customHint || messages[Math.floor(Math.random() * messages.length)];

        this.setMood('hint');
        this.say(message, 4000);
    }

    /**
     * Show streak celebration
     * @param {number} streakCount
     */
    celebrateStreak(streakCount) {
        const messages = CONFIG.MASCOT_MESSAGES.STREAK;
        const message = messages[Math.floor(Math.random() * messages.length)];

        this.setMood('excited');
        this.say(`${message} x${streakCount}`, 3000);
    }

    /**
     * Show level up message
     */
    levelUp() {
        const messages = CONFIG.MASCOT_MESSAGES.LEVEL_UP;
        const message = messages[Math.floor(Math.random() * messages.length)];

        this.setMood('excited');
        this.say(message, 4000);
    }

    /**
     * Think animation (for when child is answering)
     */
    think() {
        this.setMood('thinking');
        this.show(false);
    }

    /**
     * Cleanup
     */
    destroy() {
        this.clearHideTimeout();
        this.hide();
    }
}

// Export singleton
let mascotInstance = null;

export function getMascot() {
    if (!mascotInstance) {
        mascotInstance = new Mascot();
    }
    return mascotInstance;
}
