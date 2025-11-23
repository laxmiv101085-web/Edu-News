import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDaL1P6cmkjcRou6eoYY5gOvR3Zdit0z3E",
    authDomain: "vibe-eda-circuits.firebaseapp.com",
    projectId: "vibe-eda-circuits",
    storageBucket: "vibe-eda-circuits.firebasestorage.app",
    messagingSenderId: "291231859910",
    appId: "1:291231859910:web:1904e4bbac9ad062bd83c7",
    measurementId: "G-2ZEYLDBW21"
};

// Initialize Firebase (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
