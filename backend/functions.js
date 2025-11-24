// Firebase Cloud Functions for backend logic
// Deploy with: firebase deploy --only functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

admin.initializeApp();
const db = admin.firestore();

// Create Stripe checkout session
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    try {
        const { items, total } = data;

        const lineItems = items.map(item => ({
            price: item.stripeId,
            quantity: item.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.DOMAIN}/cart`,
            customer_email: context.auth.token.email,
            metadata: {
                userId: context.auth.uid
            }
        });

        return { sessionId: session.id };
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create checkout session');
    }
});

// Stripe webhook
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            // Create order in Firestore
            await db.collection('orders').add({
                userId: session.metadata.userId,
                stripeSessionId: session.id,
                amount: session.amount_total / 100,
                currency: session.currency,
                status: 'completed',
                email: session.customer_email,
                createdAt: new Date()
            });

            // Send confirmation email
            await sgMail.send({
                to: session.customer_email,
                from: process.env.SENDGRID_FROM_EMAIL,
                subject: 'Commande confirmée',
                html: `
                    <h1>Merci pour votre commande!</h1>
                    <p>Votre commande a été confirmée.</p>
                    <p>Montant: €${(session.amount_total / 100).toFixed(2)}</p>
                    <p>Numéro de session: ${session.id}</p>
                `
            });
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

// Get user orders
exports.getUserOrders = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    try {
        const snapshot = await db.collection('orders')
            .where('userId', '==', context.auth.uid)
            .orderBy('createdAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting orders:', error);
        throw new functions.https.HttpsError('internal', 'Failed to get orders');
    }
});

// Update user profile
exports.updateUserProfile = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    try {
        const { firstName, lastName, address, phone } = data;

        await db.collection('users').doc(context.auth.uid).update({
            firstName,
            lastName,
            address,
            phone,
            updatedAt: new Date()
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating profile:', error);
        throw new functions.https.HttpsError('internal', 'Failed to update profile');
    }
});

// Generate sitemap
exports.generateSitemap = functions.https.onRequest(async (req, res) => {
    try {
        const products = await db.collection('products').get();
        const pages = await db.collection('pages').get();
        const sizeGuides = await db.collection('sizeGuides').get();

        let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
        sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Home
        sitemap += '<url><loc>https://yourdomain.com/</loc></url>\n';

        // Products
        products.forEach(doc => {
            const product = doc.data();
            sitemap += `<url><loc>https://yourdomain.com/product/${product.slug}</loc></url>\n`;
        });

        // Pages
        pages.forEach(doc => {
            const page = doc.data();
            sitemap += `<url><loc>https://yourdomain.com/${page.slug}</loc></url>\n`;
        });

        // Size guides
        sizeGuides.forEach(doc => {
            const guide = doc.data();
            sitemap += `<url><loc>https://yourdomain.com/size-guide/${guide.slug}</loc></url>\n`;
        });

        sitemap += '</urlset>';

        res.set('Content-Type', 'application/xml');
        res.send(sitemap);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
});

// Generate robots.txt
exports.generateRobots = functions.https.onRequest((req, res) => {
    const robots = `User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://yourdomain.com/sitemap.xml`;

    res.set('Content-Type', 'text/plain');
    res.send(robots);
});
