import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC1Ek4StZbliwYfVaDB-3l8GGzgC1dF7hY",
  authDomain: "portfolio-4b24d.firebaseapp.com",
  projectId: "portfolio-4b24d",
  storageBucket: "portfolio-4b24d.firebasestorage.app",
  messagingSenderId: "511665036677",
  appId: "1:511665036677:web:4db7e1517bffb6adfc78ec",
  measurementId: "G-TPNPYEPV6W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
