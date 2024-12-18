<?php
class Carrito {
    public function validarCarrito($token, $carrito) {
        $usuario = Utils::validarToken($token);
        if (!$usuario) {
            http_response_code(401);
            echo json_encode(["error" => " Token inválido"]);
            return;
        }

        if (empty($carrito) || !is_array($carrito)) {
            http_response_code(400);
            echo json_encode(["error" => "Carrito inválido o vacío"]);
            return;
        }

        // Cargar los productos de la tienda
        $data = json_decode(file_get_contents(__DIR__ . '/data/tienda.json'), true);
        $productos = $data['products'];

        $total = 0;
        foreach ($carrito as $item) {
            $producto = array_filter($productos, function ($p) use ($item) {
                return $p['id'] == $item['id'];
            });

            if (empty($producto)) {
                http_response_code(400);
                echo json_encode(["error" => "Producto no encontrado en la tienda"]);
                return;
            }

            $producto = array_values($producto)[0]; // Obtener el primer producto encontrado
            if ($producto['price'] !== $item['price']) {
                http_response_code(400);
                echo json_encode(["error" => "El precio del producto no coincide"]);
                return;
            }

            $total += $producto['price'] * $item['quantity'];
        }

        // Si todo es correcto, devolver una respuesta positiva
        echo json_encode(["mensaje" => "Carrito validado", "total" => $total, "carrito" => $carrito]);
    }

    public function procesarCompra($token, $carrito) {
        $usuario = Utils::validarToken($token);
        if (!$usuario) {
            http_response_code(401);
            echo json_encode(["error" => "Token inválido"]);
            return;
        }

        if (empty($carrito) || !is_array($carrito)) {
            http_response_code(400);
            echo json_encode(["error" => "Carrito inválido o vacío"]);
            return;
        }

        // Cargar los productos de la tienda
        $data = json_decode(file_get_contents(__DIR__ . '/data/tienda.json'), true);
        $productos = $data['products'];

        $total = 0;
        foreach ($carrito as $item) {
            $producto = array_filter($productos, function ($p) use ($item) {
                return $p['id'] == $item['id'];
            });

            if (empty($producto)) {
                http_response_code(400);
                echo json_encode(["error" => "Producto no encontrado en la tienda"]);
                return;
            }

            $producto = array_values($producto)[0]; // Obtener el primer producto encontrado
            if ($producto['price'] !== $item['price']) {
                http_response_code(400);
                echo json_encode(["error" => "El precio del producto no coincide"]);
                return;
            }

            $total += $producto['price'] * $item['quantity'];
        }

        // Aquí podrías agregar lógica para procesar el pedido, como actualizar inventario

        // Si todo es correcto, devolver una respuesta positiva
        echo json_encode(["mensaje" => "Compra procesada con éxito", "total" => $total, "carrito" => $carrito]);
    }
}
?>