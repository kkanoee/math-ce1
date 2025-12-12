/**
 * MathCE1 - Web Speech API Wrapper
 * Speech recognition for voice input
 * @module core/speech
 */

/**
 * Speech recognition wrapper
 * Handles Web Speech API with French language support
 */
export class Speech {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.isSupported = this.checkSupport();

        // Callbacks
        this.onResult = null;
        this.onInterim = null;
        this.onError = null;
        this.onEnd = null;
        this.onStart = null;

        // Initialize if supported
        if (this.isSupported) {
            this.init();
        }
    }

    /**
     * Check if Web Speech API is supported
     * @returns {boolean}
     */
    checkSupport() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        return !!SpeechRecognition;
    }

    /**
     * Initialize speech recognition
     */
    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        this.recognition = new SpeechRecognition();

        // Configure for French
        this.recognition.lang = 'fr-FR';
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;

        // Setup event handlers
        this.recognition.onstart = () => {
            console.log('🎤 Speech recognition started');
            this.isListening = true;
            if (this.onStart) {
                this.onStart();
            }
        };

        this.recognition.onresult = (event) => {
            this.handleResult(event);
        };

        this.recognition.onerror = (event) => {
            this.handleError(event);
        };

        this.recognition.onend = () => {
            console.log('🎤 Speech recognition ended');
            this.isListening = false;
            if (this.onEnd) {
                this.onEnd();
            }
        };

        this.recognition.onnomatch = () => {
            console.log('🎤 No match found');
            if (this.onError) {
                this.onError({ type: 'no-match', message: 'Je n\'ai pas compris, réessaie !' });
            }
        };
    }

    /**
     * Handle speech recognition result
     * @param {SpeechRecognitionEvent} event
     */
    handleResult(event) {
        const results = event.results[event.resultIndex];

        if (!results) {
            return;
        }

        // Get the best transcript
        const transcript = results[0].transcript.trim().toLowerCase();
        const isFinal = results.isFinal;
        const confidence = results[0].confidence;

        console.log(`🎤 Result: "${transcript}" (final: ${isFinal}, confidence: ${confidence})`);

        // Get alternative transcripts
        const alternatives = [];
        for (let i = 0; i < results.length; i++) {
            alternatives.push({
                transcript: results[i].transcript.trim().toLowerCase(),
                confidence: results[i].confidence,
            });
        }

        if (isFinal) {
            // Final result
            if (this.onResult) {
                this.onResult({
                    transcript,
                    confidence,
                    alternatives,
                    isFinal: true,
                });
            }
        } else {
            // Interim result (for real-time display)
            if (this.onInterim) {
                this.onInterim({
                    transcript,
                    confidence,
                    isFinal: false,
                });
            }
        }
    }

    /**
     * Handle speech recognition error
     * @param {SpeechRecognitionErrorEvent} event
     */
    handleError(event) {
        console.warn('🎤 Speech error:', event.error);

        this.isListening = false;

        const errorMessages = {
            'no-speech': 'Je n\'ai rien entendu. Essaie de parler plus fort !',
            'audio-capture': 'Pas de microphone détecté.',
            'not-allowed': 'L\'accès au microphone n\'est pas autorisé.',
            'network': 'Problème de connexion. Réessaie !',
            'aborted': 'Écoute arrêtée.',
            'service-not-allowed': 'Service non disponible.',
        };

        const message = errorMessages[event.error] || 'Une erreur est survenue.';

        if (this.onError) {
            this.onError({
                type: event.error,
                message: message,
            });
        }
    }

    /**
     * Start listening
     * @returns {boolean} Success status
     */
    start() {
        if (!this.isSupported) {
            console.warn('Speech recognition not supported');
            if (this.onError) {
                this.onError({
                    type: 'not-supported',
                    message: 'La reconnaissance vocale n\'est pas disponible sur ce navigateur.',
                });
            }
            return false;
        }

        // If already listening, stop first and wait before restarting
        if (this.isListening) {
            console.log('Already listening, stopping first...');
            this.stop();
            // Wait a bit for the recognition to fully stop before restarting
            setTimeout(() => this.start(), 100);
            return true;
        }

        try {
            // Reset the listening state before starting
            this.isListening = false;
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('Failed to start recognition:', error);
            // Reset state on error
            this.isListening = false;
            // If it's an InvalidStateError, the recognition might be in a bad state
            if (error.name === 'InvalidStateError') {
                console.log('Attempting to abort and restart...');
                try {
                    this.recognition.abort();
                } catch (e) {
                    // Ignore abort errors
                }
            }
            return false;
        }
    }

    /**
     * Stop listening
     */
    stop() {
        if (!this.recognition || !this.isListening) {
            return;
        }

        try {
            this.recognition.stop();
        } catch (error) {
            console.warn('Error stopping recognition:', error);
        }
    }

    /**
     * Abort listening (immediate stop)
     */
    abort() {
        if (!this.recognition) {
            return;
        }

        try {
            this.recognition.abort();
        } catch (error) {
            console.warn('Error aborting recognition:', error);
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
     * Check if speech recognition is supported
     * @returns {boolean}
     */
    getIsSupported() {
        return this.isSupported;
    }

    /**
     * Set the language
     * @param {string} lang - Language code (e.g., 'fr-FR')
     */
    setLanguage(lang) {
        if (this.recognition) {
            this.recognition.lang = lang;
        }
    }

    /**
     * Set continuous mode
     * @param {boolean} continuous
     */
    setContinuous(continuous) {
        if (this.recognition) {
            this.recognition.continuous = continuous;
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        this.abort();
        this.onResult = null;
        this.onInterim = null;
        this.onError = null;
        this.onEnd = null;
        this.onStart = null;
    }
}

// Export singleton
let speechInstance = null;

export function getSpeech() {
    if (!speechInstance) {
        speechInstance = new Speech();
    }
    return speechInstance;
}

export function resetSpeech() {
    if (speechInstance) {
        speechInstance.destroy();
    }
    speechInstance = new Speech();
    return speechInstance;
}
