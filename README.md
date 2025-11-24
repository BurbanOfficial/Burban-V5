# Streetwear E-Commerce Platform

Site e-commerce minimaliste et moderne pour marque streetwear, avec CMS auto-hébergé et paiements Stripe.

## Architecture

### Frontend (HTML/CSS/JS)
- **Design** : Minimaliste, responsive, accessible (WCAG AA)
- **Framework** : Vanilla JS + Firebase SDK
- **Styling** : CSS custom properties, mobile-first
- **Performance** : Lazy loading, image optimization, caching

### Backend
- **Firebase** : Firestore (DB), Auth, Storage
- **Cloud Functions** : Stripe checkout, webhooks, emails
- **Email** : SendGrid pour notifications

### CMS Admin
- **Auth** : Rôles (admin/editor)
- **CRUD** : Produits, catégories, pages, bannières, guides des tailles
- **Media** : Upload et gestion d'images
- **Import/Export** : CSV/JSON

## Installation

### 1. Prérequis
- Node.js 18+
- Firebase CLI
- Compte Stripe
- Compte SendGrid

### 2. Configuration Firebase

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialiser le projet
firebase init
```

### 3. Variables d'environnement

Créer `.env.local` :
```
FIREBASE_API_KEY=<votre_clé>
FIREBASE_PROJECT_ID=<votre_projet>
STRIPE_PUBLIC_KEY=<votre_clé_publique>
STRIPE_SECRET_KEY=<votre_clé_secrète>
SENDGRID_API_KEY=<votre_clé>
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### 4. Déployer

```bash
# Déployer hosting + functions
firebase deploy

# Ou seulement hosting
firebase deploy --only hosting

# Ou seulement functions
firebase deploy --only functions
```

## Structure des données Firestore

### Collections

**products**
```javascript
{
  title: string,
  description: string,
  sku: string,
  price: number,
  stock: number,
  category: string,
  images: string[],
  stripeId: string,
  featured: boolean,
  slug: string,
  variants: {
    colors: [{name, hex, images}],
    sizes: string[]
  },
  tags: string[],
  createdAt: timestamp
}
```

**users**
```javascript
{
  email: string,
  firstName: string,
  lastName: string,
  address: string,
  phone: string,
  role: 'user' | 'admin' | 'editor',
  wishlist: string[],
  createdAt: timestamp
}
```

**orders**
```javascript
{
  userId: string,
  stripeSessionId: string,
  amount: number,
  currency: string,
  status: string,
  email: string,
  createdAt: timestamp
}
```

**banners**
```javascript
{
  title: string,
  buttonText: string,
  buttonLink: string,
  image: string,
  active: boolean,
  order: number,
  createdAt: timestamp
}
```

**pages**
```javascript
{
  title: string,
  content: string,
  slug: string,
  metaDescription: string,
  createdAt: timestamp
}
```

**sizeGuides**
```javascript
{
  title: string,
  description: string,
  content: string,
  slug: string,
  createdAt: timestamp
}
```

## Fonctionnalités

### Site Public
- ✅ Catalogue produits avec filtrage
- ✅ Recherche full-text avec autocomplete
- ✅ Panier persistant (localStorage)
- ✅ Checkout Stripe sécurisé
- ✅ Authentification Firebase (email + Google)
- ✅ Wishlist synchronisée
- ✅ Galerie produit avec sélection couleur/taille
- ✅ Bannière hero avec carousel
- ✅ Marquee infini
- ✅ Navigation responsive avec sous-menus
- ✅ SEO (JSON-LD, sitemap, robots.txt)

### CMS Admin
- ✅ Dashboard avec statistiques
- ✅ CRUD produits avec variantes
- ✅ Gestion catégories
- ✅ Gestion bannières
- ✅ Gestion pages
- ✅ Gestion guides des tailles
- ✅ Upload médias
- ✅ Contrôle d'accès par rôle

### Accessibilité
- ✅ Navigation au clavier
- ✅ Labels ARIA
- ✅ Contraste WCAG AA
- ✅ Respect prefers-reduced-motion
- ✅ Tous éléments interactifs focusables

### Performance
- ✅ Lazy loading images
- ✅ Cache HTTP headers
- ✅ Compression assets
- ✅ Offline persistence (Firestore)

## Déploiement sur GitHub Pages

Pour héberger sur GitHub Pages :

```bash
# Installer gh-pages
npm install --save-dev gh-pages

# Ajouter au package.json
"deploy": "gh-pages -d public"

# Déployer
npm run deploy
```

Ou utiliser GitHub Actions pour déploiement automatique.

## Sécurité

- ✅ Firestore rules restrictives
- ✅ Auth Firebase sécurisée
- ✅ Pas de clés secrètes en frontend
- ✅ Validation côté serveur
- ✅ HTTPS obligatoire
- ✅ CORS configuré

## Internationalisation

Textes traduisibles en FR/EN via CMS. Ajouter traductions dans Firestore :

```javascript
{
  key: 'product.addToCart',
  fr: 'Ajouter au panier',
  en: 'Add to cart'
}
```

## Support

Pour questions ou issues, consulter la documentation Firebase et Stripe.
