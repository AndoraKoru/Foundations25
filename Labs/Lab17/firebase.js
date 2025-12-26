import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {  getAuth } from ???

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

import { firebaseConfig } from "./config.js";
