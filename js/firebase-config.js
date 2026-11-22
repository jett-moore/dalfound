// Firebase connection settings.
// This web configuration is safe to commit because access is protected by Firestore rules.

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyBCviC-Es5qETzsmIm5OGxBjWr2cX74oss",
  authDomain: "dalfound-ff5ce.firebaseapp.com",
  projectId: "dalfound-ff5ce",
  storageBucket: "dalfound-ff5ce.firebasestorage.app",
  messagingSenderId: "566619648736",
  appId: "1:566619648736:web:9f86c470941314e4395685",
  measurementId: "G-2WKV8ZTW7V",
};

export const FIREBASE_VERSION = "13.4.0";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);