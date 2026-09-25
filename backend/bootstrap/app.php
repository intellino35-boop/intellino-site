<?php

use App\Http\Responses\ApiResponse;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // En-têtes de sécurité sur toutes les réponses (API comprise). Le CORS est géré par HandleCors (config/cors.php).
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);

        // API par jeton : pas de redirection vers une page de connexion, l'exception donne un 401 JSON.
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Le backend ne sert que du JSON : toutes les erreurs suivent le format { data, message, status }.
        $exceptions->shouldRenderJsonWhen(fn () => true);
        $exceptions->render(fn (Throwable $e, Request $request) => ApiResponse::fromException($e));
    })->create();
