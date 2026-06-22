import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  projectId: "jesusclass-app-2026",
  appId: "1:54216310857:web:4f6d71dfee7df2d2febf98",
  storageBucket: "jesusclass-app-2026.firebasestorage.app",
  apiKey: "AIzaSyCiOEyKwlW8S-9nKq-_gRx6YOgbkiIo4kE",
  authDomain: "jesusclass-app-2026.firebaseapp.com",
  messagingSenderId: "54216310857"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
