const cartContainer = document.getElementById("cartItems");
const totalContainer = document.getElementById("cartTotal");

// Actualiza el badge con la cantidad total del carrito
function updateCartBadge(quantity) {
    const cartBadge = document.getElementById("cart-badge");
    if (cartBadge) {
        cartBadge.textContent = quantity;
        cartBadge.style.visibility = quantity > 0 ? "visible" : "hidden";
    }

}

// Asegurar actualización del badge al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    updateCartBadge(totalQuantity); // Actualiza el badge
});


function loadCart() {
    if (!cartContainer || !totalContainer) {
        return;
    }


    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>El carrito está vacío.</p>";
        totalContainer.textContent = "Total: $0.00";
        updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
        return;
    }

    let total = 0;

    fetch('/MinimalBasics/backend/data/tienda.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar los datos del producto");
            }
            return response.json();
        })
        .then(data => {
            cart.forEach((item, index) => {
                const product = data.products.find(p => p.id === item.id);
                if (!product) {
                    console.warn(`Producto con ID ${item.id} no encontrado.`);
                    return;
                }

                total += product.price * item.quantity;

                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");

                cartItem.innerHTML = `
                <div class="cart-item-info">
                    <img src="/MinimalBasics/images/${product.image}" alt="${product.name}" class="cart-item-image">
                    <div>
                        <h4>${product.name}</h4>
                        <p>Precio: $${product.price}</p>
                        <p>Talla: ${item.size}</p>  <!-- Mostrar la talla -->
                        <div class="quantity-controls">
                            <button onclick="decreaseQuantity(${index})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="increaseQuantity(${index})">+</button>
                        </div>
                        <p>Subtotal: $${(product.price * item.quantity).toFixed(2)}</p>
                    </div>
                </div>
                <button class="remove-item nav-button" onclick="removeFromCart(${index})">Eliminar</button>
            `;
                cartContainer.appendChild(cartItem);
            });

            totalContainer.textContent = `Total: $${total.toFixed(2)}`;
            updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
        })
        .catch(error => console.error("Error al cargar los datos del producto:", error));
}

function loadRecentlyViewed() {
    const recentlyViewedContainer = document.getElementById("recentlyViewed");

    if (!recentlyViewedContainer) {
        return;
    }

    const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    if (recentlyViewed.length === 0) {
        recentlyViewedContainer.innerHTML = "<p>No has visto ningún producto recientemente.</p>";
        return;
    }

    // Cargar detalles de los productos
    fetch('/MinimalBasics/backend/data/tienda.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar los productos.");
            }
            return response.json();
        })
        .then(data => {
            recentlyViewedContainer.innerHTML = "";

            recentlyViewed.reverse().forEach(productId => {
                const product = data.products.find(p => p.id === productId);
                if (!product) {
                    console.warn(`Producto con ID ${productId} no encontrado.`);
                    return;
                }

                const productCard = document.createElement("div");
                productCard.classList.add("recently-viewed-item");

                productCard.innerHTML = `
                    <a href="productDetails.html?productId=${product.id}">
                        <img src="/MinimalBasics/images/${product.image}" alt="${product.name}">
                        <p>${product.name}</p>
                        <p>Precio: $${product.price}</p>
                    </a>
                `;

                recentlyViewedContainer.appendChild(productCard);
            });
        })
        .catch(error => console.error("Error al cargar productos vistos:", error));
}

function increaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function decreaseQuantity(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    } else {
        removeFromCart(index);
    }
}

function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

document.addEventListener("DOMContentLoaded", () => {
    loadCart();  // Cargar carrito
    loadRecentlyViewed();  // Cargar productos vistos recientemente
});
