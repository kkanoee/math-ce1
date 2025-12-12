/**
 * MathCE1 - Manipulables Index
 * Exports all manipulable components
 * @module components/manipulables
 */

export { CubeManipulable } from './cube.js';
export { TokenManipulable } from './token.js';

/**
 * Factory function to create appropriate manipulable
 * @param {string} type - Type of manipulable ('cube', 'token', 'rod')
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} options - Configuration options
 * @returns {Object} Manipulable instance
 */
export function createManipulable(type, canvas, options = {}) {
    switch (type) {
        case 'cube':
            const { CubeManipulable } = require('./cube.js');
            return new CubeManipulable(canvas, options);

        case 'token':
            const { TokenManipulable } = require('./token.js');
            return new TokenManipulable(canvas, options);

        default:
            console.warn(`Unknown manipulable type: ${type}`);
            return null;
    }
}
