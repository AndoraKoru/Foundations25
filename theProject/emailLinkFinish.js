// js/emailLinkFinish.js
import { auth } from "./firebase.js";
import {
  isSignInWithEmailLink,
  signInWithEmailLink
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const statusEl = document.getElementById("status");
const setStatus = (m) => statusEl && (statusEl.textContent = m);

async function finish() {
  const href = window.location.href;

  if (!isSignInWithEmailLink(auth, href)) {
    setStatus("Invalid or expired sign-in link.");
    return;
  }

  let email = localStorage.getItem("emailForSignIn");

  // If user opened link in a different browser/device, localStorage won't have the email.
  if (!email) email = window.prompt("Confirm your email to finish signing in:");

  if (!email) {
    setStatus("Email is required to complete sign-in.");
    return;
  }

  try {
    await signInWithEmailLink(auth, email, href);
    localStorage.removeItem("emailForSignIn");
    setStatus("Signed in. Redirecting…");
    window.location.href = "storePage.html";
  } catch (err) {
    console.error(err);
    setStatus(err.message);
  }
}

finish();
