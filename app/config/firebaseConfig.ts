// ============================================
// app/config/firebaseConfig.ts (SIN STORAGE)
// ============================================
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAr_nRvHsNbWHn3w5euTK07BPAj2XHLNdY",
  authDomain: "medify-7212e.firebaseapp.com",
  projectId: "medify-7212e",
  storageBucket: "medify-7212e.firebasestorage.app",
  messagingSenderId: "679425349149",
  appId: "1:679425349149:web:2b2af9a9ee9d06b97698f4",
  measurementId: "G-68D417G0L5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios de Firebase (SIN Storage)
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;