// Función global para agregar productos al carrito
window.agregarAlCarrito = function(productId) {
    // Leer el carrito actual desde localStorage (si no existe, inicializar como un array vacío)
    const carrito = JSON.parse(localStorage.getItem('cart')) || [];

    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === productId);

    if (productoExistente) {
        // Si ya existe, incrementar la cantidad
        productoExistente.quantity += 1;
    } else {
        // Si no existe, agregar un nuevo producto con cantidad 1
        carrito.push({ id: productId, quantity: 1 });
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(carrito));

    // Mensaje de confirmación (puedes personalizarlo o usar un modal/toast)
    alert('Producto agregado al carrito correctamente');
};

// Función para cargar productos destacados (sin cambios)
function cargarProductosDestacados() {
    fetch('/MinimalBasics/backend/data/tienda.json')
        .then(response => response.json())
        .then(data => {
            const productosDestacados = data.products.filter(product => product.destacado);
            mostrarProductosDestacados(productosDestacados);
        })
        .catch(error => console.error('Error:', error));
}

// Función para mostrar productos destacados (sin cambios, ya incluye el botón)
function mostrarProductosDestacados(productos) {
    const recentProductsContainer = document.getElementById('recentProducts');
    recentProductsContainer.innerHTML = '';

    if (productos.length === 0) {
        recentProductsContainer.innerHTML = '<p>No hay productos destacados disponibles.</p>';
        return;
    }

    productos.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <img src="/MinimalBasics/images/${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Precio: $${product.price}</p>
            <button onclick="agregarAlCarrito(${product.id})">Agregar al Carrito</button>
        `;
        recentProductsContainer.appendChild(productElement);
    });
}

// Inicialización de la página
document.addEventListener('DOMContentLoaded', cargarProductosDestacados);

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
