import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const mount = document.getElementById("productsMount");

function formatPrice(priceCents, currency = "EUR") {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(priceCents / 100);
}

function escapeHTML(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cardHTML(p) {
  const wideClass = p.is_wide ? " wide" : "";

  return `
    <article class="product-card${wideClass}">
      <div class="product-image">
        <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}">
      </div>

      <div class="product-body">
        <h2 class="product-title">${escapeHTML(p.name)}</h2>

        <p class="product-description">${escapeHTML(p.description)}</p>

        <p class="product-label">Taste</p>
        <p class="product-text">${escapeHTML(p.taste)}</p>

        <p class="product-label">Smell</p>
        <p class="product-text">${escapeHTML(p.smell)}</p>

        <p class="product-label">Pick this when…</p>
        <p class="product-text">${escapeHTML(p.pick_when)}</p>

        <p class="product-price">${formatPrice(p.price_cents, p.currency)}</p>

        <button class="product-button" type="button" data-add="${escapeHTML(p.id)}">
          Add to basket
        </button>
      </div>
    </article>
  `;
}

async function loadProducts() {
  if (!mount) return;

  mount.innerHTML = "<p>Loading…</p>";

  try {
    const q = query(collection(db, "products"));
    const snap = await getDocs(q);

    const products = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    mount.innerHTML = products.map(cardHTML).join("");

} catch (err) {
  console.error(err);
  mount.innerHTML = `<p>Could not load products: ${err.code ?? ""} ${err.message ?? err}</p>`;
}

}

loadProducts();
