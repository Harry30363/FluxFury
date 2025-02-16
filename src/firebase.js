import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_Nlo2M0-uWyCjIf7FZd6WHtiZBunb3Ao",
  authDomain: "flexfury-c6def.firebaseapp.com",
  projectId: "flexfury-c6def",
  storageBucket: "flexfury-c6def.firebasestorage.app",
  messagingSenderId: "962693154800",
  appId: "1:962693154800:web:2e28f707ca8b290c5eff35",
  measurementId: "G-S4WYDLF09Z"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export Firestore instance
export { db };