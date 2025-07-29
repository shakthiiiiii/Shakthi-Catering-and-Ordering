# Shakthi Catering - Reservation & Ordering System

A modern, responsive web application for catering services that allows customers to browse menus, place orders, make reservations, and manage their bookings. Built with HTML, CSS, JavaScript, and Firebase for backend services.

## 🚀 Features

### Core Functionality
- **Interactive Menu Display**: Browse curated menu items with high-quality images
- **Shopping Cart**: Add items to cart with quantity management
- **Reservation System**: Book catering services for events
- **User Authentication**: Secure login and registration with Firebase Auth
- **Contact Form**: Direct communication with the catering service
- **Responsive Design**: Mobile-friendly interface

### Menu Categories
- **Appetizers**: Bruschetta Platter, Garlic Bread, Stuffed Mushrooms
- **Main Courses**: Customizable Pizza, Italian Pasta, Burgers
- **Desserts**: Chocolate Mousse Cake, Tiramisu, Fruit Tart
- **Beverages**: Hot Drinks, Cold Drinks, Fresh Juices

### Technical Features
- **Firebase Integration**: Authentication, Firestore database, and storage
- **Real-time Updates**: Order and reservation status tracking
- **Local Storage**: Cart persistence across sessions
- **Form Validation**: Client-side and server-side validation
- **Smooth Navigation**: Single-page application with smooth scrolling
- **Currency Support**: Indian Rupees (₹) with proper formatting

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome 6.0
- **Images**: Unsplash API for menu item images

## 📁 Project Structure

```
Catering Reservation/
├── index.html              # Main HTML file
├── styles.css              # CSS styles
├── script.js               # JavaScript functionality
├── firebase-config.js      # Firebase configuration
├── FIREBASE_SETUP.md       # Firebase setup guide
├── firebase.json           # Firebase hosting configuration
├── pglite-debug.log        # Debug log file
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Firebase account (for backend services)
- Text editor or IDE

### Installation

1. **Clone or download the project files**
   ```bash
   git clone <repository-url>
   cd "Catering Reservation"
   ```

2. **Set up Firebase**
   - Follow the detailed instructions in `FIREBASE_SETUP.md`
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Update `firebase-config.js` with your Firebase configuration

3. **Open the application**
   - Open `index.html` in a web browser
   - Or use a local development server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (if you have serve installed)
     npx serve .
     
     # Using PHP
     php -S localhost:8000
     ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:8000`

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable the following services:
   - **Authentication**: Email/Password provider
   - **Firestore Database**: For storing orders, reservations, and user data
   - **Storage**: For file uploads (if needed)

3. Update `firebase-config.js` with your project configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

### Security Rules
Set up Firestore security rules as described in `FIREBASE_SETUP.md` to protect your data.

## 📱 Usage

### For Customers
1. **Browse Menu**: View available food items organized by categories
2. **Add to Cart**: Select items and quantities
3. **Create Account**: Register or login to place orders
4. **Make Reservation**: Fill out the reservation form with event details
5. **Place Order**: Complete checkout process
6. **Contact**: Send messages through the contact form

### For Administrators
- Monitor orders and reservations through Firebase Console
- Manage user accounts and data
- Update menu items by modifying the `menuItems` array in `script.js`

## 🎨 Customization

### Menu Items
Edit the `initializeMenuItems()` function in `script.js` to:
- Add new menu items
- Update prices (in Indian Rupees)
- Change descriptions
- Replace images with new Unsplash URLs or local images

### Styling
Modify `styles.css` to:
- Change color scheme
- Update typography
- Adjust layout and spacing
- Customize responsive breakpoints

### Contact Information
Update contact details in the Contact section of `index.html`

## 🔒 Security Features

- Firebase Authentication for secure user management
- Form validation and sanitization
- Secure Firestore rules
- Input validation on both client and server side
- Protection against common web vulnerabilities

## 📊 Data Structure

### Users Collection
```javascript
{
  fullName: "User Name",
  email: "user@example.com",
  phone: "+91 1234567890",
  createdAt: timestamp
}
```

### Orders Collection
```javascript
{
  userId: "user-id",
  items: [...cartItems],
  totalAmount: 500,
  status: "pending",
  createdAt: timestamp,
  customerInfo: {...}
}
```

### Reservations Collection
```javascript
{
  customerName: "Name",
  customerEmail: "email@example.com",
  eventDate: "2025-07-15",
  eventTime: "18:00",
  guestCount: 50,
  eventLocation: "Address",
  status: "pending",
  createdAt: timestamp
}
```

## 🚀 Deployment

### Firebase Hosting
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login and initialize:
   ```bash
   firebase login
   firebase init hosting
   ```

3. Deploy:
   ```bash
   firebase deploy
   ```

### Other Hosting Options
- Netlify: Drag and drop the project folder
- Vercel: Connect your Git repository
- GitHub Pages: Push to a GitHub repository and enable Pages
- Traditional web hosting: Upload files via FTP

## 🐛 Troubleshooting

### Common Issues
1. **Firebase not loading**: Check network connection and Firebase configuration
2. **Images not displaying**: Verify image URLs and network connectivity
3. **Cart not persisting**: Check browser local storage settings
4. **Forms not submitting**: Verify Firebase configuration and internet connection

### Debug Mode
Enable console logging by opening browser developer tools (F12) to see detailed error messages.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Shakthi** - Initial work and development

## 🙏 Acknowledgments

- Firebase for backend services
- Unsplash for high-quality food images
- Font Awesome for icons
- The web development community for inspiration and resources

## 📞 Support

For support and questions:
- Email: shakthiisivakumar@gmail.com
- Phone: +91 123-4567
- Address: 123 North Street, Peelamedu, Coimbatore-64

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - Menu browsing and cart system
  - User authentication
  - Reservation system
  - Firebase integration
  - Responsive design

---

Made with ❤️ for creating memorable dining experiences
