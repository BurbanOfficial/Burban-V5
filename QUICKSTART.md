# Guide de démarrage rapide

## 1. Cloner et installer

```bash
cd streetwear-ecommerce
npm install
cd backend && npm install && cd ..
```

## 2. Configuration Firebase

### Créer un projet Firebase

1. Aller sur https://console.firebase.google.com
2. Créer un nouveau projet
3. Activer Firestore Database
4. Activer Authentication (Email + Google)
5. Activer Storage
6. Activer Cloud Functions

### Récupérer les credentials

1. Project Settings → General
2. Copier la config Firebase
3. Remplacer les valeurs dans `js/config.js`

### Initialiser Firebase CLI

```bash
firebase login
firebase init
```

## 3. Configuration Stripe

Voir `STRIPE_SETUP.md`

## 4. Déployer

```bash
# Déployer tout
firebase deploy

# Ou seulement hosting
firebase deploy --only hosting

# Ou seulement functions
firebase deploy --only functions
```

## 5. Accéder au site

- **Site public** : https://yourdomain.firebaseapp.com
- **Admin** : https://yourdomain.firebaseapp.com/admin/login.html

## 6. Créer un compte admin

1. Créer un utilisateur via le formulaire d'inscription
2. Dans Firestore, aller à `users/{userId}`
3. Ajouter le champ `role: 'admin'`

## 7. Ajouter des produits

1. Aller à l'admin panel
2. Créer les produits avec :
   - Titre, description, SKU
   - Prix, stock, catégorie
   - Images (URLs)
   - Stripe Price ID (voir STRIPE_SETUP.md)

## 8. Configurer les bannières

1. Admin → Bannières
2. Ajouter des bannières avec images et texte
3. Elles apparaîtront automatiquement en hero

## Checklist de déploiement

- [ ] Firebase project créé et configuré
- [ ] Firestore rules déployées
- [ ] Stripe account configuré
- [ ] Cloud Functions déployées
- [ ] Variables d'environnement définies
- [ ] Admin user créé
- [ ] Produits ajoutés
- [ ] Bannières configurées
- [ ] Domain custom configuré (optionnel)
- [ ] SSL/HTTPS activé

## Troubleshooting

### "Firebase not defined"
- Vérifier que les scripts Firebase sont chargés dans index.html
- Vérifier la clé API dans config.js

### "Firestore permission denied"
- Vérifier les Firestore rules
- Vérifier que l'utilisateur est authentifié

### "Stripe error"
- Vérifier les clés Stripe dans config.js
- Vérifier que les Price IDs existent dans Stripe

### Images ne s'affichent pas
- Vérifier les URLs des images
- Vérifier les CORS settings

## Support

- Firebase Docs: https://firebase.google.com/docs
- Stripe Docs: https://stripe.com/docs
- GitHub Issues: Créer une issue sur le repo
