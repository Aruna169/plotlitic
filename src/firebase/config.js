// Firebase Configuration
// TODO: Replace with your Firebase project credentials
// Get these from: Firebase Console > Project Settings > Your apps > Web app

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDGNJX9ljxpmSzHFy9nUkzx4f_VusmZuAM",
    authDomain: "green-shade-e796b.firebaseapp.com",
    projectId: "green-shade-e796b",
    storageBucket: "green-shade-e796b.firebasestorage.app",
    messagingSenderId: "185135005938",
    appId: "1:185135005938:web:64fd4d3fa6beaa3e31506b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
