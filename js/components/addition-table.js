/**
 * MathCE1 - Addition Table Component
 * Displays an addition table (0-10) as a study aid
 * @module components/addition-table
 */

/**
 * Addition table component
 */
export class AdditionTable {
    /**
     * Create addition table
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Configuration options
     */
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            maxNumber: 10,
            highlightRow: null,
            highlightCol: null,
            ...options,
        };

        this.isVisible = false;
        this.render();
    }

    /**
     * Render the addition table
     */
    render() {
        const max = this.options.maxNumber;

        let tableHTML = `
            <div class="addition-table-overlay" id="addition-table-overlay">
                <div class="addition-table-panel">
                    <div class="addition-table-header">
                        <h3>📊 Table d'addition</h3>
                        <button class="btn btn-icon close-table-btn" id="close-table-btn" title="Fermer">✕</button>
                    </div>
                    <div class="addition-table-content">
                        <table class="addition-table">
                            <thead>
                                <tr>
                                    <th class="corner">+</th>
        `;

        // Header row (0 to max)
        for (let i = 0; i <= max; i++) {
            tableHTML += `<th class="header-cell">${i}</th>`;
        }
        tableHTML += '</tr></thead><tbody>';

        // Table body
        for (let row = 0; row <= max; row++) {
            tableHTML += `<tr><th class="row-header">${row}</th>`;
            for (let col = 0; col <= max; col++) {
                const sum = row + col;
                const isHighlighted =
                    (this.options.highlightRow === row && this.options.highlightCol === col);
                tableHTML += `
                    <td class="sum-cell ${isHighlighted ? 'highlighted' : ''}" 
                        data-row="${row}" 
                        data-col="${col}">
                        ${sum}
                    </td>`;
            }
            tableHTML += '</tr>';
        }

        tableHTML += `
                            </tbody>
                        </table>
                    </div>
                    <p class="addition-table-hint">
                        💡 Trouve le premier nombre sur la ligne, le deuxième en haut, et regarde où ils se croisent !
                    </p>
                </div>
            </div>
        `;

        this.container.innerHTML = tableHTML;
        this.overlay = this.container.querySelector('#addition-table-overlay');
        this.setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Close button
        const closeBtn = this.container.querySelector('#close-table-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        // Click outside to close
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.hide();
                }
            });
        }

        // Hover effect on cells
        const cells = this.container.querySelectorAll('.sum-cell');
        cells.forEach(cell => {
            cell.addEventListener('mouseenter', () => {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                this.highlightCrossSection(row, col);
            });

            cell.addEventListener('mouseleave', () => {
                this.clearHighlights();
            });
        });
    }

    /**
     * Highlight a row and column
     * @param {number} row - Row to highlight
     * @param {number} col - Column to highlight
     */
    highlightCrossSection(row, col) {
        // Highlight row header
        const rowHeaders = this.container.querySelectorAll('.row-header');
        rowHeaders.forEach((header, index) => {
            header.classList.toggle('active', index === row);
        });

        // Highlight column header
        const colHeaders = this.container.querySelectorAll('.header-cell');
        colHeaders.forEach((header, index) => {
            header.classList.toggle('active', index === col);
        });

        // Highlight the target cell
        const cells = this.container.querySelectorAll('.sum-cell');
        cells.forEach(cell => {
            const cellRow = parseInt(cell.dataset.row);
            const cellCol = parseInt(cell.dataset.col);
            const isTarget = cellRow === row && cellCol === col;
            const isOnPath = (cellRow === row && cellCol <= col) || (cellCol === col && cellRow <= row);
            cell.classList.toggle('highlighted', isTarget);
            cell.classList.toggle('on-path', isOnPath && !isTarget);
        });
    }

    /**
     * Clear all highlights
     */
    clearHighlights() {
        this.container.querySelectorAll('.active, .highlighted, .on-path').forEach(el => {
            el.classList.remove('active', 'highlighted', 'on-path');
        });
    }

    /**
     * Show the table
     */
    show() {
        if (this.overlay) {
            this.overlay.classList.add('visible');
            this.isVisible = true;
        }
    }

    /**
     * Hide the table
     */
    hide() {
        if (this.overlay) {
            this.overlay.classList.remove('visible');
            this.isVisible = false;
        }
    }

    /**
     * Toggle visibility
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Check if table is visible
     * @returns {boolean}
     */
    getIsVisible() {
        return this.isVisible;
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Add component styles
const additionTableStyles = `
    .addition-table-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: var(--space-4);
        z-index: var(--z-modal);
        opacity: 0;
        visibility: hidden;
        transition: opacity var(--duration-normal), visibility var(--duration-normal);
    }

    .addition-table-overlay.visible {
        opacity: 1;
        visibility: visible;
    }

    .addition-table-panel {
        background: var(--bg-secondary);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-lg);
        max-width: 420px;
        max-height: 90vh;
        overflow: auto;
        animation: slideInRight var(--duration-normal) ease-out;
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .addition-table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-4);
        border-bottom: 1px solid var(--bg-accent);
        position: sticky;
        top: 0;
        background: var(--bg-secondary);
    }

    .addition-table-header h3 {
        margin: 0;
        font-size: var(--font-size-lg);
        color: var(--color-primary);
    }

    .close-table-btn {
        width: 36px;
        height: 36px;
        font-size: var(--font-size-lg);
    }

    .addition-table-content {
        padding: var(--space-3);
        overflow-x: auto;
    }

    .addition-table {
        border-collapse: collapse;
        width: 100%;
        font-size: var(--font-size-sm);
    }

    .addition-table th,
    .addition-table td {
        width: 32px;
        height: 32px;
        text-align: center;
        vertical-align: middle;
        border: 1px solid var(--bg-accent);
    }

    .addition-table .corner {
        background: var(--color-primary);
        color: var(--text-inverse);
        font-weight: var(--font-weight-bold);
        font-size: var(--font-size-lg);
    }

    .addition-table .header-cell {
        background: var(--color-primary-light);
        color: var(--text-inverse);
        font-weight: var(--font-weight-bold);
    }

    .addition-table .header-cell.active {
        background: var(--color-secondary);
    }

    .addition-table .row-header {
        background: var(--color-primary-light);
        color: var(--text-inverse);
        font-weight: var(--font-weight-bold);
    }

    .addition-table .row-header.active {
        background: var(--color-secondary);
    }

    .addition-table .sum-cell {
        background: var(--bg-accent);
        cursor: pointer;
        transition: all var(--duration-fast);
    }

    .addition-table .sum-cell:hover {
        background: var(--color-info);
        color: var(--text-inverse);
    }

    .addition-table .sum-cell.on-path {
        background: #E8F5E9;
    }

    .addition-table .sum-cell.highlighted {
        background: var(--color-success);
        color: var(--text-inverse);
        font-weight: var(--font-weight-bold);
        transform: scale(1.1);
    }

    .addition-table-hint {
        padding: var(--space-3) var(--space-4);
        margin: 0;
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        text-align: center;
        background: var(--bg-accent);
        border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    }

    /* Mobile adjustments */
    @media (max-width: 480px) {
        .addition-table-panel {
            max-width: 100%;
            margin: 0;
            border-radius: var(--radius-lg);
        }

        .addition-table th,
        .addition-table td {
            width: 26px;
            height: 26px;
            font-size: var(--font-size-xs);
        }
    }
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionTableStyles;
    document.head.appendChild(styleSheet);
}
