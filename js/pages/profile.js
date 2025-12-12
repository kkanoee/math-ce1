/**
 * MathCE1 - Profile Management Page
 * Manage child profiles (create, switch, edit, delete)
 * @module pages/profile
 */

import { CONFIG } from '../data/config.js';

/**
 * Profile management page component
 */
export class ProfilePage {
    constructor() {
        this.app = window.MathCE1;
        this.editingProfileId = null;
    }

    /**
     * Render the profile page
     * @returns {string} HTML content
     */
    render() {
        const children = this.app.storage.get('children') || [];
        const currentChild = this.app?.state?.get('currentChild');

        return `
            <div class="profile-page slide-up">
                <header class="page-header">
                    <button class="btn btn-icon" id="back-btn">
                        <span>←</span>
                    </button>
                    <h1 class="page-title">👤 Profils</h1>
                </header>

                <section class="profiles-section">
                    <h2 class="section-title">Mes profils</h2>
                    
                    <div class="profiles-list" id="profiles-list">
                        ${children.length > 0 ? children.map(child => this.renderProfileCard(child, currentChild?.id === child.id)).join('') : `
                            <div class="empty-profiles">
                                <span class="empty-icon">👶</span>
                                <p>Aucun profil créé</p>
                            </div>
                        `}
                    </div>
                </section>

                <section class="add-profile-section card">
                    <h2 class="section-title">➕ Ajouter un profil</h2>
                    <div class="add-profile-form">
                        <input
                            type="text"
                            id="new-profile-name"
                            class="input"
                            placeholder="Prénom de l'enfant"
                            maxlength="${CONFIG.LIMITS.MAX_NAME_LENGTH}"
                            autocomplete="off"
                        />
                        <button class="btn btn-primary" id="add-profile-btn">
                            <span>Créer</span>
                            <span class="btn-icon">✨</span>
                        </button>
                    </div>
                    <p class="profiles-limit-info">
                        ${children.length} / ${CONFIG.LIMITS.MAX_CHILDREN} profils
                    </p>
                </section>

                <!-- Edit Modal -->
                <div class="modal-overlay" id="edit-modal" hidden>
                    <div class="modal-content card">
                        <h3 class="modal-title">✏️ Modifier le profil</h3>
                        <input
                            type="text"
                            id="edit-profile-name"
                            class="input"
                            placeholder="Nouveau prénom"
                            maxlength="${CONFIG.LIMITS.MAX_NAME_LENGTH}"
                        />
                        <div class="modal-actions">
                            <button class="btn btn-outline" id="cancel-edit-btn">Annuler</button>
                            <button class="btn btn-primary" id="save-edit-btn">Enregistrer</button>
                        </div>
                    </div>
                </div>

                <!-- Delete Confirmation Modal -->
                <div class="modal-overlay" id="delete-modal" hidden>
                    <div class="modal-content card">
                        <h3 class="modal-title">🗑️ Supprimer le profil ?</h3>
                        <p class="modal-text" id="delete-confirm-text">
                            Toutes les données seront perdues.
                        </p>
                        <div class="modal-actions">
                            <button class="btn btn-outline" id="cancel-delete-btn">Annuler</button>
                            <button class="btn btn-danger" id="confirm-delete-btn">Supprimer</button>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .profile-page {
                    padding: var(--space-4);
                    max-width: 600px;
                    margin: 0 auto;
                }

                .page-header {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    margin-bottom: var(--space-6);
                }

                .page-title {
                    font-size: var(--font-size-2xl);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    margin: 0;
                }

                .section-title {
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-semibold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-4);
                }

                .profiles-section {
                    margin-bottom: var(--space-6);
                }

                .profiles-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-3);
                }

                .profile-card {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    padding: var(--space-4);
                    background: var(--bg-card);
                    border-radius: var(--radius-xl);
                    border: 3px solid transparent;
                    transition: all 0.2s ease;
                    cursor: pointer;
                    overflow: hidden;
                }

                .profile-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                }

                .profile-card.active {
                    border-color: var(--color-primary);
                    background: linear-gradient(135deg, rgba(74, 144, 217, 0.1), rgba(74, 144, 217, 0.05));
                }

                .profile-card.selecting {
                    transform: scale(0.98);
                    border-color: var(--color-success);
                    background: var(--bg-accent);
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
                }

                .profile-avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                }

                .profile-info {
                    flex: 1;
                }

                .profile-name {
                    font-size: var(--font-size-lg);
                    font-weight: var(--font-weight-bold);
                    color: var(--text-primary);
                    margin-bottom: var(--space-1);
                }

                .profile-stats {
                    display: flex;
                    gap: var(--space-3);
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                }

                .profile-actions {
                    display: flex;
                    gap: var(--space-2);
                }

                .profile-action-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: none;
                    background: var(--bg-secondary);
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .profile-action-btn:hover {
                    background: var(--bg-accent);
                    transform: scale(1.1);
                }

                .profile-action-btn.delete:hover {
                    background: var(--color-error-light);
                }

                .active-badge {
                    background: var(--color-success);
                    color: white;
                    font-size: var(--font-size-xs);
                    padding: 2px 8px;
                    border-radius: var(--radius-full);
                    margin-left: var(--space-2);
                }

                .empty-profiles {
                    text-align: center;
                    padding: var(--space-8);
                    color: var(--text-secondary);
                }

                .empty-icon {
                    font-size: 48px;
                    display: block;
                    margin-bottom: var(--space-3);
                }

                .add-profile-section {
                    padding: var(--space-5);
                }

                .add-profile-form {
                    display: flex;
                    gap: var(--space-3);
                    margin-bottom: var(--space-3);
                }

                .add-profile-form .input {
                    flex: 1;
                }

                .profiles-limit-info {
                    font-size: var(--font-size-sm);
                    color: var(--text-secondary);
                    text-align: center;
                }

                /* Modal styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: var(--space-4);
                }

                .modal-overlay[hidden] {
                    display: none;
                }

                .modal-content {
                    width: 100%;
                    max-width: 400px;
                    padding: var(--space-6);
                    animation: bounceIn 0.3s ease;
                }

                .modal-title {
                    font-size: var(--font-size-xl);
                    font-weight: var(--font-weight-bold);
                    margin-bottom: var(--space-4);
                    text-align: center;
                }

                .modal-text {
                    text-align: center;
                    color: var(--text-secondary);
                    margin-bottom: var(--space-4);
                }

                .modal-actions {
                    display: flex;
                    gap: var(--space-3);
                    margin-top: var(--space-4);
                }

                .modal-actions .btn {
                    flex: 1;
                    cursor: pointer;
                    pointer-events: auto;
                }

                .btn-danger {
                    background: linear-gradient(135deg, #E74C3C, #C0392B);
                    color: white;
                }

                .btn-danger:hover {
                    background: linear-gradient(135deg, #C0392B, #A93226);
                }

                @keyframes bounceIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
            </style>
        `;
    }

    /**
     * Render a single profile card
     */
    renderProfileCard(child, isActive) {
        return `
            <div class="profile-card ${isActive ? 'active' : ''}" data-profile-id="${child.id}">
                <div class="profile-avatar">
                    🦊
                </div>
                <div class="profile-info">
                    <div class="profile-name">
                        ${child.name}
                        ${isActive ? '<span class="active-badge">Actif</span>' : ''}
                    </div>
                    <div class="profile-stats">
                        <span>⭐ ${child.stars || 0} étoiles</span>
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="profile-action-btn edit" data-action="edit" data-id="${child.id}" title="Modifier">
                        ✏️
                    </button>
                    <button class="profile-action-btn delete" data-action="delete" data-id="${child.id}" title="Supprimer">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Initialize page after render
     */
    init() {
        this.setupEventListeners();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Back button
        document.getElementById('back-btn')?.addEventListener('click', () => {
            this.app.router.navigate('home');
        });

        // Add profile button
        document.getElementById('add-profile-btn')?.addEventListener('click', () => {
            this.handleAddProfile();
        });

        // Enter key in input
        document.getElementById('new-profile-name')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleAddProfile();
            }
        });

        // Profile card clicks (select profile)
        document.querySelectorAll('.profile-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't switch if clicking action buttons
                if (e.target.closest('.profile-action-btn')) return;

                const profileId = card.dataset.profileId;
                this.handleSelectProfile(profileId);
            });
        });

        // Edit buttons
        document.querySelectorAll('.profile-action-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const profileId = btn.dataset.id;
                this.showEditModal(profileId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.profile-action-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const profileId = btn.dataset.id;
                this.showDeleteModal(profileId);
            });
        });

        // Modal buttons
        document.getElementById('cancel-edit-btn')?.addEventListener('click', () => {
            this.hideEditModal();
        });

        document.getElementById('save-edit-btn')?.addEventListener('click', () => {
            this.handleSaveEdit();
        });

        document.getElementById('cancel-delete-btn')?.addEventListener('click', () => {
            this.hideDeleteModal();
        });

        document.getElementById('confirm-delete-btn')?.addEventListener('click', () => {
            this.handleConfirmDelete();
        });

        // Close modals on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.hideEditModal();
                    this.hideDeleteModal();
                }
            });
        });
    }

    /**
     * Handle adding a new profile
     */
    handleAddProfile() {
        const input = document.getElementById('new-profile-name');
        const name = input?.value?.trim();

        if (!name || name.length < 1) {
            input?.classList.add('shake');
            setTimeout(() => input?.classList.remove('shake'), 500);
            return;
        }

        const children = this.app.storage.get('children') || [];

        if (children.length >= CONFIG.LIMITS.MAX_CHILDREN) {
            alert(`Maximum ${CONFIG.LIMITS.MAX_CHILDREN} profils autorisés.`);
            return;
        }

        // Create new profile
        const newChild = {
            id: `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: name,
            avatar: { base: 'fox', accessories: [] },
            stars: 0,
            createdAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString(),
        };

        children.push(newChild);
        this.app.storage.set('children', children);

        // If no active child, set this one as active
        if (!this.app.state.get('currentChild')) {
            this.app.storage.set('activeChildId', newChild.id);
            this.app.state.set('currentChild', newChild);
        } else {
            // Even if there was one, switch to the new one
            this.app.storage.set('activeChildId', newChild.id);
            this.app.state.set('currentChild', newChild);
        }

        // Navigate to home with welcome param
        this.app.router.navigate('home/welcome');
    }

    /**
     * Handle selecting a profile
     */
    handleSelectProfile(profileId) {
        const children = this.app.storage.get('children') || [];
        const child = children.find(c => c.id === profileId);

        if (child) {
            // Visual feedback
            const card = document.querySelector(`.profile-card[data-profile-id="${profileId}"]`);
            if (card) {
                card.classList.add('selecting');
                this.app.audio?.playClick();
            }

            // Wait for animation then switch and navigate
            setTimeout(() => {
                this.app.storage.set('activeChildId', child.id);
                this.app.state.set('currentChild', child);

                // Navigate to home
                this.app.router.navigate('home');
            }, 500);
        }
    }

    /**
     * Show edit modal
     */
    showEditModal(profileId) {
        this.editingProfileId = profileId;
        const children = this.app.storage.get('children') || [];
        const child = children.find(c => c.id === profileId);

        if (child) {
            const input = document.getElementById('edit-profile-name');
            if (input) input.value = child.name;
            document.getElementById('edit-modal').hidden = false;
            input?.focus();
        }
    }

    /**
     * Hide edit modal
     */
    hideEditModal() {
        document.getElementById('edit-modal').hidden = true;
        this.editingProfileId = null;
    }

    /**
     * Handle saving edit
     */
    handleSaveEdit() {
        if (!this.editingProfileId) return;

        const input = document.getElementById('edit-profile-name');
        const newName = input?.value?.trim();

        if (!newName || newName.length < 1) {
            input?.classList.add('shake');
            setTimeout(() => input?.classList.remove('shake'), 500);
            return;
        }

        const children = this.app.storage.get('children') || [];
        const index = children.findIndex(c => c.id === this.editingProfileId);

        if (index >= 0) {
            children[index].name = newName;
            this.app.storage.set('children', children);

            // Update current child if it's the one being edited
            const currentChild = this.app.state.get('currentChild');
            if (currentChild?.id === this.editingProfileId) {
                currentChild.name = newName;
                this.app.state.set('currentChild', currentChild);
            }

            this.hideEditModal();
            this.app.router.render();
        }
    }

    /**
     * Show delete confirmation modal
     */
    showDeleteModal(profileId) {
        this.editingProfileId = profileId;
        const children = this.app.storage.get('children') || [];
        const child = children.find(c => c.id === profileId);

        if (child) {
            const text = document.getElementById('delete-confirm-text');
            if (text) text.textContent = `Supprimer le profil de ${child.name} ? Toutes les données seront perdues.`;
            document.getElementById('delete-modal').hidden = false;
        }
    }

    /**
     * Hide delete modal
     */
    hideDeleteModal() {
        document.getElementById('delete-modal').hidden = true;
        this.editingProfileId = null;
    }

    /**
     * Handle confirm delete
     */
    handleConfirmDelete() {
        if (!this.editingProfileId) return;

        const profileId = this.editingProfileId;

        // Hide modal first
        this.hideDeleteModal();

        // Find the card and animate its removal
        const card = document.querySelector(`[data-profile-id="${profileId}"]`);
        if (card) {
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'translateX(-100%)';
            card.style.opacity = '0';
            card.style.maxHeight = card.offsetHeight + 'px';

            // After initial slide, collapse the height
            setTimeout(() => {
                card.style.maxHeight = '0';
                card.style.padding = '0';
                card.style.margin = '0';
            }, 150);

            // After animation completes, update storage and DOM
            setTimeout(() => {
                const children = this.app.storage.get('children') || [];
                const filtered = children.filter(c => c.id !== profileId);
                this.app.storage.set('children', filtered);

                // If deleting current child, switch to another or clear
                const currentChild = this.app.state.get('currentChild');
                if (currentChild?.id === profileId) {
                    if (filtered.length > 0) {
                        this.app.storage.set('activeChildId', filtered[0].id);
                        this.app.state.set('currentChild', filtered[0]);
                    } else {
                        this.app.storage.set('activeChildId', null);
                        this.app.state.set('currentChild', null);
                    }
                }

                // Remove the card from DOM
                card.remove();

                // Update the profile count
                const limitInfo = document.querySelector('.profiles-limit-info');
                if (limitInfo) {
                    limitInfo.textContent = `${filtered.length} / ${CONFIG.LIMITS.MAX_CHILDREN} profils`;
                }

                // Re-render the list to update "Active" status on other cards
                this.app.router.render();
            }, 400);
        } else {
            // Fallback: just update storage and re-render
            const children = this.app.storage.get('children') || [];
            const filtered = children.filter(c => c.id !== profileId);
            this.app.storage.set('children', filtered);

            const currentChild = this.app.state.get('currentChild');
            if (currentChild?.id === profileId) {
                if (filtered.length > 0) {
                    this.app.storage.set('activeChildId', filtered[0].id);
                    this.app.state.set('currentChild', filtered[0]);
                } else {
                    this.app.storage.set('activeChildId', null);
                    this.app.state.set('currentChild', null);
                }
            }

            this.app.router.render();
        }
    }
}
