// https://www.youtube.com/watch?v=rV_U9ctKGkA

import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

let productAlert;
let closeAlertBtn;
let productText;
let productImage;

// Firebase products cache
let products = [];


function getRandomTime() {
    return Math.floor(Math.random() * 59) + 1;
}

function getRandomDisplayTime() {
    return Math.random() * (8 - 3) + 3;
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

        setTimeout(
            showAlert,
            Math.floor(getRandomDisplayTime()) * 1000
        );
    });


    setTimeout(
        showAlert,
        Math.floor(getRandomDisplayTime()) * 1000
    );
}

initFakeAlert(db);
