<?php
class Login
{
    private $usuarios;

    public function __construct()
    {
        $this->usuarios = json_decode(file_get_contents(__DIR__ . '/data/usuarios.json'), true);
    }

    public function autenticarUsuario($input)
    {
        foreach ($this->usuarios as $usuario) {
            if ($usuario['username'] === $input['username'] && $usuario['password'] === $input['password']) {
                return $usuario; // Devolver el usuario autenticado
            }
        }
        return null; // Devolver null si no se encuentra
    }
}
?>