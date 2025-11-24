// Admin panel

const storage = firebase.storage();

// Auth check
auth.onAuthStateChanged(async user => {
    if (!user) {
        window.location.href = '/admin/login.html';
        return;
    }

    // Check admin role
    const userDoc = await db.collection('users').doc(user.uid).get();
    if (!userDoc.data()?.role || !['admin', 'editor'].includes(userDoc.data().role)) {
        alert('Accès refusé');
        window.location.href = '/';
        return;
    }

    document.getElementById('userInfo').textContent = user.email;
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = '/admin/login.html';
    });
});

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const section = link.dataset.section;
        loadSection(section);
    });
});

// Load sections
async function loadSection(section) {
    const content = document.getElementById('adminContent');
    const title = document.getElementById('pageTitle');

    switch (section) {
        case 'dashboard':
            title.textContent = 'Dashboard';
            loadDashboard();
            break;
        case 'products':
            title.textContent = 'Produits';
            loadProducts();
            break;
        case 'categories':
            title.textContent = 'Catégories';
            loadCategories();
            break;
        case 'banners':
            title.textContent = 'Bannières';
            loadBanners();
            break;
        case 'pages':
            title.textContent = 'Pages';
            loadPages();
            break;
        case 'size-guides':
            title.textContent = 'Guides des tailles';
            loadSizeGuides();
            break;
        case 'media':
            title.textContent = 'Médias';
            loadMedia();
            break;
        case 'settings':
            title.textContent = 'Paramètres';
            loadSettings();
            break;
    }
}

// Dashboard
async function loadDashboard() {
    const content = document.getElementById('adminContent');
    try {
        const productsCount = (await db.collection('products').get()).size;
        const ordersCount = (await db.collection('orders').get()).size;
        const usersCount = (await db.collection('users').get()).size;

        content.innerHTML = `
            <div class="grid">
                <div class="card">
                    <h3>Produits</h3>
                    <p style="font-size: 2rem; font-weight: 700; margin-top: var(--spacing-md);">${productsCount}</p>
                </div>
                <div class="card">
                    <h3>Commandes</h3>
                    <p style="font-size: 2rem; font-weight: 700; margin-top: var(--spacing-md);">${ordersCount}</p>
                </div>
                <div class="card">
                    <h3>Utilisateurs</h3>
                    <p style="font-size: 2rem; font-weight: 700; margin-top: var(--spacing-md);">${usersCount}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Products
async function loadProducts() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <button class="btn btn-primary" onclick="showProductForm()">+ Ajouter un produit</button>
        <div id="productsList" style="margin-top: var(--spacing-lg);"></div>
    `;

    try {
        const snapshot = await db.collection('products').get();
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const html = `
            <table class="table" style="margin-top: var(--spacing-lg);">
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>SKU</th>
                        <th>Prix</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(p => `
                        <tr>
                            <td>${p.title}</td>
                            <td>${p.sku}</td>
                            <td>${formatPrice(p.price)}</td>
                            <td>${p.stock}</td>
                            <td>
                                <button class="btn btn-secondary" onclick="editProduct('${p.id}')">Éditer</button>
                                <button class="btn btn-danger" onclick="deleteProduct('${p.id}')">Supprimer</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.getElementById('productsList').innerHTML = html;
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Show product form
function showProductForm() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <form id="productForm" style="max-width: 600px;">
            <div class="form-group">
                <label>Titre</label>
                <input type="text" id="productTitle" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="productDescription" required></textarea>
            </div>
            <div class="form-group">
                <label>SKU</label>
                <input type="text" id="productSku" required>
            </div>
            <div class="form-group">
                <label>Prix</label>
                <input type="number" id="productPrice" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Stock</label>
                <input type="number" id="productStock" required>
            </div>
            <div class="form-group">
                <label>Catégorie</label>
                <input type="text" id="productCategory" required>
            </div>
            <div class="form-group">
                <label>Images (URLs, séparées par des virgules)</label>
                <textarea id="productImages" required></textarea>
            </div>
            <div class="form-group">
                <label>Stripe Price ID</label>
                <input type="text" id="productStripeId" required>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="productFeatured">
                    Produit en vedette
                </label>
            </div>
            <div class="btn-group">
                <button type="submit" class="btn btn-primary">Enregistrer</button>
                <button type="button" class="btn btn-secondary" onclick="loadProducts()">Annuler</button>
            </div>
        </form>
    `;

    document.getElementById('productForm').addEventListener('submit', saveProduct);
}

// Save product
async function saveProduct(e) {
    e.preventDefault();
    try {
        const product = {
            title: document.getElementById('productTitle').value,
            description: document.getElementById('productDescription').value,
            sku: document.getElementById('productSku').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            category: document.getElementById('productCategory').value,
            images: document.getElementById('productImages').value.split(',').map(s => s.trim()),
            stripeId: document.getElementById('productStripeId').value,
            featured: document.getElementById('productFeatured').checked,
            slug: generateSlug(document.getElementById('productTitle').value),
            variants: {
                colors: [],
                sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
            },
            tags: [],
            createdAt: new Date()
        };

        await db.collection('products').add(product);
        alert('Produit enregistré');
        loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        alert('Erreur lors de l\'enregistrement');
    }
}

// Delete product
async function deleteProduct(id) {
    if (confirm('Êtes-vous sûr?')) {
        try {
            await db.collection('products').doc(id).delete();
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}

// Categories
async function loadCategories() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <button class="btn btn-primary" onclick="showCategoryForm()">+ Ajouter une catégorie</button>
        <div id="categoriesList" style="margin-top: var(--spacing-lg);"></div>
    `;

    try {
        const snapshot = await db.collection('categories').get();
        const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const html = `
            <table class="table" style="margin-top: var(--spacing-lg);">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Slug</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${categories.map(c => `
                        <tr>
                            <td>${c.name}</td>
                            <td>${c.slug}</td>
                            <td>
                                <button class="btn btn-danger" onclick="deleteCategory('${c.id}')">Supprimer</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.getElementById('categoriesList').innerHTML = html;
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Show category form
function showCategoryForm() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <form id="categoryForm" style="max-width: 400px;">
            <div class="form-group">
                <label>Nom</label>
                <input type="text" id="categoryName" required>
            </div>
            <div class="btn-group">
                <button type="submit" class="btn btn-primary">Enregistrer</button>
                <button type="button" class="btn btn-secondary" onclick="loadCategories()">Annuler</button>
            </div>
        </form>
    `;

    document.getElementById('categoryForm').addEventListener('submit', saveCategory);
}

// Save category
async function saveCategory(e) {
    e.preventDefault();
    try {
        const name = document.getElementById('categoryName').value;
        await db.collection('categories').add({
            name,
            slug: generateSlug(name),
            createdAt: new Date()
        });
        alert('Catégorie enregistrée');
        loadCategories();
    } catch (error) {
        console.error('Error saving category:', error);
    }
}

// Delete category
async function deleteCategory(id) {
    if (confirm('Êtes-vous sûr?')) {
        try {
            await db.collection('categories').doc(id).delete();
            loadCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }
}

// Banners
async function loadBanners() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <button class="btn btn-primary" onclick="showBannerForm()">+ Ajouter une bannière</button>
        <div id="bannersList" style="margin-top: var(--spacing-lg);"></div>
    `;

    try {
        const snapshot = await db.collection('banners').orderBy('order').get();
        const banners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const html = `
            <table class="table" style="margin-top: var(--spacing-lg);">
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Actif</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${banners.map(b => `
                        <tr>
                            <td>${b.title}</td>
                            <td>${b.active ? 'Oui' : 'Non'}</td>
                            <td>
                                <button class="btn btn-danger" onclick="deleteBanner('${b.id}')">Supprimer</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.getElementById('bannersList').innerHTML = html;
    } catch (error) {
        console.error('Error loading banners:', error);
    }
}

// Show banner form
function showBannerForm() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <form id="bannerForm" style="max-width: 600px;">
            <div class="form-group">
                <label>Titre</label>
                <input type="text" id="bannerTitle" required>
            </div>
            <div class="form-group">
                <label>Texte du bouton</label>
                <input type="text" id="bannerButtonText" required>
            </div>
            <div class="form-group">
                <label>Lien du bouton</label>
                <input type="text" id="bannerButtonLink" required>
            </div>
            <div class="form-group">
                <label>Image (URL)</label>
                <input type="text" id="bannerImage" required>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="bannerActive" checked>
                    Actif
                </label>
            </div>
            <div class="btn-group">
                <button type="submit" class="btn btn-primary">Enregistrer</button>
                <button type="button" class="btn btn-secondary" onclick="loadBanners()">Annuler</button>
            </div>
        </form>
    `;

    document.getElementById('bannerForm').addEventListener('submit', saveBanner);
}

// Save banner
async function saveBanner(e) {
    e.preventDefault();
    try {
        const count = (await db.collection('banners').get()).size;
        await db.collection('banners').add({
            title: document.getElementById('bannerTitle').value,
            buttonText: document.getElementById('bannerButtonText').value,
            buttonLink: document.getElementById('bannerButtonLink').value,
            image: document.getElementById('bannerImage').value,
            active: document.getElementById('bannerActive').checked,
            order: count,
            createdAt: new Date()
        });
        alert('Bannière enregistrée');
        loadBanners();
    } catch (error) {
        console.error('Error saving banner:', error);
    }
}

// Delete banner
async function deleteBanner(id) {
    if (confirm('Êtes-vous sûr?')) {
        try {
            await db.collection('banners').doc(id).delete();
            loadBanners();
        } catch (error) {
            console.error('Error deleting banner:', error);
        }
    }
}

// Pages
async function loadPages() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <button class="btn btn-primary" onclick="showPageForm()">+ Ajouter une page</button>
        <div id="pagesList" style="margin-top: var(--spacing-lg);"></div>
    `;

    try {
        const snapshot = await db.collection('pages').get();
        const pages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const html = `
            <table class="table" style="margin-top: var(--spacing-lg);">
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Slug</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${pages.map(p => `
                        <tr>
                            <td>${p.title}</td>
                            <td>${p.slug}</td>
                            <td>
                                <button class="btn btn-danger" onclick="deletePage('${p.id}')">Supprimer</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.getElementById('pagesList').innerHTML = html;
    } catch (error) {
        console.error('Error loading pages:', error);
    }
}

// Show page form
function showPageForm() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <form id="pageForm" style="max-width: 600px;">
            <div class="form-group">
                <label>Titre</label>
                <input type="text" id="pageTitle" required>
            </div>
            <div class="form-group">
                <label>Contenu</label>
                <textarea id="pageContent" required></textarea>
            </div>
            <div class="form-group">
                <label>Meta Description</label>
                <input type="text" id="pageMetaDescription">
            </div>
            <div class="btn-group">
                <button type="submit" class="btn btn-primary">Enregistrer</button>
                <button type="button" class="btn btn-secondary" onclick="loadPages()">Annuler</button>
            </div>
        </form>
    `;

    document.getElementById('pageForm').addEventListener('submit', savePage);
}

// Save page
async function savePage(e) {
    e.preventDefault();
    try {
        const title = document.getElementById('pageTitle').value;
        await db.collection('pages').add({
            title,
            content: document.getElementById('pageContent').value,
            metaDescription: document.getElementById('pageMetaDescription').value,
            slug: generateSlug(title),
            createdAt: new Date()
        });
        alert('Page enregistrée');
        loadPages();
    } catch (error) {
        console.error('Error saving page:', error);
    }
}

// Delete page
async function deletePage(id) {
    if (confirm('Êtes-vous sûr?')) {
        try {
            await db.collection('pages').doc(id).delete();
            loadPages();
        } catch (error) {
            console.error('Error deleting page:', error);
        }
    }
}

// Size guides
async function loadSizeGuides() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <button class="btn btn-primary" onclick="showSizeGuideForm()">+ Ajouter un guide</button>
        <div id="guidesList" style="margin-top: var(--spacing-lg);"></div>
    `;

    try {
        const snapshot = await db.collection('sizeGuides').get();
        const guides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const html = `
            <table class="table" style="margin-top: var(--spacing-lg);">
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${guides.map(g => `
                        <tr>
                            <td>${g.title}</td>
                            <td>
                                <button class="btn btn-danger" onclick="deleteSizeGuide('${g.id}')">Supprimer</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.getElementById('guidesList').innerHTML = html;
    } catch (error) {
        console.error('Error loading size guides:', error);
    }
}

// Show size guide form
function showSizeGuideForm() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <form id="guideForm" style="max-width: 600px;">
            <div class="form-group">
                <label>Titre</label>
                <input type="text" id="guideTitle" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="guideDescription" required></textarea>
            </div>
            <div class="form-group">
                <label>Contenu (HTML)</label>
                <textarea id="guideContent" required></textarea>
            </div>
            <div class="btn-group">
                <button type="submit" class="btn btn-primary">Enregistrer</button>
                <button type="button" class="btn btn-secondary" onclick="loadSizeGuides()">Annuler</button>
            </div>
        </form>
    `;

    document.getElementById('guideForm').addEventListener('submit', saveSizeGuide);
}

// Save size guide
async function saveSizeGuide(e) {
    e.preventDefault();
    try {
        const title = document.getElementById('guideTitle').value;
        await db.collection('sizeGuides').add({
            title,
            description: document.getElementById('guideDescription').value,
            content: document.getElementById('guideContent').value,
            slug: generateSlug(title),
            createdAt: new Date()
        });
        alert('Guide enregistré');
        loadSizeGuides();
    } catch (error) {
        console.error('Error saving size guide:', error);
    }
}

// Delete size guide
async function deleteSizeGuide(id) {
    if (confirm('Êtes-vous sûr?')) {
        try {
            await db.collection('sizeGuides').doc(id).delete();
            loadSizeGuides();
        } catch (error) {
            console.error('Error deleting size guide:', error);
        }
    }
}

// Media
async function loadMedia() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <div class="form-group">
            <label>Télécharger une image</label>
            <input type="file" id="mediaUpload" accept="image/*">
            <button class="btn btn-primary" onclick="uploadMedia()" style="margin-top: var(--spacing-sm);">Télécharger</button>
        </div>
        <div id="mediaList" style="margin-top: var(--spacing-lg);"></div>
    `;

    loadMediaList();
}

// Upload media
async function uploadMedia() {
    const file = document.getElementById('mediaUpload').files[0];
    if (!file) return;

    try {
        const ref = storage.ref(`media/${Date.now()}_${file.name}`);
        await ref.put(file);
        const url = await ref.getDownloadURL();
        alert('Image téléchargée: ' + url);
        loadMediaList();
    } catch (error) {
        console.error('Error uploading media:', error);
    }
}

// Load media list
async function loadMediaList() {
    try {
        const result = await storage.ref('media').listAll();
        const urls = await Promise.all(result.items.map(item => item.getDownloadURL()));

        const html = `
            <div class="grid">
                ${urls.map(url => `
                    <div class="card" style="padding: 0; overflow: hidden;">
                        <img src="${url}" alt="Media" style="width: 100%; aspect-ratio: 1; object-fit: cover;">
                        <div style="padding: var(--spacing-sm);">
                            <input type="text" value="${url}" readonly style="width: 100%; padding: var(--spacing-xs); font-size: 0.8rem;">
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        document.getElementById('mediaList').innerHTML = html;
    } catch (error) {
        console.error('Error loading media:', error);
    }
}

// Settings
async function loadSettings() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <div style="max-width: 600px;">
            <h2 style="margin-bottom: var(--spacing-lg);">Paramètres</h2>
            <div class="form-group">
                <label>Nom du site</label>
                <input type="text" id="siteName" value="BRAND">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="siteDescription">Streetwear minimaliste et moderne</textarea>
            </div>
            <button class="btn btn-primary" onclick="saveSettings()">Enregistrer</button>
        </div>
    `;
}

// Save settings
async function saveSettings() {
    try {
        await db.collection('settings').doc('general').set({
            siteName: document.getElementById('siteName').value,
            siteDescription: document.getElementById('siteDescription').value
        });
        alert('Paramètres enregistrés');
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

// Initialize
loadDashboard();
