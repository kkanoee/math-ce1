/**
 * MathCE1 - Avatar Items Data
 * Available avatar customization items
 * @module data/avatar-items
 */

export const AVATAR_ITEMS = {
    // Base avatars
    base: [
        { id: 'fox', name: 'Renard', icon: '🦊', cost: 0, default: true },
        { id: 'cat', name: 'Chat', icon: '🐱', cost: 20 },
        { id: 'dog', name: 'Chien', icon: '🐶', cost: 20 },
        { id: 'rabbit', name: 'Lapin', icon: '🐰', cost: 20 },
        { id: 'bear', name: 'Ours', icon: '🐻', cost: 30 },
        { id: 'panda', name: 'Panda', icon: '🐼', cost: 40 },
        { id: 'unicorn', name: 'Licorne', icon: '🦄', cost: 50 },
        { id: 'dragon', name: 'Dragon', icon: '🐲', cost: 75 },
    ],

    // Hats and headwear
    hats: [
        { id: 'crown', name: 'Couronne', icon: '👑', cost: 25 },
        { id: 'hat_party', name: 'Chapeau fête', icon: '🎉', cost: 15 },
        { id: 'hat_cowboy', name: 'Chapeau cowboy', icon: '🤠', cost: 20 },
        { id: 'hat_wizard', name: 'Chapeau magicien', icon: '🧙', cost: 35 },
        { id: 'hat_cap', name: 'Casquette', icon: '🧢', cost: 10 },
        { id: 'bow', name: 'Nœud', icon: '🎀', cost: 10 },
        { id: 'flower', name: 'Fleur', icon: '🌸', cost: 15 },
    ],

    // Accessories
    accessories: [
        { id: 'glasses', name: 'Lunettes', icon: '👓', cost: 15 },
        { id: 'sunglasses', name: 'Lunettes soleil', icon: '🕶️', cost: 20 },
        { id: 'star', name: 'Étoile', icon: '⭐', cost: 10 },
        { id: 'heart', name: 'Cœur', icon: '❤️', cost: 10 },
        { id: 'rainbow', name: 'Arc-en-ciel', icon: '🌈', cost: 25 },
        { id: 'sparkles', name: 'Éclats', icon: '✨', cost: 20 },
        { id: 'medal', name: 'Médaille', icon: '🏅', cost: 30 },
    ],

    // Backgrounds
    backgrounds: [
        { id: 'bg_blue', name: 'Bleu', color: '#3498DB', cost: 10 },
        { id: 'bg_green', name: 'Vert', color: '#2ECC71', cost: 10 },
        { id: 'bg_purple', name: 'Violet', color: '#9B59B6', cost: 10 },
        { id: 'bg_orange', name: 'Orange', color: '#E67E22', cost: 10 },
        { id: 'bg_pink', name: 'Rose', color: '#E91E63', cost: 10 },
        { id: 'bg_gradient1', name: 'Dégradé 1', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', cost: 25 },
        { id: 'bg_gradient2', name: 'Dégradé 2', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', cost: 25 },
        { id: 'bg_stars', name: 'Étoilé', special: 'stars', cost: 40 },
    ],

    // Frames
    frames: [
        { id: 'frame_circle', name: 'Cercle', shape: 'circle', cost: 0, default: true },
        { id: 'frame_square', name: 'Carré', shape: 'square', cost: 10 },
        { id: 'frame_star', name: 'Étoile', shape: 'star', cost: 20 },
        { id: 'frame_heart', name: 'Cœur', shape: 'heart', cost: 20 },
        { id: 'frame_gold', name: 'Or', style: 'gold', cost: 50 },
    ],
};

export const AVATAR_CATEGORIES = [
    { id: 'base', name: 'Avatar', icon: '😊' },
    { id: 'hats', name: 'Chapeaux', icon: '👒' },
    { id: 'accessories', name: 'Accessoires', icon: '🎀' },
    { id: 'backgrounds', name: 'Fonds', icon: '🎨' },
    { id: 'frames', name: 'Cadres', icon: '🖼️' },
];

export function getAvatarItem(category, itemId) {
    const items = AVATAR_ITEMS[category] || [];
    return items.find(item => item.id === itemId) || null;
}

export function getDefaultAvatar() {
    return {
        base: 'fox',
        hat: null,
        accessory: null,
        background: null,
        frame: 'frame_circle',
    };
}
