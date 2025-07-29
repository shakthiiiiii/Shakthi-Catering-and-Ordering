# Firebase Setup Guide

This document outlines the steps to set up Firebase for the Catering Reservation project.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the prompts.
3. Register your app (Web, Android, or iOS).

## 2. Add Firebase SDK

### For Web

Add the following scripts to your HTML:

```html
<!-- Firebase App (the core Firebase SDK) -->
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js"></script>
<!-- Add other Firebase SDKs as needed -->
```

### For Node.js

Install Firebase:

```bash
npm install firebase
```

## 3. Configure Firebase

Copy your Firebase config from the console and initialize in your app:

```js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
```

## 4. Enable Required Services

- **Authentication:** Set up sign-in methods.
- **Firestore/Realtime Database:** Create your database.
- **Storage:** Enable if you need file uploads.

## 5. Test Your Setup

Run your app and verify Firebase is initialized without errors.

---

For more details, refer to the [Firebase Documentation](https://firebase.google.com/docs/).