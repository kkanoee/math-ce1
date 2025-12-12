/**
 * MathCE1 - Voice Input Service
 * Combines speech recognition with French number parsing
 * @module services/voice-input
 */

import { getSpeech } from '../core/speech.js';
import { frenchToNumber } from '../data/french-numbers.js';
import { CONFIG } from '../data/config.js';

/**
 * Voice input service
 * Handles voice recognition and converts to numbers
 */
export class VoiceInput {
    constructor() {
        this.speech = getSpeech();
        this.isActive = false;
        this.timeout = null;

        // Callbacks
        this.onNumber = null;       // Called when a valid number is recognized
        this.onInterim = null;      // Called with interim results
        this.onError = null;        // Called on error
        this.onStart = null;        // Called when listening starts
        this.onEnd = null;          // Called when listening ends

        this.setupSpeechHandlers();
    }

    /**
     * Setup speech recognition handlers
     */
    setupSpeechHandlers() {
        if (!this.speech) {
            return;
        }

        // Handle final results
        this.speech.onResult = (result) => {
            this.handleResult(result);
        };

        // Handle interim results
        this.speech.onInterim = (result) => {
            this.handleInterim(result);
        };

        // Handle errors
        this.speech.onError = (error) => {
            this.clearTimeout();
            this.isActive = false;

            if (this.onError) {
                this.onError(error);
            }
        };

        // Handle end
        this.speech.onEnd = () => {
            this.clearTimeout();
            this.isActive = false;

            if (this.onEnd) {
                this.onEnd();
            }
        };

        this.speech.onStart = () => {
            this.isActive = true;

            if (this.onStart) {
                this.onStart();
            }

            // Set timeout
            this.setTimeout();
        };
    }

    /**
     * Handle final speech result
     * @param {Object} result - Speech result
     */
    handleResult(result) {
        const { transcript, alternatives } = result;

        // Try to convert to number
        let number = frenchToNumber(transcript);

        // If main transcript didn't work, try alternatives
        if (number === null && alternatives) {
            for (const alt of alternatives) {
                const altNumber = frenchToNumber(alt.transcript);
                if (altNumber !== null) {
                    number = altNumber;
                    break;
                }
            }
        }

        if (number !== null) {
            console.log(`🔢 Recognized number: ${number} from "${transcript}"`);

            if (this.onNumber) {
                this.onNumber({
                    number,
                    transcript,
                    confidence: result.confidence,
                });
            }
        } else {
            console.log(`❓ Could not parse number from: "${transcript}"`);

            // Report as interim (showing what was heard)
            if (this.onInterim) {
                this.onInterim({
                    transcript,
                    number: null,
                });
            }

            // Report error for unknown input
            if (this.onError) {
                this.onError({
                    type: 'unknown',
                    message: 'Je n\'ai pas compris ce nombre.',
                    transcript,
                });
            }
        }
    }

    /**
     * Handle interim speech result
     * @param {Object} result - Interim result
     */
    handleInterim(result) {
        const { transcript } = result;

        // Try to convert to number for preview
        const number = frenchToNumber(transcript);

        if (this.onInterim) {
            this.onInterim({
                transcript,
                number,
            });
        }
    }

    /**
     * Start voice input
     * @returns {boolean} Success status
     */
    start() {
        if (!this.speech || !this.speech.isSupported) {
            if (this.onError) {
                this.onError({
                    type: 'not-supported',
                    message: 'La reconnaissance vocale n\'est pas disponible.',
                });
            }
            return false;
        }

        if (this.isActive) {
            return true;
        }

        return this.speech.start();
    }

    /**
     * Stop voice input
     */
    stop() {
        this.clearTimeout();

        if (this.speech && this.isActive) {
            this.speech.stop();
        }

        this.isActive = false;
    }

    /**
     * Set timeout for voice recognition
     */
    setTimeout() {
        this.clearTimeout();

        this.timeout = window.setTimeout(() => {
            console.log('⏱️ Voice recognition timeout');
            this.stop();

            if (this.onError) {
                this.onError({
                    type: 'timeout',
                    message: 'Je n\'ai rien entendu. Réessaie !',
                });
            }
        }, CONFIG.VOICE_RECOGNITION_TIMEOUT);
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
     * Check if voice input is supported
     * @returns {boolean}
     */
    isSupported() {
        return this.speech && this.speech.isSupported;
    }

    /**
     * Check if currently listening
     * @returns {boolean}
     */
    isListening() {
        return this.isActive;
    }

    /**
     * Cleanup
     */
    destroy() {
        this.stop();
        this.onNumber = null;
        this.onInterim = null;
        this.onError = null;
        this.onStart = null;
        this.onEnd = null;
    }
}

// Export singleton
let voiceInputInstance = null;

export function getVoiceInput() {
    if (!voiceInputInstance) {
        voiceInputInstance = new VoiceInput();
    }
    return voiceInputInstance;
}

export function resetVoiceInput() {
    if (voiceInputInstance) {
        voiceInputInstance.destroy();
    }
    voiceInputInstance = new VoiceInput();
    return voiceInputInstance;
}
