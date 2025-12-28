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





const CART_KEY = "teastore_cart";

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function addToCart(productId, amount = 1) {
  const cart = readCart();

  const existing = cart.find(item => item.productId === productId);

  if (existing) {
    existing.qty = Number(existing.qty || 0) + amount;
  } else {
    cart.push({ productId, qty: amount });
  }

  writeCart(cart);
  return cart;
}



if (mount) {
  mount.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-add]");
    if (!btn) return;

    const productId = btn.dataset.add;
    if (!productId) return;

    addToCart(productId, 1);

    // feedback
    const original = btn.textContent;
    btn.textContent = "Added";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 700);

    console.log("Cart:", readCart());
  });
}
