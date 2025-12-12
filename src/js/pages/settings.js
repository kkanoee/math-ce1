/**
 * MathCE1 - Settings Page
 * User preferences and parent controls
 * @module pages/settings
 */

import { getSettings } from '../services/settings.js';
import { CONFIG } from '../data/config.js';

/**
 * Settings page component
 */
export class SettingsPage {
    constructor() {
        this.app = window.MathCE1;
        this.settings = getSettings();
        this.showPINModal = false;
        this.isParentMode = false;
    }

    /**
     * Render the settings page
     */
    render() {
        const currentSettings = this.settings.getAll();

        return `
      <div class="settings-page slide-up">
        <header class="page-header">
          <button class="btn btn-icon back-btn" id="back-btn">←</button>
          <h1>Paramètres</h1>
        </header>

        <main class="settings-content">
          <!-- Child Settings -->
          <section class="settings-section card">
            <h2 class="section-title">🎮 Préférences</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">🔊 Sons</span>
                <span class="setting-desc">Activer les effets sonores</span>
              </div>
              <label class="toggle">
                <input type="checkbox" id="sound-toggle" 
                  ${currentSettings.soundEnabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">🎤 Saisie vocale</span>
                <span class="setting-desc">Répondre par la voix</span>
              </div>
              <label class="toggle">
                <input type="checkbox" id="voice-toggle"
                  ${currentSettings.voiceInputEnabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">✨ Animations</span>
                <span class="setting-desc">Effets visuels et animations</span>
              </div>
              <label class="toggle">
                <input type="checkbox" id="animations-toggle"
                  ${currentSettings.animations ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">💡 Indices</span>
                <span class="setting-desc">Afficher les indices après erreurs</span>
              </div>
              <label class="toggle">
                <input type="checkbox" id="hints-toggle"
                  ${currentSettings.showHints ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </section>

          <!-- Parent Section -->
          <section class="settings-section card">
            <h2 class="section-title">👨‍👩‍👧 Espace Parent</h2>
            
            <button class="btn btn-outline btn-full" id="parent-dashboard-btn">
              📊 Tableau de bord parent
            </button>

            <button class="btn btn-outline btn-full" id="set-pin-btn">
              🔒 ${this.settings.hasParentPIN() ? 'Modifier' : 'Définir'} le code PIN
            </button>
          </section>

          <!-- Session Settings -->
          <section class="settings-section card">
            <h2 class="section-title">⏱️ Session</h2>
            
            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">Durée de session</span>
                <span class="setting-desc">Temps recommandé : 10-15 min</span>
              </div>
              <select id="session-duration" class="select">
                <option value="10" ${currentSettings.sessionDuration === 10 ? 'selected' : ''}>10 min</option>
                <option value="15" ${currentSettings.sessionDuration === 15 ? 'selected' : ''}>15 min</option>
                <option value="20" ${currentSettings.sessionDuration === 20 ? 'selected' : ''}>20 min</option>
              </select>
            </div>

            <div class="setting-item">
              <div class="setting-info">
                <span class="setting-label">💾 Sauvegarde auto</span>
                <span class="setting-desc">Sauvegarder la progression</span>
              </div>
              <label class="toggle">
                <input type="checkbox" id="autosave-toggle"
                  ${currentSettings.autoSave ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </section>

          <!-- Data Section -->
          <section class="settings-section card">
            <h2 class="section-title">📁 Données</h2>
            
            <button class="btn btn-danger btn-full" id="reset-btn">
              🗑️ Réinitialiser toutes les données
            </button>
            <p class="setting-warning">
              ⚠️ Cette action supprimera tous les profils et progressions.
            </p>
          </section>

          <!-- About -->
          <section class="settings-section card about-section">
            <h2 class="section-title">ℹ️ À propos</h2>
            <p>MathCE1 v${CONFIG.APP_VERSION}</p>
            <p class="about-desc">
              Application d'apprentissage des mathématiques 
              pour enfants de CE1, basée sur la méthode Singapour.
            </p>
          </section>
        </main>

        <!-- PIN Modal -->
        <div class="modal-overlay" id="pin-modal" hidden>
          <div class="modal card">
            <h3>Code PIN Parent</h3>
            <p>Entrez un code à 4 chiffres</p>
            <input type="password" id="pin-input" maxlength="4" 
              pattern="[0-9]*" inputmode="numeric" class="input pin-input">
            <div class="modal-buttons">
              <button class="btn btn-outline" id="pin-cancel">Annuler</button>
              <button class="btn btn-primary" id="pin-confirm">Confirmer</button>
            </div>
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Initialize page
     */
    init() {
        this.setupEventListeners();
        this.settings.applySettings();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Back button
        document.getElementById('back-btn')?.addEventListener('click', () => {
            this.app.router.navigate('home');
        });

        // Toggle handlers
        document.getElementById('sound-toggle')?.addEventListener('change', (e) => {
            this.settings.set('soundEnabled', e.target.checked);
        });

        document.getElementById('voice-toggle')?.addEventListener('change', (e) => {
            this.settings.set('voiceInputEnabled', e.target.checked);
        });

        document.getElementById('animations-toggle')?.addEventListener('change', (e) => {
            this.settings.set('animations', e.target.checked);
            this.settings.applySettings();
        });

        document.getElementById('hints-toggle')?.addEventListener('change', (e) => {
            this.settings.set('showHints', e.target.checked);
        });

        document.getElementById('autosave-toggle')?.addEventListener('change', (e) => {
            this.settings.set('autoSave', e.target.checked);
        });

        // Session duration
        document.getElementById('session-duration')?.addEventListener('change', (e) => {
            this.settings.set('sessionDuration', parseInt(e.target.value, 10));
        });

        // Parent dashboard
        document.getElementById('parent-dashboard-btn')?.addEventListener('click', () => {
            if (this.settings.hasParentPIN()) {
                this.showPINVerification(() => {
                    this.app.router.navigate('parent-dashboard');
                });
            } else {
                this.app.router.navigate('parent-dashboard');
            }
        });

        // Set PIN
        document.getElementById('set-pin-btn')?.addEventListener('click', () => {
            this.showPINSetup();
        });

        // Reset data
        document.getElementById('reset-btn')?.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer toutes les données ?')) {
                this.resetAllData();
            }
        });

        // PIN modal
        document.getElementById('pin-cancel')?.addEventListener('click', () => {
            this.hidePINModal();
        });

        document.getElementById('pin-confirm')?.addEventListener('click', () => {
            this.confirmPIN();
        });
    }

    /**
     * Show PIN setup modal
     */
    showPINSetup() {
        const modal = document.getElementById('pin-modal');
        const input = document.getElementById('pin-input');
        if (modal && input) {
            modal.hidden = false;
            input.value = '';
            input.focus();
            this.pinAction = 'setup';
        }
    }

    /**
     * Show PIN verification
     */
    showPINVerification(callback) {
        const modal = document.getElementById('pin-modal');
        const input = document.getElementById('pin-input');
        if (modal && input) {
            modal.hidden = false;
            input.value = '';
            input.focus();
            this.pinAction = 'verify';
            this.pinCallback = callback;
        }
    }

    /**
     * Hide PIN modal
     */
    hidePINModal() {
        const modal = document.getElementById('pin-modal');
        if (modal) modal.hidden = true;
        this.pinAction = null;
        this.pinCallback = null;
    }

    /**
     * Confirm PIN action
     */
    confirmPIN() {
        const input = document.getElementById('pin-input');
        const pin = input?.value;

        if (this.pinAction === 'setup') {
            if (this.settings.setParentPIN(pin)) {
                this.hidePINModal();
                alert('Code PIN enregistré !');
            } else {
                alert('Le code PIN doit contenir 4 chiffres.');
            }
        } else if (this.pinAction === 'verify') {
            if (this.settings.verifyParentPIN(pin)) {
                this.hidePINModal();
                if (this.pinCallback) this.pinCallback();
            } else {
                alert('Code PIN incorrect.');
                input.value = '';
                input.focus();
            }
        }
    }

    /**
     * Reset all data
     */
    resetAllData() {
        localStorage.clear();
        this.settings.reset();
        alert('Données supprimées. L\'application va redémarrer.');
        window.location.reload();
    }
}
