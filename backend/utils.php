<?php
class Utils {
    // Método para validar entradas
    public static function validarEntrada($input, $camposRequeridos) {
        foreach ($camposRequeridos as $campo) {
            if (empty($input[$campo])) {
                throw new Exception("Falta el campo requerido: $campo");
            }
        }
    }

    // Método para validar tokens
    public static function validarToken($token) {
        // Sustituir por una lógica más segura en producción
        $key = "clave_secreta";
        $decoded = json_decode(base64_decode($token), true);

        if (!$decoded || !isset($decoded['exp']) || $decoded['exp'] < time()) {
            return false;
        }

        return $decoded;
    }

    // Método para generar un token
    public static function generarToken($datos) {
        $key = "clave_secreta";
        $datos['exp'] = time() + 3600; // Expira en 1 hora
        return base64_encode(json_encode($datos));
    }
}
?>
