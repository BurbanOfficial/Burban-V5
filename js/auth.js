// Authentication

const authModal = document.getElementById('authModal');
const profileToggle = document.querySelector('.profile-toggle');
const authModalClose = authModal.querySelector('.modal-close');

profileToggle.addEventListener('click', e => {
    e.preventDefault();
    if (auth.currentUser) {
        displayProfile();
    } else {
        displayAuthForm();
    }
    authModal.removeAttribute('hidden');
});

authModalClose.addEventListener('click', () => {
    authModal.setAttribute('hidden', '');
});

authModal.addEventListener('click', e => {
    if (e.target === authModal) {
        authModal.setAttribute('hidden', '');
    }
});

// Display auth form
function displayAuthForm() {
    const authContent = document.getElementById('authContent');
    authContent.innerHTML = `
        <div style="max-width: 400px;">
            <h2 style="margin-bottom: var(--spacing-lg);">Connexion</h2>
            
            <form id="loginForm" style="margin-bottom: var(--spacing-lg);">
                <input type="email" id="loginEmail" placeholder="Email" required style="width: 100%; padding: var(--spacing-sm); margin-bottom: var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-family: var(--font-sans);">
                <input type="password" id="loginPassword" placeholder="Mot de passe" required style="width: 100%; padding: var(--spacing-sm); margin-bottom: var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-family: var(--font-sans);">
                <button type="submit" class="btn-checkout" style="margin-bottom: var(--spacing-md);">Se connecter</button>
            </form>

            <div style="text-align: center; margin-bottom: var(--spacing-lg); color: var(--color-text-light);">ou</div>

            <button id="googleSignIn" class="btn-checkout" style="background: var(--color-accent-light); color: var(--color-text); margin-bottom: var(--spacing-lg);">Continuer avec Google</button>

            <div style="text-align: center; color: var(--color-text-light);">
                Pas encore de compte? <a href="#" onclick="displaySignupForm(event)" style="color: var(--color-accent); text-decoration: none;">S'inscrire</a>
            </div>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('googleSignIn').addEventListener('click', handleGoogleSignIn);
}

// Display signup form
function displaySignupForm(e) {
    e.preventDefault();
    const authContent = document.getElementById('authContent');
    authContent.innerHTML = `
        <div style="max-width: 400px;">
            <h2 style="margin-bottom: var(--spacing-lg);">Créer un compte</h2>
            
            <form id="signupForm">
                <input type="email" id="signupEmail" placeholder="Email" required style="width: 100%; padding: var(--spacing-sm); margin-bottom: var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-family: var(--font-sans);">
                <input type="password" id="signupPassword" placeholder="Mot de passe" required style="width: 100%; padding: var(--spacing-sm); margin-bottom: var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-family: var(--font-sans);">
                <input type="password" id="signupPasswordConfirm" placeholder="Confirmer le mot de passe" required style="width: 100%; padding: var(--spacing-sm); margin-bottom: var(--spacing-md); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-family: var(--font-sans);">
                <button type="submit" class="btn-checkout" style="margin-bottom: var(--spacing-md);">S'inscrire</button>
            </form>

            <div style="text-align: center; color: var(--color-text-light);">
                Déjà inscrit? <a href="#" onclick="displayAuthForm()" style="color: var(--color-accent); text-decoration: none;">Se connecter</a>
            </div>
        </div>
    `;

    document.getElementById('signupForm').addEventListener('submit', handleSignup);
}

// Display profile
function displayProfile() {
    const user = auth.currentUser;
    const authContent = document.getElementById('authContent');
    
    authContent.innerHTML = `
        <div style="max-width: 400px;">
            <h2 style="margin-bottom: var(--spacing-lg);">Mon profil</h2>
            
            <div style="margin-bottom: var(--spacing-lg);">
                <p style="color: var(--color-text-light); margin-bottom: var(--spacing-sm);">Email</p>
                <p style="font-weight: 600;">${user.email}</p>
            </div>

            <div id="profileData" style="margin-bottom: var(--spacing-lg);"></div>

            <button onclick="handleLogout()" class="btn-checkout" style="background: var(--color-accent-light); color: var(--color-text);">Se déconnecter</button>
        </div>
    `;

    loadUserProfile();
}

// Load user profile from Firestore
async function loadUserProfile() {
    try {
        const user = auth.currentUser;
        const doc = await db.collection('users').doc(user.uid).get();
        
        if (doc.exists) {
            const data = doc.data();
            const profileData = document.getElementById('profileData');
            profileData.innerHTML = `
                <div style="margin-bottom: var(--spacing-md);">
                    <p style="color: var(--color-text-light); margin-bottom: var(--spacing-sm);">Prénom</p>
                    <p style="font-weight: 600;">${data.firstName || '-'}</p>
                </div>
                <div style="margin-bottom: var(--spacing-md);">
                    <p style="color: var(--color-text-light); margin-bottom: var(--spacing-sm);">Nom</p>
                    <p style="font-weight: 600;">${data.lastName || '-'}</p>
                </div>
                <div style="margin-bottom: var(--spacing-md);">
                    <p style="color: var(--color-text-light); margin-bottom: var(--spacing-sm);">Adresse</p>
                    <p style="font-weight: 600;">${data.address || '-'}</p>
                </div>
                <a href="/orders" style="display: inline-block; padding: var(--spacing-sm) var(--spacing-lg); background: var(--color-accent); color: var(--color-bg); text-decoration: none; border-radius: var(--radius-md); margin-top: var(--spacing-md);">Mes commandes</a>
            `;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        authModal.setAttribute('hidden', '');
    } catch (error) {
        alert('Erreur de connexion: ' + error.message);
    }
}

// Handle signup
async function handleSignup(e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;

    if (password !== passwordConfirm) {
        alert('Les mots de passe ne correspondent pas');
        return;
    }

    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection('users').doc(result.user.uid).set({
            email,
            createdAt: new Date(),
            wishlist: []
        });
        authModal.setAttribute('hidden', '');
    } catch (error) {
        alert('Erreur d\'inscription: ' + error.message);
    }
}

// Handle Google sign in
async function handleGoogleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        const result = await auth.signInWithPopup(provider);
        const userRef = db.collection('users').doc(result.user.uid);
        const doc = await userRef.get();
        
        if (!doc.exists) {
            await userRef.set({
                email: result.user.email,
                firstName: result.user.displayName?.split(' ')[0] || '',
                createdAt: new Date(),
                wishlist: []
            });
        }
        authModal.setAttribute('hidden', '');
    } catch (error) {
        console.error('Google sign in error:', error);
    }
}

// Handle logout
async function handleLogout() {
    try {
        await auth.signOut();
        authModal.setAttribute('hidden', '');
    } catch (error) {
        console.error('Logout error:', error);
    }
}
