<?php
class ProductosVistos {
    private $productos;

    public function __construct() {
        $this->productos = json_decode(file_get_contents(__DIR__ . '/data/tienda.json'), true);
    }

    public function gestionarProductos($token, $productoId = null) {
        $usuario = Utils::validarToken($token);

        if (!$usuario) {
            http_response_code(401);
            echo json_encode(["error" => "Token inválido"]);
            return;
        }

        // Ruta para almacenar los productos vistos
        $rutaArchivo = __DIR__ . '/data/productos_vistos_' . $usuario['id'] . '.json';
        $productosVistos = file_exists($rutaArchivo) ? json_decode(file_get_contents($rutaArchivo), true) : [];

        // Si se envía un productoId, registrar el producto
        if ($productoId !== null) {
            foreach ($this->productos['products'] as $producto) {
                if ($producto['id'] == $productoId) {
                    // Evitar duplicados
                    $productosVistos = array_filter($productosVistos, fn($p) => $p['id'] != $productoId);
                    array_unshift($productosVistos, $producto); // Añadir al inicio
                    $productosVistos = array_slice($productosVistos, 0, 5); // Limitar a los últimos 5
                    file_put_contents($rutaArchivo, json_encode($productosVistos));
                    echo json_encode(["mensaje" => "Producto registrado como visto", "producto" => $producto]);
                    return;
                }
            }

            http_response_code(404);
            echo json_encode(["error" => "Producto no encontrado"]);
            return;
        }

        // Si no se envía productoId, devolver la lista de productos vistos
        echo json_encode(["productos" => $productosVistos]);
    }
}
?>
