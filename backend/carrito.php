<?php
class Carrito {
    public function validarCarrito($token, $carrito) {
        $usuario = Utils::validarToken($token);

        if (!$usuario) {
            http_response_code(401);
            echo json_encode(["error" => "Token inválido"]);
            return;
        }

        if (empty($carrito) || !is_array($carrito)) {
            throw new Exception("Carrito inválido o vacío");
        }

        echo json_encode(["mensaje" => "Carrito validado", "carrito" => $carrito]);
    }
}

?>
