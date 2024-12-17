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

    // Realizar una solicitud única para obtener los productos
    fetch('/MinimalBasics/backend/data/tienda.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar los datos del producto");
            }
            return response.json();
        })
        .then(data => {
            // Procesar cada producto del carrito con los datos obtenidos
            cart.forEach((item, index) => {
                const product = data.products.find(p => p.id === item.id);
                if (!product) {
                    console.warn(`Producto con ID ${item.id} no encontrado en los datos.`);
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
                    <button class="remove-item" onclick="removeFromCart(${index})">Eliminar</button>
                `;

                cartContainer.appendChild(cartItem);
            });

            totalContainer.textContent = `Total: $${total.toFixed(2)}`;
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

// Mostrar productos vistos recientemente
function loadRecentlyViewed() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("Token no encontrado en localStorage");
        return;
    }

    fetch('/MinimalBasics/backend/procesar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accion: 'productos_vistos',
            token: token,
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            const recentProductsContainer = document.getElementById("recentProducts");
            recentProductsContainer.innerHTML = "";

            if (!data.productos || data.productos.length === 0) {
                recentProductsContainer.innerHTML = "<p>No hay productos vistos recientemente.</p>";
                return;
            }

            data.productos.forEach(product => {
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

// Llamar a las funciones al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    loadRecentlyViewed();
});
