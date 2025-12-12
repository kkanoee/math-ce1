/**
 * MathCE1 - Avatar Shop Page
 * Shop for purchasing avatar items
 * @module pages/avatar-shop
 */

import { AVATAR_CATEGORIES } from '../data/avatar-items.js';
import { getAvatarManager } from '../services/avatar-manager.js';
import { Avatar } from '../components/avatar.js';

/**
 * Avatar shop page component
 */
export class AvatarShopPage {
    constructor() {
        this.app = window.MathCE1;
        this.avatarManager = getAvatarManager();
        this.currentChild = null;
        this.selectedCategory = 'base';
        this.avatarPreview = null;
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

        const stars = this.currentChild.stars || 0;

        return `
      <div class="avatar-shop-page slide-up">
        <!-- Header with stars -->
        <header class="shop-header">
          <h1 class="shop-title">Boutique Avatar</h1>
          <div class="shop-stars">
            <span class="star-icon">⭐</span>
            <span class="star-count" id="shop-star-count">${stars}</span>
          </div>
        </header>

        <!-- Avatar Preview -->
        <section class="avatar-preview-section">
          <div id="avatar-preview-container"></div>
          <p class="preview-label">Ton avatar</p>
        </section>

        <!-- Category Tabs -->
        <nav class="category-tabs">
          ${AVATAR_CATEGORIES.map(cat => `
            <button
              class="category-tab ${cat.id === this.selectedCategory ? 'active' : ''}"
              data-category="${cat.id}"
            >
              <span class="tab-icon">${cat.icon}</span>
              <span class="tab-name">${cat.name}</span>
            </button>
          `).join('')}
        </nav>

        <!-- Items Grid -->
        <section class="items-section">
          <div class="items-grid" id="items-grid">
            ${this.renderItems()}
          </div>
        </section>
      </div>
    `;
    }

    /**
     * Render items for current category
     */
    renderItems() {
        const shopItems = this.avatarManager.getShopItems(this.currentChild.id);
        const items = shopItems[this.selectedCategory] || [];
        const equipped = this.avatarManager.getAvatarConfig(this.currentChild.id);
        const equipKey = this.avatarManager.categoryToEquipKey(this.selectedCategory);
        const currentEquipped = equipped[equipKey];

        return items.map(item => {
            const isEquipped = currentEquipped === item.id;

            return `
        <button
          class="shop-item ${item.owned ? 'owned' : ''} ${isEquipped ? 'equipped' : ''}"
          data-item-id="${item.id}"
          data-category="${this.selectedCategory}"
          data-cost="${item.cost}"
        >
          <div class="item-icon">${item.icon || '🎁'}</div>
          <div class="item-name">${item.name}</div>

          ${item.owned ? `
            <div class="item-status">
              ${isEquipped ? '✓ Équipé' : 'Possédé'}
            </div>
          ` : `
            <div class="item-price ${item.canAfford ? '' : 'expensive'}">
              <span class="price-star">⭐</span>
              <span class="price-value">${item.cost}</span>
            </div>
          `}
        </button>
      `;
        }).join('');
    }

    /**
     * Render no child state
     */
    renderNoChild() {
        return `
      <div class="avatar-shop-page">
        <div class="empty-state">
          <div class="empty-icon">👤</div>
          <h2>Pas de profil</h2>
          <button class="btn btn-primary" onclick="window.location.hash='home'">
            Retour à l'accueil
          </button>
        </div>
      </div>
    `;
    }

    /**
     * Initialize page after render
     */
    init() {
        this.setupAvatarPreview();
        this.setupEventListeners();
    }

    /**
     * Setup avatar preview
     */
    setupAvatarPreview() {
        const container = document.getElementById('avatar-preview-container');
        if (!container) return;

        this.avatarPreview = new Avatar(container, {
            size: 'xlarge',
            animated: true,
        });

        const config = this.avatarManager.getAvatarConfig(this.currentChild.id);
        this.avatarPreview.setAvatar(config, this.currentChild.name);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Category tabs
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.selectedCategory = tab.dataset.category;
                this.updateCategoryTabs();
                this.updateItemsGrid();
            });
        });

        // Item clicks (delegation)
        const itemsGrid = document.getElementById('items-grid');
        if (itemsGrid) {
            itemsGrid.addEventListener('click', (e) => {
                const item = e.target.closest('.shop-item');
                if (item) {
                    this.handleItemClick(item);
                }
            });
        }
    }

    /**
     * Update category tab states
     */
    updateCategoryTabs() {
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === this.selectedCategory);
        });
    }

    /**
     * Update items grid
     */
    updateItemsGrid() {
        const grid = document.getElementById('items-grid');
        if (grid) {
            grid.innerHTML = this.renderItems();
        }
    }

    /**
     * Handle item click
     */
    handleItemClick(itemElement) {
        const itemId = itemElement.dataset.itemId;
        const category = itemElement.dataset.category;
        const isOwned = itemElement.classList.contains('owned');

        if (isOwned) {
            // Equip item
            this.equipItem(category, itemId);
        } else {
            // Try to purchase
            this.purchaseItem(category, itemId);
        }
    }

    /**
     * Purchase an item
     */
    purchaseItem(category, itemId) {
        const result = this.avatarManager.purchaseItem(this.currentChild.id, category, itemId);

        if (result.success) {
            // Update stars display
            this.updateStarsDisplay(result.newStars);

            // Auto-equip
            this.equipItem(category, itemId);

            // Show success feedback
            this.showPurchaseFeedback(result.item);

            // Play sound
            this.app.audio?.playSuccess();
        } else {
            // Show error
            this.showError(result.message);
            this.app.audio?.playClick();
        }

        // Refresh items
        this.updateItemsGrid();
    }

    /**
     * Equip an item
     */
    equipItem(category, itemId) {
        const result = this.avatarManager.equipItem(this.currentChild.id, category, itemId);

        if (result.success) {
            // Update preview
            if (this.avatarPreview) {
                this.avatarPreview.setAvatar(result.equipped, this.currentChild.name);
                this.avatarPreview.animate();
            }

            // Refresh items to update equipped status
            this.updateItemsGrid();

            // Play sound
            this.app.audio?.playClick();
        }
    }

    /**
     * Update stars display
     */
    updateStarsDisplay(newStars) {
        const starCount = document.getElementById('shop-star-count');
        if (starCount) {
            starCount.textContent = newStars;
            starCount.classList.add('updated');
            setTimeout(() => starCount.classList.remove('updated'), 500);
        }

        // Update global state
        this.currentChild.stars = newStars;
    }

    /**
     * Show purchase feedback
     */
    showPurchaseFeedback(item) {
        // Could show a toast or animation
        console.log(`Purchased: ${item.name}`);
    }

    /**
     * Show error message
     */
    showError(message) {
        // Could show a toast
        console.warn(message);
    }

    /**
     * Cleanup
     */
    destroy() {
        // Nothing to cleanup
    }
}

// Add shop styles
const shopStyles = `
  .avatar-shop-page {
    max-width: 600px;
    margin: 0 auto;
    padding-bottom: var(--space-12);
  }

  .shop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
  }

  .shop-title {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-extra);
    color: var(--text-primary);
  }

  .shop-stars {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: var(--color-secondary-light);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
  }

  .shop-stars .star-icon {
    font-size: var(--font-size-lg);
  }

  .shop-stars .star-count {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-extra);
    color: var(--color-secondary-dark);
  }

  .shop-stars .star-count.updated {
    animation: pulse 0.3s ease;
  }

  .avatar-preview-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: var(--space-6);
  }

  .preview-label {
    margin-top: var(--space-2);
    color: var(--text-secondary);
  }

  .category-tabs {
    display: flex;
    gap: var(--space-2);
    overflow-x: auto;
    padding-bottom: var(--space-2);
    margin-bottom: var(--space-4);
    -webkit-overflow-scrolling: touch;
  }

  .category-tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-2) var(--space-3);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    background: var(--bg-secondary);
    cursor: pointer;
    transition: all var(--duration-fast);
    min-width: 70px;
    flex-shrink: 0;
  }

  .category-tab:hover {
    background: var(--bg-accent);
  }

  .category-tab.active {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }

  .tab-icon {
    font-size: var(--font-size-xl);
  }

  .tab-name {
    font-size: var(--font-size-xs);
    margin-top: var(--space-1);
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: var(--space-3);
  }

  .shop-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-3);
    background: var(--bg-secondary);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--duration-fast);
  }

  .shop-item:hover {
    transform: scale(1.05);
    border-color: var(--color-primary);
  }

  .shop-item.owned {
    background: rgba(126, 211, 33, 0.1);
    border-color: var(--color-success);
  }

  .shop-item.equipped {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }

  .item-icon {
    font-size: 32px;
    margin-bottom: var(--space-2);
  }

  .item-name {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    text-align: center;
  }

  .item-status {
    font-size: var(--font-size-xs);
    color: var(--color-success);
    margin-top: var(--space-1);
  }

  .item-price {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    margin-top: var(--space-1);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    color: var(--color-secondary-dark);
  }

  .item-price.expensive {
    color: var(--color-error);
    opacity: 0.6;
  }

  .price-star {
    font-size: var(--font-size-xs);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = shopStyles;
    document.head.appendChild(styleSheet);
}
