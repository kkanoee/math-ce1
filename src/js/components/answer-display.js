/**
 * MathCE1 - Answer Display Component
 * Real-time display of recognized/typed answers
 * @module components/answer-display
 */

/**
 * Answer display component
 * Shows the current answer in real-time
 */
export class AnswerDisplay {
    /**
     * Create answer display
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Configuration options
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            placeholder: 'Ta réponse...',
            showInterim: true,
            ...options,
        };

        this.currentValue = '';
        this.interimValue = '';
        this.state = 'idle'; // 'idle', 'listening', 'correct', 'incorrect'

        this.render();
    }

    /**
     * Render the display
     */
    render() {
        this.container.innerHTML = `
      <div class="answer-display-wrapper">
        <div class="answer-display ${this.state}" id="answer-box">
          <span class="answer-value" id="answer-value">
            ${this.currentValue || `<span class="answer-placeholder">${this.options.placeholder}</span>`}
          </span>
          <span class="answer-interim" id="answer-interim" hidden>${this.interimValue}</span>
        </div>
      </div>
    `;

        this.answerBox = this.container.querySelector('#answer-box');
        this.answerValue = this.container.querySelector('#answer-value');
        this.answerInterim = this.container.querySelector('#answer-interim');
    }

    /**
     * Set the answer value
     * @param {string|number} value - Answer to display
     */
    setValue(value) {
        this.currentValue = String(value);
        this.updateDisplay();
    }

    /**
     * Get current value
     * @returns {string}
     */
    getValue() {
        return this.currentValue;
    }

    /**
     * Set interim (in-progress) value
     * @param {string} value - Interim text
     */
    setInterim(value) {
        this.interimValue = value;

        if (this.answerInterim) {
            this.answerInterim.textContent = value;
            this.answerInterim.hidden = !value || !this.options.showInterim;
        }
    }

    /**
     * Clear interim value
     */
    clearInterim() {
        this.interimValue = '';
        if (this.answerInterim) {
            this.answerInterim.textContent = '';
            this.answerInterim.hidden = true;
        }
    }

    /**
     * Append a digit (for keyboard input)
     * @param {string} digit - Digit to append
     */
    appendDigit(digit) {
        this.currentValue += digit;
        this.updateDisplay();
    }

    /**
     * Remove last digit (backspace)
     */
    removeLastDigit() {
        this.currentValue = this.currentValue.slice(0, -1);
        this.updateDisplay();
    }

    /**
     * Clear the answer
     */
    clear() {
        this.currentValue = '';
        this.interimValue = '';
        this.setState('idle');
        this.updateDisplay();
        this.clearInterim();
    }

    /**
     * Update the display
     */
    updateDisplay() {
        if (!this.answerValue) {
            return;
        }

        if (this.currentValue) {
            this.answerValue.innerHTML = `<span class="answer-number">${this.currentValue}</span>`;
        } else {
            this.answerValue.innerHTML = `<span class="answer-placeholder">${this.options.placeholder}</span>`;
        }

        // Add animation on change
        this.answerValue.classList.add('pop');
        setTimeout(() => this.answerValue.classList.remove('pop'), 200);
    }

    /**
     * Set display state
     * @param {'idle'|'listening'|'correct'|'incorrect'} state
     */
    setState(state) {
        this.state = state;

        if (this.answerBox) {
            this.answerBox.className = `answer-display ${state}`;
        }
    }

    /**
     * Show as correct answer
     */
    showCorrect() {
        this.setState('correct');
        if (this.answerBox) {
            this.answerBox.classList.add('celebrate');
            setTimeout(() => this.answerBox.classList.remove('celebrate'), 600);
        }
    }

    /**
     * Show as incorrect answer
     */
    showIncorrect() {
        this.setState('incorrect');
        if (this.answerBox) {
            this.answerBox.classList.add('shake');
            setTimeout(() => {
                this.answerBox.classList.remove('shake');
                this.setState('idle');
            }, 500);
        }
    }

    /**
     * Show listening state
     */
    showListening() {
        this.setState('listening');
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Add component styles
const answerDisplayStyles = `
  .answer-display-wrapper {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }

  .answer-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    padding: var(--space-4) var(--space-6);
    background: var(--bg-secondary);
    border: 4px solid var(--color-primary);
    border-radius: var(--radius-xl);
    transition: all var(--duration-fast);
  }

  .answer-display.listening {
    border-color: var(--color-success);
    box-shadow: 0 0 0 4px rgba(126, 211, 33, 0.2);
    animation: pulse-border 1.5s ease-in-out infinite;
  }

  .answer-display.correct {
    border-color: var(--color-success);
    background: rgba(126, 211, 33, 0.1);
  }

  .answer-display.incorrect {
    border-color: var(--color-error);
    background: rgba(255, 107, 107, 0.1);
  }

  .answer-value {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-extra);
    color: var(--color-primary);
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .answer-number {
    font-family: 'Courier New', monospace;
    letter-spacing: 0.1em;
  }

  .answer-placeholder {
    color: var(--text-muted);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-normal);
  }

  .answer-interim {
    font-size: var(--font-size-base);
    color: var(--text-muted);
    font-style: italic;
    margin-top: var(--space-2);
  }

  .answer-value.pop {
    animation: pop 0.2s ease-out;
  }

  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  @keyframes pulse-border {
    0%, 100% { border-color: var(--color-success); }
    50% { border-color: var(--color-success-light); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = answerDisplayStyles;
    document.head.appendChild(styleSheet);
}
