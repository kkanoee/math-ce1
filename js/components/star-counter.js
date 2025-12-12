/**
 * MathCE1 - Star Counter Component
 * Animated star count display
 * @module components/star-counter
 */

/**
 * Star counter component
 */
export class StarCounter {
    /**
     * Create star counter
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Options
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            size: 'medium', // small, medium, large
            animated: true,
            showLabel: true,
            ...options,
        };

        this.currentValue = 0;
        this.targetValue = 0;
        this.animationFrame = null;
    }

    /**
     * Set the star count
     * @param {number} value - Star count
     * @param {boolean} animate - Whether to animate
     */
    setValue(value, animate = true) {
        this.targetValue = value;

        if (animate && this.options.animated && value !== this.currentValue) {
            this.animateTo(value);
        } else {
            this.currentValue = value;
            this.render();
        }
    }

    /**
     * Add stars with animation
     * @param {number} amount - Stars to add
     */
    addStars(amount) {
        this.setValue(this.targetValue + amount, true);
    }

    /**
     * Animate to target value
     */
    animateTo(target) {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const start = this.currentValue;
        const diff = target - start;
        const duration = Math.min(1000, Math.abs(diff) * 50); // Max 1s, 50ms per star
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3);

            this.currentValue = Math.round(start + diff * eased);
            this.render();

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                this.currentValue = target;
                this.render();
                this.showCompletionEffect();
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Show completion effect
     */
    showCompletionEffect() {
        const counter = this.container.querySelector('.star-counter');
        if (counter) {
            counter.classList.add('pop');
            setTimeout(() => counter.classList.remove('pop'), 300);
        }
    }

    /**
     * Render the counter
     */
    render() {
        const sizeClass = `star-counter-${this.options.size}`;

        this.container.innerHTML = `
      <div class="star-counter ${sizeClass}">
        <span class="star-counter-icon">⭐</span>
        <span class="star-counter-value">${this.currentValue}</span>
        ${this.options.showLabel ? `
          <span class="star-counter-label">étoiles</span>
        ` : ''}
      </div>
    `;
    }

    /**
     * Get current value
     * @returns {number}
     */
    getValue() {
        return this.currentValue;
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
}

// Add star counter styles
const starCounterStyles = `
  .star-counter {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: linear-gradient(135deg, #FFF8DC, #FFD700);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-sm);
    transition: transform var(--duration-fast);
  }

  .star-counter.pop {
    animation: star-pop 0.3s ease;
  }

  @keyframes star-pop {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .star-counter-icon {
    font-size: 1.2em;
  }

  .star-counter-value {
    font-weight: var(--font-weight-extra);
    color: #B8860B;
  }

  .star-counter-label {
    font-size: 0.8em;
    color: #B8860B;
  }

  /* Sizes */
  .star-counter-small {
    padding: var(--space-1) var(--space-2);
    font-size: var(--font-size-sm);
  }

  .star-counter-small .star-counter-icon {
    font-size: var(--font-size-base);
  }

  .star-counter-medium {
    font-size: var(--font-size-base);
  }

  .star-counter-large {
    padding: var(--space-3) var(--space-4);
    font-size: var(--font-size-xl);
  }

  .star-counter-large .star-counter-icon {
    font-size: var(--font-size-2xl);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = starCounterStyles;
    document.head.appendChild(styleSheet);
}
