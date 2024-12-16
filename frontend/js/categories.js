document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    cargarProductos(); // Carga inicial de productos
});

function cargarProductos() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category'); // Leer categoría de la URL (si existe)

    fetch('/MinimalBasics/backend/procesar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            accion: 'obtener_productos',
            categoryId: categoryId || null, // Enviamos null si no hay categoría
            token: localStorage.getItem('token'),
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            renderProductos(data.products); // Mostrar productos
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

function renderProductos(products) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p>No hay productos disponibles.</p>';
        return;
    }

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <a href="productDetails.html?productId=${product.id}">
                <div class="product-card">
                    <img src="/MinimalBasics/images/${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Precio: $${product.price}</p>
                </div>
            </a>
        `;
        container.appendChild(productDiv);
    });
}
