import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCiOEyKwlW8S-9nKq-_gRx6YOgbkiIo4kE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "jesusclass-app-2026.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://jesusclass-app-2026-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "jesusclass-app-2026",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "jesusclass-app-2026.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "54216310857",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:54216310857:web:4f6d71dfee7df2d2febf98",
};

// 기본 펄백 설정 또는 환경 변수가 등록되어 있으면 Firebase 모드로 정상 작동합니다.
export const isFirebaseConfigured = true;

let app = null;
let auth = null;
let db = null;
let rtdb = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    rtdb = getDatabase(app);
    storage = getStorage(app);
  } catch (err) {
    console.error('Firebase 초기화 실패:', err);
  }
}

export { app, auth, db, rtdb, storage };

