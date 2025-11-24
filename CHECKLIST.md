# Checklist de mise en production

## Avant le lancement

### Configuration Firebase
- [ ] Créer un projet Firebase
- [ ] Activer Firestore Database
- [ ] Activer Authentication (Email + Google)
- [ ] Activer Cloud Storage
- [ ] Activer Cloud Functions
- [ ] Copier les credentials dans `js/config.js`
- [ ] Déployer les Firestore rules
- [ ] Créer les indexes Firestore

### Configuration Stripe
- [ ] Créer un compte Stripe
- [ ] Obtenir les clés API (Publishable + Secret)
- [ ] Créer les produits et prix dans Stripe
- [ ] Configurer les webhooks
- [ ] Copier les clés dans les variables d'environnement
- [ ] Tester avec les numéros de carte de test

### Configuration SendGrid
- [ ] Créer un compte SendGrid
- [ ] Obtenir la clé API
- [ ] Configurer l'email d'envoi
- [ ] Ajouter aux variables d'environnement

### Backend
- [ ] Installer les dépendances (`npm install` dans `backend/`)
- [ ] Configurer les variables d'environnement
- [ ] Déployer les Cloud Functions (`firebase deploy --only functions`)
- [ ] Tester les webhooks Stripe

### Frontend
- [ ] Vérifier tous les liens (internes et externes)
- [ ] Tester la recherche
- [ ] Tester le panier
- [ ] Tester le checkout Stripe
- [ ] Tester l'authentification (email + Google)
- [ ] Tester la wishlist
- [ ] Tester le carousel
- [ ] Vérifier la responsive (mobile, tablet, desktop)
- [ ] Vérifier l'accessibilité (navigation clavier, contraste)

### CMS Admin
- [ ] Créer un compte admin
- [ ] Ajouter des produits
- [ ] Ajouter des catégories
- [ ] Ajouter des bannières
- [ ] Ajouter des pages (About, Contact)
- [ ] Ajouter des guides des tailles
- [ ] Tester l'upload de médias
- [ ] Vérifier les permissions (rôles)

### SEO
- [ ] Ajouter les métadonnées (title, description, og:image)
- [ ] Générer le sitemap.xml
- [ ] Générer le robots.txt
- [ ] Ajouter les schémas JSON-LD
- [ ] Vérifier avec Google Search Console
- [ ] Vérifier avec Lighthouse

### Sécurité
- [ ] Vérifier les Firestore rules
- [ ] Vérifier les CORS settings
- [ ] Activer HTTPS
- [ ] Vérifier les variables d'environnement (pas de secrets en frontend)
- [ ] Tester les injections XSS
- [ ] Tester les injections SQL (Firestore)
- [ ] Vérifier la validation des données

### Performance
- [ ] Vérifier le lazy loading des images
- [ ] Vérifier le caching HTTP
- [ ] Minifier CSS/JS
- [ ] Compresser les images
- [ ] Tester avec Lighthouse
- [ ] Vérifier les Core Web Vitals

### Déploiement
- [ ] Configurer le domaine personnalisé
- [ ] Configurer le SSL/HTTPS
- [ ] Déployer le hosting (`firebase deploy --only hosting`)
- [ ] Vérifier que le site est accessible
- [ ] Vérifier les logs Firebase
- [ ] Configurer les backups

## Après le lancement

### Monitoring
- [ ] Configurer Google Analytics
- [ ] Configurer Sentry pour error tracking
- [ ] Configurer les alertes Firebase
- [ ] Vérifier les logs Cloud Functions

### Maintenance
- [ ] Mettre à jour les dépendances régulièrement
- [ ] Vérifier les erreurs dans les logs
- [ ] Sauvegarder les données Firestore
- [ ] Mettre à jour le contenu (produits, pages)
- [ ] Vérifier les performances

### Marketing
- [ ] Ajouter les réseaux sociaux
- [ ] Configurer les emails de notification
- [ ] Ajouter les avis clients
- [ ] Configurer les promotions/codes promo
- [ ] Ajouter les newsletters

## Tests

### Tests fonctionnels
- [ ] Créer un compte utilisateur
- [ ] Se connecter avec email/password
- [ ] Se connecter avec Google
- [ ] Ajouter un produit au panier
- [ ] Modifier la quantité
- [ ] Supprimer du panier
- [ ] Passer une commande
- [ ] Recevoir l'email de confirmation
- [ ] Voir l'historique des commandes
- [ ] Ajouter à la wishlist
- [ ] Rechercher un produit
- [ ] Filtrer par catégorie

### Tests de sécurité
- [ ] Tester l'accès non autorisé à l'admin
- [ ] Tester la modification de données d'autres utilisateurs
- [ ] Tester les injections XSS
- [ ] Tester les CSRF
- [ ] Vérifier les tokens JWT

### Tests de performance
- [ ] Charger le site avec 1000 produits
- [ ] Charger le site avec 10000 utilisateurs
- [ ] Tester la recherche avec beaucoup de produits
- [ ] Vérifier les temps de réponse API
- [ ] Vérifier la consommation de bande passante

### Tests de compatibilité
- [ ] Chrome (desktop + mobile)
- [ ] Firefox (desktop + mobile)
- [ ] Safari (desktop + mobile)
- [ ] Edge (desktop)
- [ ] Navigateurs anciens (IE11 si nécessaire)

## Documentation

- [ ] README.md complété
- [ ] QUICKSTART.md complété
- [ ] STRIPE_SETUP.md complété
- [ ] GITHUB_DEPLOYMENT.md complété
- [ ] STRUCTURE.md complété
- [ ] Documenter les API personnalisées
- [ ] Documenter les processus d'administration

## Lancement

- [ ] Annoncer le lancement
- [ ] Envoyer des emails aux clients
- [ ] Partager sur les réseaux sociaux
- [ ] Ajouter à Google Search Console
- [ ] Ajouter à Bing Webmaster Tools
- [ ] Configurer les redirections 301 (si migration)

## Post-lancement (1 mois)

- [ ] Analyser les données Google Analytics
- [ ] Vérifier les erreurs Sentry
- [ ] Recueillir les retours utilisateurs
- [ ] Optimiser les performances
- [ ] Corriger les bugs
- [ ] Ajouter les améliorations demandées
