import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

export function watchAuth(callback) {
  // Calls callback(user) whenever auth state changes
  return onAuthStateChanged(auth, callback);
}
