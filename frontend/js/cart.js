const cartContainer = document.getElementById("cartItems");
const totalContainer = document.getElementById("cartTotal");

// Función para cargar el carrito
function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>El carrito está vacío.</p>";
        totalContainer.textContent = "Total: $0.00";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        // Obtener los datos del producto desde el archivo JSON
        fetch('/MinimalBasics/backend/data/tienda.json')
            .then(response => response.json())
            .then(data => {
                const product = data.products.find(product => product.id === item.id);
                if (!product) return;

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
                    <button class="remove-item" onclick="removeFromCart(${index})">Eliminar</button>
                `;

                cartContainer.appendChild(cartItem);
                totalContainer.textContent = `Total: $${total.toFixed(2)}`;
            })
            .catch(error => console.error("Error al cargar los datos del producto:", error));
    });
}

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// Mostrar productos vistos recientemente
function loadRecentlyViewed() {
    const token = localStorage.getItem("token");

    fetch('/MinimalBasics/backend/productos_vistos.php?accion=obtener', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const recentProductsContainer = document.getElementById("recentProducts");
            recentProductsContainer.innerHTML = "";

            if (!data || data.length === 0) {
                recentProductsContainer.innerHTML = "<p>No hay productos vistos recientemente.</p>";
                return;
            }

            data.forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");

                productCard.innerHTML = `
                    <img src="/MinimalBasics/images/${product.image}" alt="${product.name}" class="product-image">
                    <h4>${product.name}</h4>
                    <p>Precio: $${product.price}</p>
                `;

                recentProductsContainer.appendChild(productCard);
            });
        })
        .catch(error => console.error("Error al cargar los productos vistos:", error));
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    loadRecentlyViewed();
});

