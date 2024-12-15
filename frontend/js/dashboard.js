document.addEventListener('DOMContentLoaded', function () {
    // Función para cargar productos destacados
    function cargarProductosDestacados() {
        fetch('/MinimalBasics/backend/data/tienda.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar los productos');
                }
                return response.json();
            })
            .then(data => {
                const productosDestacados = data.products.filter(product => product.destacado);
                mostrarProductosDestacados(productosDestacados);
            })
            .catch(error => {
                console.error('Error:', error);
                // Aquí podrías mostrar un mensaje de error en la interfaz si lo deseas
            });
    }

    // Función para mostrar productos destacados en el DOM
    function mostrarProductosDestacados(productos) {
        const recentProductsContainer = document.getElementById('recentProducts');
        recentProductsContainer.innerHTML = ''; // Limpiar el contenedor

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

    // Función para agregar un producto al carrito (puedes implementar la lógica según tu necesidad)
    window.agregarAlCarrito = function(productId) {
        // Aquí puedes implementar la lógica para agregar el producto al carrito
        console.log(`Producto ID ${productId} agregado al carrito.`);
        // Por ejemplo, podrías almacenar el producto en el localStorage
    };

    // Cargar productos destacados al iniciar
    cargarProductosDestacados();
});