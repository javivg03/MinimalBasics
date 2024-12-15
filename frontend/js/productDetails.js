document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    fetch('/MinimalBasics/backend/data/tienda.json')
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.id == productId);
            const productDetailsDiv = document.getElementById('productDetails');

            if (!product) {
                productDetailsDiv.innerHTML = '<p>Producto no encontrado.</p>';
                return;
            }

            productDetailsDiv.innerHTML = `
                <div class="product-card">
                    <img src="/MinimalBasics/images/${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Precio: $${product.price}</p>
                    <p>${product.description}</p>
                    <button onclick="agregarAlCarrito(${product.id})">Agregar al Carrito</button>
                </div>
            `;
        })
        .catch(error => console.error('Error cargando los datos:', error));

    // Función para agregar un producto al carrito
    window.agregarAlCarrito = function(productId) {
        console.log(`Producto ID ${productId} agregado al carrito.`);
        // Aquí puedes implementar la lógica para agregar el producto al carrito
    };
});

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
