<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \App\Http\Middleware\SecurityHeaders::class,
        ]);
        $middleware->redirectGuestsTo(fn () => route('admin.login'));
        $middleware->redirectUsersTo(fn () => route('admin.dashboard'));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Fiche introuvable (produit, article…) : même page 404 que les adresses inconnues, dans le style du site.
        $exceptions->respond(function (Response $response, Throwable $e, Request $request) {
            if ($response->getStatusCode() === 404 && ! $request->expectsJson()) {
                return Inertia::render('ComingSoon')->toResponse($request)->setStatusCode(404);
            }

            // Page d'admin non autorisée pour ce rôle : retour au tableau de bord avec un message.
            if ($response->getStatusCode() === 403 && $request->user() && $request->is('admin/*') && ! $request->expectsJson()) {
                return redirect()->route('admin.dashboard')
                    ->withErrors(['user' => "Votre rôle ne donne pas accès à cette page."]);
            }

            return $response;
        });
    })->create();
