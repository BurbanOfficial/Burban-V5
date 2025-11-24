// Utility functions

// Debounce
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}

// Generate slug
function generateSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Get URL params
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params);
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}

// Keyboard navigation for dropdowns
function setupKeyboardNavigation() {
    document.querySelectorAll('[aria-haspopup="true"]').forEach(trigger => {
        trigger.addEventListener('keydown', e => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                trigger.setAttribute('aria-expanded', 'true');
                const submenu = trigger.nextElementSibling;
                if (submenu) submenu.querySelector('a')?.focus();
            }
        });
    });

    document.querySelectorAll('[role="menuitem"]').forEach(item => {
        item.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                e.preventDefault();
                const trigger = item.closest('.nav-submenu')?.previousElementSibling;
                if (trigger) {
                    trigger.setAttribute('aria-expanded', 'false');
                    trigger.focus();
                }
            }
        });
    });
}

// Fetch with error handling
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Get auth token
async function getAuthToken() {
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
    setupKeyboardNavigation();
});
