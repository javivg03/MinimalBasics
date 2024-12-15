document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');

    fetch('/MinimalBasics/backend/data/tienda.json')
        .then(response => response.json())
        .then(data => {
            const productosDiv = document.getElementById('productos');
            const categoriasDiv = document.getElementById('categorias');

            if (!productosDiv || !categoriasDiv) {
                console.error('Los contenedores de categorías o productos no se encontraron en el DOM.');
                return; // Salir si no se encuentran los elementos
            }

            // Mostrar categorías
            data.categories.forEach(category => {
                const categoryElement = document.createElement('button');
                categoryElement.textContent = category.name;
                categoryElement.addEventListener('click', () => {
                    // Redirigir a la página de productos de la categoría seleccionada
                    window.location.href = `product.html?category=${category.id}`;
                });
                categoriasDiv.appendChild(categoryElement);
            });

            // Mostrar productos de la categoría seleccionada
            mostrarProductos(data.products, categoryId);
        })
        .catch(error => console.error('Error cargando los datos:', error));

    function mostrarProductos(productos, categoryId) {
        const productosDiv = document.getElementById('productos');
        productosDiv.innerHTML = ''; // Limpiar productos anteriores

        const filteredProducts = productos.filter(product => product.category == categoryId);
        filteredProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>Precio: $${product.price}</p>
                <p>Descripción: ${product.description || 'No disponible'}</p>
            `;
            productosDiv.appendChild(productElement);
        });
    }
});