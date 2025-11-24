// Cart management

class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(product, color, size, quantity = 1) {
        const existingItem = this.items.find(
            item => item.id === product.id && item.color === color && item.size === size
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images?.[0],
                color,
                size,
                quantity,
                stripeId: product.stripeId
            });
        }

        this.saveCart();
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.saveCart();
    }

    updateQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeItem(index);
        } else {
            this.items[index].quantity = quantity;
            this.saveCart();
        }
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = count;
    }

    clear() {
        this.items = [];
        this.saveCart();
    }
}

const cart = new Cart();

// Cart modal
const cartModal = document.getElementById('cartModal');
const cartToggle = document.querySelector('.cart-toggle');
const modalClose = cartModal.querySelector('.modal-close');

cartToggle.addEventListener('click', e => {
    e.preventDefault();
    displayCart();
    cartModal.removeAttribute('hidden');
});

modalClose.addEventListener('click', () => {
    cartModal.setAttribute('hidden', '');
});

cartModal.addEventListener('click', e => {
    if (e.target === cartModal) {
        cartModal.setAttribute('hidden', '');
    }
});

// Display cart
function displayCart() {
    const cartContent = document.getElementById('cartContent');

    if (cart.items.length === 0) {
        cartContent.innerHTML = `
            <h2>Panier vide</h2>
            <p style="color: var(--color-text-light); margin: var(--spacing-lg) 0;">Continuez vos achats pour ajouter des articles.</p>
            <a href="/" style="display: inline-block; padding: var(--spacing-sm) var(--spacing-lg); background: var(--color-accent); color: var(--color-bg); text-decoration: none; border-radius: var(--radius-md);">Continuer</a>
        `;
        return;
    }

    const itemsHTML = cart.items.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="cart-item-details">
                <h3>${item.title}</h3>
                <p>${item.color} / ${item.size}</p>
                <p style="font-weight: 600;">${formatPrice(item.price)}</p>
            </div>
            <div class="cart-item-actions">
                <div style="display: flex; gap: var(--spacing-xs);">
                    <button onclick="cart.updateQuantity(${index}, ${item.quantity - 1})" style="width: 30px; height: 30px; border: 1px solid var(--color-border); background: var(--color-bg); cursor: pointer; border-radius: var(--radius-sm);">−</button>
                    <input type="number" value="${item.quantity}" min="1" onchange="cart.updateQuantity(${index}, parseInt(this.value))" style="width: 50px; text-align: center; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">
                    <button onclick="cart.updateQuantity(${index}, ${item.quantity + 1})" style="width: 30px; height: 30px; border: 1px solid var(--color-border); background: var(--color-bg); cursor: pointer; border-radius: var(--radius-sm);">+</button>
                </div>
                <button onclick="cart.removeItem(${index}); displayCart();" style="background: none; border: none; color: var(--color-text-light); cursor: pointer; text-decoration: underline;">Supprimer</button>
            </div>
        </div>
    `).join('');

    const total = cart.getTotal();

    cartContent.innerHTML = `
        <h2>Panier</h2>
        <div class="cart-items" style="margin: var(--spacing-lg) 0;">
            ${itemsHTML}
        </div>
        <div class="cart-summary" style="position: static; margin-top: var(--spacing-lg);">
            <div class="cart-summary-row">
                <span>Sous-total</span>
                <span>${formatPrice(total)}</span>
            </div>
            <div class="cart-summary-row">
                <span>Livraison</span>
                <span>À calculer</span>
            </div>
            <div class="cart-summary-row">
                <span>Total</span>
                <span>${formatPrice(total)}</span>
            </div>
            <button class="btn-checkout" onclick="goToCheckout()">Passer la commande</button>
        </div>
    `;
}

// Checkout
async function goToCheckout() {
    if (cart.items.length === 0) return;

    try {
        const token = await getAuthToken();
        const response = await fetchAPI('/api/checkout', {
            method: 'POST',
            body: JSON.stringify({
                items: cart.items,
                total: cart.getTotal()
            }),
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (response.sessionId) {
            const stripe = Stripe(STRIPE_PUBLIC_KEY);
            await stripe.redirectToCheckout({ sessionId: response.sessionId });
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Erreur lors du paiement. Veuillez réessayer.');
    }
}
