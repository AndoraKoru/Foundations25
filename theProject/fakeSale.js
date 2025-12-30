// https://www.youtube.com/watch?v=rV_U9ctKGkA

import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

let productAlert;
let closeAlertBtn;
let productText;
let productImage;

// Firebase products cache
let products = [];

// timing, first 10sec after going on the store page and then after 8 minutes
const FIRST_SHOW_DELAY_MS = 10_000;
const NEXT_SHOW_AFTER_CLOSE_MS = 8 * 60_000;

function getRandomTime() {
    return Math.floor(Math.random() * 10) + 1; // inbetween short time
}

function getRandomItemFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function showAlert() {
    if (!products.length) return;

    const randomProduct = getRandomItemFromArray(products);
    const { name, image } = randomProduct;

    productImage.src = image;
    productImage.alt = name;

    productText.innerHTML = `
    <p class="message">
      Someone purchased <strong>${name}</strong>
    </p>
    <p class="time">
      ${getRandomTime()} mins ago
    </p>
  `;

    productAlert.style.display = "flex";
}

async function loadProducts(db) {
    const querySnapshot = await getDocs(collection(db, "products"));

    products = querySnapshot.docs.map(doc => ({
        name: doc.data().name,
        image: doc.data().image
    }));
}

async function initFakeAlert(db) {
    await loadProducts(db);
    const res = await fetch("./fakesale.html");
    const html = await res.text();
    document.body.insertAdjacentHTML("beforeend", html);


    productAlert = document.getElementById("product-alert");
    closeAlertBtn = document.getElementById("close-btn");
    productText = document.getElementById("product-text");
    productImage = document.getElementById("product-image");


    closeAlertBtn.addEventListener("click", () => {
        productAlert.style.display = "none";
        setTimeout(showAlert, NEXT_SHOW_AFTER_CLOSE_MS);
    });

    // 10 seconds after being on the page
    setTimeout(showAlert, FIRST_SHOW_DELAY_MS);

    // again 8 minutes later
    closeAlertBtn.addEventListener("click", () => {
        productAlert.style.display = "none";
        setTimeout(showAlert, NEXT_SHOW_AFTER_CLOSE_MS);
    });
}

initFakeAlert(db);
