import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQSWS6KjDsRdC_8FMXsyhleWUgKI7Zs0s",
  authDomain: "teastore-1d3a2.firebaseapp.com",
  projectId: "teastore-1d3a2",
  storageBucket: "teastore-1d3a2.firebasestorage.app",
  messagingSenderId: "1096140209872",
  appId: "1:1096140209872:web:7d4fbf64ed9f4387a7a8d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services so all pages can import them
export const auth = getAuth(app);
export const db = getFirestore(app);
