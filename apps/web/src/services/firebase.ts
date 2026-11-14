import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  getDocs, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyCwuSh_3-AUZLrsuPk8JdM7_Wyeo5WQDHk",
  authDomain: "skillforgedemowebsite.firebaseapp.com",
  projectId: "skillforgedemowebsite",
  storageBucket: "skillforgedemowebsite.firebasestorage.app",
  messagingSenderId: "957822862900",
  appId: "1:957822862900:web:4bfcfd0f207d95ac8aec61"
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Helper: Record Login event in Firestore
export async function recordLoginEvent(user: { uid: string; email: string | null; displayName?: string | null }) {
  try {
    const loginData = {
      userId: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      timestamp: serverTimestamp(),
      clientTimestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    await addDoc(collection(db, 'logins'), loginData);
    
    // Also update/upsert user document
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      lastLogin: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore logging note:', err);
  }
}

// Helper: Save Brand in Firestore
export async function saveBrandToFirestore(brand: any) {
  try {
    await setDoc(doc(db, 'brands', brand.id), {
      ...brand,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore brand save note:', err);
  }
}
