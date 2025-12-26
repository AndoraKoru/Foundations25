import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const mount = document.getElementById("productsMount");

export async function loadProducts() {
  mount.innerHTML = "<p>Loading…</p>";

  try {
    const snap = await getDocs(collection(db, "products"));
    const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    mount.innerHTML = products.map(p => `
      <article class="product-card">
        <div class="product-image"><img src="${p.image}" alt="${p.name}"></div>
        <div class="product-body">
          <h2 class="product-title">${p.name}</h2>
          <p class="product-description">${p.description}</p>
          <p class="product-price">€${(p.price_cents/100).toFixed(2)}</p>
          <button class="product-button" data-add="${p.id}" type="button">Add to basket</button>
        </div>
      </article>
    `).join("");
  } catch (err) {
    mount.innerHTML = "<p>Failed to load products.</p>";
    console.error(err);
  }
}
