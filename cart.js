// ---------------------- LOAD CART ----------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ---------------------- HELPER ----------------------
function formatPrice(value) {
  return "Rs. " + value.toLocaleString("en-IN"); // Indian numbering format
}

// ---------------------- CART COUNT BADGE ----------------------
function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems > 0) {
      cartCountEl.innerText = totalItems;
      cartCountEl.style.display = "inline-block";
    } else {
      cartCountEl.innerText = "0";
      cartCountEl.style.display = "none"; // hide badge if empty
    }
  }
}

// ---------------------- ADD TO CART (shop.html) ----------------------
function addToCart(product) {
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(product.name + " added to cart!");
  updateCartCount(); // ✅ update badge
}

// Attach event listeners only on shop.html
if (window.location.pathname.includes("shop.html")) {
  document.querySelectorAll(".product .buy-btn").forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const productEl = e.target.closest(".product");

      const name = productEl.querySelector(".p-name").innerText;
      const priceText = productEl.querySelector(".p-price").innerText;
      const img = productEl.querySelector("img").src;

      // ✅ Fix: extract integer price safely
      const price = parseInt(priceText.replace(/[^\d]/g, ""), 10);

      const product = { name, price, img };
      addToCart(product);
    });
  });
}

// ---------------------- RENDER CART (cart.html) ----------------------
function renderCart() {
  const cartTable = document.getElementById("cart-items");
  if (!cartTable) {
    updateCartCount(); // still update badge outside cart page
    return;
  }

  cartTable.innerHTML = "";
  let subTotal = 0;

  cart.forEach((item, index) => {
    const rowTotal = item.price * item.quantity;
    subTotal += rowTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><a href="#" onclick="removeItem(${index})"><i class="fas fa-trash-alt"></i></a></td>
      <td><img src="${item.img}" alt=""></td>
      <td><h5>${item.name}</h5></td>
      <td><h5>${formatPrice(item.price)}</h5></td>
      <td><input type="number" min="1" value="${item.quantity}" 
                 onchange="updateQuantity(${index}, this.value)" 
                 class="w-25 pl-1"></td>
      <td><h5>${formatPrice(rowTotal)}</h5></td>
    `;
    cartTable.appendChild(row);
  });

  // Shipping cost: Rs.150 if cart not empty, else 0
  const shipping = cart.length > 0 ? 150 : 0;
  const grandTotal = subTotal + shipping;

  // Update summary section
  const subTotalEl = document.getElementById("sub-total");
  const shippingEl = document.getElementById("shipping");
  const grandTotalEl = document.getElementById("grand-total");

  if (subTotalEl) subTotalEl.innerText = formatPrice(subTotal);
  if (shippingEl) shippingEl.innerText = formatPrice(shipping);
  if (grandTotalEl) grandTotalEl.innerText = formatPrice(grandTotal);

  updateCartCount(); // ✅ update badge
}

// ---------------------- UPDATE / REMOVE ----------------------
function updateQuantity(index, qty) {
  cart[index].quantity = parseInt(qty, 10);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// ---------------------- INITIALIZE ----------------------
renderCart();
updateCartCount(); // ✅ initialize badge on page load

// ---------------------- CHECKOUT ----------------------
const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty. Please add some items first.");
      return;
    }

    // Simple confirmation
    alert("✅ Thank you for shopping at Rymo.com! Your order is Placed Successfully!");

    // Clear cart after placing order
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
    updateCartCount();
  });
}
