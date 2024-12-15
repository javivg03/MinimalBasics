const cartContainer = document.getElementById("cartItems");

// Función para cargar el carrito
function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    cart.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <p>Producto ID: ${item.id}</p>
            <p>Cantidad: ${item.quantity}</p>
        `;

        cartContainer.appendChild(cartItem);
    });
}

// Inicialización de la página
loadCart();
