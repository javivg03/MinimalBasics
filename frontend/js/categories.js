document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    cargarCategorias(); // Cargar categorías al iniciar
    cargarProductos(); // Cargar productos inicialmente sin filtro
});

// Cargar las categorías y mostrarlas en botones
function cargarCategorias() {
    const token = localStorage.getItem('token');

    fetch('/MinimalBasics/backend/procesar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'obtener_categorias', token: token })
    })
    .then(response => response.json())
    .then(data => {
        const categoriesContainer = document.getElementById('categoriesContainer');
        categoriesContainer.innerHTML = '';

        if (data.categories && data.categories.length > 0) {
            data.categories.forEach(category => {
                const categoryButton = document.createElement('button');
                categoryButton.textContent = category.name; // Nombre de la categoría
                categoryButton.onclick = () => redirigirACategoria(category.id, category.name); // Redirige al hacer clic
                categoriesContainer.appendChild(categoryButton);
            });
        } else {
            categoriesContainer.innerHTML = '<p>No hay categorías disponibles.</p>';
        }
    })
    .catch(error => console.error('Error al cargar las categorías:', error));
}

// Redirigir a la misma página con el filtro de categoría en la URL
function redirigirACategoria(categoryId, categoryName) {
    const url = new URL(window.location.href);
    url.searchParams.set('category', categoryId); // Establece el ID de la categoría en la URL
    window.location.href = url.toString(); // Redirige a la URL actualizada
}

// Cargar productos según la categoría seleccionada
function cargarProductos() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category'); // Leer categoría de la URL
    const pageTitle = document.getElementById('pageTitle'); // Elemento del título de la página

    // Si hay una categoría seleccionada, cambiar el título y cargar los productos filtrados
    if (categoryId) {
        fetch('/MinimalBasics/backend/procesar.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                accion: 'obtener_productos',
                categoryId: categoryId,
                token: localStorage.getItem('token'),
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            renderProductos(data.products); // Mostrar productos filtrados
            pageTitle.textContent = `Productos - ${getCategoryName(categoryId)}`; // Cambiar el título de la página
        })
        .catch(error => console.error('Error al cargar productos:', error));
    } else {
        // Si no hay categoría, cargar todos los productos
        fetch('/MinimalBasics/backend/procesar.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                accion: 'obtener_productos',
                categoryId: null, // No enviar filtro de categoría
                token: localStorage.getItem('token'),
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            renderProductos(data.products); // Mostrar todos los productos
            pageTitle.textContent = 'Todos los productos'; // Título para todos los productos
        })
        .catch(error => console.error('Error al cargar productos:', error));
    }
}

// Obtener el nombre de la categoría desde el servidor o el archivo JSON (se puede mejorar con un array de categorías en memoria)
function getCategoryName(categoryId) {
    const categories = [
        { id: 1, name: 'Essentials' },
        { id: 2, name: 'Gráficas' },
        { id: 3, name: 'Outerwear' },
        { id: 4, name: 'Accesorios' },
        { id: 5, name: 'Colaboraciones' }
    ];

    const category = categories.find(c => c.id == categoryId);
    return category ? category.name : 'Categoría desconocida';
}

// Renderizar productos en el contenedor
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
