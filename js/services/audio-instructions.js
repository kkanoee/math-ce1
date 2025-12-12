/**
 * MathCE1 - Audio Instructions Service
 * Text-to-speech for reading questions aloud
 * @module services/audio-instructions
 */

/**
 * Audio instructions using Speech Synthesis API
 */
export class AudioInstructions {
    constructor() {
        this.synth = window.speechSynthesis || null;
        this.isSupported = !!this.synth;
        this.isSpeaking = false;
        this.voice = null;
        this.rate = 0.9;
        this.pitch = 1.0;
        this.volume = 1.0;

        if (this.isSupported) {
            this.loadVoice();
        }
    }

    /**
     * Load French voice - prioritize natural-sounding voices
     */
    loadVoice() {
        const loadVoices = () => {
            const voices = this.synth.getVoices();

            // Log available French voices for debugging
            const frenchVoices = voices.filter(v => v.lang.startsWith('fr'));
            console.log('🔊 Available French voices:', frenchVoices.map(v => `${v.name} (${v.lang})`));

            // Priority order for more natural voices
            // 1. Google Premium/Wavenet voices (very natural)
            // 2. Microsoft Online (Neural) voices
            // 3. Amazon Polly voices
            // 4. Apple premium voices
            // 5. Any other French voice

            const preferredPatterns = [
                /google.*premium/i,
                /google.*wavenet/i,
                /google/i,
                /microsoft.*online/i,
                /microsoft.*neural/i,
                /microsoft/i,
                /amazon/i,
                /polly/i,
                /amélie/i,        // macOS premium French voice
                /thomas/i,        // macOS premium French voice
                /audrey/i,        // macOS premium French voice
            ];

            // Try to find a preferred voice
            for (const pattern of preferredPatterns) {
                const preferredVoice = frenchVoices.find(v => pattern.test(v.name));
                if (preferredVoice) {
                    this.voice = preferredVoice;
                    console.log('🔊 Selected premium voice:', this.voice.name);
                    return;
                }
            }

            // Fall back to any local French voice (often better than network ones)
            this.voice = frenchVoices.find(v => v.localService)
                || frenchVoices[0]
                || null;

            if (this.voice) {
                console.log('🔊 Voice loaded:', this.voice.name);
            } else {
                console.warn('⚠️ No French voice found, will use default');
            }
        };

        // Voices may load asynchronously
        if (this.synth.getVoices().length > 0) {
            loadVoices();
        } else {
            this.synth.addEventListener('voiceschanged', loadVoices);
        }
    }

    /**
     * Speak text aloud
     * @param {string} text - Text to speak
     * @returns {Promise} Resolves when speech is complete
     */
    speak(text) {
        return new Promise((resolve, reject) => {
            if (!this.isSupported) {
                reject(new Error('Speech synthesis not supported'));
                return;
            }

            // Cancel any ongoing speech
            this.stop();

            const utterance = new SpeechSynthesisUtterance(text);

            utterance.lang = 'fr-FR';
            utterance.rate = this.rate;
            utterance.pitch = this.pitch;
            utterance.volume = this.volume;

            if (this.voice) {
                utterance.voice = this.voice;
            }

            utterance.onstart = () => {
                this.isSpeaking = true;
            };

            utterance.onend = () => {
                this.isSpeaking = false;
                resolve();
            };

            utterance.onerror = (event) => {
                this.isSpeaking = false;
                console.warn('Speech error:', event.error);
                reject(event.error);
            };

            this.synth.speak(utterance);
        });
    }

    /**
     * Read an exercise question aloud
     * @param {Object} exercise - Exercise object
     */
    async readQuestion(exercise) {
        if (!exercise) {
            return;
        }

        let text = '';

        switch (exercise.type) {
            case 'addition':
                text = `Combien font ${exercise.a} plus ${exercise.b} ?`;
                break;

            case 'subtraction':
                text = `Combien font ${exercise.a} moins ${exercise.b} ?`;
                break;

            case 'counting':
                text = `Combien y a-t-il d'éléments ?`;
                break;

            case 'comparison':
                text = `Quel nombre est le plus grand : ${exercise.a} ou ${exercise.b} ?`;
                break;

            case 'ordering':
                text = exercise.question_template
                    .replace('{a}', exercise.params?.a || exercise.a);
                break;

            default:
                text = exercise.question || 'Réponds à cette question.';
        }

        try {
            await this.speak(text);
        } catch (error) {
            console.warn('Failed to read question:', error);
        }
    }

    /**
     * Read a number aloud
     * @param {number} num - Number to read
     */
    async readNumber(num) {
        try {
            await this.speak(String(num));
        } catch (error) {
            console.warn('Failed to read number:', error);
        }
    }

    /**
     * Read success message
     * @param {string} message - Message to read
     */
    async readSuccess(message = 'Bravo !') {
        try {
            await this.speak(message);
        } catch (error) {
            console.warn('Failed to read success:', error);
        }
    }

    /**
     * Read hint aloud
     * @param {string} hint - Hint text
     */
    async readHint(hint) {
        try {
            await this.speak(hint);
        } catch (error) {
            console.warn('Failed to read hint:', error);
        }
    }

    /**
     * Stop any ongoing speech
     */
    stop() {
        if (this.synth) {
            this.synth.cancel();
            this.isSpeaking = false;
        }
    }

    /**
     * Check if currently speaking
     * @returns {boolean}
     */
    getIsSpeaking() {
        return this.isSpeaking;
    }

    /**
     * Set speech rate
     * @param {number} rate - Rate 0.1 to 2.0
     */
    setRate(rate) {
        this.rate = Math.max(0.1, Math.min(2.0, rate));
    }

    /**
     * Set volume
     * @param {number} volume - Volume 0 to 1
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Check if supported
     * @returns {boolean}
     */
    getIsSupported() {
        return this.isSupported;
    }

    /**
     * Cleanup
     */
    destroy() {
        this.stop();
    }
}

// Export singleton
let audioInstructionsInstance = null;

export function getAudioInstructions() {
    if (!audioInstructionsInstance) {
        audioInstructionsInstance = new AudioInstructions();
    }
    return audioInstructionsInstance;
}
