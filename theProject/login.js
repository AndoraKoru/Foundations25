import { auth } from "./firebase.js";
import {
  sendSignInLinkToEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const form = document.getElementById("emailLinkForm");
const statusEl = document.getElementById("status");
const rememberCheckbox = document.getElementById("rememberMe"); // optional (only if you have it)

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  if (!email) {
    setStatus("Please enter an email.");
    return;
  }

  setStatus("Sending sign-in link…");

  try {
    const actionCodeSettings = {
      url: `${window.location.origin}/emailLinkFinish.html`,
      handleCodeInApp: true
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);

    // Store email so we can finish sign-in when the user clicks the link
    localStorage.setItem("emailForSignIn", email);

    setStatus("Link sent. Check your email.");
  } catch (err) {
    console.error(err);
    setStatus(err.message);
  }
});
