<?php

namespace App\Http\Middleware;

use App\Http\Responses\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/** Refuse (401) un utilisateur dont le compte a été désactivé et révoque son jeton. */
class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->active) {
            $user->currentAccessToken()?->delete();

            return ApiResponse::error('Votre compte a été désactivé. Contactez un administrateur.', 401);
        }

        return $next($request);
    }
}
