# Configuration Stripe

## 1. Créer un compte Stripe

1. Aller sur https://stripe.com
2. Créer un compte
3. Vérifier l'email

## 2. Obtenir les clés API

1. Aller à Dashboard → Developers → API keys
2. Copier :
   - **Publishable key** → `STRIPE_PUBLIC_KEY` dans `js/config.js`
   - **Secret key** → `STRIPE_SECRET_KEY` dans les variables d'environnement Firebase

## 3. Créer les produits et prix

### Via Dashboard Stripe

1. Aller à Products
2. Créer un produit pour chaque variante (couleur + taille)
3. Ajouter un prix pour chaque produit
4. Copier le **Price ID** (commence par `price_`)

### Exemple de structure

```
Produit: "Hoodie Noir - S"
Price ID: price_1234567890
```

### Via API (recommandé pour automatisation)

```javascript
// Dans le CMS admin, lors de création d'un produit
const product = await stripe.products.create({
  name: `${productTitle} - ${color} - ${size}`,
  metadata: {
    productId: productId,
    color: color,
    size: size
  }
});

const price = await stripe.prices.create({
  product: product.id,
  unit_amount: Math.round(productPrice * 100), // en centimes
  currency: 'eur'
});

// Sauvegarder price.id dans Firestore
```

## 4. Configurer les webhooks

1. Aller à Developers → Webhooks
2. Ajouter un endpoint :
   - URL: `https://yourdomain.com/api/stripe-webhook`
   - Événements à écouter:
     - `checkout.session.completed`
     - `payment_intent.succeeded`

3. Copier le **Signing secret** → `STRIPE_WEBHOOK_SECRET`

## 5. Variables d'environnement Firebase

Ajouter dans Firebase Console → Project Settings → Environment variables :

```
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
DOMAIN=https://yourdomain.com
```

## 6. Tester en mode test

Utiliser les numéros de carte de test Stripe :

- **Succès** : 4242 4242 4242 4242
- **Décliné** : 4000 0000 0000 0002
- **Authentification requise** : 4000 0025 0000 3155

Expiration : 12/25, CVC : 123

## 7. Passer en production

1. Activer le mode Live dans Stripe Dashboard
2. Utiliser les clés Live (commencent par `pk_live_` et `sk_live_`)
3. Mettre à jour les variables d'environnement
4. Redéployer les Cloud Functions

## Intégration dans le CMS

Lors de la création d'un produit dans le CMS :

1. Créer le produit dans Stripe
2. Créer les prix pour chaque variante
3. Sauvegarder les Price IDs dans Firestore
4. Utiliser ces IDs lors du checkout

## Gestion des commandes

Les commandes sont créées automatiquement via le webhook `checkout.session.completed`.

Structure de la commande :
```javascript
{
  userId: string,
  stripeSessionId: string,
  amount: number,
  currency: string,
  status: 'completed' | 'pending' | 'failed',
  email: string,
  items: [{
    productId: string,
    title: string,
    price: number,
    quantity: number,
    color: string,
    size: string
  }],
  createdAt: timestamp
}
```

## Support

- Documentation Stripe : https://stripe.com/docs
- API Reference : https://stripe.com/docs/api
- Webhooks : https://stripe.com/docs/webhooks
