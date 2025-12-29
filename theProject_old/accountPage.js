import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


// If not signed in then go to login page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("loginPage.html");
  }
});


// If clicked log out, go to loginPage.html
const logoutBtn = document.querySelector(".logout-btn a");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // prevent link navigation

    try {
      await signOut(auth);
      window.location.replace("loginPage.html");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  });
}
