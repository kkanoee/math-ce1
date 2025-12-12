/**
 * MathCE1 - Avatar Component
 * Displays avatar with equipped items
 * @module components/avatar
 */

import { AVATAR_ITEMS, getAvatarItem, getDefaultAvatar } from '../data/avatar-items.js';

/**
 * Avatar display component
 */
export class Avatar {
    /**
     * Create avatar component
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Options
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            size: 'medium', // small, medium, large, xlarge
            editable: false,
            showName: false,
            animated: true,
            ...options,
        };

        this.avatar = getDefaultAvatar();
        this.childName = '';
    }

    /**
     * Set avatar configuration
     * @param {Object} avatarConfig - Avatar configuration
     * @param {string} name - Child name
     */
    setAvatar(avatarConfig, name = '') {
        this.avatar = { ...getDefaultAvatar(), ...avatarConfig };
        this.childName = name;
        this.render();
    }

    /**
     * Get size in pixels
     */
    getSizePixels() {
        switch (this.options.size) {
            case 'small': return 48;
            case 'medium': return 80;
            case 'large': return 120;
            case 'xlarge': return 160;
            default: return 80;
        }
    }

    /**
     * Render avatar
     */
    render() {
        const size = this.getSizePixels();
        const baseItem = getAvatarItem('base', this.avatar.base);
        const hatItem = this.avatar.hat ? getAvatarItem('hats', this.avatar.hat) : null;
        const accessoryItem = this.avatar.accessory ? getAvatarItem('accessories', this.avatar.accessory) : null;
        const bgItem = this.avatar.background ? getAvatarItem('backgrounds', this.avatar.background) : null;
        const frameItem = getAvatarItem('frames', this.avatar.frame);

        // Build background style
        let bgStyle = 'background: var(--bg-accent);';
        if (bgItem) {
            if (bgItem.gradient) {
                bgStyle = `background: ${bgItem.gradient};`;
            } else if (bgItem.color) {
                bgStyle = `background: ${bgItem.color};`;
            }
        }

        // Build frame class
        const frameClass = frameItem?.shape || 'circle';

        this.container.innerHTML = `
      <div
        class="avatar-wrapper avatar-${this.options.size} frame-${frameClass} ${this.options.animated ? 'animated' : ''}"
        style="width: ${size}px; height: ${size}px; ${bgStyle}"
      >
        <div class="avatar-base">${baseItem?.icon || '🦊'}</div>

        ${hatItem ? `
          <div class="avatar-hat">${hatItem.icon}</div>
        ` : ''}

        ${accessoryItem ? `
          <div class="avatar-accessory">${accessoryItem.icon}</div>
        ` : ''}

        ${this.options.editable ? `
          <button class="avatar-edit-btn" aria-label="Modifier avatar">✏️</button>
        ` : ''}
      </div>

      ${this.options.showName && this.childName ? `
        <div class="avatar-name">${this.childName}</div>
      ` : ''}
    `;

        // Bind edit button
        if (this.options.editable) {
            const editBtn = this.container.querySelector('.avatar-edit-btn');
            if (editBtn && this.options.onEdit) {
                editBtn.addEventListener('click', () => this.options.onEdit());
            }
        }
    }

    /**
     * Get current avatar config
     * @returns {Object}
     */
    getConfig() {
        return { ...this.avatar };
    }

    /**
     * Animate (bounce effect)
     */
    animate() {
        const wrapper = this.container.querySelector('.avatar-wrapper');
        if (wrapper) {
            wrapper.classList.add('bounce');
            setTimeout(() => wrapper.classList.remove('bounce'), 500);
        }
    }
}

// Add avatar styles
const avatarStyles = `
  .avatar-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .avatar-wrapper.frame-circle {
    border-radius: 50%;
  }

  .avatar-wrapper.frame-square {
    border-radius: var(--radius-lg);
  }

  .avatar-wrapper.frame-star {
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  }

  .avatar-wrapper.frame-heart {
    clip-path: polygon(50% 15%, 100% 0, 100% 60%, 50% 100%, 0 60%, 0 0);
  }

  .avatar-wrapper.animated:hover {
    animation: avatar-wiggle 0.5s ease;
  }

  @keyframes avatar-wiggle {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }

  .avatar-base {
    font-size: 60%;
    line-height: 1;
  }

  .avatar-small .avatar-base { font-size: 28px; }
  .avatar-medium .avatar-base { font-size: 48px; }
  .avatar-large .avatar-base { font-size: 72px; }
  .avatar-xlarge .avatar-base { font-size: 96px; }

  .avatar-hat {
    position: absolute;
    top: -5%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 35%;
  }

  .avatar-small .avatar-hat { font-size: 16px; }
  .avatar-medium .avatar-hat { font-size: 24px; }
  .avatar-large .avatar-hat { font-size: 36px; }
  .avatar-xlarge .avatar-hat { font-size: 48px; }

  .avatar-accessory {
    position: absolute;
    bottom: 5%;
    right: 5%;
    font-size: 20%;
  }

  .avatar-small .avatar-accessory { font-size: 12px; }
  .avatar-medium .avatar-accessory { font-size: 18px; }
  .avatar-large .avatar-accessory { font-size: 24px; }
  .avatar-xlarge .avatar-accessory { font-size: 32px; }

  .avatar-edit-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--duration-fast);
  }

  .avatar-edit-btn:hover {
    transform: scale(1.1);
  }

  .avatar-name {
    text-align: center;
    font-weight: var(--font-weight-bold);
    margin-top: var(--space-2);
    color: var(--text-primary);
  }

  .avatar-wrapper.bounce {
    animation: bounce 0.5s ease;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = avatarStyles;
    document.head.appendChild(styleSheet);
}
