// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1IeHc3DPvApcaGBkZNUZ3MBlakoVdsvQ",
  authDomain: "welcome-locals-c79e1.firebaseapp.com",
  projectId: "welcome-locals-c79e1",
  storageBucket: "welcome-locals-c79e1.firebasestorage.app",
  messagingSenderId: "645251263574",
  appId: "1:645251263574:web:1ec4212a65c5c4df785ff7",
  measurementId: "G-46HDKYEB4T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const storage = getStorage(app);
