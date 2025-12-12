/**
 * MathCE1 - Numeric Keyboard Component
 * Large touch-friendly keyboard for children
 * @module components/keyboard
 */

/**
 * Numeric keyboard component
 */
export class NumericKeyboard {
    /**
     * Create keyboard
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Configuration
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            onDigit: null,      // Called when digit is pressed
            onBackspace: null,  // Called when backspace is pressed
            onClear: null,      // Called when clear is pressed
            showClear: false,   // Show clear button
            disabled: false,
            ...options,
        };

        this.render();
        this.bindEvents();
    }

    /**
     * Render the keyboard
     */
    render() {
        this.container.innerHTML = `
      <div class="keyboard" role="group" aria-label="Clavier numérique">
        <button class="key" data-digit="1" type="button" aria-label="1">1</button>
        <button class="key" data-digit="2" type="button" aria-label="2">2</button>
        <button class="key" data-digit="3" type="button" aria-label="3">3</button>
        <button class="key" data-digit="4" type="button" aria-label="4">4</button>
        <button class="key" data-digit="5" type="button" aria-label="5">5</button>
        <button class="key" data-digit="6" type="button" aria-label="6">6</button>
        <button class="key" data-digit="7" type="button" aria-label="7">7</button>
        <button class="key" data-digit="8" type="button" aria-label="8">8</button>
        <button class="key" data-digit="9" type="button" aria-label="9">9</button>
        ${this.options.showClear
                ? '<button class="key key-clear" data-action="clear" type="button" aria-label="Effacer tout">C</button>'
                : '<button class="key key-backspace" data-action="backspace" type="button" aria-label="Effacer">⌫</button>'
            }
        <button class="key key-zero" data-digit="0" type="button" aria-label="0">0</button>
        <button class="key key-backspace" data-action="backspace" type="button" aria-label="Effacer">⌫</button>
      </div>
    `;

        this.keyboard = this.container.querySelector('.keyboard');

        // Apply disabled state if needed
        if (this.options.disabled) {
            this.setDisabled(true);
        }
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        if (!this.keyboard) {
            return;
        }

        // Handle clicks on keys
        this.keyboard.addEventListener('click', (e) => {
            const key = e.target.closest('.key');
            if (!key || key.disabled) {
                return;
            }

            // Play click sound
            window.MathCE1?.audio?.playClick();

            // Add pressed animation
            key.classList.add('pressed');
            setTimeout(() => key.classList.remove('pressed'), 150);

            // Handle digit
            if (key.dataset.digit !== undefined) {
                if (this.options.onDigit) {
                    this.options.onDigit(key.dataset.digit);
                }
            }

            // Handle actions
            if (key.dataset.action) {
                switch (key.dataset.action) {
                    case 'backspace':
                        if (this.options.onBackspace) {
                            this.options.onBackspace();
                        }
                        break;
                    case 'clear':
                        if (this.options.onClear) {
                            this.options.onClear();
                        }
                        break;
                }
            }
        });

        // Handle keyboard input for accessibility
        this.keyboard.addEventListener('keydown', (e) => {
            // If a number key is pressed
            if (/^[0-9]$/.test(e.key)) {
                if (this.options.onDigit) {
                    this.options.onDigit(e.key);
                }
            }

            // Backspace
            if (e.key === 'Backspace') {
                if (this.options.onBackspace) {
                    this.options.onBackspace();
                }
            }
        });
    }

    /**
     * Enable/disable keyboard
     * @param {boolean} disabled
     */
    setDisabled(disabled) {
        this.options.disabled = disabled;

        if (this.keyboard) {
            const keys = this.keyboard.querySelectorAll('.key');
            keys.forEach(key => {
                key.disabled = disabled;
                key.setAttribute('aria-disabled', disabled);
            });
        }
    }

    /**
     * Highlight a specific key (for hints)
     * @param {string} digit - Digit to highlight
     */
    highlightKey(digit) {
        if (!this.keyboard) {
            return;
        }

        // Remove existing highlights
        this.clearHighlights();

        // Add highlight to matching key
        const key = this.keyboard.querySelector(`[data-digit="${digit}"]`);
        if (key) {
            key.classList.add('highlighted');
        }
    }

    /**
     * Clear all key highlights
     */
    clearHighlights() {
        if (!this.keyboard) {
            return;
        }

        this.keyboard.querySelectorAll('.highlighted').forEach(key => {
            key.classList.remove('highlighted');
        });
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

// Add keyboard styles
const keyboardStyles = `
  .keyboard {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-3);
    padding: var(--space-4);
    background: var(--bg-secondary);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    max-width: 320px;
    margin: 0 auto;
    user-select: none;
  }

  .key {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--touch-target-large);
    min-height: var(--touch-target-large);
    font-family: inherit;
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-extra);
    color: var(--text-primary);
    background: var(--bg-accent);
    border: none;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--duration-fast);
    -webkit-tap-highlight-color: transparent;
  }

  .key:hover:not(:disabled) {
    background: var(--color-primary-light);
    color: var(--text-inverse);
    transform: scale(1.02);
  }

  .key:active:not(:disabled),
  .key.pressed {
    transform: scale(0.95);
    background: var(--color-primary);
    color: var(--text-inverse);
  }

  .key:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .key:focus-visible {
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
  }

  .key-zero {
    grid-column: span 1;
  }

  .key-backspace {
    background: var(--color-error-light);
    color: var(--color-error-dark);
  }

  .key-backspace:hover:not(:disabled) {
    background: var(--color-error);
    color: var(--text-inverse);
  }

  .key-clear {
    background: var(--color-warning);
    color: var(--text-inverse);
  }

  .key-clear:hover:not(:disabled) {
    background: var(--color-secondary-dark);
  }

  .key.highlighted {
    background: var(--color-success);
    color: var(--text-inverse);
    animation: pulse 1s ease-in-out infinite;
  }

  /* Larger keys on tablet */
  @media (min-width: 768px) {
    .keyboard {
      max-width: 400px;
      gap: var(--space-4);
    }

    .key {
      min-height: 80px;
      font-size: var(--font-size-3xl);
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyboardStyles;
    document.head.appendChild(styleSheet);
}
