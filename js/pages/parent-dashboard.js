/**
 * MathCE1 - Parent Dashboard Page
 * Detailed view for parents with stats and history
 * @module pages/parent-dashboard
 */

import { CONFIG } from '../data/config.js';
import { getProgressionService } from '../services/progression.js';
import { getSessionService } from '../services/session.js';
import { getBadgeService } from '../services/badge-service.js';

/**
 * Parent dashboard page component
 */
export class ParentDashboardPage {
    constructor() {
        this.app = window.MathCE1;
        this.progressionService = getProgressionService();
        this.sessionService = getSessionService();
        this.badgeService = getBadgeService();
        this.currentChild = null;
        this.selectedPeriod = 'week';
    }

    /**
     * Render the page
     * @returns {string} HTML content
     */
    render() {
        this.currentChild = this.app?.state?.get('currentChild');

        if (!this.currentChild) {
            return this.renderNoChild();
        }

        const stats = this.progressionService.getOverallStats(this.currentChild.id);
        const sessions = this.sessionService.getSessionHistory(this.currentChild.id);
        const recentSessions = sessions.slice(-10).reverse();

        return `
      <div class="parent-dashboard slide-up">
        <!-- Header -->
        <header class="dashboard-header">
          <div class="dashboard-title-section">
            <h1 class="dashboard-title">Tableau de bord</h1>
            <p class="dashboard-subtitle">Suivi de ${this.currentChild.name}</p>
          </div>
          <button class="btn btn-secondary" id="back-to-child">
            Mode enfant
          </button>
        </header>

        <!-- Period Selector -->
        <nav class="period-selector">
          <button class="period-btn ${this.selectedPeriod === 'week' ? 'active' : ''}" data-period="week">
            Cette semaine
          </button>
          <button class="period-btn ${this.selectedPeriod === 'month' ? 'active' : ''}" data-period="month">
            Ce mois
          </button>
          <button class="period-btn ${this.selectedPeriod === 'all' ? 'active' : ''}" data-period="all">
            Tout
          </button>
        </nav>

        <!-- Summary Cards -->
        <section class="summary-cards">
          <div class="summary-card">
            <div class="summary-icon">📊</div>
            <div class="summary-value">${stats.totalExercises}</div>
            <div class="summary-label">Exercices réalisés</div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">✅</div>
            <div class="summary-value">${stats.successRate}%</div>
            <div class="summary-label">Taux de réussite</div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">⭐</div>
            <div class="summary-value">${this.currentChild.stars || 0}</div>
            <div class="summary-label">Étoiles gagnées</div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">🏆</div>
            <div class="summary-value">${this.badgeService.getBadgeCounts(this.currentChild.id).earned}</div>
            <div class="summary-label">Badges obtenus</div>
          </div>
        </section>

        <!-- Domain Progress -->
        <section class="domain-details card">
          <h2 class="section-title">Détail par domaine</h2>
          <div class="domain-table">
            ${this.renderDomainTable()}
          </div>
        </section>

        <!-- Recent Sessions -->
        <section class="sessions-section card">
          <h2 class="section-title">Sessions récentes</h2>
          ${recentSessions.length > 0 ? `
            <div class="sessions-list">
              ${recentSessions.map(session => this.renderSessionRow(session)).join('')}
            </div>
          ` : `
            <p class="empty-text">Aucune session pour le moment</p>
          `}
        </section>

        <!-- Recommendations -->
        <section class="recommendations card">
          <h2 class="section-title">💡 Recommandations</h2>
          <div class="recommendations-list">
            ${this.renderRecommendations(stats)}
          </div>
        </section>

        <!-- Settings -->
        <section class="settings-section">
          <h2 class="section-title">⚙️ Paramètres</h2>
          <div class="settings-grid">
            <div class="setting-item">
              <label class="setting-label">Durée max. session</label>
              <select class="setting-select" id="session-duration">
                <option value="10">10 minutes</option>
                <option value="15" selected>15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>
            <div class="setting-item">
              <label class="setting-label">Sons activés</label>
              <input type="checkbox" id="sounds-enabled" checked>
            </div>
            <div class="setting-item">
              <label class="setting-label">Instructions vocales</label>
              <input type="checkbox" id="voice-enabled" checked>
            </div>
          </div>
        </section>
      </div>
    `;
    }

    /**
     * Render domain progress table
     */
    renderDomainTable() {
        const domains = Object.values(CONFIG.DOMAINS);

        return `
      <table class="data-table">
        <thead>
          <tr>
            <th>Domaine</th>
            <th>Niveau</th>
            <th>Exercices</th>
            <th>Réussite</th>
            <th>Phase CPA</th>
          </tr>
        </thead>
        <tbody>
          ${domains.map(domain => {
            const stats = this.progressionService.getDomainStats(this.currentChild.id, domain.id);
            const phaseLabel = {
                'concrete': 'Concret',
                'pictorial': 'Pictural',
                'abstract': 'Abstrait',
            };

            return `
              <tr>
                <td>
                  <span class="domain-cell">
                    <span class="domain-icon">${domain.icon}</span>
                    <span>${domain.name}</span>
                  </span>
                </td>
                <td>
                  <span class="level-badge">Niv. ${stats?.level || 1}</span>
                </td>
                <td>${stats?.totalExercises || 0}</td>
                <td>
                  <span class="rate-badge ${this.getRateClass(stats?.successRate || 0)}">
                    ${stats?.successRate || 0}%
                  </span>
                </td>
                <td>${phaseLabel[stats?.currentPhase] || 'Concret'}</td>
              </tr>
            `;
        }).join('')}
        </tbody>
      </table>
    `;
    }

    /**
     * Get rate color class
     */
    getRateClass(rate) {
        if (rate >= 80) return 'high';
        if (rate >= 50) return 'medium';
        return 'low';
    }

    /**
     * Render session row
     */
    renderSessionRow(session) {
        const date = new Date(session.startedAt);
        const domainConfig = CONFIG.DOMAINS[session.domain?.toUpperCase()];
        const duration = Math.round((session.duration || 0) / 60);

        return `
      <div class="session-row">
        <div class="session-date">
          <span class="date-day">${date.toLocaleDateString('fr-FR', { weekday: 'short' })}</span>
          <span class="date-full">${date.toLocaleDateString('fr-FR')}</span>
        </div>
        <div class="session-domain">
          <span class="domain-icon">${domainConfig?.icon || '📚'}</span>
          <span>${domainConfig?.name || session.domain}</span>
        </div>
        <div class="session-stats">
          <span class="stat">${session.totalExercises} ex.</span>
          <span class="stat">${Math.round((session.correctAnswers / session.totalExercises) * 100) || 0}%</span>
          <span class="stat">${duration} min</span>
        </div>
        <div class="session-stars">
          ⭐ +${session.starsEarned || 0}
        </div>
      </div>
    `;
    }

    /**
     * Render recommendations
     */
    renderRecommendations(stats) {
        const recommendations = [];

        // Check for weak domains
        Object.values(CONFIG.DOMAINS).forEach(domain => {
            const domainStats = this.progressionService.getDomainStats(this.currentChild.id, domain.id);

            if (domainStats) {
                if (domainStats.totalExercises < 5) {
                    recommendations.push({
                        icon: '🎯',
                        text: `Découvrir le domaine "${domain.name}" avec quelques exercices.`,
                        priority: 'medium',
                    });
                } else if (domainStats.successRate < 60) {
                    recommendations.push({
                        icon: '💪',
                        text: `Renforcer "${domain.name}" avec des exercices de niveau ${domainStats.level}.`,
                        priority: 'high',
                    });
                }
            }
        });

        // General recommendations based on activity
        if (stats.totalExercises < 20) {
            recommendations.push({
                icon: '📅',
                text: 'Faire des sessions régulières de 10-15 minutes par jour.',
                priority: 'low',
            });
        }

        if (stats.bestStreak < 5) {
            recommendations.push({
                icon: '🔥',
                text: 'Encourager des séries de bonnes réponses pour débloquer des badges.',
                priority: 'low',
            });
        }

        if (recommendations.length === 0) {
            recommendations.push({
                icon: '🌟',
                text: 'Excellent travail ! Continuez sur cette lancée !',
                priority: 'success',
            });
        }

        return recommendations.map(rec => `
      <div class="recommendation ${rec.priority}">
        <span class="rec-icon">${rec.icon}</span>
        <span class="rec-text">${rec.text}</span>
      </div>
    `).join('');
    }

    /**
     * Render no child state
     */
    renderNoChild() {
        return `
      <div class="parent-dashboard">
        <div class="empty-state">
          <div class="empty-icon">👤</div>
          <h2>Aucun profil enfant</h2>
          <p>Créez d'abord un profil pour voir les statistiques.</p>
          <button class="btn btn-primary" onclick="window.location.hash='home'">
            Créer un profil
          </button>
        </div>
      </div>
    `;
    }

    /**
     * Initialize page after render
     */
    init() {
        this.setupEventListeners();
        this.loadSettings();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Back button
        document.getElementById('back-to-child')?.addEventListener('click', () => {
            this.app.router.navigate('home');
        });

        // Period selector
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedPeriod = btn.dataset.period;
                this.updatePeriodButtons();
                // Could filter data here
            });
        });

        // Settings
        document.getElementById('sounds-enabled')?.addEventListener('change', (e) => {
            this.app.audio?.setEnabled(e.target.checked);
            this.saveSetting('soundEnabled', e.target.checked);
        });
    }

    /**
     * Update period button states
     */
    updatePeriodButtons() {
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === this.selectedPeriod);
        });
    }

    /**
     * Load settings
     */
    loadSettings() {
        const settings = this.app.state?.get('settings') || {};

        const soundsCheckbox = document.getElementById('sounds-enabled');
        if (soundsCheckbox) {
            soundsCheckbox.checked = settings.soundEnabled !== false;
        }
    }

    /**
     * Save setting
     */
    saveSetting(key, value) {
        const settings = this.app.state?.get('settings') || {};
        settings[key] = value;
        this.app.state?.set('settings', settings);
        this.app.storage?.set('settings', settings);
    }

    /**
     * Cleanup
     */
    destroy() {
        // Nothing to cleanup
    }
}

// Add dashboard styles
const dashboardStyles = `
  .parent-dashboard {
    max-width: 900px;
    margin: 0 auto;
    padding-bottom: var(--space-12);
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
  }

  .dashboard-title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-extra);
    color: var(--text-primary);
  }

  .dashboard-subtitle {
    color: var(--text-secondary);
    margin-top: var(--space-1);
  }

  .period-selector {
    display: flex;
    gap: var(--space-2);
    margin-bottom: var(--space-6);
    background: var(--bg-secondary);
    padding: var(--space-1);
    border-radius: var(--radius-full);
  }

  .period-btn {
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all var(--duration-fast);
  }

  .period-btn:hover {
    background: var(--bg-accent);
  }

  .period-btn.active {
    background: var(--color-primary);
    color: var(--text-inverse);
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .summary-card {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    text-align: center;
  }

  .summary-icon {
    font-size: 28px;
    margin-bottom: var(--space-2);
  }

  .summary-value {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-extra);
    color: var(--color-primary);
  }

  .summary-label {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin-top: var(--space-1);
  }

  .section-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--space-4);
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--font-size-sm);
  }

  .data-table th,
  .data-table td {
    padding: var(--space-3);
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }

  .data-table th {
    font-weight: var(--font-weight-medium);
    color: var(--text-secondary);
  }

  .domain-cell {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .level-badge {
    background: var(--color-primary-light);
    color: var(--color-primary-dark);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    font-weight: var(--font-weight-bold);
  }

  .rate-badge {
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    font-weight: var(--font-weight-bold);
  }

  .rate-badge.high {
    background: rgba(126, 211, 33, 0.2);
    color: #5BA318;
  }

  .rate-badge.medium {
    background: rgba(241, 196, 15, 0.2);
    color: #B7950B;
  }

  .rate-badge.low {
    background: rgba(231, 76, 60, 0.2);
    color: #C0392B;
  }

  .sessions-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .session-row {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-3);
    background: var(--bg-accent);
    border-radius: var(--radius-md);
  }

  .session-date {
    min-width: 80px;
  }

  .date-day {
    display: block;
    font-weight: var(--font-weight-bold);
    text-transform: capitalize;
  }

  .date-full {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }

  .session-domain {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    min-width: 120px;
  }

  .session-stats {
    display: flex;
    gap: var(--space-4);
    flex: 1;
  }

  .session-stats .stat {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .session-stars {
    font-weight: var(--font-weight-bold);
    color: var(--color-secondary-dark);
  }

  .recommendations-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .recommendation {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    background: var(--bg-accent);
  }

  .recommendation.high {
    border-left: 3px solid var(--color-error);
  }

  .recommendation.medium {
    border-left: 3px solid var(--color-secondary);
  }

  .recommendation.success {
    border-left: 3px solid var(--color-success);
    background: rgba(126, 211, 33, 0.1);
  }

  .rec-icon {
    font-size: var(--font-size-lg);
  }

  .rec-text {
    flex: 1;
    line-height: 1.4;
  }

  .settings-section {
    margin-top: var(--space-6);
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-4);
  }

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3);
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
  }

  .setting-label {
    font-weight: var(--font-weight-medium);
  }

  .setting-select {
    padding: var(--space-2);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
  }

  .empty-text {
    text-align: center;
    color: var(--text-muted);
    padding: var(--space-6);
  }

  @media (max-width: 640px) {
    .session-row {
      flex-wrap: wrap;
    }

    .session-stats {
      width: 100%;
      justify-content: space-between;
    }

    .data-table {
      font-size: var(--font-size-xs);
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = dashboardStyles;
    document.head.appendChild(styleSheet);
}
