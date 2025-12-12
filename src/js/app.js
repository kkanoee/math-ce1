/**
 * MathCE1 - Application Entry Point
 * Main initialization and service worker registration
 * @module app
 */

import { Router } from './router.js';
import { Storage } from './core/storage.js';
import { State } from './core/state.js';
import { Audio } from './core/audio.js';

// Import pages
import { HomePage } from './pages/home.js';
import { ExercisePage } from './pages/exercise.js';
import { ProgressPage } from './pages/progress.js';
import { DomainSelectPage } from './pages/domain-select.js';
import { AvatarShopPage } from './pages/avatar-shop.js';
import { ParentDashboardPage } from './pages/parent-dashboard.js';
import { SettingsPage } from './pages/settings.js';
import { ProfilePage } from './pages/profile.js';

/**
 * Application singleton
 */
class App {
    constructor() {
        this.router = null;
        this.storage = null;
        this.state = null;
        this.audio = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.isInitialized) {
            console.warn('App already initialized');
            return;
        }

        console.log('🚀 MathCE1 initializing...');

        try {
            // Initialize core modules
            this.storage = new Storage('mathce1');
            this.state = new State(this.storage);
            this.audio = new Audio();

            // Initialize router with pages
            this.router = new Router({
                home: HomePage,
                exercise: ExercisePage,
                progress: ProgressPage,
                'domain-select': DomainSelectPage,
                'avatar-shop': AvatarShopPage,
                'parent-dashboard': ParentDashboardPage,
                settings: SettingsPage,
                profile: ProfilePage,
            });

            // Register service worker for offline support
            await this.registerServiceWorker();

            // Load saved state
            await this.loadState();

            // Setup global event listeners
            this.setupEventListeners();

            // Hide loading screen
            this.hideLoading();

            // Navigate to initial route
            this.router.init();

            this.isInitialized = true;
            console.log('✅ MathCE1 ready!');

        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.showError('Erreur de chargement. Veuillez rafraîchir la page.');
        }
    }

    /**
     * Register service worker for PWA/offline support
     */
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('📦 Service Worker registered:', registration.scope);

                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('🔄 New version available');
                        }
                    });
                });

            } catch (error) {
                console.warn('⚠️ Service Worker registration failed:', error);
            }
        } else {
            console.warn('⚠️ Service Workers not supported');
        }
    }

    /**
     * Load saved application state
     */
    async loadState() {
        // Load active child profile
        const activeChildId = this.storage.get('activeChildId');
        if (activeChildId) {
            const children = this.storage.get('children') || [];
            const activeChild = children.find(c => c.id === activeChildId);
            if (activeChild) {
                this.state.set('currentChild', activeChild);
                // Immediately update header star display
                this.updateStarDisplay(activeChild.stars || 0);
            }
        }

        // Load settings
        const settings = this.storage.get('settings') || {
            soundEnabled: true,
            volume: 80,
            voiceInputEnabled: true,
            autoValidation: true,
            sessionDuration: 15,
            theme: 'colorful',
        };
        this.state.set('settings', settings);

        // Apply settings
        this.audio.setVolume(settings.volume / 100);
        this.audio.setEnabled(settings.soundEnabled);
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Back button
        const backBtn = document.getElementById('btn-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.router.back());
        }

        // Profile button
        const profileBtn = document.getElementById('btn-profile');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => this.router.navigate('profile'));
        }

        // Star count updates
        this.state.subscribe('currentChild', (child) => {
            this.updateStarDisplay(child?.stars || 0);
        });

        // Handle visibility change (pause when tab hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.state.set('appPaused', true);
            } else {
                this.state.set('appPaused', false);
            }
        });

        // Handle online/offline
        window.addEventListener('online', () => {
            console.log('🌐 Back online');
            this.state.set('isOnline', true);
        });

        window.addEventListener('offline', () => {
            console.log('📴 Gone offline');
            this.state.set('isOnline', false);
        });
    }

    /**
     * Update star display in header
     */
    updateStarDisplay(stars) {
        const starCount = document.getElementById('star-count');
        if (starCount) {
            const currentValue = parseInt(starCount.textContent) || 0;
            if (stars > currentValue) {
                starCount.classList.add('celebrate');
                setTimeout(() => starCount.classList.remove('celebrate'), 600);
            }
            starCount.textContent = stars;
        }
    }

    /**
     * Hide loading screen
     */
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('fade-out');
            setTimeout(() => {
                loading.hidden = true;
            }, 300);
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-screen">
                    <div class="error-icon">😢</div>
                    <p class="error-message">${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Réessayer
                    </button>
                </div>
            `;
        }
    }

    /**
     * Get a core module
     */
    getModule(name) {
        switch (name) {
            case 'storage': return this.storage;
            case 'state': return this.state;
            case 'audio': return this.audio;
            case 'router': return this.router;
            default: return null;
        }
    }
}

// Create and export app instance
const app = new App();

// Make app globally accessible for debugging
window.MathCE1 = app;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

export { app };
