/**
 * MathCE1 - Simple Hash-Based SPA Router
 * @module router
 */

/**
 * Router class for single-page navigation
 */
export class Router {
    /**
     * Create a router instance
     * @param {Object} routes - Map of route names to page components
     */
    constructor(routes = {}) {
        this.routes = routes;
        this.currentPage = null;
        this.history = [];
        this.container = null;
        this.backButton = null;
    }

    /**
     * Initialize the router
     */
    init() {
        this.container = document.getElementById('main-content');
        this.backButton = document.getElementById('btn-back');
        this.profileButton = document.getElementById('btn-profile');

        if (!this.container) {
            console.error('Router: main-content container not found');
            return;
        }

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());

        // Handle initial route
        this.handleRoute();
    }

    /**
     * Handle route change
     */
    handleRoute() {
        const hash = window.location.hash.slice(1) || 'home';
        const [routeName, ...params] = hash.split('/');

        console.log(`🔀 Navigating to: ${routeName}`, params);

        // Update body attribute for CSS styling
        document.body.dataset.page = routeName || 'home';

        const PageComponent = this.routes[routeName];

        if (!PageComponent) {
            console.warn(`Route not found: ${routeName}, redirecting to home`);
            this.navigate('home');
            return;
        }

        // Clear current page
        this.clearPage();

        // Create new page instance
        try {
            this.currentPage = new PageComponent(params);

            // Render page
            const content = this.currentPage.render();

            if (typeof content === 'string') {
                this.container.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                this.container.appendChild(content);
            }

            // Initialize page after render
            if (this.currentPage.init) {
                this.currentPage.init();
            }

            // Update back button visibility
            this.updateBackButton();

            // Update profile button visibility
            this.updateProfileButtonVisibility(routeName || 'home');

            // Add page transition animation
            this.container.classList.add('page-enter');
            setTimeout(() => this.container.classList.remove('page-enter'), 300);

        } catch (error) {
            console.error(`Failed to render page ${routeName}:`, error);
            this.showError(routeName);
        }
    }

    /**
     * Navigate to a route
     * @param {string} route - Route name
     * @param {Object} params - Route parameters
     */
    navigate(route, params = {}) {
        // Save current route to history
        if (this.currentPage) {
            this.history.push(window.location.hash);
        }

        // Build hash with parameters
        let hash = route;
        if (Object.keys(params).length > 0) {
            const paramString = Object.values(params).join('/');
            hash = `${route}/${paramString}`;
        }

        window.location.hash = hash;
    }

    /**
     * Go back to previous page
     */
    back() {
        if (this.history.length > 0) {
            const previousHash = this.history.pop();
            window.location.hash = previousHash;
        } else {
            this.navigate('home');
        }
    }

    /**
     * Register a new route
     * @param {string} name - Route name
     * @param {Function} component - Page component class
     */
    register(name, component) {
        this.routes[name] = component;
    }

    /**
     * Clear current page content and cleanup
     */
    clearPage() {
        if (this.currentPage && this.currentPage.destroy) {
            this.currentPage.destroy();
        }
        this.container.innerHTML = '';
    }

    /**
     * Update back button visibility
     */
    updateBackButton() {
        if (this.backButton) {
            const isHome = window.location.hash === '' || window.location.hash === '#home';
            if (isHome) {
                this.backButton.style.setProperty('display', 'none', 'important');
            } else {
                this.backButton.style.display = '';
            }
        }
    }

    /**
     * Update profile button visibility
     * Shows only on home page
     * @param {string} routeName 
     */
    updateProfileButtonVisibility(routeName) {
        if (this.profileButton) {
            const isHome = routeName === 'home' || routeName === '';

            if (isHome) {
                this.profileButton.style.display = '';
                // Also remove hidden class just in case
                this.profileButton.classList.remove('hidden');
            } else {
                this.profileButton.style.setProperty('display', 'none', 'important');
            }
        }
    }

    /**
     * Show error page
     * @param {string} routeName - Failed route name
     */
    showError(routeName) {
        this.container.innerHTML = `
      <div class="error-page slide-up">
        <div class="error-icon">🤔</div>
        <h2>Oups !</h2>
        <p>Cette page n'existe pas encore.</p>
        <button class="btn btn-primary" onclick="window.location.hash='home'">
          Retour à l'accueil
        </button>
      </div>
    `;
    }
}

// Export singleton helper
let routerInstance = null;

export function getRouter() {
    return routerInstance;
}

export function setRouter(router) {
    routerInstance = router;
}
