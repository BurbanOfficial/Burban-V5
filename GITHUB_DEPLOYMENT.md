# Déploiement sur GitHub Pages

## Option 1 : Déploiement manuel avec gh-pages

### 1. Installer gh-pages

```bash
npm install --save-dev gh-pages
```

### 2. Ajouter scripts au package.json

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d public",
    "build": "echo 'Build complete'"
  }
}
```

### 3. Configurer le repository

Dans `package.json`, ajouter :
```json
{
  "homepage": "https://yourusername.github.io/streetwear-ecommerce"
}
```

### 4. Déployer

```bash
npm run deploy
```

## Option 2 : Déploiement automatique avec GitHub Actions

### 1. Créer le workflow

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Deploy
      run: npm run deploy
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 2. Configurer les secrets GitHub

1. Aller à Settings → Secrets and variables → Actions
2. Ajouter les secrets :
   - `FIREBASE_API_KEY`
   - `STRIPE_PUBLIC_KEY`
   - etc.

### 3. Push vers main

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

## Option 3 : Déploiement Firebase Hosting

### 1. Initialiser Firebase

```bash
firebase init hosting
```

### 2. Configurer firebase.json

```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 3. Déployer

```bash
firebase deploy --only hosting
```

## Configuration du domaine personnalisé

### Avec GitHub Pages

1. Aller à Settings → Pages
2. Sélectionner "Deploy from a branch"
3. Choisir la branche `gh-pages`
4. Ajouter le domaine personnalisé

### Avec Firebase Hosting

1. Firebase Console → Hosting
2. Ajouter domaine personnalisé
3. Suivre les instructions DNS

## Optimisation pour GitHub Pages

### 1. Créer un script de build

```bash
#!/bin/bash
# build.sh

# Copier les fichiers publics
cp -r public/* .

# Minifier CSS/JS (optionnel)
# npx terser js/*.js -o js/*.min.js

echo "Build complete"
```

### 2. Configurer .gitignore

```
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
```

### 3. Ajouter un CNAME (domaine personnalisé)

Créer `public/CNAME` :
```
yourdomain.com
```

## Troubleshooting

### "404 on refresh"

Ajouter une redirection 404 → index.html :

Créer `public/404.html` :
```html
<!DOCTYPE html>
<html>
<head>
    <script>
        sessionStorage.redirect = location.href;
    </script>
    <meta http-equiv="refresh" content="0;URL='/index.html'">
</head>
<body>
</body>
</html>
```

### "Assets not loading"

Vérifier les chemins relatifs dans index.html :
```html
<!-- ❌ Mauvais -->
<link rel="stylesheet" href="/css/style.css">

<!-- ✅ Correct pour GitHub Pages -->
<link rel="stylesheet" href="./css/style.css">
```

### "Firebase not working"

Vérifier que les clés Firebase sont correctes dans `js/config.js`.

## CI/CD avec GitHub Actions

### Exemple complet

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Lint (optionnel)
      run: npm run lint || true
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      if: github.ref == 'refs/heads/main'
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./public
```

## Monitoring

### Ajouter Google Analytics

```html
<!-- Dans index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Ajouter Sentry pour error tracking

```html
<script src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: 'YOUR_DSN' });
</script>
```

## Performance

### Optimiser les assets

```bash
# Minifier CSS
npx cssnano css/style.css -o css/style.min.css

# Minifier JS
npx terser js/app.js -o js/app.min.js

# Optimiser images
npx imagemin public/images/* --out-dir=public/images
```

### Ajouter service worker pour offline

Créer `public/sw.js` :
```javascript
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/',
        '/css/style.css',
        '/js/app.js'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

Enregistrer dans `index.html` :
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```
