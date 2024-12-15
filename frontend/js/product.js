function mostrarProductos(productos, categoryId) {
    const productosDiv = document.getElementById('productos');
    productosDiv.innerHTML = '';

    const filteredProducts = productos.filter(product => product.category == categoryId);

    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <a href="productDetails.html?productId=${product.id}">
                <img src="/MinimalBasics/images/${product.image}" alt="${product.name}">
            </a>
            <h3>${product.name}</h3>
            <p>Precio: $${product.price}</p>
            <button onclick="agregarAlCarrito(${product.id})">Agregar al Carrito</button>
        `;
        productosDiv.appendChild(productElement);
    });
}
// Función global para mostrar notificaciones tipo toast
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animación de entrada
    setTimeout(() => toast.classList.add("show"), 100);

    // Eliminar el toast después de 3 segundos
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Actualización de agregarAlCarrito para incluir la notificación
window.agregarAlCarrito = function (productId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productoExistente = cart.find(item => item.id === productId);

    if (productoExistente) {
        productoExistente.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("Producto agregado al carrito");
};
