/**
 * MathCE1 - Microphone Button Component
 * Button for activating voice input with visual feedback
 * @module components/mic-button
 */

import { getSpeech } from '../core/speech.js';

/**
 * Microphone button component
 */
export class MicButton {
    /**
     * Create mic button
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Configuration options
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            size: 'large',  // 'small', 'medium', 'large'
            showLabel: true,
            onStart: null,
            onStop: null,
            ...options,
        };

        this.speech = getSpeech();
        this.button = null;
        this.isListening = false;

        this.render();
        this.bindEvents();
    }

    /**
     * Render the button
     */
    render() {
        const sizeClass = `mic-button-${this.options.size}`;

        this.container.innerHTML = `
      <div class="mic-button-wrapper">
        <button
          class="mic-button ${sizeClass}"
          type="button"
          aria-label="Activer le microphone"
          ${!this.speech.isSupported ? 'disabled' : ''}
        >
          <span class="mic-icon">🎤</span>
          <span class="mic-waves" hidden>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        ${this.options.showLabel ? `
          <span class="mic-label">
            ${this.speech.isSupported ? 'Appuie pour parler' : 'Non disponible'}
          </span>
        ` : ''}
      </div>
    `;

        this.button = this.container.querySelector('.mic-button');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        if (!this.button || !this.speech.isSupported) {
            return;
        }

        // Toggle on click
        this.button.addEventListener('click', () => {
            if (this.isListening) {
                this.stop();
            } else {
                this.start();
            }
        });

        // Also handle touch for mobile
        this.button.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (this.isListening) {
                this.stop();
            } else {
                this.start();
            }
        });
    }

    /**
     * Start listening
     */
    start() {
        if (this.isListening) {
            return;
        }

        const started = this.speech.start();

        if (started) {
            this.isListening = true;
            this.updateUI(true);

            if (this.options.onStart) {
                this.options.onStart();
            }

            // Auto-stop after speech ends
            this.speech.onEnd = () => {
                this.stop();
            };
        }
    }

    /**
     * Stop listening
     */
    stop() {
        if (!this.isListening) {
            return;
        }

        this.speech.stop();
        this.isListening = false;
        this.updateUI(false);

        if (this.options.onStop) {
            this.options.onStop();
        }
    }

    /**
     * Update UI based on listening state
     * @param {boolean} listening
     */
    updateUI(listening) {
        if (!this.button) {
            return;
        }

        const waves = this.button.querySelector('.mic-waves');
        const label = this.container.querySelector('.mic-label');

        if (listening) {
            this.button.classList.add('listening');
            this.button.setAttribute('aria-label', 'Arrêter l\'écoute');
            if (waves) {
                waves.hidden = false;
            }
            if (label) {
                label.textContent = 'Je t\'écoute...';
            }
        } else {
            this.button.classList.remove('listening');
            this.button.setAttribute('aria-label', 'Activer le microphone');
            if (waves) {
                waves.hidden = true;
            }
            if (label) {
                label.textContent = 'Appuie pour parler';
            }
        }
    }

    /**
     * Show error state
     * @param {string} message
     */
    showError(message) {
        const label = this.container.querySelector('.mic-label');
        if (label) {
            label.textContent = message;
            label.classList.add('error');

            setTimeout(() => {
                label.classList.remove('error');
                label.textContent = 'Appuie pour parler';
            }, 3000);
        }
    }

    /**
     * Enable/disable the button
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        if (this.button) {
            this.button.disabled = !enabled;
        }
    }

    /**
     * Check if currently listening
     * @returns {boolean}
     */
    getIsListening() {
        return this.isListening;
    }

    /**
     * Get speech recognition instance
     * @returns {Speech}
     */
    getSpeech() {
        return this.speech;
    }

    /**
     * Cleanup
     */
    destroy() {
        this.stop();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Add component styles
const micButtonStyles = `
  .mic-button-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
  }

  .mic-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
    border: none;
    color: var(--text-inverse);
    cursor: pointer;
    box-shadow: var(--shadow-lg);
    transition: all var(--duration-fast);
  }

  .mic-button:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: var(--shadow-glow);
  }

  .mic-button:active:not(:disabled) {
    transform: scale(0.95);
  }

  .mic-button:disabled {
    background: var(--text-muted);
    cursor: not-allowed;
  }

  /* Sizes */
  .mic-button-small {
    width: 48px;
    height: 48px;
  }

  .mic-button-small .mic-icon {
    font-size: 24px;
  }

  .mic-button-medium {
    width: 64px;
    height: 64px;
  }

  .mic-button-medium .mic-icon {
    font-size: 32px;
  }

  .mic-button-large {
    width: 80px;
    height: 80px;
  }

  .mic-button-large .mic-icon {
    font-size: 40px;
  }

  /* Listening state */
  .mic-button.listening {
    background: linear-gradient(135deg, var(--color-success), var(--color-success-dark));
    animation: pulse-ring 1.5s ease-out infinite;
  }

  .mic-button.listening .mic-icon {
    animation: pulse-scale 1s ease-in-out infinite;
  }

  /* Waves animation */
  .mic-waves {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
  }

  .mic-waves span {
    width: 3px;
    height: 16px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 2px;
    animation: wave 1s ease-in-out infinite;
  }

  .mic-waves span:nth-child(1) { animation-delay: 0s; height: 12px; }
  .mic-waves span:nth-child(2) { animation-delay: 0.1s; height: 20px; }
  .mic-waves span:nth-child(3) { animation-delay: 0.2s; height: 16px; }
  .mic-waves span:nth-child(4) { animation-delay: 0.3s; height: 20px; }
  .mic-waves span:nth-child(5) { animation-delay: 0.4s; height: 12px; }

  /* Label */
  .mic-label {
    font-size: var(--font-size-base);
    color: var(--text-secondary);
    text-align: center;
    transition: color var(--duration-fast);
  }

  .mic-label.error {
    color: var(--color-error);
  }

  @keyframes wave {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.5); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = micButtonStyles;
    document.head.appendChild(styleSheet);
}
