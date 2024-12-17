<?php
class Login {
    private $usuarios;

    public function __construct() {
        $this->usuarios = json_decode(file_get_contents(__DIR__ . '/data/usuarios.json'), true);
    }

    public function autenticarUsuario($input) {
        foreach ($this->usuarios as $usuario) {
            if ($usuario['username'] === $input['username'] && $usuario['password'] === $input['password']) {
                $token = Utils::generarToken(["username" => $usuario['username']]);
                echo json_encode(["mensaje" => "Autenticación exitosa", "token" => $token]);
                return;
            }
        }

        http_response_code(401);
        echo json_encode(["error" => "Credenciales inválidas"]);
    }
}
?>