/**
 * MathCE1 - Progress Page
 * Dashboard showing child's progress
 * @module pages/progress
 */

import { CONFIG } from '../data/config.js';
import { getProgressionService } from '../services/progression.js';

/**
 * Progress page component
 */
export class ProgressPage {
    constructor() {
        this.app = window.MathCE1;
        this.progressionService = getProgressionService();
        this.currentChild = null;
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

        return `
      <div class="progress-page slide-up">
        <!-- Child Header -->
        <section class="progress-header card">
          <div class="child-info">
            <div class="child-avatar-large">🦊</div>
            <div class="child-details">
              <h1 class="child-name">${this.currentChild.name}</h1>
              <div class="child-stars">
                <span class="stars-icon">⭐</span>
                <span class="stars-count">${this.currentChild.stars || 0}</span>
                <span class="stars-label">étoiles</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Overall Stats -->
        <section class="stats-overview">
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-number">${stats.totalExercises}</div>
            <div class="stat-name">Exercices</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-number">${stats.successRate}%</div>
            <div class="stat-name">Réussite</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-number">${stats.bestStreak}</div>
            <div class="stat-name">Meilleure série</div>
          </div>
        </section>

        <!-- Domain Progress -->
        <section class="domain-progress">
          <h2 class="section-title">Progression par domaine</h2>
          <div class="domains-list">
            ${this.renderDomainCards()}
          </div>
        </section>

        <!-- Badges Section -->
        <section class="badges-section">
          <h2 class="section-title">Mes badges</h2>
          <div class="badges-grid" id="badges-grid">
            ${this.renderBadges()}
          </div>
        </section>

        <!-- Actions -->
        <section class="progress-actions">
          <button class="btn btn-primary btn-lg" id="continue-btn">
            Continuer à jouer 🚀
          </button>
        </section>
      </div>
    `;
    }

    /**
     * Render domain progress cards
     */
    renderDomainCards() {
        const domains = Object.values(CONFIG.DOMAINS);

        return domains.map(domain => {
            const stats = this.progressionService.getDomainStats(this.currentChild.id, domain.id);

            return `
        <div class="domain-progress-card" style="--domain-color: ${domain.color}">
          <div class="domain-header">
            <span class="domain-icon">${domain.icon}</span>
            <span class="domain-name">${domain.name}</span>
            <span class="domain-level">Niveau ${stats?.level || 1}</span>
          </div>
          <div class="domain-stats">
            <div class="domain-bar">
              <div class="domain-bar-fill" style="width: ${stats?.progressToNextLevel || 0}%"></div>
            </div>
            <span class="domain-exercises">${stats?.totalExercises || 0} exercices</span>
          </div>
          <div class="domain-cpa">
            <span class="cpa-tag ${stats?.currentPhase === 'concrete' ? 'active' : ''}">C</span>
            <span class="cpa-tag ${stats?.currentPhase === 'pictorial' ? 'active' : ''}">P</span>
            <span class="cpa-tag ${stats?.currentPhase === 'abstract' ? 'active' : ''}">A</span>
          </div>
        </div>
      `;
        }).join('');
    }

    /**
     * Render badges
     */
    renderBadges() {
        // Get earned badges
        const badges = this.app.storage.get('badges') || {};
        const childBadges = badges[this.currentChild.id] || [];

        // All possible badges
        const allBadges = [
            { id: 'first_exercise', icon: '🎯', name: 'Premier Pas', description: 'Premier exercice réussi' },
            { id: 'streak_5', icon: '🔥', name: 'En feu !', description: 'Série de 5 bonnes réponses' },
            { id: 'streak_10', icon: '💫', name: 'Inarrêtable', description: 'Série de 10 bonnes réponses' },
            { id: 'star_10', icon: '⭐', name: 'Collectionneur', description: '10 étoiles gagnées' },
            { id: 'star_50', icon: '🌟', name: 'Super Star', description: '50 étoiles gagnées' },
            { id: 'level_up', icon: '📈', name: 'Progression', description: 'Monter d\'un niveau' },
            { id: 'calcul_master', icon: '➕', name: 'As du Calcul', description: 'Maîtrise le calcul' },
            { id: 'numeration_master', icon: '🔢', name: 'Expert Nombres', description: 'Maîtrise la numération' },
        ];

        return allBadges.map(badge => {
            const earned = childBadges.includes(badge.id);

            return `
        <div class="badge-item ${earned ? 'earned' : 'locked'}">
          <div class="badge-icon">${earned ? badge.icon : '🔒'}</div>
          <div class="badge-name">${badge.name}</div>
          <div class="badge-description">${badge.description}</div>
        </div>
      `;
        }).join('');
    }

    /**
     * Render no child selected state
     */
    renderNoChild() {
        return `
      <div class="progress-page slide-up">
        <div class="empty-state">
          <div class="empty-icon">👤</div>
          <h2>Pas de profil sélectionné</h2>
          <p>Retourne à l'accueil pour créer un profil.</p>
          <button class="btn btn-primary" onclick="window.location.hash='home'">
            Accueil
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
        this.animateStats();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.app.router.navigate('home');
            });
        }
    }

    /**
     * Animate stats on page load
     */
    animateStats() {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'all 0.4s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Animate progress bars
        setTimeout(() => {
            const bars = document.querySelectorAll('.domain-bar-fill');
            bars.forEach(bar => {
                bar.style.transition = 'width 0.8s ease-out';
            });
        }, 300);
    }

    /**
     * Cleanup
     */
    destroy() {
        // Nothing to cleanup
    }
}

// Add progress page styles
const progressStyles = `
  .progress-page {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    max-width: 800px;
    margin: 0 auto;
    padding-bottom: var(--space-12);
  }

  .progress-header .child-info {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  .child-avatar-large {
    font-size: 64px;
  }

  .child-details {
    flex: 1;
  }

  .child-name {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-extra);
    color: var(--color-primary);
    margin-bottom: var(--space-2);
  }

  .child-stars {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .stars-icon {
    font-size: var(--font-size-xl);
  }

  .stars-count {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-extra);
    color: var(--color-secondary-dark);
  }

  .stars-label {
    color: var(--text-secondary);
  }

  .stats-overview {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }

  .stat-card {
    background: var(--bg-secondary);
    border-radius: var(--radius-xl);
    padding: var(--space-4);
    text-align: center;
    box-shadow: var(--shadow-sm);
  }

  .stat-icon {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-2);
  }

  .stat-number {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-extra);
    color: var(--color-primary);
  }

  .stat-name {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin-top: var(--space-1);
  }

  .section-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    margin-bottom: var(--space-4);
  }

  .domains-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .domain-progress-card {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    border-left: 4px solid var(--domain-color);
  }

  .domain-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }

  .domain-icon {
    font-size: var(--font-size-xl);
  }

  .domain-name {
    font-weight: var(--font-weight-bold);
    flex: 1;
  }

  .domain-level {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    background: var(--bg-accent);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-full);
  }

  .domain-stats {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
  }

  .domain-bar {
    flex: 1;
    height: 8px;
    background: var(--bg-accent);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .domain-bar-fill {
    height: 100%;
    background: var(--domain-color);
    border-radius: var(--radius-full);
  }

  .domain-exercises {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
    white-space: nowrap;
  }

  .domain-cpa {
    display: flex;
    gap: var(--space-2);
  }

  .cpa-tag {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    border-radius: var(--radius-sm);
    background: var(--bg-accent);
    color: var(--text-muted);
  }

  .cpa-tag.active {
    background: var(--domain-color);
    color: var(--text-inverse);
  }

  .badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--space-3);
  }

  .badge-item {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    text-align: center;
    transition: transform var(--duration-fast);
  }

  .badge-item.earned {
    background: linear-gradient(135deg, var(--color-secondary-light), var(--color-secondary));
  }

  .badge-item.locked {
    opacity: 0.5;
  }

  .badge-item:hover {
    transform: scale(1.02);
  }

  .badge-icon {
    font-size: 40px;
    margin-bottom: var(--space-2);
  }

  .badge-name {
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-1);
  }

  .badge-description {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }

  .badge-item.earned .badge-name,
  .badge-item.earned .badge-description {
    color: var(--text-inverse);
  }

  .progress-actions {
    text-align: center;
    padding: var(--space-4);
  }

  .empty-state {
    text-align: center;
    padding: var(--space-12);
  }

  .empty-icon {
    font-size: 64px;
    margin-bottom: var(--space-4);
  }

  @media (max-width: 480px) {
    .stats-overview {
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-2);
    }

    .stat-card {
      padding: var(--space-3);
    }

    .badges-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = progressStyles;
    document.head.appendChild(styleSheet);
}
