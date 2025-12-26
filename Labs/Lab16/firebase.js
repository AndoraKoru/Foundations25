import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
// Initsialiseerimine (initialization) tähendab programmeerimises millegi esmakordset ettevalmistamist kasutamiseks – st anda muutujatele esimesed väärtused või käivitada mõni teenus/raamistik nii, et see oleks valmis tööle.
  const app = initializeApp(firebaseConfig); 


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);




