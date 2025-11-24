// Configuration Firebase
const firebaseConfig = {
    apiKey: '<FIREBASE_API_KEY>',
    authDomain: '<PROJECT_ID>.firebaseapp.com',
    projectId: '<PROJECT_ID>',
    storageBucket: '<PROJECT_ID>.appspot.com',
    messagingSenderId: '<MESSAGING_SENDER_ID>',
    appId: '<APP_ID>'
};

// Configuration Stripe
const STRIPE_PUBLIC_KEY = '<STRIPE_PUBLIC_KEY>';

// Configuration API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://api.yourdomain.com' 
    : 'http://localhost:3000';

// Langues supportées
const SUPPORTED_LANGUAGES = ['fr', 'en'];
const DEFAULT_LANGUAGE = 'fr';
