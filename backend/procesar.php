<?php
require_once 'utils.php';
require_once 'login.php';
require_once 'carrito.php';
require_once 'productos_vistos.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Obtener datos JSON
        $input = json_decode(file_get_contents('php://input'), true);

        // Validar entrada básica
        if (empty($input['accion'])) {
            throw new Exception("No se recibió ninguna acción");
        }

        // Gestionar acciones
        switch ($input['accion']) {
            case 'login':
                Utils::validarEntrada($input, ['username', 'password']);
                $login = new Login();
                $login->autenticarUsuario($input);
                break;

            case 'validar_token':
                Utils::validarEntrada($input, ['token']);
                $decoded = Utils::validarToken($input['token']);
                if ($decoded) {
                    echo json_encode(["mensaje" => "Token válido"]);
                } else {
                    http_response_code(401);
                    echo json_encode(["error" => "Token inválido o expirado"]);
                }
                break;

            case 'carrito':
                Utils::validarEntrada($input, ['token', 'carrito']);
                $carrito = new Carrito();
                $carrito->validarCarrito($input['token'], $input['carrito']);
                break;

            case 'productos_vistos':
                Utils::validarEntrada($input, ['token', 'producto_id']);
                $productos = new ProductosVistos();
                $productos->gestionarProductos($input['token'], $input['producto_id']);
                break;

            case 'categorias':
                $token = $input['token'] ?? '';

                // Validar el token
                if (!Utils::validarToken($token)) {
                    echo json_encode(["error" => "Token inválido."]);
                    exit;
                }

                // Cargar las categorías desde tienda.json
                $data = json_decode(file_get_contents(__DIR__ . '/data/tienda.json'), true);
                echo json_encode(["categories" => $data['categories']]);
                break;

            case 'obtener_categorias':
                // Validar el token
                $token = $input['token'] ?? '';
                if (!Utils::validarToken($token)) {
                    echo json_encode(["error" => "Token inválido o expirado."]);
                    exit;
                }

                // Cargar las categorías desde el archivo JSON
                $data = json_decode(file_get_contents(__DIR__ . '/data/tienda.json'), true);
                $categories = $data['categories'] ?? [];

                echo json_encode(["categories" => $categories]);
                break;

            case 'obtener_productos':
                $token = $input['token'] ?? '';
                if (!Utils::validarToken($token)) {
                    echo json_encode(["error" => "Token inválido o expirado."]);
                    exit;
                }

                $categoryId = $input['categoryId'] ?? null;
                $data = json_decode(file_get_contents(__DIR__ . '/data/tienda.json'), true);

                if ($categoryId) {
                    $productos = array_filter($data['products'], fn($p) => $p['categoryId'] == $categoryId);
                } else {
                    $productos = $data['products'];
                }

                echo json_encode(["products" => array_values($productos)]);
                break;

            default:
                http_response_code(400);
                throw new Exception("Acción no válida");
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido. Use POST."]);
}
?>