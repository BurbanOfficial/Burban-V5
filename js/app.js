// Main app logic

// Menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMain = document.getElementById('navMain');

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navMain.setAttribute('aria-expanded', !isExpanded);
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMain.setAttribute('aria-expanded', 'false');
    });
});

// Router
async function router() {
    const path = window.location.pathname;
    const mainContent = document.getElementById('mainContent');

    if (path === '/') {
        loadHomepage();
    } else if (path.startsWith('/product/')) {
        const slug = path.split('/')[2];
        loadProductPage(slug);
    } else if (path.startsWith('/category/')) {
        const category = path.split('/')[2];
        loadCategoryPage(category);
    } else if (path === '/cart') {
        displayCart();
    } else if (path === '/about') {
        loadPage('about');
    } else if (path === '/contact') {
        loadPage('contact');
    } else if (path === '/size-guides') {
        loadSizeGuides();
    } else {
        mainContent.innerHTML = '<h1>Page non trouvée</h1>';
    }
}

// Load homepage
async function loadHomepage() {
    const mainContent = document.getElementById('mainContent');
    try {
        const snapshot = await db.collection('products').where('featured', '==', true).limit(12).get();
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        mainContent.innerHTML = `
            <section>
                <h1 style="font-size: 2.5rem; margin-bottom: var(--spacing-lg); font-weight: 700;">Nouveautés</h1>
                <div class="products-grid">
                    ${products.map(product => createProductCard(product)).join('')}
                </div>
            </section>
        `;
    } catch (error) {
        console.error('Error loading homepage:', error);
    }
}

// Create product card
function createProductCard(product) {
    return `
        <a href="/product/${generateSlug(product.title)}" class="product-card">
            <div class="product-image">
                <img src="${product.images?.[0]}" alt="${product.title}" loading="lazy">
                ${product.featured ? '<span class="product-badge">Nouveau</span>' : ''}
            </div>
            <div class="product-info">
                <h3>${product.title}</h3>
                <p style="color: var(--color-text-light); font-size: 0.9rem; margin-bottom: var(--spacing-xs);">${product.category}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button onclick="event.preventDefault(); wishlist.toggleItem('${product.id}');" style="background: none; border: none; cursor: pointer; color: var(--color-text); padding: var(--spacing-xs);">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="${wishlist.isInWishlist(product.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </a>
    `;
}

// Load product page
async function loadProductPage(slug) {
    const mainContent = document.getElementById('mainContent');
    try {
        const snapshot = await db.collection('products').where('slug', '==', slug).limit(1).get();
        if (snapshot.empty) {
            mainContent.innerHTML = '<h1>Produit non trouvé</h1>';
            return;
        }

        const product = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

        mainContent.innerHTML = `
            <div class="product-detail">
                <div class="product-gallery">
                    <div class="gallery-thumbnails">
                        ${product.images.map((img, i) => `
                            <div class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="switchImage(this, '${img}')">
                                <img src="${img}" alt="Thumbnail ${i + 1}" loading="lazy">
                            </div>
                        `).join('')}
                    </div>
                    <div class="gallery-main">
                        <img id="mainImage" src="${product.images[0]}" alt="${product.title}" loading="lazy">
                    </div>
                </div>

                <div class="product-details">
                    <h1>${product.title}</h1>
                    <p class="price">${formatPrice(product.price)}</p>
                    <p class="description">${product.description}</p>

                    <div class="color-selector">
                        <label>Couleur</label>
                        <div class="color-options">
                            ${product.variants.colors.map(color => `
                                <button class="color-option" style="background-color: ${color.hex};" onclick="selectColor(this, '${color.name}', ${JSON.stringify(color.images).replace(/"/g, '&quot;')})" title="${color.name}"></button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="size-selector" id="sizeSelector" style="display: none;">
                        <label>Taille</label>
                        <div class="size-options">
                            ${product.variants.sizes.map(size => `
                                <button class="size-option" onclick="selectSize(this, '${size}')">${size}</button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="quantity-selector">
                        <button onclick="decreaseQuantity()">−</button>
                        <input type="number" id="quantity" value="1" min="1" max="${product.stock}">
                        <button onclick="increaseQuantity()">+</button>
                    </div>

                    <button class="btn-add-cart" onclick="addToCart('${product.id}', '${product.title}', ${product.price}, '${product.images[0]}', '${product.stripeId}')">Ajouter au panier</button>

                    <div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
                        <p><strong>Guide des tailles:</strong> <a href="/size-guide/${product.sizeGuideSlug}" style="color: var(--color-accent); text-decoration: none;">Consulter</a></p>
                        <p style="color: var(--color-text-light); font-size: 0.9rem; margin-top: var(--spacing-md);">SKU: ${product.sku}</p>
                    </div>
                </div>
            </div>

            <section style="margin-top: var(--spacing-xl);">
                <h2 style="margin-bottom: var(--spacing-lg);">Produits similaires</h2>
                <div class="products-grid" id="similarProducts"></div>
            </section>
        `;

        loadSimilarProducts(product.category, product.id);
    } catch (error) {
        console.error('Error loading product:', error);
    }
}

// Select color
function selectColor(button, colorName, images) {
    document.querySelectorAll('.color-option').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    document.getElementById('sizeSelector').style.display = 'block';
    document.getElementById('mainImage').src = images[0];
}

// Select size
function selectSize(button, size) {
    document.querySelectorAll('.size-option').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// Quantity controls
function increaseQuantity() {
    const input = document.getElementById('quantity');
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Add to cart
function addToCart(productId, title, price, image, stripeId) {
    const color = document.querySelector('.color-option.active')?.title;
    const size = document.querySelector('.size-option.active')?.textContent;
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!color || !size) {
        alert('Veuillez sélectionner une couleur et une taille');
        return;
    }

    cart.addItem({ id: productId, title, price, images: [image], stripeId }, color, size, quantity);
    alert('Produit ajouté au panier');
}

// Load category page
async function loadCategoryPage(category) {
    const mainContent = document.getElementById('mainContent');
    try {
        const snapshot = await db.collection('products').where('category', '==', category).get();
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        mainContent.innerHTML = `
            <h1 style="text-transform: capitalize; margin-bottom: var(--spacing-lg);">${category}</h1>
            <div class="products-grid">
                ${products.map(product => createProductCard(product)).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error loading category:', error);
    }
}

// Load similar products
async function loadSimilarProducts(category, excludeId) {
    try {
        const snapshot = await db.collection('products')
            .where('category', '==', category)
            .limit(4)
            .get();

        const products = snapshot.docs
            .filter(doc => doc.id !== excludeId)
            .slice(0, 3)
            .map(doc => ({ id: doc.id, ...doc.data() }));

        document.getElementById('similarProducts').innerHTML = products
            .map(product => createProductCard(product))
            .join('');
    } catch (error) {
        console.error('Error loading similar products:', error);
    }
}

// Load page
async function loadPage(pageSlug) {
    const mainContent = document.getElementById('mainContent');
    try {
        const snapshot = await db.collection('pages').where('slug', '==', pageSlug).limit(1).get();
        if (snapshot.empty) {
            mainContent.innerHTML = '<h1>Page non trouvée</h1>';
            return;
        }

        const page = snapshot.docs[0].data();
        mainContent.innerHTML = `
            <h1>${page.title}</h1>
            <div style="margin-top: var(--spacing-lg); line-height: 1.8;">${page.content}</div>
        `;
    } catch (error) {
        console.error('Error loading page:', error);
    }
}

// Load size guides
async function loadSizeGuides() {
    const mainContent = document.getElementById('mainContent');
    try {
        const snapshot = await db.collection('sizeGuides').get();
        const guides = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        mainContent.innerHTML = `
            <h1 style="margin-bottom: var(--spacing-lg);">Guides des tailles</h1>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--spacing-lg);">
                ${guides.map(guide => `
                    <a href="/size-guide/${guide.slug}" style="text-decoration: none; color: var(--color-text); padding: var(--spacing-lg); border: 1px solid var(--color-border); border-radius: var(--radius-md); transition: all var(--transition);" onmouseover="this.style.borderColor='var(--color-accent)'" onmouseout="this.style.borderColor='var(--color-border)'">
                        <h3>${guide.title}</h3>
                        <p style="color: var(--color-text-light); margin-top: var(--spacing-sm);">${guide.description}</p>
                    </a>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error loading size guides:', error);
    }
}

// Switch image
function switchImage(thumb, imageSrc) {
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    document.getElementById('mainImage').src = imageSrc;
}

// Initialize router
window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', router);
