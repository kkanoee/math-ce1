/**
 * MathCE1 - Home Page
 * Welcome screen with child selection and domain choice
 * @module pages/home
 */

import { CONFIG } from '../data/config.js';
import { Avatar } from '../components/avatar.js';
import { getAvatarManager } from '../services/avatar-manager.js';

/**
 * Home page component
 */
export class HomePage {
  constructor(params) {
    this.app = window.MathCE1;
    this.avatar = null;
    this.params = params || []; // params from router
  }

  // ... render ...

  /**
   * Initialize page after render
   */
  init() {
    this.setupEventListeners();
    this.loadBadgeCount();

    // Check for welcome param
    if (this.params.includes('welcome')) {
      const currentChild = this.app?.state?.get('currentChild');
      if (currentChild) {
        this.showMascotMessage(`Bienvenue ${currentChild.name} ! 🎉`);
        // Also play a success sound
        this.app.audio?.playSuccess();
      }
    } else {
      this.showMascot();
    }

    this.initAvatar();
  }

  /**
   * Initialize avatar display
   */
  initAvatar() {
    const container = document.getElementById('home-avatar-container');
    const currentChild = this.app?.state?.get('currentChild');

    if (container && currentChild) {
      try {
        const avatarManager = getAvatarManager();
        const avatarConfig = avatarManager.getAvatarConfig(currentChild.id);

        this.avatar = new Avatar(container, {
          size: 'xlarge',
          animated: true,
          editable: true,
          onEdit: () => this.app.router.navigate('avatar-shop'),
        });

        this.avatar.setAvatar(avatarConfig, '');
      } catch (e) {
        // Keep default mascot
        console.log('Avatar not loaded, using default mascot');
      }
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Start button (new profile)
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.handleCreateProfile());
    }

    // Name input (enter key)
    const nameInput = document.getElementById('child-name-input');
    if (nameInput) {
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleCreateProfile();
        }
      });
      // Focus the input
      nameInput.focus();
    }

    // Domain cards
    document.querySelectorAll('.domain-card').forEach(card => {
      card.addEventListener('click', () => {
        const domain = card.dataset.domain;
        this.handleDomainSelect(domain);
      });
    });

    // Progress link
    const progressLink = document.getElementById('progress-link');
    if (progressLink) {
      progressLink.addEventListener('click', () => {
        this.app.router.navigate('progress');
      });
    }

    // Avatar shop link
    const avatarShopLink = document.getElementById('avatar-shop-link');
    if (avatarShopLink) {
      avatarShopLink.addEventListener('click', () => {
        this.app.router.navigate('avatar-shop');
      });
    }
  }

  /**
   * Handle profile creation
   */
  handleCreateProfile() {
    const nameInput = document.getElementById('child-name-input');
    const name = nameInput?.value?.trim();

    if (!name || name.length < 1) {
      nameInput?.classList.add('shake');
      setTimeout(() => nameInput?.classList.remove('shake'), 500);
      return;
    }

    // Create child profile
    const child = {
      id: this.generateId(),
      name: name,
      avatar: { base: 'fox', accessories: [] },
      stars: 0,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    // Save to storage
    const children = this.app.storage.get('children') || [];
    children.push(child);
    this.app.storage.set('children', children);
    this.app.storage.set('activeChildId', child.id);

    // Update state
    this.app.state.set('currentChild', child);

    // Re-render
    this.app.router.render();

    // Show welcome message
    this.showMascotMessage(`Bienvenue ${name} ! 🎉`);
  }

  /**
   * Handle domain selection
   */
  handleDomainSelect(domainId) {
    // Play click sound
    this.app.audio?.playClick();

    // Add selection animation
    const card = document.querySelector(`[data-domain="${domainId}"]`);
    card?.classList.add('selected');

    // Navigate to exercise after animation
    setTimeout(() => {
      this.app.router.navigate(`exercise/${domainId}`);
    }, 300);
  }

  /**
   * Load badge count from storage
   */
  loadBadgeCount() {
    const badgeCountEl = document.getElementById('badge-count');
    if (badgeCountEl) {
      const currentChild = this.app?.state?.get('currentChild');
      const badges = this.app.storage.get('badges') || {};
      const childBadges = badges[currentChild?.id] || [];
      badgeCountEl.textContent = childBadges.length;
    }
  }

  /**
   * Show mascot with welcome message
   */
  showMascot() {
    const messages = CONFIG.MASCOT_MESSAGES.WELCOME;
    const message = messages[Math.floor(Math.random() * messages.length)];

    setTimeout(() => {
      this.showMascotMessage(message);
    }, 500);
  }

  /**
   * Show mascot message
   */
  showMascotMessage(message) {
    // Could integrate with global mascot component
    console.log(`Mascot says: ${message}`);
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
