document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Función para manejar el inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Evitar recargar la página

            // Obtener los valores de los campos
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Validar que no estén vacíos
            if (!username || !password) {
                errorMessage.textContent = "Por favor, completa todos los campos.";
                errorMessage.style.display = "block";
                return;
            }

            // Enviar los datos al backend
            fetch('/MinimalBasics/backend/procesar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accion: 'login',
                    username: username,
                    password: password,
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al conectar con el servidor");
                }
                return response.json();
            })
            .then(data => {
                if (data.token) {
                    // Guardar el token en localStorage
                    localStorage.setItem('token', data.token);

                    // Cargar todos los productos y guardarlos en localStorage
                    return fetch('/MinimalBasics/backend/procesar.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            accion: 'obtener_productos',
                            token: data.token, 
                        })
                    });
                } else {
                    // Mostrar el mensaje de error
                    errorMessage.textContent = data.error || "Error desconocido.";
                    errorMessage.style.display = "block";
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.products) {
                    localStorage.setItem('products', JSON.stringify(data.products));
                }
                // Redirigir al dashboard
                window.location.href = '/MinimalBasics/frontend/dashboard.html';
            })
            .catch(error => {
                console.error('Error:', error);
                errorMessage.textContent = "Hubo un problema, intenta de nuevo.";
                errorMessage.style.display = "block";
            });
        });
    }

    // Verificar estado del token
    const token = localStorage.getItem('token');

    // Páginas protegidas que requieren autenticación
    const protectedPages = [
        '/MinimalBasics/frontend/dashboard.html',
        '/MinimalBasics/frontend/cart.html',
        '/MinimalBasics/frontend/categories.html',
        '/MinimalBasics/frontend/productDetails.html',
    ];

    // Páginas accesibles solo sin autenticación
    const publicPages = ['/MinimalBasics/frontend/login.html'];

    // Lógica de redirección según el estado de autenticación
    if (protectedPages.includes(window.location.pathname) && !token) {
        // Si no hay token y la página es protegida, redirigir al login
        window.location.href = '/MinimalBasics/frontend/login.html';
    } else if (publicPages.includes(window.location.pathname) && token) {
        // Si hay token y se intenta acceder al login, redirigir al dashboard
        window.location.href = '/MinimalBasics/frontend/dashboard.html';
    }
});