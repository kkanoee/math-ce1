/**
 * MathCE1 - French Numbers Mapping (0-100)
 * Handles conversion between spoken French and numeric values
 * @module data/french-numbers
 */

/**
 * Base number words in French
 */
const UNITS = {
    'zéro': 0,
    'zero': 0,
    'un': 1,
    'une': 1,
    'deux': 2,
    'trois': 3,
    'quatre': 4,
    'cinq': 5,
    'six': 6,
    'sept': 7,
    'huit': 8,
    'neuf': 9,
    'dix': 10,
    'onze': 11,
    'douze': 12,
    'treize': 13,
    'quatorze': 14,
    'quinze': 15,
    'seize': 16,
};

/**
 * Tens in French
 */
const TENS = {
    'vingt': 20,
    'trente': 30,
    'quarante': 40,
    'cinquante': 50,
    'soixante': 60,
    // 70, 80, 90 are handled specially
};

/**
 * Special French number forms (70-99)
 */
const SPECIAL_NUMBERS = {
    // 70-79 (soixante-dix, soixante et onze, etc.)
    'soixante-dix': 70,
    'soixante dix': 70,
    'soixante et onze': 71,
    'soixante-onze': 71,
    'soixante onze': 71,
    'soixante-douze': 72,
    'soixante douze': 72,
    'soixante-treize': 73,
    'soixante treize': 73,
    'soixante-quatorze': 74,
    'soixante quatorze': 74,
    'soixante-quinze': 75,
    'soixante quinze': 75,
    'soixante-seize': 76,
    'soixante seize': 76,
    'soixante-dix-sept': 77,
    'soixante dix sept': 77,
    'soixante-dix-huit': 78,
    'soixante dix huit': 78,
    'soixante-dix-neuf': 79,
    'soixante dix neuf': 79,

    // 80-89 (quatre-vingts, quatre-vingt-un, etc.)
    'quatre-vingts': 80,
    'quatre vingts': 80,
    'quatre-vingt': 80,
    'quatre vingt': 80,
    'quatre-vingt-un': 81,
    'quatre vingt un': 81,
    'quatre-vingt-une': 81,
    'quatre-vingt-deux': 82,
    'quatre vingt deux': 82,
    'quatre-vingt-trois': 83,
    'quatre vingt trois': 83,
    'quatre-vingt-quatre': 84,
    'quatre vingt quatre': 84,
    'quatre-vingt-cinq': 85,
    'quatre vingt cinq': 85,
    'quatre-vingt-six': 86,
    'quatre vingt six': 86,
    'quatre-vingt-sept': 87,
    'quatre vingt sept': 87,
    'quatre-vingt-huit': 88,
    'quatre vingt huit': 88,
    'quatre-vingt-neuf': 89,
    'quatre vingt neuf': 89,

    // 90-99 (quatre-vingt-dix, etc.)
    'quatre-vingt-dix': 90,
    'quatre vingt dix': 90,
    'quatre-vingt-onze': 91,
    'quatre vingt onze': 91,
    'quatre-vingt-douze': 92,
    'quatre vingt douze': 92,
    'quatre-vingt-treize': 93,
    'quatre vingt treize': 93,
    'quatre-vingt-quatorze': 94,
    'quatre vingt quatorze': 94,
    'quatre-vingt-quinze': 95,
    'quatre vingt quinze': 95,
    'quatre-vingt-seize': 96,
    'quatre vingt seize': 96,
    'quatre-vingt-dix-sept': 97,
    'quatre vingt dix sept': 97,
    'quatre-vingt-dix-huit': 98,
    'quatre vingt dix huit': 98,
    'quatre-vingt-dix-neuf': 99,
    'quatre vingt dix neuf': 99,

    // 100
    'cent': 100,
};

/**
 * Complete mapping for quick lookup
 */
const ALL_NUMBERS = {};

// Build complete mapping
function buildMapping() {
    // Add units (0-16)
    Object.assign(ALL_NUMBERS, UNITS);

    // Add 17-19
    ALL_NUMBERS['dix-sept'] = 17;
    ALL_NUMBERS['dix sept'] = 17;
    ALL_NUMBERS['dix-huit'] = 18;
    ALL_NUMBERS['dix huit'] = 18;
    ALL_NUMBERS['dix-neuf'] = 19;
    ALL_NUMBERS['dix neuf'] = 19;

    // Add regular tens (20-69)
    Object.entries(TENS).forEach(([word, value]) => {
        ALL_NUMBERS[word] = value;

        // Add tens + units (e.g., vingt-et-un, vingt-deux)
        Object.entries(UNITS).forEach(([unitWord, unitValue]) => {
            if (unitValue >= 1 && unitValue <= 9) {
                if (unitValue === 1) {
                    // Special case: vingt et un
                    ALL_NUMBERS[`${word} et un`] = value + 1;
                    ALL_NUMBERS[`${word}-et-un`] = value + 1;
                    ALL_NUMBERS[`${word} et une`] = value + 1;
                } else {
                    ALL_NUMBERS[`${word}-${unitWord}`] = value + unitValue;
                    ALL_NUMBERS[`${word} ${unitWord}`] = value + unitValue;
                }
            }
        });
    });

    // Add special numbers (70-100)
    Object.assign(ALL_NUMBERS, SPECIAL_NUMBERS);
}

buildMapping();

/**
 * Convert French text to a number
 * @param {string} text - French number text
 * @returns {number|null} Numeric value or null if not recognized
 */
export function frenchToNumber(text) {
    if (!text || typeof text !== 'string') {
        return null;
    }

    // Normalize text
    const normalized = text
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/\s+/g, ' ');           // Normalize spaces

    // Try direct lookup first
    if (normalized in ALL_NUMBERS) {
        return ALL_NUMBERS[normalized];
    }

    // Try with different hyphen/space variations
    const withHyphens = normalized.replace(/ /g, '-');
    if (withHyphens in ALL_NUMBERS) {
        return ALL_NUMBERS[withHyphens];
    }

    const withSpaces = normalized.replace(/-/g, ' ');
    if (withSpaces in ALL_NUMBERS) {
        return ALL_NUMBERS[withSpaces];
    }

    // Try to extract a number from the text
    const extracted = extractNumber(normalized);
    if (extracted !== null) {
        return extracted;
    }

    return null;
}

/**
 * Try to extract a number from text that may contain extra words
 * @param {string} text - Text to parse
 * @returns {number|null}
 */
function extractNumber(text) {
    // Check if text contains a digit string
    const digitMatch = text.match(/\b(\d+)\b/);
    if (digitMatch) {
        const num = parseInt(digitMatch[1], 10);
        if (num >= 0 && num <= 100) {
            return num;
        }
    }

    // Try each known number as a substring
    for (const [word, value] of Object.entries(ALL_NUMBERS)) {
        if (text.includes(word)) {
            return value;
        }
    }

    return null;
}

/**
 * Convert a number to French text
 * @param {number} num - Number to convert (0-100)
 * @returns {string|null} French text or null if out of range
 */
export function numberToFrench(num) {
    if (typeof num !== 'number' || num < 0 || num > 100 || !Number.isInteger(num)) {
        return null;
    }

    // Find the entry with this value
    for (const [word, value] of Object.entries(ALL_NUMBERS)) {
        if (value === num && word.includes('-')) {
            // Prefer hyphenated forms
            return word;
        }
    }

    // Fallback: find any matching entry
    for (const [word, value] of Object.entries(ALL_NUMBERS)) {
        if (value === num) {
            return word;
        }
    }

    return null;
}

/**
 * Get all variants of a number
 * @param {number} num - Number
 * @returns {string[]} All French text variants
 */
export function getNumberVariants(num) {
    const variants = [];

    for (const [word, value] of Object.entries(ALL_NUMBERS)) {
        if (value === num) {
            variants.push(word);
        }
    }

    return variants;
}

/**
 * Check if text could be a French number
 * @param {string} text - Text to check
 * @returns {boolean}
 */
export function isFrenchNumber(text) {
    return frenchToNumber(text) !== null;
}

/**
 * Get the complete number mapping (for testing)
 * @returns {Object}
 */
export function getAllMappings() {
    return { ...ALL_NUMBERS };
}

export { ALL_NUMBERS, UNITS, TENS, SPECIAL_NUMBERS };
