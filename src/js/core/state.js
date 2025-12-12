/**
 * MathCE1 - Reactive State Management
 * @module core/state
 */

/**
 * Simple reactive state management
 * Allows subscribing to state changes
 */
export class State {
    /**
     * Create state manager
     * @param {Storage} storage - Storage instance for persistence
     */
    constructor(storage = null) {
        this.state = {};
        this.subscribers = new Map();
        this.storage = storage;
    }

    /**
     * Get state value
     * @param {string} key - State key
     * @param {*} defaultValue - Default if not set
     * @returns {*} State value
     */
    get(key, defaultValue = null) {
        return key in this.state ? this.state[key] : defaultValue;
    }

    /**
     * Set state value and notify subscribers
     * @param {string} key - State key
     * @param {*} value - New value
     * @param {boolean} persist - Whether to persist to storage
     */
    set(key, value, persist = false) {
        const oldValue = this.state[key];

        // Only notify if value actually changed
        if (oldValue === value) {
            return;
        }

        this.state[key] = value;

        // Persist to storage if requested
        if (persist && this.storage) {
            this.storage.set(key, value);
        }

        // Notify subscribers
        this.notify(key, value, oldValue);
    }

    /**
     * Update state with partial object
     * @param {string} key - State key
     * @param {Object} updates - Partial updates
     * @param {boolean} persist - Whether to persist
     */
    update(key, updates, persist = false) {
        const current = this.get(key) || {};
        const updated = { ...current, ...updates };
        this.set(key, updated, persist);
    }

    /**
     * Subscribe to state changes
     * @param {string} key - State key to watch
     * @param {Function} callback - Function to call on change
     * @returns {Function} Unsubscribe function
     */
    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }

        this.subscribers.get(key).add(callback);

        // Return unsubscribe function
        return () => {
            this.subscribers.get(key)?.delete(callback);
        };
    }

    /**
     * Subscribe to any state change
     * @param {Function} callback - Function to call on any change
     * @returns {Function} Unsubscribe function
     */
    subscribeAll(callback) {
        return this.subscribe('*', callback);
    }

    /**
     * Notify subscribers of a change
     * @param {string} key - Changed key
     * @param {*} newValue - New value
     * @param {*} oldValue - Previous value
     */
    notify(key, newValue, oldValue) {
        // Notify specific key subscribers
        if (this.subscribers.has(key)) {
            this.subscribers.get(key).forEach(callback => {
                try {
                    callback(newValue, oldValue, key);
                } catch (e) {
                    console.error(`State subscriber error for ${key}:`, e);
                }
            });
        }

        // Notify wildcard subscribers
        if (this.subscribers.has('*')) {
            this.subscribers.get('*').forEach(callback => {
                try {
                    callback(newValue, oldValue, key);
                } catch (e) {
                    console.error('State wildcard subscriber error:', e);
                }
            });
        }
    }

    /**
     * Get entire state snapshot
     * @returns {Object} State copy
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Reset state (optionally keeping some keys)
     * @param {string[]} keepKeys - Keys to preserve
     */
    reset(keepKeys = []) {
        const preserved = {};
        keepKeys.forEach(key => {
            if (key in this.state) {
                preserved[key] = this.state[key];
            }
        });

        this.state = preserved;
    }

    /**
     * Create a computed value that updates when dependencies change
     * @param {string} key - Key for the computed value
     * @param {string[]} dependencies - Keys this depends on
     * @param {Function} compute - Function to compute the value
     */
    computed(key, dependencies, compute) {
        // Compute initial value
        const computeValue = () => {
            const values = dependencies.map(dep => this.get(dep));
            return compute(...values);
        };

        this.state[key] = computeValue();

        // Recompute when dependencies change
        dependencies.forEach(dep => {
            this.subscribe(dep, () => {
                const newValue = computeValue();
                this.set(key, newValue);
            });
        });
    }
}

// Export singleton instance
let stateInstance = null;

export function getState() {
    if (!stateInstance) {
        stateInstance = new State();
    }
    return stateInstance;
}

export function setState(state) {
    stateInstance = state;
}
