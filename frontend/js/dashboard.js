// Función para cargar productos destacados
function cargarProductosDestacados() {
    // Intentar obtener productos destacados del localStorage
    const productosDestacados = JSON.parse(localStorage.getItem('productosDestacados'));

    if (productosDestacados) {
        // Si existen en localStorage, mostrarlos
        mostrarProductosDestacados(productosDestacados);
    } else {
        // Si no existen, hacer la petición al servidor
        fetch('/MinimalBasics/backend/data/tienda.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar los productos destacados.');
                }
                return response.json();
            })
            .then(data => {
                const productosDestacados = data.products.filter(product => product.destacado);
                // Guardar los productos destacados en localStorage
                localStorage.setItem('productosDestacados', JSON.stringify(productosDestacados));
                mostrarProductosDestacados(productosDestacados);
            })
            .catch(error => {
                console.error('Error:', error);
                const recentProductsContainer = document.getElementById('recentProducts');
                recentProductsContainer.innerHTML = '<p>Error al cargar los productos destacados. Intente nuevamente más tarde.</p>';
            });
    }
}

// Función para mostrar productos destacados
function mostrarProductosDestacados(productos) {
    const recentProductsContainer = document.getElementById('recentProducts');
    recentProductsContainer.innerHTML = '';

    if (productos.length === 0) {
        recentProductsContainer.innerHTML = '<p>No hay productos destacados disponibles.</p>';
        return;
    }

    productos.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <a href="productDetails.html?productId=${product.id}" class="product-link">
                <img src="/MinimalBasics/images/${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Precio: $${product.price}</p>
            </a>
        `;
        recentProductsContainer.appendChild(productCard);
    });
}

// Inicialización de la página
document.addEventListener('DOMContentLoaded', cargarProductosDestacados);