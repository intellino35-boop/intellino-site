<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\ContactMessage;
use App\Models\User;
use App\Support\AdminResources;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/** Authentification de l'administration par jeton Sanctum (en-tête « Authorization: Bearer … »). */
class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            // Message générique : ne révèle pas si le compte existe.
            throw ValidationException::withMessages(['email' => 'Identifiants incorrects.']);
        }

        if (! $user->active) {
            return $this->fail('Votre compte a été désactivé. Contactez un administrateur.', 403);
        }

        $expiresAt = $request->boolean('remember')
            ? now()->addDays(config('intellino.token_remember_days'))
            : now()->addHours(config('intellino.token_hours'));

        $token = $user->createToken('admin', ['*'], $expiresAt)->plainTextToken;
        $user->forceFill(['last_login_at' => now()])->save();

        return $this->ok([
            'token' => $token,
            'expires_at' => $expiresAt->toIso8601String(),
            ...$this->session($user),
        ], 'Connexion réussie.');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return $this->ok(null, 'Vous êtes déconnecté(e).');
    }

    /** Utilisateur connecté + données du menu de l'admin (messages non lus, types de contenus). */
    public function me(Request $request): JsonResponse
    {
        return $this->ok($this->session($request->user()));
    }

    private function session(User $user): array
    {
        return [
            'user' => $user->toAuthPayload(),
            'admin' => [
                'unread' => $user->hasPermission('messages') ? ContactMessage::whereNull('read_at')->count() : 0,
                'resources' => collect(AdminResources::content())
                    ->map(fn (array $r, string $type) => ['type' => $type, 'label' => $r['label']])
                    ->values(),
                'blockTypes' => array_keys(AdminResources::blocks()),
            ],
        ];
    }
}
