/**
 * MathCE1 - Cube Manipulable Component
 * Draggable cube for concrete phase exercises
 * @module components/manipulables/cube
 */

/**
 * Cube component using Canvas
 */
export class CubeManipulable {
    /**
     * Create cube manipulable
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {Object} options - Configuration
     */
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.options = {
            cubeSize: 40,
            gap: 8,
            colors: {
                primary: '#3498DB',
                secondary: '#E74C3C',
                selected: '#7ED321',
            },
            ...options,
        };

        this.cubes = [];
        this.selectedCubes = new Set();
        this.isDragging = false;
        this.dragCube = null;
        this.dragOffset = { x: 0, y: 0 };

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
     * Initialize cubes for an exercise
     * @param {number} countA - Number of primary colored cubes
     * @param {number} countB - Number of secondary colored cubes
     */
    initCubes(countA, countB = 0) {
        this.cubes = [];
        this.selectedCubes.clear();

        const { cubeSize, gap } = this.options;
        const totalWidth = this.width;
        const startY = (this.height - cubeSize) / 2;

        // Calculate positions for group A
        const groupAWidth = countA * (cubeSize + gap) - gap;
        let startXA = (totalWidth / 4) - (groupAWidth / 2);

        for (let i = 0; i < countA; i++) {
            this.cubes.push({
                id: `a_${i}`,
                x: startXA + i * (cubeSize + gap),
                y: startY,
                size: cubeSize,
                color: 'primary',
                selected: false,
                counted: false,
            });
        }

        // Calculate positions for group B
        if (countB > 0) {
            const groupBWidth = countB * (cubeSize + gap) - gap;
            let startXB = (totalWidth * 3 / 4) - (groupBWidth / 2);

            for (let i = 0; i < countB; i++) {
                this.cubes.push({
                    id: `b_${i}`,
                    x: startXB + i * (cubeSize + gap),
                    y: startY,
                    size: cubeSize,
                    color: 'secondary',
                    selected: false,
                    counted: false,
                });
            }
        }

        this.render();
    }

    /**
     * Bind mouse/touch events
     */
    bindEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handlePointerDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handlePointerMove(e));
        this.canvas.addEventListener('mouseup', () => this.handlePointerUp());
        this.canvas.addEventListener('mouseleave', () => this.handlePointerUp());

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handlePointerDown(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handlePointerMove(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', () => this.handlePointerUp());

        // Click to count
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
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
     * Find cube at position
     */
    getCubeAt(x, y) {
        // Iterate in reverse to get topmost cube first
        for (let i = this.cubes.length - 1; i >= 0; i--) {
            const cube = this.cubes[i];
            if (
                x >= cube.x &&
                x <= cube.x + cube.size &&
                y >= cube.y &&
                y <= cube.y + cube.size
            ) {
                return cube;
            }
        }
        return null;
    }

    /**
     * Handle pointer down
     */
    handlePointerDown(e) {
        const coords = this.getCanvasCoords(e);
        const cube = this.getCubeAt(coords.x, coords.y);

        if (cube) {
            this.isDragging = true;
            this.dragCube = cube;
            this.dragOffset = {
                x: coords.x - cube.x,
                y: coords.y - cube.y,
            };

            // Move to front
            const index = this.cubes.indexOf(cube);
            this.cubes.splice(index, 1);
            this.cubes.push(cube);

            this.render();
        }
    }

    /**
     * Handle pointer move
     */
    handlePointerMove(e) {
        if (!this.isDragging || !this.dragCube) {
            return;
        }

        const coords = this.getCanvasCoords(e);
        this.dragCube.x = coords.x - this.dragOffset.x;
        this.dragCube.y = coords.y - this.dragOffset.y;

        // Keep within bounds
        this.dragCube.x = Math.max(0, Math.min(this.width - this.dragCube.size, this.dragCube.x));
        this.dragCube.y = Math.max(0, Math.min(this.height - this.dragCube.size, this.dragCube.y));

        this.render();
    }

    /**
     * Handle pointer up
     */
    handlePointerUp() {
        this.isDragging = false;
        this.dragCube = null;
    }

    /**
     * Handle click to count
     */
    handleClick(e) {
        if (this.isDragging) {
            return;
        }

        const coords = this.getCanvasCoords(e);
        const cube = this.getCubeAt(coords.x, coords.y);

        if (cube) {
            cube.counted = !cube.counted;

            // Play click sound
            window.MathCE1?.audio?.playClick();

            this.render();

            // Notify parent
            if (this.options.onCount) {
                const countedTotal = this.cubes.filter(c => c.counted).length;
                this.options.onCount(countedTotal);
            }
        }
    }

    /**
     * Render all cubes
     */
    render() {
        const { ctx, width, height } = this;
        const { colors, cubeSize } = this.options;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw each cube
        this.cubes.forEach(cube => {
            const baseColor = cube.counted
                ? colors.selected
                : colors[cube.color] || colors.primary;

            // Draw 3D cube effect
            this.drawCube(cube.x, cube.y, cube.size, baseColor, cube.counted);
        });
    }

    /**
     * Draw a single cube with 3D effect
     */
    drawCube(x, y, size, color, isHighlighted = false) {
        const ctx = this.ctx;
        const depth = 6;

        // Parse color to get variations
        const darkerColor = this.darkenColor(color, 30);
        const lighterColor = this.lightenColor(color, 20);

        // Main face
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);

        // Top face (lighter)
        ctx.fillStyle = lighterColor;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + depth, y - depth);
        ctx.lineTo(x + size + depth, y - depth);
        ctx.lineTo(x + size, y);
        ctx.closePath();
        ctx.fill();

        // Right face (darker)
        ctx.fillStyle = darkerColor;
        ctx.beginPath();
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size + depth, y - depth);
        ctx.lineTo(x + size + depth, y + size - depth);
        ctx.lineTo(x + size, y + size);
        ctx.closePath();
        ctx.fill();

        // Border
        ctx.strokeStyle = darkerColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);

        // Count indicator if highlighted
        if (isHighlighted) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, 8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = color;
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('✓', x + size / 2, y + size / 2);
        }
    }

    /**
     * Darken a color
     */
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    }

    /**
     * Lighten a color
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    }

    /**
     * Get count of highlighted cubes
     */
    getCountedCount() {
        return this.cubes.filter(c => c.counted).length;
    }

    /**
     * Reset all cubes
     */
    reset() {
        this.cubes.forEach(cube => {
            cube.counted = false;
        });
        this.render();
    }

    /**
     * Cleanup
     */
    destroy() {
        this.cubes = [];
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.width, this.height);
        }
    }
}
