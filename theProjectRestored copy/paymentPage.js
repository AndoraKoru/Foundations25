import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const CART_KEY = "teastore_cart";

const invoiceNumberEl = document.getElementById("invoiceNumber");
const invoiceTotalEl = document.getElementById("invoiceTotal");
const invoiceStatusEl = document.getElementById("invoiceStatus");
const payBtn = document.getElementById("payBtn");
const payStatusEl = document.getElementById("payStatus");

function getInvoiceIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("invoiceId");
}

function formatMoney(cents, currency = "EUR") {
  if (currency === "EUR") return `${(cents / 100).toFixed(2)}€`;
  return `${(cents / 100).toFixed(2)} ${currency}`;
}

function setStatus(msg) {
  payStatusEl.textContent = msg;
}

async function loadInvoice(invoiceId) {
  const ref = doc(db, "invoices", invoiceId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Invoice not found");
  return { id: snap.id, ...snap.data() };
}

async function markInvoicePaid(invoiceId) {
  const ref = doc(db, "invoices", invoiceId);

  await updateDoc(ref, {
    status: "paid",
    payment_method: "dummy",
    payment_reference: `DUMMY-${Date.now()}`,
    paid_at: serverTimestamp(),
    updated_at: serverTimestamp()
  });
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("loginPage.html");
    return;
  }

  const invoiceId = getInvoiceIdFromURL();
  if (!invoiceId) {
    setStatus("Missing invoiceId in URL.");
    payBtn.disabled = true;
    return;
  }

  try {
    const invoice = await loadInvoice(invoiceId);

    // Security: make sure users only see their invoice
    if (invoice.user_id !== user.uid) {
      setStatus("You do not have access to this invoice.");
      payBtn.disabled = true;
      return;
    }

    invoiceNumberEl.textContent = invoice.invoice_number || invoiceId;
    invoiceTotalEl.textContent = formatMoney(Number(invoice.total_cents || 0), invoice.currency || "EUR");
    invoiceStatusEl.textContent = invoice.status || "—";

    if (invoice.status === "paid") {
      payBtn.disabled = true;
      setStatus("Already paid.");
      return;
    }
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Could not load invoice.");
    payBtn.disabled = true;
  }
});

payBtn.addEventListener("click", async () => {
  const invoiceId = getInvoiceIdFromURL();
  if (!invoiceId) return;

  try {
    payBtn.disabled = true;
    setStatus("Processing payment…");

    await markInvoicePaid(invoiceId);

    // Clear cart after “successful payment”
    localStorage.removeItem(CART_KEY);

    setStatus("Payment successful. Redirecting…");
    window.location.assign("accountPage.html");
  } catch (err) {
    console.error(err);
    setStatus(err.message || "Payment failed.");
    payBtn.disabled = false;
  }
});
