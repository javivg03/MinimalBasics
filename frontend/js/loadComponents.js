// Función para cargar el header
function loadHeader() {
    fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el header');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('headerContainer').innerHTML = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para cargar el footer
function loadFooter() {
    fetch('footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el footer');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('footerContainer').innerHTML = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Cargar el header y footer al iniciar
document.addEventListener('DOMContentLoaded', function () {
    loadHeader();
    loadFooter();
});