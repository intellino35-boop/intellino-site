<?php

namespace App\Http\Responses;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

/**
 * Format unique des réponses de l'API :
 * { "data": …, "message": "", "status": true|false [, "errors": {…}] [, "meta": {…}] }
 */
class ApiResponse
{
    public static function success(mixed $data = null, string $message = '', int $code = 200, ?array $meta = null): JsonResponse
    {
        $body = ['data' => $data, 'message' => $message, 'status' => true];
        if ($meta !== null) {
            $body['meta'] = $meta;
        }

        return response()->json($body, $code);
    }

    public static function error(string $message, int $code, ?array $errors = null): JsonResponse
    {
        $body = ['data' => null, 'message' => $message, 'status' => false];
        if ($errors !== null) {
            $body['errors'] = $errors;
        }

        return response()->json($body, $code);
    }

    /** Toute exception devient une réponse JSON au même format (401, 403, 404, 422, 429, 500…). */
    public static function fromException(Throwable $e): JsonResponse
    {
        if ($e instanceof ValidationException) {
            $errors = $e->errors();
            // Une seule erreur : son message (ex. « Identifiants incorrects. ») ; plusieurs : message général en français
            // (le résumé de Laravel ajoute « (and N more errors) » en anglais).
            $message = count($errors) === 1 ? (string) (reset($errors)[0] ?? '') : 'Les données envoyées sont invalides.';

            return self::error($message ?: 'Les données envoyées sont invalides.', 422, $errors);
        }

        if ($e instanceof AuthenticationException) {
            return self::error('Authentification requise. Veuillez vous connecter.', 401);
        }

        if ($e instanceof HttpExceptionInterface) {
            $code = $e->getStatusCode();
            $message = match ($code) {
                403 => 'Vous n\'avez pas l\'autorisation d\'effectuer cette action.',
                404 => 'Ressource introuvable.',
                405 => 'Méthode non autorisée.',
                419 => 'Session expirée.',
                429 => 'Trop de requêtes. Merci de réessayer dans une minute.',
                503 => 'Service en maintenance. Merci de réessayer dans quelques instants.',
                default => $e->getMessage() ?: 'Erreur.',
            };

            return self::error($message, $code)->withHeaders($e->getHeaders());
        }

        return self::error(
            config('app.debug') ? $e->getMessage() : 'Une erreur interne est survenue. Merci de réessayer plus tard.',
            500,
        );
    }
}
