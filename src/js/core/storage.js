/**
 * MathCE1 - LocalStorage Abstraction
 * @module core/storage
 */

/**
 * Storage class for localStorage abstraction
 * Handles JSON serialization and key prefixing
 */
export class Storage {
    /**
     * Create storage instance with key prefix
     * @param {string} prefix - Prefix for all storage keys
     */
    constructor(prefix = 'mathce1') {
        this.prefix = prefix;
        this.isAvailable = this.checkAvailability();

        if (!this.isAvailable) {
            console.warn('⚠️ localStorage not available, using in-memory fallback');
            this.memoryStore = {};
        }
    }

    /**
     * Check if localStorage is available
     * @returns {boolean}
     */
    checkAvailability() {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Get prefixed key
     * @param {string} key - Original key
     * @returns {string} Prefixed key
     */
    getKey(key) {
        return `${this.prefix}_${key}`;
    }

    /**
     * Get value from storage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Parsed value or default
     */
    get(key, defaultValue = null) {
        const fullKey = this.getKey(key);

        try {
            const value = this.isAvailable
                ? localStorage.getItem(fullKey)
                : this.memoryStore[fullKey];

            if (value === null || value === undefined) {
                return defaultValue;
            }

            return JSON.parse(value);
        } catch (e) {
            console.warn(`Storage.get error for ${key}:`, e);
            return defaultValue;
        }
    }

    /**
     * Set value in storage
     * @param {string} key - Storage key
     * @param {*} value - Value to store (will be JSON serialized)
     * @returns {boolean} Success status
     */
    set(key, value) {
        const fullKey = this.getKey(key);

        try {
            const serialized = JSON.stringify(value);

            if (this.isAvailable) {
                localStorage.setItem(fullKey, serialized);
            } else {
                this.memoryStore[fullKey] = serialized;
            }

            return true;
        } catch (e) {
            console.error(`Storage.set error for ${key}:`, e);

            // Handle quota exceeded
            if (e.name === 'QuotaExceededError') {
                this.cleanup();
                // Try again after cleanup
                try {
                    localStorage.setItem(fullKey, JSON.stringify(value));
                    return true;
                } catch (e2) {
                    console.error('Storage still full after cleanup');
                }
            }

            return false;
        }
    }

    /**
     * Remove value from storage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
        const fullKey = this.getKey(key);

        try {
            if (this.isAvailable) {
                localStorage.removeItem(fullKey);
            } else {
                delete this.memoryStore[fullKey];
            }
            return true;
        } catch (e) {
            console.error(`Storage.remove error for ${key}:`, e);
            return false;
        }
    }

    /**
     * Check if key exists
     * @param {string} key - Storage key
     * @returns {boolean}
     */
    has(key) {
        const fullKey = this.getKey(key);

        if (this.isAvailable) {
            return localStorage.getItem(fullKey) !== null;
        }
        return fullKey in this.memoryStore;
    }

    /**
     * Get all keys with this prefix
     * @returns {string[]} Array of keys (without prefix)
     */
    keys() {
        const prefixLength = this.prefix.length + 1;
        const keys = [];

        if (this.isAvailable) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith(this.prefix + '_')) {
                    keys.push(key.slice(prefixLength));
                }
            }
        } else {
            Object.keys(this.memoryStore).forEach(key => {
                if (key.startsWith(this.prefix + '_')) {
                    keys.push(key.slice(prefixLength));
                }
            });
        }

        return keys;
    }

    /**
     * Clear all data with this prefix
     * @returns {boolean} Success status
     */
    clear() {
        try {
            const keys = this.keys();
            keys.forEach(key => this.remove(key));
            return true;
        } catch (e) {
            console.error('Storage.clear error:', e);
            return false;
        }
    }

    /**
     * Cleanup old data to free space
     * Removes old sessions (keeps last 20)
     */
    cleanup() {
        console.log('🧹 Cleaning up storage...');

        // Get sessions and keep only last 20
        const sessions = this.get('sessions') || {};

        Object.keys(sessions).forEach(childId => {
            const childSessions = sessions[childId] || [];
            if (childSessions.length > 20) {
                sessions[childId] = childSessions.slice(-20);
            }
        });

        this.set('sessions', sessions);
    }

    /**
     * Get storage usage info
     * @returns {Object} Usage info
     */
    getUsage() {
        if (!this.isAvailable) {
            return { used: 0, total: 0, percentage: 0 };
        }

        let used = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.prefix + '_')) {
                used += localStorage.getItem(key).length;
            }
        }

        // localStorage typically has 5MB limit
        const total = 5 * 1024 * 1024;

        return {
            used,
            total,
            percentage: Math.round((used / total) * 100),
        };
    }

    /**
     * Export all data (for backup)
     * @returns {Object} All stored data
     */
    export() {
        const data = {};
        this.keys().forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    }

    /**
     * Import data (restore from backup)
     * @param {Object} data - Data to import
     */
    import(data) {
        Object.entries(data).forEach(([key, value]) => {
            this.set(key, value);
        });
    }
}

// Export singleton instance
let storageInstance = null;

export function getStorage() {
    if (!storageInstance) {
        storageInstance = new Storage();
    }
    return storageInstance;
}
