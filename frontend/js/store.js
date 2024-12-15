// Cargar las categorías dinámicamente
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('categories.html')) {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }

        // Obtener categorías desde localStorage
        const categories = JSON.parse(localStorage.getItem('categories')) || [];
        if (categories.length > 0) {
            renderCategories(categories);
        } else {
            // Si no hay categorías en localStorage, llamar al backend
            fetch('/MinimalBasics/backend/procesar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accion: 'obtener_categorias',
                    token: token
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                renderCategories(data.categories);
                // Almacenar las categorías en localStorage
                localStorage.setItem('categories', JSON.stringify(data.categories));
            })
            .catch(error => {
                console.error('Error al cargar las categorías:', error);
            });
        }
    }
});

// Renderizar categorías
function renderCategories(categories) {
    const container = document.getElementById('categoriesContainer');
    if (!container) return; // Salir si no estamos en la página de categorías

    container.innerHTML = ''; // Limpiar el contenedor
    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `
            <h3>${category.name}</h3>
            <button onclick="viewProducts(${category.id})">Ver productos</button>
        `;
        container.appendChild(categoryDiv);
    });
}

// Redirigir a la página de productos
function viewProducts(categoryId) {
    window.location.href = `product.html?category=${categoryId}`;
}