/**
 * MathCE1 - Domain Select Page
 * Domain selection with exercise type choice
 * @module pages/domain-select
 */

import { CONFIG } from '../data/config.js';
import { getProgressionService } from '../services/progression.js';

/**
 * Domain select page component
 */
export class DomainSelectPage {
    /**
     * @param {string[]} params - Route params [domain]
     */
    constructor(params = []) {
        this.app = window.MathCE1;
        this.domain = params[0];
        this.domainConfig = CONFIG.DOMAINS[this.domain?.toUpperCase()] || null;
        this.progressionService = getProgressionService();
    }

    /**
     * Render the page
     * @returns {string} HTML content
     */
    render() {
        if (!this.domainConfig) {
            return this.renderDomainList();
        }

        return this.renderDomainDetail();
    }

    /**
     * Render domain list (if no specific domain selected)
     */
    renderDomainList() {
        const currentChild = this.app?.state?.get('currentChild');
        const domains = Object.values(CONFIG.DOMAINS);

        return `
      <div class="domain-select-page slide-up">
        <h1 class="page-title">Choisis un domaine</h1>

        <div class="domains-large-grid">
          ${domains.map(domain => {
            const stats = currentChild
                ? this.progressionService.getDomainStats(currentChild.id, domain.id)
                : null;

            return `
              <button
                class="domain-large-card"
                data-domain="${domain.id}"
                style="--domain-color: ${domain.color}"
              >
                <div class="domain-large-icon">${domain.icon}</div>
                <div class="domain-large-name">${domain.name}</div>
                <div class="domain-large-description">${domain.description}</div>
                ${stats ? `
                  <div class="domain-level-badge">
                    Niveau ${stats.level}
                  </div>
                ` : ''}
              </button>
            `;
        }).join('')}
        </div>
      </div>
    `;
    }

    /**
     * Render domain detail with exercise options
     */
    renderDomainDetail() {
        const currentChild = this.app?.state?.get('currentChild');
        const stats = currentChild
            ? this.progressionService.getDomainStats(currentChild.id, this.domainConfig.id)
            : null;

        return `
      <div class="domain-select-page slide-up">
        <!-- Domain Header -->
        <div class="domain-detail-header" style="--domain-color: ${this.domainConfig.color}">
          <div class="domain-detail-icon">${this.domainConfig.icon}</div>
          <div class="domain-detail-info">
            <h1 class="domain-detail-name">${this.domainConfig.name}</h1>
            <p class="domain-detail-description">${this.domainConfig.description}</p>
          </div>
        </div>

        <!-- Progress Card -->
        ${stats ? `
          <div class="domain-progress-summary card">
            <div class="progress-stat">
              <span class="progress-stat-value">${stats.level}</span>
              <span class="progress-stat-label">Niveau</span>
            </div>
            <div class="progress-stat">
              <span class="progress-stat-value">${stats.totalExercises}</span>
              <span class="progress-stat-label">Exercices</span>
            </div>
            <div class="progress-stat">
              <span class="progress-stat-value">${stats.successRate}%</span>
              <span class="progress-stat-label">Réussite</span>
            </div>
          </div>
        ` : ''}

        <!-- Session Options -->
        <section class="session-options">
          <h2 class="section-title">Choisir une session</h2>

          <div class="session-cards">
            <button class="session-card" data-exercises="5" data-phase="abstract">
              <div class="session-icon">⚡</div>
              <div class="session-name">Session rapide</div>
              <div class="session-description">5 exercices</div>
            </button>

            <button class="session-card recommended" data-exercises="10" data-phase="abstract">
              <div class="session-badge">Recommandé</div>
              <div class="session-icon">📚</div>
              <div class="session-name">Session normale</div>
              <div class="session-description">10 exercices</div>
            </button>

            <button class="session-card" data-exercises="5" data-phase="concrete">
              <div class="session-icon">🧱</div>
              <div class="session-name">Avec manipulables</div>
              <div class="session-description">Phase concrète</div>
            </button>
          </div>
        </section>

        <!-- CPA Phase Selection -->
        <section class="cpa-selection">
          <h2 class="section-title">Ou choisir une phase</h2>

          <div class="cpa-buttons">
            <button class="cpa-button concrete" data-phase="concrete" data-exercises="5">
              <span class="cpa-icon">🧱</span>
              <span class="cpa-name">Concret</span>
              <span class="cpa-desc">Manipuler</span>
            </button>
            <button class="cpa-button pictorial" data-phase="pictorial" data-exercises="5">
              <span class="cpa-icon">🖼️</span>
              <span class="cpa-name">Pictural</span>
              <span class="cpa-desc">Visualiser</span>
            </button>
            <button class="cpa-button abstract" data-phase="abstract" data-exercises="5">
              <span class="cpa-icon">🔢</span>
              <span class="cpa-name">Abstrait</span>
              <span class="cpa-desc">Calculer</span>
            </button>
          </div>
        </section>
      </div>
    `;
    }

    /**
     * Initialize page after render
     */
    init() {
        this.setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Domain cards (from list view)
        document.querySelectorAll('.domain-large-card').forEach(card => {
            card.addEventListener('click', () => {
                const domain = card.dataset.domain;
                this.app.router.navigate('domain-select', { domain });
            });
        });

        // Session cards
        document.querySelectorAll('.session-card').forEach(card => {
            card.addEventListener('click', () => {
                const exercises = card.dataset.exercises;
                const phase = card.dataset.phase;
                this.startSession(exercises, phase);
            });
        });

        // CPA buttons
        document.querySelectorAll('.cpa-button').forEach(btn => {
            btn.addEventListener('click', () => {
                const exercises = btn.dataset.exercises;
                const phase = btn.dataset.phase;
                this.startSession(exercises, phase);
            });
        });
    }

    /**
     * Start exercise session
     */
    startSession(exercises, phase) {
        // Store session config in state
        this.app.state.set('sessionConfig', {
            domain: this.domainConfig?.id || this.domain,
            exercises: parseInt(exercises, 10),
            phase,
        });

        // Navigate to exercise
        this.app.router.navigate('exercise', {
            domain: this.domainConfig?.id || this.domain,
        });
    }

    /**
     * Cleanup
     */
    destroy() {
        // Nothing to cleanup
    }
}

// Add domain select styles
const domainSelectStyles = `
  .domain-select-page {
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: var(--space-12);
  }

  .page-title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-extra);
    text-align: center;
    margin-bottom: var(--space-8);
    color: var(--text-primary);
  }

  .domains-large-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-4);
  }

  .domain-large-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-6);
    background: var(--bg-secondary);
    border: 3px solid transparent;
    border-radius: var(--radius-xl);
    cursor: pointer;
    transition: all var(--duration-fast);
    position: relative;
  }

  .domain-large-card:hover {
    border-color: var(--domain-color);
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .domain-large-icon {
    font-size: 48px;
    margin-bottom: var(--space-3);
  }

  .domain-large-name {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin-bottom: var(--space-2);
  }

  .domain-large-description {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    text-align: center;
  }

  .domain-level-badge {
    position: absolute;
    top: var(--space-3);
    right: var(--space-3);
    background: var(--domain-color);
    color: var(--text-inverse);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-full);
  }

  /* Domain Detail */
  .domain-detail-header {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-6);
    background: linear-gradient(135deg, var(--domain-color), color-mix(in srgb, var(--domain-color) 80%, black));
    border-radius: var(--radius-xl);
    color: var(--text-inverse);
    margin-bottom: var(--space-6);
  }

  .domain-detail-icon {
    font-size: 64px;
  }

  .domain-detail-name {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-extra);
    margin-bottom: var(--space-1);
  }

  .domain-detail-description {
    opacity: 0.9;
  }

  .domain-progress-summary {
    display: flex;
    justify-content: space-around;
    padding: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .progress-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .progress-stat-value {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-extra);
    color: var(--color-primary);
  }

  .progress-stat-label {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .section-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-4);
  }

  .session-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-3);
    margin-bottom: var(--space-8);
  }

  .session-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-4);
    background: var(--bg-secondary);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--duration-fast);
    position: relative;
  }

  .session-card:hover {
    border-color: var(--color-primary);
    transform: scale(1.02);
  }

  .session-card.recommended {
    border-color: var(--color-success);
    background: rgba(126, 211, 33, 0.1);
  }

  .session-badge {
    position: absolute;
    top: -10px;
    background: var(--color-success);
    color: var(--text-inverse);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-full);
  }

  .session-icon {
    font-size: 32px;
    margin-bottom: var(--space-2);
  }

  .session-name {
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-1);
  }

  .session-description {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .cpa-buttons {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .cpa-button {
    flex: 1;
    min-width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-4);
    border: 2px solid;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--duration-fast);
    background: var(--bg-secondary);
  }

  .cpa-button.concrete {
    border-color: var(--color-concrete);
  }

  .cpa-button.pictorial {
    border-color: var(--color-pictorial);
  }

  .cpa-button.abstract {
    border-color: var(--color-abstract);
  }

  .cpa-button:hover {
    transform: scale(1.05);
  }

  .cpa-button.concrete:hover {
    background: rgba(46, 204, 113, 0.1);
  }

  .cpa-button.pictorial:hover {
    background: rgba(241, 196, 15, 0.1);
  }

  .cpa-button.abstract:hover {
    background: rgba(155, 89, 182, 0.1);
  }

  .cpa-icon {
    font-size: 28px;
    margin-bottom: var(--space-2);
  }

  .cpa-name {
    font-weight: var(--font-weight-bold);
  }

  .cpa-desc {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = domainSelectStyles;
    document.head.appendChild(styleSheet);
}
