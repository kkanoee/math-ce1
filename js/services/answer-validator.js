/**
 * MathCE1 - Answer Validator Service
 * Dynamic validation logic for voice and keyboard input
 * @module services/answer-validator
 */

import { CONFIG } from '../data/config.js';

/**
 * Answer validator
 * Validates answers dynamically (auto-validation on correct)
 */
export class AnswerValidator {
    /**
     * Create validator
     * @param {Object} options - Configuration
     */
    constructor(options = {}) {
        this.options = {
            autoValidate: true,        // Auto-validate on correct answer
            allowCorrection: true,     // Allow backspace/correction
            keyboardTimeout: CONFIG.KEYBOARD_TIMEOUT,
            ...options,
        };

        this.expectedAnswer = null;
        this.currentInput = '';
        this.digitCount = 0;
        this.timeout = null;

        // Callbacks
        this.onCorrect = null;
        this.onIncorrect = null;
        this.onChange = null;
        this.onTimeout = null;
    }

    /**
     * Set the expected answer
     * @param {number|string} answer - Expected answer
     */
    setExpectedAnswer(answer) {
        this.expectedAnswer = String(answer);
        this.digitCount = this.expectedAnswer.length;
        this.currentInput = '';
        console.log(`🎯 Expected answer: ${this.expectedAnswer} (${this.digitCount} digits)`);
    }

    /**
     * Get expected answer
     * @returns {string}
     */
    getExpectedAnswer() {
        return this.expectedAnswer;
    }

    /**
     * Validate a voice input
     * @param {number} number - Recognized number
     * @returns {boolean} Is correct
     */
    validateVoice(number) {
        if (this.expectedAnswer === null) {
            console.warn('No expected answer set');
            return false;
        }

        const expected = parseInt(this.expectedAnswer, 10);
        const isCorrect = number === expected;

        if (isCorrect) {
            this.handleCorrect(number);
        } else {
            this.handleIncorrect(number);
        }

        return isCorrect;
    }

    /**
     * Add a digit from keyboard
     * @param {string} digit - Digit to add (0-9)
     * @returns {Object} Result { value, complete, correct }
     */
    addDigit(digit) {
        if (!/^[0-9]$/.test(digit)) {
            return null;
        }

        this.clearTimeout();
        this.currentInput += digit;

        console.log(`⌨️ Input: "${this.currentInput}" (${this.currentInput.length}/${this.digitCount} digits)`);

        if (this.onChange) {
            this.onChange(this.currentInput);
        }

        // Only auto-validate when we have EXACTLY the right number of digits
        // This prevents validating "1" when the answer is "10"
        if (this.options.autoValidate && this.currentInput.length === this.digitCount) {
            console.log('✅ Auto-validating (exact digit count reached)');
            return this.evaluateKeyboardInput();
        }

        // If user has entered MORE digits than expected, also validate
        // (this handles case where user types extra digits)
        if (this.options.autoValidate && this.currentInput.length > this.digitCount) {
            console.log('⚠️ Auto-validating (exceeded digit count)');
            return this.evaluateKeyboardInput();
        }

        // Start timeout for partial input (won't validate, just for guidance)
        this.startTimeout();

        return {
            value: this.currentInput,
            complete: false,
            correct: null,
        };
    }

    /**
     * Remove last digit (backspace)
     */
    removeDigit() {
        if (!this.options.allowCorrection || this.currentInput.length === 0) {
            return;
        }

        this.clearTimeout();
        this.currentInput = this.currentInput.slice(0, -1);

        if (this.onChange) {
            this.onChange(this.currentInput);
        }

        // Restart timeout if there's still input
        if (this.currentInput.length > 0) {
            this.startTimeout();
        }
    }

    /**
     * Evaluate keyboard input
     * @returns {Object} Result { value, complete, correct }
     */
    evaluateKeyboardInput() {
        this.clearTimeout();

        const inputNumber = parseInt(this.currentInput, 10);
        const expectedNumber = parseInt(this.expectedAnswer, 10);
        const isCorrect = inputNumber === expectedNumber;

        if (isCorrect) {
            this.handleCorrect(inputNumber);
        } else {
            this.handleIncorrect(inputNumber);
        }

        return {
            value: this.currentInput,
            complete: true,
            correct: isCorrect,
        };
    }

    /**
     * Handle correct answer
     * @param {number} answer - Given answer
     */
    handleCorrect(answer) {
        console.log(`✅ Correct! Expected ${this.expectedAnswer}, got ${answer}`);

        if (this.onCorrect) {
            this.onCorrect({
                answer,
                expected: parseInt(this.expectedAnswer, 10),
            });
        }
    }

    /**
     * Handle incorrect answer
     * @param {number} answer - Given answer
     */
    handleIncorrect(answer) {
        console.log(`❌ Incorrect. Expected ${this.expectedAnswer}, got ${answer}`);

        if (this.onIncorrect) {
            this.onIncorrect({
                answer,
                expected: parseInt(this.expectedAnswer, 10),
            });
        }

        // Clear input for retry
        this.currentInput = '';
    }

    /**
     * Start timeout for partial keyboard input
     */
    startTimeout() {
        this.clearTimeout();

        this.timeout = window.setTimeout(() => {
            console.log('⏱️ Keyboard input timeout');

            if (this.onTimeout) {
                this.onTimeout({
                    partialInput: this.currentInput,
                });
            }
        }, this.options.keyboardTimeout);
    }

    /**
     * Clear timeout
     */
    clearTimeout() {
        if (this.timeout) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    /**
     * Reset validator state
     */
    reset() {
        this.clearTimeout();
        this.currentInput = '';

        if (this.onChange) {
            this.onChange('');
        }
    }

    /**
     * Get current input
     * @returns {string}
     */
    getCurrentInput() {
        return this.currentInput;
    }

    /**
     * Check if input is complete (enough digits)
     * @returns {boolean}
     */
    isComplete() {
        return this.currentInput.length >= this.digitCount;
    }

    /**
     * Cleanup
     */
    destroy() {
        this.clearTimeout();
        this.onCorrect = null;
        this.onIncorrect = null;
        this.onChange = null;
        this.onTimeout = null;
    }
}

// Export factory
export function createValidator(options) {
    return new AnswerValidator(options);
}
