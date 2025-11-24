# Structure du projet

```
streetwear-ecommerce/
├── index.html                 # Page d'accueil
├── contact.html              # Page de contact
├── orders.html               # Page des commandes utilisateur
├── success.html              # Page de confirmation de paiement
│
├── css/
│   ├── style.css            # Styles du site public (minimaliste, responsive)
│   └── admin.css            # Styles du CMS admin
│
├── js/
│   ├── config.js            # Configuration Firebase & Stripe
│   ├── firebase-init.js     # Initialisation Firebase
│   ├── utils.js             # Fonctions utilitaires (debounce, formatage, etc.)
│   ├── search.js            # Recherche full-text avec autocomplete
│   ├── cart.js              # Gestion du panier (localStorage)
│   ├── auth.js              # Authentification Firebase (email + Google)
│   ├── wishlist.js          # Gestion wishlist (localStorage + Firestore)
│   ├── carousel.js          # Hero carousel avec autoplay
│   └── app.js               # Routeur et logique principale
│
├── admin/
│   ├── index.html           # Dashboard admin
│   ├── login.html           # Page de login admin
│   └── admin.js             # Logique CRUD admin (produits, catégories, etc.)
│
├── backend/
│   ├── functions.js         # Cloud Functions (Stripe, webhooks, emails)
│   └── package.json         # Dépendances backend
│
├── public/
│   ├── images/              # Dossier pour images statiques
│   └── robots.txt           # Robots.txt pour SEO
│
├── firebase.json            # Configuration Firebase (hosting, functions)
├── firestore.rules          # Règles de sécurité Firestore
├── package.json             # Dépendances principales
├── .gitignore              # Fichiers à ignorer
│
├── README.md               # Documentation complète
├── QUICKSTART.md           # Guide de démarrage rapide
├── STRIPE_SETUP.md         # Configuration Stripe
└── STRUCTURE.md            # Ce fichier
```

## Fichiers clés

### Frontend (Public)

**index.html**
- Structure sémantique
- Header avec navigation responsive
- Hero carousel
- Marquee infini
- Footer
- Modals (panier, auth)

**css/style.css**
- Design minimaliste (palette neutre + accent noir)
- Variables CSS pour thème
- Mobile-first responsive
- Accessibilité WCAG AA
- Animations discrètes
- Lazy loading images

**js/app.js**
- Routeur SPA (Single Page Application)
- Chargement dynamique des pages
- Gestion des catégories et produits
- Intégration avec Firestore

**js/cart.js**
- Gestion panier (localStorage)
- Intégration Stripe Checkout
- Synchronisation avec backend

**js/auth.js**
- Authentification Firebase
- Email/password + Google OAuth
- Gestion profil utilisateur
- Historique commandes

**js/wishlist.js**
- Wishlist locale (localStorage)
- Synchronisation Firestore si connecté
- Ajout/suppression favoris

**js/search.js**
- Recherche full-text
- Autocomplete instantané
- Suggestions as-you-type

**js/carousel.js**
- Hero carousel avec autoplay
- Navigation clavier
- Pause on hover
- Progress bar

### Admin (CMS)

**admin/index.html**
- Dashboard avec statistiques
- Navigation sidebar
- Sections CRUD

**admin/admin.js**
- CRUD produits (titre, description, SKU, prix, stock, images, variantes, Stripe ID)
- CRUD catégories
- CRUD bannières (texte, bouton, image, ordre)
- CRUD pages (About, Contact, etc.)
- CRUD guides des tailles
- Upload médias (Firebase Storage)
- Gestion utilisateurs et rôles

### Backend (Cloud Functions)

**backend/functions.js**
- `createCheckoutSession` : Créer session Stripe
- `stripeWebhook` : Traiter webhooks Stripe
- `getUserOrders` : Récupérer commandes utilisateur
- `updateUserProfile` : Mettre à jour profil
- `generateSitemap` : Générer sitemap.xml
- `generateRobots` : Générer robots.txt

## Collections Firestore

### products
```
{
  title, description, sku, price, stock, category,
  images[], stripeId, featured, slug, variants,
  tags[], createdAt
}
```

### users
```
{
  email, firstName, lastName, address, phone,
  role, wishlist[], createdAt
}
```

### orders
```
{
  userId, stripeSessionId, amount, currency,
  status, email, createdAt
}
```

### banners
```
{
  title, buttonText, buttonLink, image,
  active, order, createdAt
}
```

### pages
```
{
  title, content, slug, metaDescription, createdAt
}
```

### sizeGuides
```
{
  title, description, content, slug, createdAt
}
```

### categories
```
{
  name, slug, createdAt
}
```

## Flux utilisateur

### Achat
1. Parcourir produits (homepage, catégories)
2. Rechercher produits
3. Voir détails produit (galerie, couleur, taille)
4. Ajouter au panier
5. Voir panier
6. Checkout Stripe
7. Paiement
8. Confirmation (success.html)
9. Email de confirmation

### Authentification
1. Cliquer profil
2. Choisir login ou signup
3. Email/password ou Google OAuth
4. Redirection profil
5. Voir historique commandes
6. Gérer wishlist

### Admin
1. Login admin
2. Dashboard (stats)
3. Gérer produits (CRUD)
4. Gérer catégories
5. Gérer bannières
6. Gérer pages
7. Gérer guides des tailles
8. Upload médias

## Performance

- **Images** : Lazy loading, WebP/AVIF fallback
- **Cache** : HTTP headers (31536000s pour assets)
- **Compression** : Gzip automatique
- **Offline** : Firestore persistence
- **SEO** : JSON-LD, sitemap, robots.txt

## Sécurité

- **Firestore Rules** : Restrictives par défaut
- **Auth** : Firebase Auth sécurisée
- **Stripe** : Pas de PCI sur le site
- **Webhooks** : Signature Stripe vérifiée
- **HTTPS** : Obligatoire
- **CORS** : Configuré

## Déploiement

```bash
# Développement
firebase emulators:start

# Production
firebase deploy

# Ou sélectif
firebase deploy --only hosting
firebase deploy --only functions
```

## Hébergement GitHub

Pour GitHub Pages :
```bash
npm install --save-dev gh-pages
npm run deploy
```

Ou utiliser GitHub Actions pour CI/CD automatique.
