// Search functionality

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchBar = document.getElementById('searchBar');
const searchToggle = document.querySelector('.search-toggle');

let allProducts = [];

// Load products for search
async function loadProductsForSearch() {
    try {
        const snapshot = await db.collection('products').get();
        allProducts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Search products
function searchProducts(query) {
    if (!query.trim()) {
        searchResults.innerHTML = '';
        return;
    }

    const lowerQuery = query.toLowerCase();
    const results = allProducts.filter(product => {
        const searchFields = [
            product.title,
            product.description,
            product.sku,
            ...(product.tags || [])
        ].join(' ').toLowerCase();

        return searchFields.includes(lowerQuery);
    }).slice(0, 8);

    displaySearchResults(results);
}

// Display search results
function displaySearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-light);">Aucun produit trouvé</p>';
        return;
    }

    searchResults.innerHTML = results.map(product => `
        <a href="/product/${generateSlug(product.title)}" class="search-result-item">
            <img src="${product.images?.[0]}" alt="${product.title}" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: var(--radius-md); margin-bottom: var(--spacing-xs);">
            <div style="font-size: 0.9rem; font-weight: 600;">${product.title}</div>
            <div style="font-size: 0.85rem; color: var(--color-text-light);">${formatPrice(product.price)}</div>
        </a>
    `).join('');
}

// Event listeners
searchToggle.addEventListener('click', () => {
    searchBar.toggleAttribute('hidden');
    if (!searchBar.hasAttribute('hidden')) {
        searchInput.focus();
    }
});

searchInput.addEventListener('input', debounce(e => {
    searchProducts(e.target.value);
}, 300));

// Close search on escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !searchBar.hasAttribute('hidden')) {
        searchBar.setAttribute('hidden', '');
    }
});

// Load products on init
loadProductsForSearch();
