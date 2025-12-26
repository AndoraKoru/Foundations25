import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const form = document.querySelector("#loginForm");
const statusEl = document.querySelector("#status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "Signing in…";

  const email = form.email.value.trim();
  const password = form.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "storePage.html";
  } catch (err) {
    statusEl.textContent = err.message;
  }
});
