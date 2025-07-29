// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwgiBonUTz_CmBocDbCGuiQL0cfE63LiU",
    authDomain: "cateringreservationsyste-7d6fc.firebaseapp.com",
    projectId: "cateringreservationsyste-7d6fc",
    storageBucket: "cateringreservationsyste-7d6fc.firebasestorage.app",
    messagingSenderId: "184521953310",
    appId: "1:184521953310:web:10adf323ac80b0444d1e0f",
    measurementId: "G-5GJJ3MJZJW"
};

// Simple Firebase initialization
console.log('Initializing Firebase...');

try {
    // Initialize Firebase
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('Firebase app initialized');
        }
        
        // Initialize services
        window.auth = firebase.auth();
        window.db = firebase.firestore();
        window.storage = firebase.storage();
        
        // Also create global variables for backward compatibility
        window.firebaseServices = {
            auth: window.auth,
            db: window.db,
            storage: window.storage
        };
        
        console.log('Firebase services initialized successfully');
        console.log('Auth available:', !!window.auth);
        console.log('Firestore available:', !!window.db);
        console.log('Storage available:', !!window.storage);
        
    } else {
        console.error('Firebase SDK not loaded');
    }
} catch (error) {
    console.error('Error initializing Firebase:', error);
}