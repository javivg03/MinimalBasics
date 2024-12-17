document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    const token = localStorage.getItem("token");

    fetch('/MinimalBasics/backend/procesar.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accion: 'obtener_productos',
            token
        })
    })
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.id == productId);
            const productDetailsDiv = document.getElementById('productDetails');

            if (!product) {
                productDetailsDiv.innerHTML = '<p>Producto no encontrado.</p>';
                return;
            }

            productDetailsDiv.innerHTML = `
                <div class="product-details-content">
                    <img src="/MinimalBasics/images/${product.image}" alt="${product.name}">
                    <div class="product-details-info">
                        <h3>${product.name}</h3>
                        <p>Precio: $${product.price}</p>
                        <p>${product.description}</p>
                        <label for="size">Selecciona una talla:</label>
                        <select id="size">
                            ${getTallasPorCategoria(product.categoryId).map(
                                talla => `<option value="${talla}">${talla}</option>`
                            ).join('')}
                        </select>
                        <button onclick="agregarAlCarrito(${product.id})">Agregar al Carrito</button>
                    </div>
                </div>
            `;
        })
        .catch(error => console.error('Error cargando los datos:', error));
});

// Obtener tallas según la categoría del producto
function getTallasPorCategoria(categoryId) {
    switch (categoryId) {
        case 1: // Essentials
        case 2: // Gráficas
            return ['XS', 'S', 'M', 'L', 'XL'];
        case 3: // Outerwear
            return ['S', 'M', 'L', 'XL', 'XXL'];
        case 4: // Accesorios
        case 5: // Colaboraciones
            return ['Única'];
        default:
            return [];
    }
}

// Función global para agregar productos al carrito
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

// Función para mostrar notificaciones tipo toast
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}