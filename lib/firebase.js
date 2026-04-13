import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "curiosity-cultivator",
  appId: "1:721684961157:web:a663b73ad0eab387b916ec",
  storageBucket: "curiosity-cultivator.firebasestorage.app",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyATf30YE1Y60R3E9uivblY2VV6dLIIZyqo",
  authDomain: "curiosity-cultivator.firebaseapp.com",
  messagingSenderId: "721684961157",
  measurementId: "G-RYPX5J9FWL",
};

// Prevent duplicate initialization in Next.js (hot reload)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
