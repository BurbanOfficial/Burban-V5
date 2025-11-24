# Commandes utiles

## Installation et setup

```bash
# Installer les dépendances
npm install

# Installer les dépendances backend
cd backend && npm install && cd ..

# Initialiser Firebase
firebase init

# Login Firebase
firebase login
```

## Développement

```bash
# Démarrer les émulateurs Firebase
firebase emulators:start

# Démarrer avec Firestore emulator
firebase emulators:start --only firestore

# Démarrer avec Functions emulator
firebase emulators:start --only functions

# Démarrer avec tous les émulateurs
firebase emulators:start
```

## Déploiement

```bash
# Déployer tout (hosting + functions)
firebase deploy

# Déployer seulement le hosting
firebase deploy --only hosting

# Déployer seulement les functions
firebase deploy --only functions

# Déployer avec un message
firebase deploy -m "Description du déploiement"

# Déployer une fonction spécifique
firebase deploy --only functions:createCheckoutSession
```

## Firestore

```bash
# Exporter les données
firebase firestore:export ./backup

# Importer les données
firebase firestore:import ./backup

# Supprimer une collection
firebase firestore:delete --recursive --all-collections

# Supprimer une collection spécifique
firebase firestore:delete --recursive products
```

## Cloud Functions

```bash
# Voir les logs
firebase functions:log

# Voir les logs en temps réel
firebase functions:log --follow

# Voir les logs d'une fonction spécifique
firebase functions:log --function=createCheckoutSession

# Tester une fonction localement
firebase emulators:start --only functions
```

## Authentication

```bash
# Exporter les utilisateurs
firebase auth:export ./users.json

# Importer les utilisateurs
firebase auth:import ./users.json
```

## Hosting

```bash
# Voir les versions déployées
firebase hosting:channel:list

# Créer une version de preview
firebase hosting:channel:deploy preview

# Supprimer une version
firebase hosting:channel:delete preview
```

## GitHub Pages

```bash
# Installer gh-pages
npm install --save-dev gh-pages

# Déployer sur GitHub Pages
npm run deploy

# Vérifier le status
git status
```

## Optimisation

```bash
# Minifier CSS
npx cssnano css/style.css -o css/style.min.css

# Minifier JS
npx terser js/app.js -o js/app.min.js

# Optimiser les images
npx imagemin public/images/* --out-dir=public/images

# Analyser la taille des bundles
npx webpack-bundle-analyzer
```

## Linting et formatage

```bash
# Installer ESLint
npm install --save-dev eslint

# Initialiser ESLint
npx eslint --init

# Linter les fichiers JS
npx eslint js/*.js

# Formater avec Prettier
npm install --save-dev prettier
npx prettier --write .
```

## Testing

```bash
# Installer Jest
npm install --save-dev jest

# Lancer les tests
npm test

# Lancer les tests en watch mode
npm test -- --watch

# Générer un coverage report
npm test -- --coverage
```

## Debugging

```bash
# Voir les erreurs Firebase
firebase functions:log --limit 50

# Voir les erreurs Firestore
firebase firestore:inspect

# Voir les erreurs Storage
firebase storage:inspect

# Voir les erreurs Auth
firebase auth:inspect
```

## Maintenance

```bash
# Mettre à jour Firebase CLI
npm install -g firebase-tools@latest

# Mettre à jour les dépendances
npm update

# Vérifier les dépendances obsolètes
npm outdated

# Auditer les vulnérabilités
npm audit

# Corriger les vulnérabilités
npm audit fix
```

## Utilitaires

```bash
# Générer un UUID
node -e "console.log(require('crypto').randomUUID())"

# Convertir une date en timestamp
node -e "console.log(new Date('2024-01-01').getTime())"

# Encoder en base64
node -e "console.log(Buffer.from('text').toString('base64'))"

# Décoder base64
node -e "console.log(Buffer.from('dGV4dA==', 'base64').toString())"
```

## Stripe CLI

```bash
# Installer Stripe CLI
brew install stripe/stripe-cli/stripe

# Login Stripe
stripe login

# Écouter les webhooks
stripe listen --forward-to localhost:3000/api/stripe-webhook

# Déclencher un événement de test
stripe trigger payment_intent.succeeded

# Voir les événements
stripe events list
```

## Git

```bash
# Initialiser le repo
git init

# Ajouter les fichiers
git add .

# Commit
git commit -m "Initial commit"

# Ajouter la remote
git remote add origin https://github.com/username/repo.git

# Push
git push -u origin main

# Voir l'historique
git log --oneline

# Voir les branches
git branch -a
```

## Docker (optionnel)

```bash
# Créer une image Docker
docker build -t streetwear-ecommerce .

# Lancer un conteneur
docker run -p 3000:3000 streetwear-ecommerce

# Voir les conteneurs
docker ps

# Arrêter un conteneur
docker stop <container_id>
```

## Utiles pour le développement

```bash
# Ouvrir la console Firebase
firebase console

# Ouvrir Firestore
firebase open firestore

# Ouvrir Storage
firebase open storage

# Ouvrir Functions
firebase open functions

# Ouvrir Hosting
firebase open hosting
```

## Commandes personnalisées

Ajouter dans `package.json` :

```json
{
  "scripts": {
    "dev": "firebase emulators:start",
    "deploy": "firebase deploy",
    "deploy:hosting": "firebase deploy --only hosting",
    "deploy:functions": "firebase deploy --only functions",
    "backup": "firebase firestore:export ./backup",
    "restore": "firebase firestore:import ./backup",
    "logs": "firebase functions:log --follow",
    "lint": "eslint js/*.js",
    "format": "prettier --write .",
    "test": "jest",
    "build": "npm run lint && npm run test"
  }
}
```

Utiliser :
```bash
npm run dev
npm run deploy
npm run backup
npm run logs
npm run lint
npm run format
npm run test
npm run build
```
