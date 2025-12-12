/**
 * MathCE1 - Shape Component
 * Visual shapes for geometry exercises
 * @module components/shape
 */

/**
 * Shape definitions with SVG paths
 */
const SHAPE_DEFS = {
    circle: {
        render: (size, color) => `
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 5}" fill="${color}" stroke="#333" stroke-width="3"/>
    `,
    },
    square: {
        render: (size, color) => `
      <rect x="5" y="5" width="${size - 10}" height="${size - 10}" fill="${color}" stroke="#333" stroke-width="3"/>
    `,
    },
    rectangle: {
        render: (size, color) => `
      <rect x="5" y="${size / 4}" width="${size - 10}" height="${size / 2}" fill="${color}" stroke="#333" stroke-width="3"/>
    `,
    },
    triangle: {
        render: (size, color) => `
      <polygon points="${size / 2},5 ${size - 5},${size - 5} 5,${size - 5}" fill="${color}" stroke="#333" stroke-width="3"/>
    `,
    },
    pentagon: {
        render: (size, color) => {
            const points = [];
            for (let i = 0; i < 5; i++) {
                const angle = (i * 72 - 90) * Math.PI / 180;
                const x = size / 2 + (size / 2 - 5) * Math.cos(angle);
                const y = size / 2 + (size / 2 - 5) * Math.sin(angle);
                points.push(`${x},${y}`);
            }
            return `<polygon points="${points.join(' ')}" fill="${color}" stroke="#333" stroke-width="3"/>`;
        },
    },
    hexagon: {
        render: (size, color) => {
            const points = [];
            for (let i = 0; i < 6; i++) {
                const angle = (i * 60 - 90) * Math.PI / 180;
                const x = size / 2 + (size / 2 - 5) * Math.cos(angle);
                const y = size / 2 + (size / 2 - 5) * Math.sin(angle);
                points.push(`${x},${y}`);
            }
            return `<polygon points="${points.join(' ')}" fill="${color}" stroke="#333" stroke-width="3"/>`;
        },
    },
};

const SHAPE_COLORS = {
    circle: '#E74C3C',
    square: '#3498DB',
    rectangle: '#2ECC71',
    triangle: '#F39C12',
    pentagon: '#9B59B6',
    hexagon: '#1ABC9C',
};

/**
 * Shape visual component
 */
export class ShapeVisual {
    /**
     * Create shape visual
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Shape options
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            shape: 'circle',
            size: 100,
            color: null,
            showLabel: false,
            animated: true,
            ...options,
        };

        this.render();
    }

    /**
     * Set shape
     * @param {string} shapeId - Shape identifier
     */
    setShape(shapeId) {
        this.options.shape = shapeId;
        this.render();
    }

    /**
     * Render the shape
     */
    render() {
        const { shape, size, color, showLabel, animated } = this.options;
        const shapeDef = SHAPE_DEFS[shape];
        const shapeColor = color || SHAPE_COLORS[shape] || '#3498DB';

        if (!shapeDef) {
            console.warn(`Unknown shape: ${shape}`);
            return;
        }

        const shapeNames = {
            circle: 'Cercle',
            square: 'Carré',
            rectangle: 'Rectangle',
            triangle: 'Triangle',
            pentagon: 'Pentagone',
            hexagon: 'Hexagone',
        };

        this.container.innerHTML = `
      <div class="shape-visual ${animated ? 'animated' : ''}" style="width: ${size}px;">
        <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
          ${shapeDef.render(size, shapeColor)}
        </svg>
        ${showLabel ? `
          <div class="shape-label">${shapeNames[shape] || shape}</div>
        ` : ''}
      </div>
    `;
    }
}

/**
 * Shape grid for multiple shapes
 */
export class ShapeGrid {
    /**
     * Create shape grid
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Grid options
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            shapes: [], // Array of { type, count }
            shapeSize: 50,
            columns: 5,
            interactive: false,
            ...options,
        };

        this.render();
    }

    /**
     * Set shapes to display
     * @param {Object[]} shapes - Array of shape configs
     */
    setShapes(shapes) {
        this.options.shapes = shapes;
        this.render();
    }

    /**
     * Render the grid
     */
    render() {
        const { shapes, shapeSize, columns, interactive } = this.options;

        // Flatten shapes into individual items
        const items = [];
        shapes.forEach(({ type, count, color }) => {
            for (let i = 0; i < count; i++) {
                items.push({ type, color: color || SHAPE_COLORS[type] });
            }
        });

        // Shuffle items
        const shuffled = items.sort(() => Math.random() - 0.5);

        const itemsHtml = shuffled.map((item, index) => {
            const shapeDef = SHAPE_DEFS[item.type];
            if (!shapeDef) return '';

            return `
        <div
          class="grid-shape ${interactive ? 'interactive' : ''}"
          data-shape="${item.type}"
          data-index="${index}"
          style="width: ${shapeSize}px; height: ${shapeSize}px;"
        >
          <svg viewBox="0 0 ${shapeSize} ${shapeSize}" width="${shapeSize}" height="${shapeSize}">
            ${shapeDef.render(shapeSize, item.color)}
          </svg>
        </div>
      `;
        }).join('');

        this.container.innerHTML = `
      <div class="shape-grid" style="display: flex; flex-wrap: wrap; gap: 8px; max-width: ${columns * (shapeSize + 8)}px;">
        ${itemsHtml}
      </div>
    `;
    }
}

/**
 * Shape options for multiple choice
 */
export class ShapeOptions {
    /**
     * Create shape options
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Options config
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            options: [], // Array of shape IDs
            correctAnswer: null,
            onSelect: null,
            size: 80,
            ...options,
        };

        this.selectedIndex = null;
        this.render();
    }

    /**
     * Set options
     */
    setOptions(options, correctAnswer) {
        this.options.options = options;
        this.options.correctAnswer = correctAnswer;
        this.selectedIndex = null;
        this.render();
    }

    /**
     * Render options
     */
    render() {
        const { options, size } = this.options;

        const shapeNames = {
            circle: 'Cercle',
            square: 'Carré',
            rectangle: 'Rectangle',
            triangle: 'Triangle',
            pentagon: 'Pentagone',
            hexagon: 'Hexagone',
        };

        const optionsHtml = options.map((shapeId, index) => {
            const shapeDef = SHAPE_DEFS[shapeId];
            const color = SHAPE_COLORS[shapeId];

            return `
        <button
          class="shape-option ${this.selectedIndex === index ? 'selected' : ''}"
          data-index="${index}"
          data-shape="${shapeId}"
        >
          <div class="option-shape" style="width: ${size}px; height: ${size}px;">
            <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
              ${shapeDef?.render(size, color) || ''}
            </svg>
          </div>
          <div class="option-label">${shapeNames[shapeId] || shapeId}</div>
        </button>
      `;
        }).join('');

        this.container.innerHTML = `
      <div class="shape-options">
        ${optionsHtml}
      </div>
    `;

        // Bind click handlers
        this.container.querySelectorAll('.shape-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index, 10);
                this.selectOption(index);
            });
        });
    }

    /**
     * Select an option
     */
    selectOption(index) {
        this.selectedIndex = index;
        const shape = this.options.options[index];

        // Update UI
        this.container.querySelectorAll('.shape-option').forEach((btn, i) => {
            btn.classList.toggle('selected', i === index);
        });

        // Callback
        if (this.options.onSelect) {
            const isCorrect = shape === this.options.correctAnswer;
            this.options.onSelect(shape, isCorrect, index);
        }
    }
}

// Add shape styles
const shapeStyles = `
  .shape-visual {
    display: inline-block;
    text-align: center;
  }

  .shape-visual.animated svg {
    transition: transform 0.3s ease;
  }

  .shape-visual.animated:hover svg {
    transform: scale(1.05);
  }

  .shape-label {
    margin-top: var(--space-2);
    font-weight: var(--font-weight-bold);
    color: var(--text-secondary);
  }

  .grid-shape {
    cursor: default;
    transition: transform 0.2s;
  }

  .grid-shape.interactive {
    cursor: pointer;
  }

  .grid-shape.interactive:hover {
    transform: scale(1.1);
  }

  .shape-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    justify-content: center;
  }

  .shape-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-3);
    background: var(--bg-secondary);
    border: 3px solid transparent;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--duration-fast);
  }

  .shape-option:hover {
    border-color: var(--color-primary);
  }

  .shape-option.selected {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }

  .option-label {
    margin-top: var(--space-2);
    font-weight: var(--font-weight-medium);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = shapeStyles;
    document.head.appendChild(styleSheet);
}
