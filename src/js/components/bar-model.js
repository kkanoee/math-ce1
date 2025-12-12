/**
 * MathCE1 - Bar Model Component
 * Visual bar model for Singapore Method problems
 * @module components/bar-model
 */

/**
 * Bar model visualization component
 */
export class BarModel {
    /**
     * Create bar model
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Configuration
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            height: 48,
            gap: 8,
            borderRadius: 8,
            colors: {
                partA: '#3498DB',
                partB: '#E74C3C',
                whole: '#2ECC71',
                unknown: '#95A5A6',
            },
            showLabels: true,
            animated: true,
            ...options,
        };

        this.parts = [];
        this.whole = null;
        this.unknownPart = null;
    }

    /**
     * Render an addition bar model
     * a + b = ?
     * @param {number} a - First addend
     * @param {number} b - Second addend
     */
    renderAddition(a, b) {
        const total = a + b;
        const { colors, height, borderRadius, showLabels } = this.options;

        this.container.innerHTML = `
      <div class="bar-model-wrapper">
        <!-- Parts Row -->
        <div class="bar-model-row">
          <div
            class="bar-segment part-a"
            style="
              flex: ${a};
              background: linear-gradient(135deg, ${colors.partA}, ${this.darken(colors.partA, 15)});
              height: ${height}px;
              border-radius: ${borderRadius}px;
            "
          >
            ${showLabels ? `<span class="bar-label">${a}</span>` : ''}
          </div>
          <div
            class="bar-segment part-b"
            style="
              flex: ${b};
              background: linear-gradient(135deg, ${colors.partB}, ${this.darken(colors.partB, 15)});
              height: ${height}px;
              border-radius: ${borderRadius}px;
            "
          >
            ${showLabels ? `<span class="bar-label">${b}</span>` : ''}
          </div>
        </div>

        <!-- Whole Row (unknown) -->
        <div class="bar-model-row">
          <div
            class="bar-segment whole unknown-answer"
            style="
              flex: ${total};
              background: linear-gradient(135deg, ${colors.unknown}, ${this.darken(colors.unknown, 15)});
              height: ${height}px;
              border-radius: ${borderRadius}px;
            "
          >
            <span class="bar-label">?</span>
          </div>
        </div>

        <!-- Bracket showing total -->
        <div class="bar-model-bracket">
          <span class="bracket-label">Total = ?</span>
        </div>
      </div>
    `;

        if (this.options.animated) {
            this.animateIn();
        }
    }

    /**
     * Render a subtraction bar model
     * a - b = ?
     * @param {number} a - Minuend (whole)
     * @param {number} b - Subtrahend (part to remove)
     */
    renderSubtraction(a, b) {
        const result = a - b;
        const { colors, height, borderRadius, showLabels } = this.options;

        this.container.innerHTML = `
      <div class="bar-model-wrapper">
        <!-- Whole Row -->
        <div class="bar-model-row">
          <div
            class="bar-segment whole"
            style="
              flex: ${a};
              background: linear-gradient(135deg, ${colors.whole}, ${this.darken(colors.whole, 15)});
              height: ${height}px;
              border-radius: ${borderRadius}px;
            "
          >
            ${showLabels ? `<span class="bar-label">${a}</span>` : ''}
          </div>
        </div>

        <!-- Parts Row -->
        <div class="bar-model-row">
          <div
            class="bar-segment part-removed"
            style="
              flex: ${b};
              background: repeating-linear-gradient(
                45deg,
                ${colors.partB}22,
                ${colors.partB}22 10px,
                ${colors.partB}44 10px,
                ${colors.partB}44 20px
              );
              border: 2px dashed ${colors.partB};
              height: ${height}px;
              border-radius: ${borderRadius}px;
            "
          >
            ${showLabels ? `<span class="bar-label">${b}</span>` : ''}
          </div>
          <div
            class="bar-segment remainder unknown-answer"
            style="
              flex: ${result};
              background: linear-gradient(135deg, ${colors.unknown}, ${this.darken(colors.unknown, 15)});
              height: ${height}px;
              border-radius: ${borderRadius}px;
            "
          >
            <span class="bar-label">?</span>
          </div>
        </div>
      </div>
    `;

        if (this.options.animated) {
            this.animateIn();
        }
    }

    /**
     * Render a comparison bar model
     * @param {number} a - First number
     * @param {number} b - Second number
     */
    renderComparison(a, b) {
        const { colors, height, borderRadius, showLabels } = this.options;
        const max = Math.max(a, b);

        this.container.innerHTML = `
      <div class="bar-model-wrapper comparison">
        <!-- First number bar -->
        <div class="bar-model-row labeled">
          <span class="row-label">A:</span>
          <div
            class="bar-segment"
            style="
              flex: ${a};
              max-width: ${(a / max) * 100}%;
              background: linear-gradient(135deg, ${colors.partA}, ${this.darken(colors.partA, 15)});
              height: ${height}px;
              border-radius: ${borderRadius}px;
            "
          >
            ${showLabels ? `<span class="bar-label">${a}</span>` : ''}
          </div>
        </div>

        <!-- Second number bar -->
        <div class="bar-model-row labeled">
          <span class="row-label">B:</span>
          <div
            class="bar-segment"
            style="
              flex: ${b};
              max-width: ${(b / max) * 100}%;
              background: linear-gradient(135deg, ${colors.partB}, ${this.darken(colors.partB, 15)});
              height: ${height}px;
              border-radius: ${borderRadius}px;
            "
          >
            ${showLabels ? `<span class="bar-label">${b}</span>` : ''}
          </div>
        </div>
      </div>
    `;

        if (this.options.animated) {
            this.animateIn();
        }
    }

    /**
     * Reveal the answer
     * @param {number} answer - The answer to show
     */
    revealAnswer(answer) {
        const unknownElement = this.container.querySelector('.unknown-answer');

        if (unknownElement) {
            unknownElement.classList.add('revealed');
            unknownElement.querySelector('.bar-label').textContent = answer;
            unknownElement.style.background = `linear-gradient(135deg, ${this.options.colors.whole}, ${this.darken(this.options.colors.whole, 15)})`;
        }
    }

    /**
     * Animate bars in
     */
    animateIn() {
        const bars = this.container.querySelectorAll('.bar-segment');

        bars.forEach((bar, index) => {
            bar.style.opacity = '0';
            bar.style.transform = 'scaleX(0)';
            bar.style.transformOrigin = 'left';

            setTimeout(() => {
                bar.style.transition = 'all 0.5s ease-out';
                bar.style.opacity = '1';
                bar.style.transform = 'scaleX(1)';
            }, index * 200);
        });
    }

    /**
     * Darken a color
     */
    darken(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    }

    /**
     * Clear the bar model
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        this.clear();
    }
}

// Add bar model styles
const barModelStyles = `
  .bar-model-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-4);
    max-width: 400px;
    margin: 0 auto;
  }

  .bar-model-row {
    display: flex;
    gap: 2px;
    align-items: center;
  }

  .bar-model-row.labeled {
    gap: var(--space-2);
  }

  .row-label {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--text-secondary);
    min-width: 32px;
  }

  .bar-segment {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    min-width: 40px;
  }

  .bar-label {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--text-inverse);
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  }

  .bar-model-bracket {
    text-align: center;
    margin-top: var(--space-2);
  }

  .bracket-label {
    font-size: var(--font-size-base);
    color: var(--text-secondary);
    font-weight: var(--font-weight-medium);
  }

  .bar-segment.revealed {
    animation: bar-reveal 0.5s ease-out;
  }

  @keyframes bar-reveal {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = barModelStyles;
    document.head.appendChild(styleSheet);
}
