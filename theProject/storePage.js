import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const mount = document.getElementById("productsMount");
const priceSortSelect = document.getElementById("priceSort");

let allProducts = [];
let currentSort = "default";

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

function renderProducts() {
  if (!mount) return;

  const list = allProducts.slice();

  if (currentSort === "asc") {
    list.sort((a, b) => (a.price_cents ?? 0) - (b.price_cents ?? 0));
  } else if (currentSort === "desc") {
    list.sort((a, b) => (b.price_cents ?? 0) - (a.price_cents ?? 0));
  }

  mount.innerHTML = list.map(cardHTML).join("");
}

async function loadProducts() {
  if (!mount) return;

  mount.innerHTML = "<p>Loading…</p>";

  try {
    const q = query(collection(db, "products"));
    const snap = await getDocs(q);

    allProducts = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Respect current dropdown value if present
    currentSort = (priceSortSelect && priceSortSelect.value) ? priceSortSelect.value : "default";
    renderProducts();

  } catch (err) {
    console.error(err);
    mount.innerHTML = `<p>Could not load products: ${err.code ?? ""} ${err.message ?? err}</p>`;
  }
}

loadProducts();

// Sorting UI (no reload)
if (priceSortSelect) {
  priceSortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value || "default";
    renderProducts();
  });
}

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

// Quotes

async function loadDailyQuote() {
  const quoteEl = document.getElementById("dailyQuoteText");
  const authorEl = document.getElementById("dailyQuoteAuthor");
  if (!quoteEl || !authorEl) return;

  // fallback
  const fallback = {
    text: "Tea is a small ritual that makes the day feel intentional.",
    author: "Alexandra"
  };

  quoteEl.textContent = "Loading…";
  authorEl.textContent = "";

  try {
    const res = await fetch("https://motivational-spark-api.vercel.app/api/quotes/random", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    quoteEl.textContent = `“${data.quote}”`;
    authorEl.textContent = `— ${data.author || "Unknown"}`;
  } catch (err) {

    // fallback on error
    quoteEl.textContent = `“${fallback.text}”`;
    authorEl.textContent = `— ${fallback.author}`;
    console.warn("Quote API failed, showing fallback:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadDailyQuote);
