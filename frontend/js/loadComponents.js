document.addEventListener("DOMContentLoaded", function () {
  // Cargar el header
  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("headerContainer").innerHTML = data;
      // Asignar el evento de clic al botón de cierre de sesión
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
          // Eliminar el token del almacenamiento local
          localStorage.removeItem("token");
          localStorage.removeItem("categories"); // Eliminar categorías al cerrar sesión

          // Redirigir al usuario a la página de inicio de sesión
          window.location.href = "/MinimalBasics/frontend/login.html";
        });
      }
    })
    .catch((error) => console.error("Error al cargar el header:", error));
});

// Función para cargar el footer
function loadFooter() {
  fetch("footer.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al cargar el footer");
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("footerContainer").innerHTML = data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Cargar el header y footer al iniciar
document.addEventListener("DOMContentLoaded", function () {
  loadHeader();
  loadFooter();
});
