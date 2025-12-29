import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const CART_KEY = "teastore_cart";
const TAX_RATE = 0.24; 

const cartItemsEl = document.getElementById("cartItems");
const cartEmptyEl = document.getElementById("cartEmpty");
const templateEl = document.getElementById("cartItemTemplate");

const itemsCountEl = document.getElementById("itemsCount");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");

const checkoutBtn = document.getElementById("checkoutBtn");

let currentUser = null;
const productCache = {};

/* cart storage */

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(cartItems) {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

function findQty(cartItems, productId) {
  const item = cartItems.find(i => i.productId === productId);
  return Number(item?.qty || 0);
}

function setQty(productId, qty) {
  const cart = readCart();
  const existing = cart.find(i => i.productId === productId);

  if (qty <= 0) {
    // remove item
    const next = cart.filter(i => i.productId !== productId);
    writeCart(next);
    return next;
  }

  if (existing) {
    existing.qty = qty;
  } else {
    cart.push({ productId, qty });
  }

  writeCart(cart);
  return cart;
}

function cartItemCount(cartItems) {
  return cartItems.reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

/* € formatting */

function formatMoney(cents, currency = "EUR") {
  if (currency === "EUR") {
    const euros = (cents / 100).toFixed(2);
    return `${euros}€`;
  }
  return `${(cents / 100).toFixed(2)} ${currency}`;
}

/* Loading the products */

async function loadProduct(productId) {
  if (productCache[productId]) return productCache[productId];

  const ref = doc(db, "products", productId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error(`Product not found: ${productId}`);
  }

  const data = snap.data();
  productCache[productId] = { id: snap.id, ...data };
  return productCache[productId];
}

async function loadProductsForCart(cartItems) {
  const products = [];
  const validIds = new Set();

  for (const item of cartItems) {
    const id = item.productId;

    try {
      const p = await loadProduct(id);
      products.push(p);
      validIds.add(id);
    } catch (err) {
      console.warn("Missing product in Firestore, removing from cart:", id, err);
    }
  }

  const cleaned = cartItems.filter(i => validIds.has(i.productId));
  if (cleaned.length !== cartItems.length) {
    writeCart(cleaned);
  }

  return products;
}


/* Summary */

function clearCartUI() {
  cartItemsEl.innerHTML = "";
}

function toggleEmptyState(isEmpty) {
  cartEmptyEl.hidden = !isEmpty;
  checkoutBtn.disabled = isEmpty;
}

function computeTotals(cartItems, products) {
  let subtotalCents = 0;

  for (const p of products) {
    const qty = findQty(cartItems, p.id);
    const unit = Number(p.price_cents || 0);
    subtotalCents += unit * qty;
  }

  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalCents = subtotalCents + taxCents;

  const currency = products[0]?.currency || "EUR";

  return { currency, subtotalCents, taxCents, totalCents };
}

function renderSummary(cartItems, products) {
  const count = cartItemCount(cartItems);
  const { currency, subtotalCents, taxCents, totalCents } = computeTotals(cartItems, products);

  itemsCountEl.textContent = String(count);
  subtotalEl.textContent = formatMoney(subtotalCents, currency);
  taxEl.textContent = formatMoney(taxCents, currency);
  totalEl.textContent = formatMoney(totalCents, currency);
}

function renderItems(cartItems, products) {
  clearCartUI();

  for (const p of products) {
    const qty = findQty(cartItems, p.id);
    if (!qty) continue;

    const node = templateEl.content.cloneNode(true);

    const article = node.querySelector(".cart-item");
    const img = node.querySelector(".cart-item-img");
    const title = node.querySelector(".cart-item-title");
    const price = node.querySelector(".cart-item-price");
    const qtyValue = node.querySelector(".qty-value");

    const decBtn = node.querySelector(".qty-btn-dec");
    const incBtn = node.querySelector(".qty-btn-inc");

    article.dataset.productId = p.id;

    img.src = p.image || "";
    img.alt = p.name ? `${p.name} image` : "Product image";

    title.textContent = (p.name || p.id).toUpperCase();
    price.textContent = formatMoney(Number(p.price_cents || 0), p.currency || "EUR");

    qtyValue.textContent = String(qty);

    decBtn.dataset.action = "dec";
    incBtn.dataset.action = "inc";

    cartItemsEl.appendChild(node);
  }
}

async function renderCart() {
  const cartItems = readCart();

  if (cartItems.length === 0) {
    toggleEmptyState(true);
    itemsCountEl.textContent = "0";
    subtotalEl.textContent = "0€";
    taxEl.textContent = "0€";
    totalEl.textContent = "0€";
    clearCartUI();
    return;
  }

  toggleEmptyState(false);

  try {
    const products = await loadProductsForCart(cartItems);
    renderItems(cartItems, products);
    renderSummary(cartItems, products);
  } catch (err) {
    console.error(err);
    clearCartUI();
    toggleEmptyState(true);
  }
}

/* Quantity */

cartItemsEl.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  if (action !== "dec" && action !== "inc") return;

  const itemEl = btn.closest(".cart-item");
  if (!itemEl) return;

  const productId = itemEl.dataset.productId;
  if (!productId) return;

  const cartItems = readCart();
  const currentQty = findQty(cartItems, productId);

  const newQty = action === "inc" ? currentQty + 1 : currentQty - 1;

  setQty(productId, newQty);
  await renderCart();
});

/* invoice */

async function createInvoiceFromCart() {
  if (!currentUser) {
    window.location.replace("loginPage.html");
    return;
  }

  const cartItems = readCart();
  if (cartItems.length === 0) return;

  const products = await loadProductsForCart(cartItems);
  const { currency, subtotalCents, taxCents, totalCents } = computeTotals(cartItems, products);

  const items = products.map((p) => {
    const qty = findQty(cartItems, p.id);
    return {
      product_id: p.id,
      name: p.name || p.id,
      unit_price_cents: Number(p.price_cents || 0),
      quantity: qty,
      line_total_cents: Number(p.price_cents || 0) * qty
    };
  }).filter(i => i.quantity > 0);

  const invoice = {
    invoice_number: `INV-${Date.now()}`,
    user_id: currentUser.uid,
    user_email: currentUser.email || null,

    currency,
    subtotal_cents: subtotalCents,
    tax_cents: taxCents,
    total_cents: totalCents,

    items,
    status: "pending",
    created_at: serverTimestamp()
  };

  const ref = await addDoc(collection(db, "invoices"), invoice);
  return { invoiceId: ref.id, totalCents, currency };
}

checkoutBtn.addEventListener("click", async () => {
  try {
    checkoutBtn.disabled = true;

    const result = await createInvoiceFromCart();
    if (!result) {
      checkoutBtn.disabled = false;
      return;
    }

    window.location.assign(`paymentPage.html?invoiceId=${encodeURIComponent(result.invoiceId)}`);
  } catch (err) {
    console.error("Checkout failed:", err);
    checkoutBtn.disabled = false;
  }
});

/* Must be logged in */

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("loginPage.html");
    return;
  }

  currentUser = user;
  await renderCart();
});
