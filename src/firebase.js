import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBBw1wB5wVpz3YN2WEHQvAUDeRpIDqFBJs",
  authDomain: "gestion-cra.firebaseapp.com",
  projectId: "gestion-cra",
  storageBucket: "gestion-cra.appspot.com",
  messagingSenderId: "565475445126",
  appId: "1:565475445126:web:63a41b2c8a400da8024407"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
