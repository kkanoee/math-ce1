/**
 * MathCE1 - Audio Manager
 * Sound generation using Web Audio API for feedback
 * @module core/audio
 */

/**
 * Audio manager for game sounds using Web Audio API
 */
export class Audio {
    constructor() {
        this.enabled = true;
        this.volume = 0.8;
        this.audioContext = null;
        this.initialized = false;
    }

    /**
     * Initialize audio context (must be called after user interaction)
     */
    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('🔊 Web Audio API initialized');
        } catch (error) {
            console.warn('⚠️ Web Audio API not supported:', error);
        }
    }

    /**
     * Create an oscillator note
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {number} startTime - Start time relative to current time
     * @param {string} type - Oscillator type (sine, square, triangle, sawtooth)
     */
    playNote(frequency, duration, startTime = 0, type = 'sine') {
        if (!this.enabled || !this.audioContext) {
            this.init();
            if (!this.audioContext) return;
        }

        const ctx = this.audioContext;
        const now = ctx.currentTime + startTime;

        // Create oscillator
        const oscillator = ctx.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, now);

        // Create gain for envelope
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.volume * 0.3, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Connect and play
        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start(now);
        oscillator.stop(now + duration);

        return oscillator;
    }

    /**
     * Play success sound (happy ascending chime)
     */
    playSuccess() {
        if (!this.enabled) return;
        this.init();

        // Play a cheerful ascending arpeggio (C-E-G-C)
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            this.playNote(freq, 0.15, i * 0.08, 'sine');
        });

        // Add a sparkle effect
        setTimeout(() => {
            this.playNote(1318.51, 0.3, 0, 'triangle'); // E6 sparkle
        }, 300);
    }

    /**
     * Play encouragement sound (gentle warm tone)
     */
    playEncouragement() {
        if (!this.enabled) return;
        this.init();

        // Soft descending tone
        this.playNote(392, 0.2, 0, 'sine'); // G4
        this.playNote(349.23, 0.3, 0.15, 'sine'); // F4
    }

    /**
     * Play click sound
     */
    playClick() {
        if (!this.enabled) return;
        this.init();

        // Short click sound
        this.playNote(800, 0.05, 0, 'square');
    }

    /**
     * Play level up sound (fanfare)
     */
    playLevelUp() {
        if (!this.enabled) return;
        this.init();

        // Triumphant fanfare
        const fanfare = [
            { freq: 523.25, time: 0 },      // C5
            { freq: 659.25, time: 0.1 },    // E5
            { freq: 783.99, time: 0.2 },    // G5
            { freq: 1046.50, time: 0.3 },   // C6
            { freq: 1318.51, time: 0.5 },   // E6
            { freq: 1567.98, time: 0.7 },   // G6
        ];

        fanfare.forEach(note => {
            this.playNote(note.freq, 0.25, note.time, 'sine');
        });
    }

    /**
     * Play badge unlock sound
     */
    playBadge() {
        if (!this.enabled) return;
        this.init();

        // Magical sound
        const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        notes.forEach((freq, i) => {
            this.playNote(freq, 0.3, i * 0.1, 'triangle');
        });
    }

    /**
     * Play error sound (gentle)
     */
    playError() {
        if (!this.enabled) return;
        this.init();

        // Soft descending minor tone (not harsh)
        this.playNote(350, 0.15, 0, 'sine');
        this.playNote(320, 0.2, 0.1, 'sine');
    }

    /**
     * Set volume
     * @param {number} volume - Volume level 0-1
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * Enable/disable sounds
     * @param {boolean} enabled
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * Toggle sounds
     * @returns {boolean} New enabled state
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Check if audio is ready
     * @returns {boolean}
     */
    isReady() {
        return this.initialized || this.init();
    }
}

// Export singleton
let audioInstance = null;

export function getAudio() {
    if (!audioInstance) {
        audioInstance = new Audio();
    }
    return audioInstance;
}

