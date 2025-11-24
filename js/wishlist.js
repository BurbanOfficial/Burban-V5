// Wishlist management

class Wishlist {
    constructor() {
        this.items = this.loadWishlist();
    }

    loadWishlist() {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    }

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.items));
    }

    addItem(productId) {
        if (!this.items.includes(productId)) {
            this.items.push(productId);
            this.saveWishlist();
            this.syncToFirestore();
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(id => id !== productId);
        this.saveWishlist();
        this.syncToFirestore();
    }

    toggleItem(productId) {
        if (this.items.includes(productId)) {
            this.removeItem(productId);
        } else {
            this.addItem(productId);
        }
    }

    isInWishlist(productId) {
        return this.items.includes(productId);
    }

    async syncToFirestore() {
        const user = auth.currentUser;
        if (user) {
            try {
                await db.collection('users').doc(user.uid).update({
                    wishlist: this.items
                });
            } catch (error) {
                console.error('Error syncing wishlist:', error);
            }
        }
    }
}

const wishlist = new Wishlist();

// Sync wishlist from Firestore on login
async function syncWishlistToFirestore() {
    const user = auth.currentUser;
    if (user) {
        try {
            const doc = await db.collection('users').doc(user.uid).get();
            if (doc.exists && doc.data().wishlist) {
                wishlist.items = doc.data().wishlist;
                wishlist.saveWishlist();
            }
        } catch (error) {
            console.error('Error syncing wishlist:', error);
        }
    }
}

// Wishlist toggle
const wishlistToggle = document.querySelector('.wishlist-toggle');

wishlistToggle.addEventListener('click', e => {
    e.preventDefault();
    if (auth.currentUser) {
        displayWishlist();
    } else {
        displayAuthForm();
        authModal.removeAttribute('hidden');
    }
});

// Display wishlist
function displayWishlist() {
    const authContent = document.getElementById('authContent');
    authContent.innerHTML = `
        <h2 style="margin-bottom: var(--spacing-lg);">Mes favoris</h2>
        <div id="wishlistItems" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--spacing-md);"></div>
    `;

    loadWishlistItems();
    authModal.removeAttribute('hidden');
}

// Load wishlist items
async function loadWishlistItems() {
    const container = document.getElementById('wishlistItems');

    if (wishlist.items.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; color: var(--color-text-light);">Aucun favori pour le moment</p>';
        return;
    }

    try {
        const products = await Promise.all(
            wishlist.items.map(id => db.collection('products').doc(id).get())
        );

        const html = products
            .filter(doc => doc.exists)
            .map(doc => {
                const product = doc.data();
                return `
                    <div style="position: relative;">
                        <a href="/product/${generateSlug(product.title)}" style="text-decoration: none; color: var(--color-text);">
                            <div class="product-image">
                                <img src="${product.images?.[0]}" alt="${product.title}" loading="lazy">
                            </div>
                            <h3 style="font-size: 0.9rem; margin-bottom: var(--spacing-xs);">${product.title}</h3>
                            <p style="font-weight: 700; color: var(--color-accent);">${formatPrice(product.price)}</p>
                        </a>
                        <button onclick="wishlist.removeItem('${doc.id}'); loadWishlistItems();" style="position: absolute; top: var(--spacing-sm); right: var(--spacing-sm); background: var(--color-bg); border: 1px solid var(--color-border); width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">×</button>
                    </div>
                `;
            })
            .join('');

        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading wishlist items:', error);
    }
}

// Add to wishlist button
function createWishlistButton(productId) {
    const button = document.createElement('button');
    button.className = 'wishlist-btn';
    button.setAttribute('aria-label', 'Ajouter aux favoris');
    button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="${wishlist.isInWishlist(productId) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
    `;

    button.addEventListener('click', e => {
        e.preventDefault();
        wishlist.toggleItem(productId);
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${wishlist.isInWishlist(productId) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        `;
    });

    return button;
}
