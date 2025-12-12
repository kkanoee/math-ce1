/**
 * MathCE1 - Progress Bar Component
 * Animated progress visualization
 * @module components/progress-bar
 */

/**
 * Progress bar component
 */
export class ProgressBar {
    /**
     * Create progress bar
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Options
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            color: 'primary', // primary, success, warning, cpa
            height: 12,
            animated: true,
            showValue: true,
            showLabel: false,
            label: '',
            cpaPhase: null, // concrete, pictorial, abstract
            ...options,
        };

        this.value = 0;
        this.max = 100;
    }

    /**
     * Set progress value
     * @param {number} value - Current value
     * @param {number} max - Maximum value
     */
    setValue(value, max = 100) {
        this.value = Math.max(0, Math.min(value, max));
        this.max = max;
        this.render();
    }

    /**
     * Set percentage directly
     * @param {number} percentage - 0-100
     */
    setPercentage(percentage) {
        this.value = Math.max(0, Math.min(percentage, 100));
        this.max = 100;
        this.render();
    }

    /**
     * Get current percentage
     * @returns {number}
     */
    getPercentage() {
        return this.max > 0 ? Math.round((this.value / this.max) * 100) : 0;
    }

    /**
     * Get color class or style
     */
    getColorStyle() {
        const { color, cpaPhase } = this.options;

        if (cpaPhase) {
            switch (cpaPhase) {
                case 'concrete': return 'var(--color-concrete)';
                case 'pictorial': return 'var(--color-pictorial)';
                case 'abstract': return 'var(--color-abstract)';
            }
        }

        switch (color) {
            case 'primary': return 'var(--color-primary)';
            case 'success': return 'var(--color-success)';
            case 'warning': return 'var(--color-secondary)';
            case 'error': return 'var(--color-error)';
            default: return color; // Allow custom colors
        }
    }

    /**
     * Render the progress bar
     */
    render() {
        const percentage = this.getPercentage();
        const colorStyle = this.getColorStyle();
        const { height, showValue, showLabel, label, animated } = this.options;

        this.container.innerHTML = `
      ${showLabel && label ? `
        <div class="progress-bar-label">${label}</div>
      ` : ''}
      <div class="progress-bar-wrapper" style="height: ${height}px">
        <div class="progress-bar-track">
          <div
            class="progress-bar-fill ${animated ? 'animated' : ''}"
            style="width: ${percentage}%; background: ${colorStyle};"
          ></div>
        </div>
        ${showValue ? `
          <span class="progress-bar-value">${percentage}%</span>
        ` : ''}
      </div>
    `;

        // Add animation after render
        if (animated) {
            setTimeout(() => {
                const fill = this.container.querySelector('.progress-bar-fill');
                if (fill) {
                    fill.style.transition = 'width 0.5s ease-out';
                }
            }, 10);
        }
    }

    /**
     * Animate to value
     */
    animateTo(value, max = 100) {
        const fill = this.container.querySelector('.progress-bar-fill');
        if (fill) {
            fill.style.transition = 'width 0.5s ease-out';
        }
        this.setValue(value, max);
    }
}

/**
 * Multi-step progress indicator
 */
export class StepProgress {
    /**
     * Create step progress
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Options
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            steps: 5,
            labels: [],
            activeColor: 'var(--color-primary)',
            completedColor: 'var(--color-success)',
            ...options,
        };

        this.current = 0;
    }

    /**
     * Set current step
     * @param {number} step - Current step (1-indexed)
     */
    setStep(step) {
        this.current = Math.max(0, Math.min(step, this.options.steps));
        this.render();
    }

    /**
     * Go to next step
     */
    nextStep() {
        this.setStep(this.current + 1);
    }

    /**
     * Render step progress
     */
    render() {
        const { steps, labels, activeColor, completedColor } = this.options;

        const stepsHtml = Array.from({ length: steps }, (_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < this.current;
            const isActive = stepNum === this.current;
            const label = labels[i] || '';

            return `
        <div class="step-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
          <div
            class="step-circle"
            style="
              background: ${isCompleted ? completedColor : isActive ? activeColor : 'var(--bg-accent)'};
              color: ${isCompleted || isActive ? 'white' : 'var(--text-muted)'};
            "
          >
            ${isCompleted ? '✓' : stepNum}
          </div>
          ${label ? `<span class="step-label">${label}</span>` : ''}
          ${stepNum < steps ? `
            <div class="step-connector ${isCompleted ? 'completed' : ''}"></div>
          ` : ''}
        </div>
      `;
        }).join('');

        this.container.innerHTML = `
      <div class="step-progress">
        ${stepsHtml}
      </div>
    `;
    }
}

// Add progress bar styles
const progressStyles = `
  .progress-bar-wrapper {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .progress-bar-track {
    flex: 1;
    height: 100%;
    background: var(--bg-accent);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    border-radius: var(--radius-full);
    min-width: 0;
  }

  .progress-bar-fill.animated {
    transition: width 0.3s ease-out;
  }

  .progress-bar-value {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    color: var(--text-secondary);
    min-width: 40px;
    text-align: right;
  }

  .progress-bar-label {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin-bottom: var(--space-1);
  }

  /* Step Progress */
  .step-progress {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .step-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-sm);
    position: relative;
    z-index: 1;
    transition: all var(--duration-fast);
  }

  .step-item.active .step-circle {
    transform: scale(1.1);
    box-shadow: 0 0 0 4px var(--color-primary-light);
  }

  .step-label {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    margin-top: var(--space-1);
    text-align: center;
    max-width: 60px;
  }

  .step-connector {
    position: absolute;
    top: 16px;
    left: 50%;
    width: 100%;
    height: 2px;
    background: var(--bg-accent);
    z-index: 0;
  }

  .step-connector.completed {
    background: var(--color-success);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = progressStyles;
    document.head.appendChild(styleSheet);
}
