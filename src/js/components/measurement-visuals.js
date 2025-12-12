/**
 * MathCE1 - Visual Components for Measurements
 * Clock, ruler, and coins visualizations
 * @module components/measurement-visuals
 */

/**
 * Clock component for time exercises
 */
export class ClockVisual {
    /**
     * Create clock visual
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Clock options
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            size: 200,
            hours: 12,
            minutes: 0,
            showNumbers: true,
            interactive: false,
            ...options,
        };

        this.render();
    }

    /**
     * Set time
     * @param {number} hours - Hours (1-12)
     * @param {number} minutes - Minutes (0-59)
     */
    setTime(hours, minutes) {
        this.options.hours = hours;
        this.options.minutes = minutes;
        this.render();
    }

    /**
     * Render the clock
     */
    render() {
        const { size, hours, minutes, showNumbers } = this.options;
        const center = size / 2;
        const radius = size / 2 - 10;

        // Calculate hand angles
        const hourAngle = ((hours % 12) + minutes / 60) * 30 - 90;
        const minuteAngle = minutes * 6 - 90;

        // Hour hand length
        const hourLength = radius * 0.5;
        const minuteLength = radius * 0.75;

        this.container.innerHTML = `
      <div class="clock-visual" style="width: ${size}px; height: ${size}px;">
        <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
          <!-- Clock face -->
          <circle
            cx="${center}"
            cy="${center}"
            r="${radius}"
            fill="white"
            stroke="#333"
            stroke-width="3"
          />

          <!-- Hour markers -->
          ${this.renderMarkers(center, radius)}

          <!-- Numbers -->
          ${showNumbers ? this.renderNumbers(center, radius) : ''}

          <!-- Hour hand -->
          <line
            x1="${center}"
            y1="${center}"
            x2="${center + hourLength * Math.cos(hourAngle * Math.PI / 180)}"
            y2="${center + hourLength * Math.sin(hourAngle * Math.PI / 180)}"
            stroke="#3498DB"
            stroke-width="6"
            stroke-linecap="round"
          />

          <!-- Minute hand -->
          <line
            x1="${center}"
            y1="${center}"
            x2="${center + minuteLength * Math.cos(minuteAngle * Math.PI / 180)}"
            y2="${center + minuteLength * Math.sin(minuteAngle * Math.PI / 180)}"
            stroke="#E74C3C"
            stroke-width="4"
            stroke-linecap="round"
          />

          <!-- Center dot -->
          <circle cx="${center}" cy="${center}" r="6" fill="#333" />
        </svg>
      </div>
    `;
    }

    /**
     * Render hour markers
     */
    renderMarkers(center, radius) {
        let markers = '';
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const innerRadius = radius - 10;
            const x1 = center + innerRadius * Math.cos(angle);
            const y1 = center + innerRadius * Math.sin(angle);
            const x2 = center + radius * Math.cos(angle);
            const y2 = center + radius * Math.sin(angle);

            markers += `
        <line
          x1="${x1}" y1="${y1}"
          x2="${x2}" y2="${y2}"
          stroke="#333"
          stroke-width="${i % 3 === 0 ? 3 : 1}"
        />
      `;
        }
        return markers;
    }

    /**
     * Render numbers
     */
    renderNumbers(center, radius) {
        let numbers = '';
        const textRadius = radius - 25;

        for (let i = 1; i <= 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const x = center + textRadius * Math.cos(angle);
            const y = center + textRadius * Math.sin(angle) + 6;

            numbers += `
        <text
          x="${x}"
          y="${y}"
          text-anchor="middle"
          font-size="16"
          font-weight="bold"
          fill="#333"
        >${i}</text>
      `;
        }
        return numbers;
    }
}

/**
 * Ruler component for length exercises
 */
export class RulerVisual {
    /**
     * Create ruler visual
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Ruler options
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            length: 10, // cm
            maxLength: 20,
            showLine: true,
            lineLength: null,
            ...options,
        };

        this.render();
    }

    /**
     * Set the line to measure
     * @param {number} length - Length in cm
     */
    setLine(length) {
        this.options.lineLength = length;
        this.render();
    }

    /**
     * Render the ruler
     */
    render() {
        const { length, maxLength, showLine, lineLength } = this.options;
        const width = maxLength * 30 + 40; // 30px per cm
        const height = 80;
        const startX = 20;

        this.container.innerHTML = `
      <div class="ruler-visual">
        ${showLine && lineLength ? `
          <div class="ruler-line" style="width: ${lineLength * 30}px; margin-bottom: 10px;">
            <div class="line-body"></div>
          </div>
        ` : ''}
        <svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
          <!-- Ruler body -->
          <rect
            x="${startX}"
            y="10"
            width="${maxLength * 30}"
            height="50"
            fill="#F5E6C8"
            stroke="#8B4513"
            stroke-width="2"
            rx="3"
          />

          <!-- Centimeter marks -->
          ${this.renderMarks(startX, maxLength)}

          <!-- Numbers -->
          ${this.renderRulerNumbers(startX, maxLength)}
        </svg>
      </div>
    `;
    }

    /**
     * Render ruler marks
     */
    renderMarks(startX, maxLength) {
        let marks = '';
        for (let i = 0; i <= maxLength; i++) {
            const x = startX + i * 30;
            const isMajor = i % 5 === 0;
            const markHeight = isMajor ? 20 : 10;

            marks += `
        <line
          x1="${x}" y1="10"
          x2="${x}" y2="${10 + markHeight}"
          stroke="#8B4513"
          stroke-width="${isMajor ? 2 : 1}"
        />
      `;

            // Half centimeter marks
            if (i < maxLength) {
                marks += `
          <line
            x1="${x + 15}" y1="10"
            x2="${x + 15}" y2="17"
            stroke="#8B4513"
            stroke-width="1"
          />
        `;
            }
        }
        return marks;
    }

    /**
     * Render ruler numbers
     */
    renderRulerNumbers(startX, maxLength) {
        let numbers = '';
        for (let i = 0; i <= maxLength; i += 5) {
            const x = startX + i * 30;
            numbers += `
        <text
          x="${x}"
          y="52"
          text-anchor="middle"
          font-size="14"
          font-weight="bold"
          fill="#8B4513"
        >${i}</text>
      `;
        }
        return numbers;
    }
}

/**
 * Coins component for money exercises
 */
export class CoinsVisual {
    /**
     * Create coins visual
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Coins options
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            coins: [1, 2, 5],
            interactive: false,
            ...options,
        };

        this.render();
    }

    /**
     * Set coins to display
     * @param {number[]} coins - Array of coin values
     */
    setCoins(coins) {
        this.options.coins = coins;
        this.render();
    }

    /**
     * Get coin color based on value
     */
    getCoinColor(value) {
        switch (value) {
            case 1: return { bg: '#CD7F32', border: '#8B4513' }; // Bronze
            case 2: return { bg: '#CD7F32', border: '#8B4513' }; // Bronze
            case 5: return { bg: '#C0C0C0', border: '#808080' }; // Silver
            case 10: return { bg: '#C0C0C0', border: '#808080' }; // Silver
            case 20: return { bg: '#FFD700', border: '#DAA520' }; // Gold
            case 50: return { bg: '#FFD700', border: '#DAA520' }; // Gold
            default: return { bg: '#CD7F32', border: '#8B4513' };
        }
    }

    /**
     * Render coins
     */
    render() {
        const { coins } = this.options;

        const coinsHtml = coins.map((value, index) => {
            const colors = this.getCoinColor(value);
            const size = value >= 10 ? 60 : 50;

            return `
        <div
          class="coin"
          style="
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle at 30% 30%, ${colors.bg}, ${colors.border});
            border: 3px solid ${colors.border};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            font-size: ${value >= 10 ? '16px' : '14px'};
            box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
          "
        >
          ${value}€
        </div>
      `;
        }).join('');

        this.container.innerHTML = `
      <div class="coins-visual" style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; padding: 10px;">
        ${coinsHtml}
      </div>
    `;
    }
}

// Add visual styles
const visualStyles = `
  .clock-visual {
    display: inline-block;
    background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }

  .ruler-visual {
    padding: 20px;
  }

  .ruler-line {
    height: 8px;
    background: var(--color-primary);
    border-radius: 4px;
    margin-left: 20px;
  }

  .coins-visual .coin {
    cursor: default;
    transition: transform 0.2s;
  }

  .coins-visual .coin:hover {
    transform: scale(1.1);
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = visualStyles;
    document.head.appendChild(styleSheet);
}
