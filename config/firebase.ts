import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Export initialized instances
export { app, db, auth, db as firestore }; // Export both names for compatibility
