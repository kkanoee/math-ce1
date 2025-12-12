/**
 * MathCE1 - Avatar Manager Service
 * Handles avatar item purchase and equipment
 * @module services/avatar-manager
 */

import { getStorage } from '../core/storage.js';
import { AVATAR_ITEMS, getAvatarItem, getDefaultAvatar, AVATAR_CATEGORIES } from '../data/avatar-items.js';

/**
 * Avatar manager service
 */
export class AvatarManager {
    constructor() {
        this.storage = getStorage();
    }

    /**
     * Get owned items for a child
     * @param {string} childId - Child ID
     * @returns {Object} Owned items by category
     */
    getOwnedItems(childId) {
        const avatars = this.storage.get('avatars') || {};
        const childData = avatars[childId] || this.createDefaultData();
        return childData.owned;
    }

    /**
     * Get current avatar config for a child
     * @param {string} childId - Child ID
     * @returns {Object} Current avatar configuration
     */
    getAvatarConfig(childId) {
        const avatars = this.storage.get('avatars') || {};
        const childData = avatars[childId] || this.createDefaultData();
        return childData.equipped;
    }

    /**
     * Create default avatar data
     */
    createDefaultData() {
        return {
            owned: {
                base: ['fox'],
                hats: [],
                accessories: [],
                backgrounds: [],
                frames: ['frame_circle'],
            },
            equipped: getDefaultAvatar(),
        };
    }

    /**
     * Check if child can afford an item
     * @param {string} childId - Child ID
     * @param {number} cost - Item cost
     * @returns {boolean}
     */
    canAfford(childId, cost) {
        const stars = this.getStars(childId);
        return stars >= cost;
    }

    /**
     * Get child's star count
     */
    getStars(childId) {
        const children = this.storage.get('children') || [];
        const child = children.find(c => c.id === childId);
        return child?.stars || 0;
    }

    /**
     * Purchase an item
     * @param {string} childId - Child ID
     * @param {string} category - Item category
     * @param {string} itemId - Item ID
     * @returns {Object} Result { success, message, newStars }
     */
    purchaseItem(childId, category, itemId) {
        const item = getAvatarItem(category, itemId);

        if (!item) {
            return { success: false, message: 'Article introuvable' };
        }

        // Check if already owned
        const owned = this.getOwnedItems(childId);
        if (owned[category]?.includes(itemId)) {
            return { success: false, message: 'Tu as déjà cet article !' };
        }

        // Check if can afford
        if (!this.canAfford(childId, item.cost)) {
            return { success: false, message: 'Pas assez d\'étoiles !' };
        }

        // Deduct stars
        const newStars = this.deductStars(childId, item.cost);

        // Add to owned
        const avatars = this.storage.get('avatars') || {};
        if (!avatars[childId]) {
            avatars[childId] = this.createDefaultData();
        }

        if (!avatars[childId].owned[category]) {
            avatars[childId].owned[category] = [];
        }

        avatars[childId].owned[category].push(itemId);
        this.storage.set('avatars', avatars);

        return {
            success: true,
            message: 'Achat réussi !',
            newStars,
            item,
        };
    }

    /**
     * Deduct stars from child
     */
    deductStars(childId, amount) {
        const children = this.storage.get('children') || [];
        const childIndex = children.findIndex(c => c.id === childId);

        if (childIndex === -1) {
            return 0;
        }

        children[childIndex].stars = Math.max(0, (children[childIndex].stars || 0) - amount);
        this.storage.set('children', children);

        // Update app state
        window.MathCE1?.state?.set('currentChild', children[childIndex]);

        return children[childIndex].stars;
    }

    /**
     * Equip an item
     * @param {string} childId - Child ID
     * @param {string} category - Item category
     * @param {string} itemId - Item ID (or null to unequip)
     * @returns {Object} Result
     */
    equipItem(childId, category, itemId) {
        // Check if owned (unless it's free/default)
        if (itemId) {
            const item = getAvatarItem(category, itemId);
            if (!item?.default) {
                const owned = this.getOwnedItems(childId);
                if (!owned[category]?.includes(itemId)) {
                    return { success: false, message: 'Tu ne possèdes pas cet article' };
                }
            }
        }

        const avatars = this.storage.get('avatars') || {};
        if (!avatars[childId]) {
            avatars[childId] = this.createDefaultData();
        }

        // Map category to equipped key
        const equipKey = this.categoryToEquipKey(category);
        avatars[childId].equipped[equipKey] = itemId;

        this.storage.set('avatars', avatars);

        return {
            success: true,
            equipped: avatars[childId].equipped,
        };
    }

    /**
     * Map category to equipment key
     */
    categoryToEquipKey(category) {
        switch (category) {
            case 'base': return 'base';
            case 'hats': return 'hat';
            case 'accessories': return 'accessory';
            case 'backgrounds': return 'background';
            case 'frames': return 'frame';
            default: return category;
        }
    }

    /**
     * Get all available items with ownership status
     * @param {string} childId - Child ID
     * @returns {Object} Items by category with owned status
     */
    getShopItems(childId) {
        const owned = this.getOwnedItems(childId);
        const stars = this.getStars(childId);
        const result = {};

        AVATAR_CATEGORIES.forEach(category => {
            const items = AVATAR_ITEMS[category.id] || [];

            result[category.id] = items.map(item => ({
                ...item,
                owned: item.default || owned[category.id]?.includes(item.id),
                canAfford: stars >= item.cost,
            }));
        });

        return result;
    }

    /**
     * Reset avatar to default
     * @param {string} childId - Child ID
     */
    resetAvatar(childId) {
        const avatars = this.storage.get('avatars') || {};
        if (avatars[childId]) {
            avatars[childId].equipped = getDefaultAvatar();
            this.storage.set('avatars', avatars);
        }
    }
}

// Export singleton
let avatarManagerInstance = null;

export function getAvatarManager() {
    if (!avatarManagerInstance) {
        avatarManagerInstance = new AvatarManager();
    }
    return avatarManagerInstance;
}
