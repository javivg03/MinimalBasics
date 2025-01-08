const cartContainer = document.getElementById("cartItems");
const totalContainer = document.getElementById("cartTotal");
const cartBadge = document.getElementById("cart-badge");

// Función para actualizar el badge
function updateCartBadge(quantity) {
    if (cartBadge) {
        cartBadge.textContent = quantity;
        cartBadge.style.visibility = quantity > 0 ? "visible" : "hidden";
    }
}

// Función para cargar el carrito
function loadCart() {
    if (!cartContainer || !totalContainer) {
        console.warn("Elementos del carrito no encontrados en esta página.");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>El carrito está vacío.</p>";
        totalContainer.textContent = "Total: $0.00";
        updateCartBadge(0);
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
                            <p>Cantidad: ${item.quantity}</p>
                            <p>Subtotal: $${(product.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                    <button class="remove-item nav-button" onclick="removeFromCart(${index})">Eliminar</button>
                `;

                cartContainer.appendChild(cartItem);
            });

            totalContainer.textContent = `Total: $${total.toFixed(2)}`;
            updateCartBadge(cart.length);
        })
        .catch(error => console.error("Error al cargar los datos del producto:", error));
}


// Función para eliminar un producto del carrito
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

const recentlyViewedContainer = document.getElementById("recentlyViewedItems");

// Función para añadir un producto a "Vistos recientemente"
function addToRecentlyViewed(productId) {
    const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    // Evitar duplicados
    if (!recentlyViewed.includes(productId)) {
        recentlyViewed.push(productId);
    }

    // Mantener un límite de 5 productos
    if (recentlyViewed.length > 5) {
        recentlyViewed.shift(); // Elimina el más antiguo
    }

    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
}

// Función para cargar la sección de "Vistos recientemente"
function loadRecentlyViewed() {
    // Verifica si el contenedor existe
    if (!recentlyViewedContainer) {
        console.warn("El contenedor de productos vistos no está presente en esta página.");
        return;
    }

    const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    if (recentlyViewed.length === 0) {
        recentlyViewedContainer.innerHTML = "<p>No has visto productos recientemente.</p>";
        return;
    }

    fetch('/MinimalBasics/backend/data/tienda.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar los datos del producto");
            }
            return response.json();
        })
        .then(data => {
            recentlyViewedContainer.innerHTML = ""; 

            recentlyViewed.forEach(productId => {
                const product = data.products.find(p => p.id === productId);
                if (!product) {
                    console.warn(`Producto con ID ${productId} no encontrado.`);
                    return;
                }

                const productCard = document.createElement("div");
                productCard.classList.add("recently-viewed-item");

                productCard.innerHTML = `
                    <a href="productDetails.html?productId=${product.id}" class="recently-viewed-link">
                        <img src="/MinimalBasics/images/${product.image}" alt="${product.name}" class="recently-viewed-image">
                        <h4>${product.name}</h4>
                        <p>Precio: $${product.price}</p>
                    </a>
                `;

                recentlyViewedContainer.appendChild(productCard);
            });
        })
        .catch(error => console.error("Error al cargar los productos vistos:", error));
}


// Llamar a las funciones necesarias al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    loadRecentlyViewed();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartBadge(cart.reduce((total, item) => total + item.quantity, 0));
});
