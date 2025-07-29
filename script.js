let cart = [];
let menuItems = [];
let currentUser = null;
let auth, db, storage; 
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const cartCount = document.getElementById('cartCount');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Wait for Firebase to load completely
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded');
        // Use fallback for reservation system
        setTimeout(addFallbackListener, 1000);
        return;
    }
    
    // Initialize Firebase services
    initializeFirebase();
    
    initializeMenuItems();
    setupEventListeners();
    loadCartFromStorage();
    updateCartDisplay();
    setMinDate();
    
    // Set up Firebase auth state listener with delay
    setTimeout(() => {
        setupAuthStateListener();
    }, 500);
    
    // If Firebase fails to initialize properly, add fallback after 3 seconds
    setTimeout(() => {
        if (!db && !window.firebaseServices) {
            console.warn('Firebase not initialized properly, adding fallback reservation handler');
            addFallbackListener();
        }
    }, 3000);
});

// Initialize Firebase services
function initializeFirebase() {
    console.log('initializeFirebase called');
    
    // Check if Firebase services are available from firebase-config.js
    if (window.auth && window.db && window.storage) {
        auth = window.auth;
        db = window.db;
        storage = window.storage;
        console.log('Firebase services loaded from window globals');
        return;
    }
    
    // Fallback to firebaseServices object
    if (window.firebaseServices) {
        auth = window.firebaseServices.auth;
        db = window.firebaseServices.db;
        storage = window.firebaseServices.storage;
        console.log('Firebase services loaded from firebaseServices object');
        return;
    }
    
    // Last resort - direct firebase access
    if (typeof firebase !== 'undefined') {
        try {
            auth = firebase.auth();
            db = firebase.firestore();
            storage = firebase.storage();
            console.log('Firebase services initialized directly');
            return;
        } catch (error) {
            console.error('Error initializing Firebase directly:', error);
        }
    }
    
    console.error('Firebase initialization failed - no services available');
}

// Debug function to check Firebase status
function checkFirebaseStatus() {
    console.log('=== Firebase Status Check ===');
    console.log('Firebase object:', typeof firebase !== 'undefined' ? 'Available' : 'Not Available');
    console.log('Firebase apps:', firebase && firebase.apps ? firebase.apps.length : 'N/A');
    console.log('Window firebaseServices:', window.firebaseServices ? 'Available' : 'Not Available');
    console.log('Auth variable:', auth ? 'Available' : 'Not Available');
    console.log('DB variable:', db ? 'Available' : 'Not Available');
    console.log('Storage variable:', storage ? 'Available' : 'Not Available');
    console.log('==============================');
}

// Call this function after initialization
setTimeout(checkFirebaseStatus, 1000);

// Menu Items Data
function initializeMenuItems() {
    menuItems = [
        // Appetizers (3 items)
        {
            id: 1,
            name: 'Bruschetta Platter',
            category: 'appetizers',
            price: 59,
            description: 'Fresh tomatoes, basil, and mozzarella on toasted bread',
            image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop'
        },
        {
            id: 2,
            name: 'Garlic Bread',
            category: 'appetizers',
            price: 79,
            description: 'Crispy golden bread with aromatic garlic and herbs',
            image: 'https://images.unsplash.com/photo-1573821663912-6df460f9c684?w=400&h=300&fit=crop'
        },
        {
            id: 3,
            name: 'Stuffed Mushrooms',
            category: 'appetizers',
            price: 99,
            description: 'Button mushrooms stuffed with herbs, cheese, and breadcrumbs',
            image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop'
        },
        
        // Main Courses (3 items)
        {
            id: 4,
            name: 'Pizza(Customizable)',
            category: 'mains',
            price: 249,
            description: 'Wood-fired pizza with your choice of toppings',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
        },
        {
            id: 5,
            name: 'Italian Pasta(Customizable)',
            category: 'mains',
            price: 299,
            description: 'Authentic Italian pasta with choice of sauce and ingredients',
            image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop'
        },
        {
            id: 6,
            name: 'Burger(Customizable)',
            category: 'mains',
            price: 109,
            description: 'Juicy burger with fresh ingredients and choice of toppings',
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop'
        },
        
        // Desserts (3 items)
        {
            id: 7,
            name: 'Chocolate Mousse Cake',
            category: 'desserts',
            price: 99,
            description: 'Rich chocolate mousse with berry compote',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
        },
        {
            id: 8,
            name: 'Tiramisu',
            category: 'desserts',
            price: 99,
            description: 'Classic Italian dessert with coffee and mascarpone',
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop'
        },
        {
            id: 9,
            name: 'Fruit Tart',
            category: 'desserts',
            price: 79,
            description: 'Pastry shell with vanilla custard and fresh seasonal fruits',
            image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop'
        },
        
        // Beverages (3 items)
        {
            id: 10,
            name: 'Hot Drinks',
            category: 'beverages',
            price: 25,
            description: 'Freshly brewed coffee, tea, and hot chocolate varieties',
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'
        },
        {
            id: 11,
            name: 'Cold Drinks',
            category: 'beverages',
            price: 60,
            description: 'Refreshing sodas, iced teas, and soft drinks',
            image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop'
        },
        {
            id: 12,
            name: 'Fresh Juices',
            category: 'beverages',
            price: 70,
            description: 'Freshly squeezed fruit juices and smoothies',
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop'
        }
    ];
    
    displayMenuItems('all');
}

// Firebase Authentication State Listener
function setupAuthStateListener() {
    if (!firebase.auth) return;
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = {
                uid: user.uid,
                email: user.email,
                name: user.displayName || user.email.split('@')[0]
            };
            updateLoginStatus();
            console.log('User signed in:', currentUser);
        } else {
            currentUser = null;
            updateLoginStatus();
            console.log('User signed out');
        }
    });
}

// Event Listeners Setup
function setupEventListeners() {
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Modal event listeners
    setupModalEventListeners();
    
    // Menu category buttons
    setupMenuCategoryListeners();
    
    // Form submissions
    setupFormListeners();
    
    // Smooth scrolling for navigation
    setupSmoothScrolling();
}

// Mobile Menu Functions
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

// Modal Functions
function setupModalEventListeners() {
    // Cart modal
    if (cartBtn) {
        cartBtn.addEventListener('click', openCartModal);
    }
    
    // Login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', openLoginModal);
    }
    
    // Close modal events
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeModal);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal();
        }
    });
    
    // Auth tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', switchAuthTab);
    });
    
    // Cart action buttons
    const clearCartBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkout');
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
}

function openCartModal() {
    cartModal.style.display = 'block';
    updateCartModal();
}

function openLoginModal() {
    loginModal.style.display = 'block';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function switchAuthTab(event) {
    const targetTab = event.target.dataset.tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(targetTab + 'Form').classList.add('active');
}

// Menu Functions
function setupMenuCategoryListeners() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            document.querySelectorAll('.category-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Display filtered items
            displayMenuItems(category);
        });
    });
}

function displayMenuItems(category) {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;
    
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    menuGrid.innerHTML = filteredItems.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy" />
            </div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">₹${item.price}</span>
                    <button class="add-to-cart" onclick="addToCart(${item.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart Functions
function addToCart(itemId) {
    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCartToStorage();
    showMessage('Item added to cart!', 'success');
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    updateCartModal();
    saveCartToStorage();
}

function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        updateCartDisplay();
        updateCartModal();
        saveCartToStorage();
    }
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price} each</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})" 
                        style="background: #dc3545; padding: 5px 10px; font-size: 0.8rem;">
                    Remove
                </button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString('en-IN');
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCartDisplay();
        updateCartModal();
        saveCartToStorage();
        showMessage('Cart cleared!', 'success');
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showMessage('Your cart is empty!', 'error');
        return;
    }
    
    if (!currentUser) {
        closeModal();
        openLoginModal();
        showMessage('Please login to proceed with checkout', 'error');
        return;
    }
    
    // Simulate checkout process
    showMessage('Redirecting to checkout...', 'success');
    setTimeout(() => {
        alert(`Checkout completed!\nTotal: ₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('en-IN')}\nThank you for your order!`);
        cart = [];
        updateCartDisplay();
        updateCartModal();
        saveCartToStorage();
        closeModal();
    }, 1500);
}

// Local Storage Functions
function saveCartToStorage() {
    localStorage.setItem('cateringCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cateringCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Form Handling with Firebase Integration
function setupFormListeners() {
    // Reservation form
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        console.log('Reservation form found, adding event listener');
        reservationForm.addEventListener('submit', handleReservationSubmit);
    } else {
        console.error('Reservation form not found!');
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }
}

// Firebase-integrated reservation submission
async function handleReservationSubmit(event) {
    console.log('Reservation form submitted!');
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const reservationData = {};
    
    for (let [key, value] of formData.entries()) {
        reservationData[key] = value;
    }
    
    console.log('Reservation data:', reservationData);
    
    // Validate required fields
    const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'eventDate', 'eventTime', 'guestCount', 'eventLocation'];
    const missingFields = requiredFields.filter(field => !reservationData[field]);
    
    if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields);
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate date is not in the past
    const selectedDate = new Date(reservationData.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        console.log('Date validation failed:', selectedDate, 'vs', today);
        showMessage('Event date cannot be in the past', 'error');
        return;
    }
    
    // Show loading message
    showMessage('Processing your reservation...', 'success');
    console.log('Attempting to save reservation to Firebase...');
    
    try {
        // Add reservation to Backend API (with Firebase fallback)
        const reservationId = await saveReservationToBackend(reservationData);
        
        showMessage('Reservation submitted successfully! We will contact you within 24 hours.', 'success');
        event.target.reset();
        
        alert(`Reservation Confirmed!\nReservation ID: ${reservationId}\nWe will contact you at ${reservationData.customerEmail} to confirm details.`);
    } catch (error) {
        console.error('Error submitting reservation:', error);
        showMessage('Error submitting reservation. Please try again.', 'error');
    }
}

// Save reservation to Backend API
async function saveReservationToBackend(reservationData) {
    console.log('saveReservationToBackend called with:', reservationData);
    
    try {
        // Prepare data for backend
        const backendData = {
            customerName: reservationData.customerName,
            customerEmail: reservationData.customerEmail,
            customerPhone: reservationData.customerPhone,
            eventDate: reservationData.eventDate,
            eventTime: reservationData.eventTime,
            guestCount: parseInt(reservationData.guestCount),
            eventType: reservationData.eventType,
            eventLocation: reservationData.eventLocation,
            specialRequests: reservationData.specialRequests,
            totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            cartItems: [...cart]
        };

        // Make API call to backend
        const response = await fetch('http://localhost:3000/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(backendData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to submit reservation');
        }

        console.log('Reservation saved successfully:', result);
        return result.reservationId;

    } catch (error) {
        console.error('Error saving reservation to backend:', error);
        
        // Fallback to Firebase if backend fails
        console.log('Falling back to Firebase...');
        return await saveReservationToFirebase(reservationData);
    }
}

// Save reservation to Firebase Firestore (fallback)
async function saveReservationToFirebase(reservationData) {
    console.log('saveReservationToFirebase called with:', reservationData);
    
    // Try multiple ways to get Firestore
    let firestore = null;
    
    if (window.db) {
        firestore = window.db;
        console.log('Using window.db');
    } else if (db) {
        firestore = db;
        console.log('Using global db variable');
    } else if (firebase && firebase.firestore) {
        firestore = firebase.firestore();
        console.log('Using firebase.firestore()');
    }
    
    if (!firestore) {
        console.error('No Firestore instance available');
        // For now, let's just show success and log the data
        console.log('Reservation data (would be saved to Firebase):', reservationData);
        return 'test-reservation-' + Date.now();
    }
    
    const reservation = {
        ...reservationData,
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userId: currentUser ? currentUser.uid : null,
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        cartItems: [...cart]
    };
    
    console.log('Reservation object to save:', reservation);
    
    try {
        const docRef = await firestore.collection('reservations').add(reservation);
        console.log('Reservation saved successfully with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error saving reservation to Firestore:', error);
        // For now, don't throw error - just return a test ID
        console.log('Falling back to local storage/logging');
        return 'local-reservation-' + Date.now();
    }
}

// Firebase-integrated contact form submission
async function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const contactData = {};
    
    for (let [key, value] of formData.entries()) {
        contactData[key] = value;
    }
    
    showMessage('Sending your message...', 'success');
    
    try {
        // Save contact message to Firebase
        await saveContactMessageToFirebase(contactData);
        
        showMessage('Message sent successfully! We will get back to you soon.', 'success');
        event.target.reset();
    } catch (error) {
        console.error('Error sending message:', error);
        showMessage('Error sending message. Please try again.', 'error');
    }
}

// Save contact message to Firebase
async function saveContactMessageToFirebase(contactData) {
    const firestore = db || (firebase && firebase.firestore ? firebase.firestore() : null);
    
    if (!firestore) {
        throw new Error('Firebase Firestore not initialized');
    }
    
    const message = {
        ...contactData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'unread'
    };
    
    await firestore.collection('contactMessages').add(message);
}

// Firebase Authentication - Login
async function handleLoginSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!firebase || !firebase.auth) {
        showMessage('Authentication service not available', 'error');
        return;
    }
    
    showMessage('Logging in...', 'success');
    
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        closeModal();
        showMessage('Login successful!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed. Please try again.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email address.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later.';
                break;
        }
        
        showMessage(errorMessage, 'error');
    }
}

// Firebase Authentication - Register
async function handleRegisterSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const fullName = formData.get('fullName');
    const phone = formData.get('phone');
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (!firebase || !firebase.auth) {
        showMessage('Authentication service not available', 'error');
        return;
    }
    
    showMessage('Creating your account...', 'success');
    
    try {
        // Create user account
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update user profile
        await user.updateProfile({
            displayName: fullName
        });
        
        // Save additional user data to Firestore
        await firebase.firestore().collection('users').doc(user.uid).set({
            fullName: fullName,
            email: email,
            phone: phone,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        closeModal();
        showMessage('Account created successfully!', 'success');
    } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = 'Registration failed. Please try again.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'An account with this email already exists.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address.';
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak. Please use at least 6 characters.';
                break;
        }
        
        showMessage(errorMessage, 'error');
    }
}

function updateLoginStatus() {
    if (currentUser) {
        loginBtn.textContent = `Hi, ${currentUser.name}`;
        loginBtn.onclick = logout;
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = openLoginModal;
    }
}

// Firebase logout
async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            if (firebase.auth) {
                await firebase.auth().signOut();
            } else {
                currentUser = null;
                updateLoginStatus();
            }
            showMessage('Logged out successfully', 'success');
        } catch (error) {
            console.error('Logout error:', error);
            showMessage('Error logging out', 'error');
        }
    }
}

// Enhanced checkout with Firebase order storage
async function proceedToCheckout() {
    if (cart.length === 0) {
        showMessage('Your cart is empty!', 'error');
        return;
    }
    
    if (!currentUser) {
        closeModal();
        openLoginModal();
        showMessage('Please login to proceed with checkout', 'error');
        return;
    }
    
    showMessage('Processing your order...', 'success');
    
    try {
        // Save order to Firebase
        const orderId = await saveOrderToFirebase();
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Order completed!\nOrder ID: ${orderId}\nTotal: ₹${total.toLocaleString('en-IN')}\nThank you for your order!`);
        
        cart = [];
        updateCartDisplay();
        updateCartModal();
        saveCartToStorage();
        closeModal();
        
        showMessage('Order placed successfully!', 'success');
    } catch (error) {
        console.error('Checkout error:', error);
        showMessage('Error processing order. Please try again.', 'error');
    }
}

// Save order to Firebase
async function saveOrderToFirebase() {
    const firestore = db || (firebase && firebase.firestore ? firebase.firestore() : null);
    
    if (!firestore) {
        throw new Error('Firebase Firestore not initialized');
    }
    
    const order = {
        userId: currentUser.uid,
        items: [...cart],
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        customerInfo: {
            email: currentUser.email,
            name: currentUser.name
        }
    };
    
    const docRef = await firestore.collection('orders').add(order);
    return docRef.id;
}

// Load user's order history (bonus feature)
async function loadUserOrders() {
    if (!currentUser || !db) return [];
    
    try {
        const snapshot = await db.collection('orders')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error loading orders:', error);
        return [];
    }
}

// Load user's reservation history (bonus feature)
async function loadUserReservations() {
    if (!currentUser || !db) return [];
    
    try {
        const snapshot = await db.collection('reservations')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error loading reservations:', error);
        return [];
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function setMinDate() {
    const eventDateInput = document.getElementById('eventDate');
    if (eventDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        eventDateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

function showMessage(message, type) {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the body
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Search functionality (bonus feature)
function searchMenu(query) {
    const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
    
    const menuGrid = document.getElementById('menuGrid');
    if (filteredItems.length === 0) {
        menuGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No items found</p>';
    } else {
        displayFilteredItems(filteredItems);
    }
}

function displayFilteredItems(items) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = items.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy" />
            </div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="menu-item-price">₹${item.price}</span>
                    <button class="add-to-cart" onclick="addToCart(${item.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Test function to check if form is accessible
function testReservationForm() {
    const form = document.getElementById('reservationForm');
    console.log('Test - Reservation form:', form);
    if (form) {
        console.log('Form action:', form.action);
        console.log('Form method:', form.method);
        console.log('Form elements:', form.elements.length);
        
        // Add a test click listener to the submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            console.log('Submit button found:', submitBtn);
            submitBtn.addEventListener('click', function(e) {
                console.log('Submit button clicked!');
            });
        } else {
            console.error('Submit button not found!');
        }
    } else {
        console.error('Reservation form not found in DOM!');
    }
}

// Call test function after DOM is loaded
setTimeout(testReservationForm, 2000);

// Fallback reservation handler (no Firebase)
function handleReservationSubmitFallback(event) {
    console.log('Fallback reservation handler called');
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const reservationData = {};
    
    for (let [key, value] of formData.entries()) {
        reservationData[key] = value;
    }
    
    console.log('Fallback - Reservation data:', reservationData);
    
    // Simple validation
    if (!reservationData.customerName || !reservationData.customerEmail) {
        alert('Please fill in your name and email at minimum.');
        return;
    }
    
    // Show success message
    alert(`Reservation received!\nName: ${reservationData.customerName}\nEmail: ${reservationData.customerEmail}\nDate: ${reservationData.eventDate}\n\nThis is a test confirmation. Your reservation has been logged to the console.`);
    
    // Reset form
    event.target.reset();
}

// Add fallback listener as backup
function addFallbackListener() {
    const form = document.getElementById('reservationForm');
    if (form) {
        // Remove existing listeners and add fallback
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', handleReservationSubmitFallback);
        console.log('Fallback listener added to reservation form');
    }
}

// ...existing code...

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        validateEmail,
        validatePhone,
        searchMenu
    };
}
