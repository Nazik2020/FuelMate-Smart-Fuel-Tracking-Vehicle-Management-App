import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAAagNjm20pofQPCE7JGJjAiLJQTymiUM",
  authDomain: "fuelmate-5bbe1.firebaseapp.com",
  projectId: "fuelmate-5bbe1",
  storageBucket: "fuelmate-5bbe1.firebasestorage.app",
  messagingSenderId: "527764945006",
  appId: "1:527764945006:web:b06a02ae01b1a905c44e7f",
  measurementId: "G-Q17T423X39",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const firestore = db; // alias for backward compatibility

export { app, auth, db, firestore };
