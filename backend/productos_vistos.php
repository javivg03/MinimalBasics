<?php
class ProductosVistos {
    private $productos;

    public function __construct() {
        $this->productos = json_decode(file_get_contents(__DIR__ . '/data/tienda.json'), true);
    }

    public function gestionarProductos($token, $productoId) {
        $usuario = Utils::validarToken($token);

        if (!$usuario) {
            http_response_code(401);
            echo json_encode(["error" => "Token inválido"]);
            return;
        }

        foreach ($this->productos['products'] as $producto) {
            if ($producto['id'] == $productoId) {
                echo json_encode(["mensaje" => "Producto visto", "producto" => $producto]);
                return;
            }
        }
        
        http_response_code(404);
        echo json_encode(["error" => "Producto no encontrado"]);
    }
}
?>
