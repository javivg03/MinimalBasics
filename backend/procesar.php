<?php
header('Content-Type: application/json');
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
                Utils::validarEntrada($input, ['token']);
                $productoId = $input['productoId'] ?? null;
                $productos = new ProductosVistos();
                $productos->gestionarProductos($input['token'], $productoId);
                break;

            // Obtener todas las categorías
            case 'obtener_categorias':
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

            // Obtener productos por categoría
            case 'obtener_productos':
                $token = $input['token'] ?? '';
                if (!Utils::validarToken($token)) {
                    echo json_encode(["error" => "Token inválido o expirado."]);
                    exit;
                }

                $categoryId = $input['categoryId'] ?? null;
                $data = json_decode(file_get_contents(__DIR__ . '/data/tienda.json'), true);

                // Filtrar productos si se pasa una categoría
                if ($categoryId) {
                    $productos = array_filter($data['products'], function($p) use ($categoryId) {
                        return $p['categoryId'] == $categoryId;  // Asegúrate de que 'categoryId' sea el campo correcto
                    });
                } else {
                    $productos = $data['products'];
                }

                echo json_encode(["products" => array_values($productos)]);
                break;

            case 'logout':
                session_start();
                session_destroy(); // Destruye la sesión

                echo json_encode(["mensaje" => "Sesión cerrada correctamente"]);
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
