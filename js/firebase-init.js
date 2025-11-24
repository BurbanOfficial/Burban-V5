// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence().catch(err => {
    if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence disabled');
    } else if (err.code === 'unimplemented') {
        console.warn('Browser does not support persistence');
    }
});

// Auth state listener
auth.onAuthStateChanged(user => {
    if (user) {
        document.body.dataset.userId = user.uid;
        syncWishlistToFirestore();
    } else {
        delete document.body.dataset.userId;
    }
});
