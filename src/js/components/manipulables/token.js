/**
 * MathCE1 - Token Manipulable Component
 * Tappable tokens for counting exercises
 * @module components/manipulables/token
 */

/**
 * Token component using Canvas
 */
export class TokenManipulable {
    /**
     * Create token manipulable
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {Object} options - Configuration
     */
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.options = {
            tokenSize: 36,
            gap: 10,
            tokensPerRow: 10,
            colors: {
                default: '#F39C12',
                counted: '#7ED321',
                border: '#D68910',
            },
            ...options,
        };

        this.tokens = [];

        this.setupCanvas();
        this.bindEvents();
    }

    /**
     * Setup canvas for retina displays
     */
    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.scale(dpr, dpr);

        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;

        this.width = rect.width;
        this.height = rect.height;
    }

    /**
     * Initialize tokens for counting exercise
     * @param {number} count - Number of tokens
     */
    initTokens(count) {
        this.tokens = [];
        const { tokenSize, gap, tokensPerRow } = this.options;

        const rowWidth = Math.min(count, tokensPerRow) * (tokenSize + gap) - gap;
        const startX = (this.width - rowWidth) / 2;
        const totalRows = Math.ceil(count / tokensPerRow);
        const totalHeight = totalRows * (tokenSize + gap) - gap;
        const startY = (this.height - totalHeight) / 2;

        for (let i = 0; i < count; i++) {
            const row = Math.floor(i / tokensPerRow);
            const col = i % tokensPerRow;

            // Center incomplete rows
            const tokensInThisRow = Math.min(tokensPerRow, count - row * tokensPerRow);
            const rowStartX = (this.width - (tokensInThisRow * (tokenSize + gap) - gap)) / 2;

            this.tokens.push({
                id: i,
                x: rowStartX + col * (tokenSize + gap),
                y: startY + row * (tokenSize + gap),
                radius: tokenSize / 2,
                counted: false,
                animationFrame: 0,
            });
        }

        this.render();
    }

    /**
     * Bind touch/click events
     */
    bindEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleClick(e.touches[0]);
        });
    }

    /**
     * Get canvas-relative coordinates
     */
    getCanvasCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }

    /**
     * Find token at position
     */
    getTokenAt(x, y) {
        for (const token of this.tokens) {
            const distance = Math.sqrt(
                Math.pow(x - (token.x + token.radius), 2) +
                Math.pow(y - (token.y + token.radius), 2)
            );
            if (distance <= token.radius) {
                return token;
            }
        }
        return null;
    }

    /**
     * Handle click/tap
     */
    handleClick(e) {
        const coords = this.getCanvasCoords(e);
        const token = this.getTokenAt(coords.x, coords.y);

        if (token) {
            token.counted = !token.counted;

            // Play click sound
            window.MathCE1?.audio?.playClick();

            // Animate
            this.animateToken(token);

            // Notify parent
            if (this.options.onCount) {
                const countedTotal = this.tokens.filter(t => t.counted).length;
                this.options.onCount(countedTotal);
            }
        }
    }

    /**
     * Animate token tap
     */
    animateToken(token) {
        const frames = 10;
        let frame = 0;

        const animate = () => {
            frame++;
            token.animationFrame = frame / frames;

            this.render();

            if (frame < frames) {
                requestAnimationFrame(animate);
            } else {
                token.animationFrame = 0;
                this.render();
            }
        };

        animate();
    }

    /**
     * Render all tokens
     */
    render() {
        const { ctx, width, height } = this;
        const { colors } = this.options;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw each token
        this.tokens.forEach((token, index) => {
            this.drawToken(token, index + 1);
        });
    }

    /**
     * Draw a single token
     */
    drawToken(token, number) {
        const { ctx } = this;
        const { colors } = this.options;

        const centerX = token.x + token.radius;
        const centerY = token.y + token.radius;
        let radius = token.radius;

        // Apply animation scale
        if (token.animationFrame > 0) {
            const scale = 1 + 0.2 * Math.sin(token.animationFrame * Math.PI);
            radius *= scale;
        }

        // Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Main circle
        const gradient = ctx.createRadialGradient(
            centerX - radius * 0.3,
            centerY - radius * 0.3,
            0,
            centerX,
            centerY,
            radius
        );

        if (token.counted) {
            gradient.addColorStop(0, '#A8E86E');
            gradient.addColorStop(1, colors.counted);
        } else {
            gradient.addColorStop(0, '#FFD080');
            gradient.addColorStop(1, colors.default);
        }

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Border
        ctx.strokeStyle = token.counted ? '#5BA318' : colors.border;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Number or checkmark
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${radius * 0.8}px 'Nunito', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (token.counted) {
            ctx.fillText('✓', centerX, centerY);
        }
    }

    /**
     * Get count of tapped tokens
     */
    getCountedCount() {
        return this.tokens.filter(t => t.counted).length;
    }

    /**
     * Count all tokens sequentially (for hint)
     */
    countAll(delay = 300) {
        this.tokens.forEach((token, i) => {
            setTimeout(() => {
                token.counted = true;
                this.animateToken(token);

                if (this.options.onCount) {
                    this.options.onCount(i + 1);
                }
            }, i * delay);
        });
    }

    /**
     * Reset all tokens
     */
    reset() {
        this.tokens.forEach(token => {
            token.counted = false;
        });
        this.render();
    }

    /**
     * Cleanup
     */
    destroy() {
        this.tokens = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    }
}
