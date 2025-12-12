/**
 * MathCE1 - Service Worker
 * Cache-first strategy for offline support
 */

const CACHE_NAME = 'mathce1-v1';
const STATIC_CACHE = 'mathce1-static-v1';
const DYNAMIC_CACHE = 'mathce1-dynamic-v1';

// Files to cache on install (shell)
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/main.css',
    '/css/components.css',
    '/css/animations.css',
    '/css/exercises.css',
    '/js/app.js',
    '/js/router.js',
    '/js/core/storage.js',
    '/js/core/state.js',
    '/js/core/speech.js',
    '/js/core/audio.js',
    '/js/data/french-numbers.js',
    '/js/data/config.js',
    '/js/data/exercises/calcul.json',
    '/js/data/exercises/numeration.json',
    '/js/pages/home.js',
    '/js/pages/exercise.js',
    '/js/pages/domain-select.js',
    '/js/components/feedback.js',
    '/js/components/mic-button.js',
    '/js/components/keyboard.js',
    '/js/components/answer-display.js',
    '/assets/sounds/success.mp3',
    '/assets/sounds/encouragement.mp3',
    '/assets/sounds/click.mp3',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS.map(url => {
                    // Prefix with base path if needed
                    return new Request(url, { cache: 'reload' });
                })).catch((err) => {
                    console.warn('[SW] Some assets failed to cache:', err);
                    // Continue anyway - some files may not exist yet
                    return Promise.resolve();
                });
            })
            .then(() => {
                console.log('[SW] Static assets cached');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Service worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - cache-first strategy for static, network-first for dynamic
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests (except fonts)
    if (url.origin !== location.origin && !url.hostname.includes('fonts.')) {
        return;
    }

    // Handle different resource types
    if (isStaticAsset(url.pathname)) {
        // Cache-first for static assets
        event.respondWith(cacheFirst(request));
    } else if (url.pathname.includes('/data/exercises/')) {
        // Cache-first for exercise data (important for offline)
        event.respondWith(cacheFirst(request));
    } else {
        // Network-first for everything else
        event.respondWith(networkFirst(request));
    }
});

/**
 * Check if URL is a static asset
 */
function isStaticAsset(pathname) {
    return pathname.match(/\.(css|js|json|png|jpg|jpeg|gif|svg|mp3|woff2?)$/i);
}

/**
 * Cache-first strategy
 * Try cache, fallback to network, cache the response
 */
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.warn('[SW] Fetch failed for:', request.url);

        // Return offline fallback for HTML pages
        if (request.headers.get('Accept')?.includes('text/html')) {
            return caches.match('/index.html');
        }

        throw error;
    }
}

/**
 * Network-first strategy
 * Try network, fallback to cache
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.warn('[SW] Network failed, trying cache for:', request.url);

        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            return caches.match('/index.html');
        }

        throw error;
    }
}

// Listen for messages from the main app
self.addEventListener('message', (event) => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data.type === 'CACHE_EXERCISES') {
        // Cache additional exercise files on demand
        const exercises = event.data.files;
        caches.open(DYNAMIC_CACHE)
            .then((cache) => cache.addAll(exercises))
            .then(() => {
                event.ports[0].postMessage({ success: true });
            })
            .catch((err) => {
                event.ports[0].postMessage({ success: false, error: err.message });
            });
    }
});
