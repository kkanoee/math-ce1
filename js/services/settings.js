/**
 * MathCE1 - Settings Service
 * User preferences management
 * @module services/settings
 */

import { getStorage } from '../core/storage.js';
import { CONFIG } from '../data/config.js';

/**
 * Default settings
 */
const DEFAULT_SETTINGS = {
    soundEnabled: true,
    voiceInputEnabled: true,
    sessionDuration: CONFIG.SESSION_DURATION_DEFAULT,
    parentPIN: null,
    language: 'fr',
    theme: 'light',
    fontSize: 'normal',
    animations: true,
    autoSave: true,
    showHints: true,
};

/**
 * Settings service for managing user preferences
 */
class SettingsService {
    constructor() {
        this.storage = getStorage();
        this.settings = this.loadSettings();
        this.listeners = [];
    }

    /**
     * Load settings from storage
     */
    loadSettings() {
        const stored = this.storage.get(CONFIG.STORAGE_KEYS.SETTINGS);
        return { ...DEFAULT_SETTINGS, ...stored };
    }

    /**
     * Save settings to storage
     */
    saveSettings() {
        this.storage.set(CONFIG.STORAGE_KEYS.SETTINGS, this.settings);
        this.notifyListeners();
    }

    /**
     * Get a setting value
     * @param {string} key - Setting key
     * @returns {any} Setting value
     */
    get(key) {
        return this.settings[key] ?? DEFAULT_SETTINGS[key];
    }

    /**
     * Set a setting value
     * @param {string} key - Setting key
     * @param {any} value - Setting value
     */
    set(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }

    /**
     * Toggle a boolean setting
     * @param {string} key - Setting key
     * @returns {boolean} New value
     */
    toggle(key) {
        this.settings[key] = !this.settings[key];
        this.saveSettings();
        return this.settings[key];
    }

    /**
     * Get all settings
     * @returns {Object} All settings
     */
    getAll() {
        return { ...this.settings };
    }

    /**
     * Reset settings to defaults
     */
    reset() {
        this.settings = { ...DEFAULT_SETTINGS };
        this.saveSettings();
    }

    /**
     * Set parent PIN
     * @param {string} pin - 4-digit PIN
     * @returns {boolean} Success
     */
    setParentPIN(pin) {
        if (pin && /^\d{4}$/.test(pin)) {
            this.set('parentPIN', pin);
            return true;
        }
        return false;
    }

    /**
     * Verify parent PIN
     * @param {string} pin - PIN to verify
     * @returns {boolean} Valid
     */
    verifyParentPIN(pin) {
        const storedPIN = this.get('parentPIN');
        if (!storedPIN) return true; // No PIN set
        return pin === storedPIN;
    }

    /**
     * Check if parent PIN is set
     * @returns {boolean}
     */
    hasParentPIN() {
        return !!this.get('parentPIN');
    }

    /**
     * Subscribe to settings changes
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    /**
     * Notify listeners of settings change
     */
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(this.settings);
            } catch (e) {
                console.error('Settings listener error:', e);
            }
        });
    }

    /**
     * Apply settings to app
     */
    applySettings() {
        // Apply theme
        document.documentElement.dataset.theme = this.get('theme');

        // Apply font size
        document.documentElement.dataset.fontSize = this.get('fontSize');

        // Apply animations setting
        if (!this.get('animations')) {
            document.documentElement.classList.add('reduce-motion');
        } else {
            document.documentElement.classList.remove('reduce-motion');
        }
    }
}

// Export singleton
let settingsInstance = null;

export function getSettings() {
    if (!settingsInstance) {
        settingsInstance = new SettingsService();
    }
    return settingsInstance;
}

export { SettingsService };
