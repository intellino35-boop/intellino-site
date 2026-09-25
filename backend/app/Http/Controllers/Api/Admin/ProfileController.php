<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/** « Mon compte » : chaque utilisateur modifie son nom, son e-mail et son mot de passe (pas son rôle). */
class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        return $this->ok([
            'user' => $user->toAuthPayload(),
            'role' => Roles::DEFINITIONS[$user->role] ?? null,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            // Mot de passe actuel exigé pour tout changement (protège une session laissée ouverte).
            'current_password' => ['required', 'current_password:sanctum'],
            'password' => ['nullable', 'confirmed', Password::min(10)],
        ], [
            'required' => 'Ce champ est obligatoire.',
            'email' => 'Adresse e-mail invalide.',
            'email.unique' => 'Un utilisateur utilise déjà cette adresse.',
            'current_password' => 'Mot de passe actuel incorrect.',
            'confirmed' => 'La confirmation ne correspond pas.',
            'password.min' => 'Le mot de passe doit contenir au moins :min caractères.',
        ]);

        unset($data['current_password']);
        $passwordChanged = ! empty($data['password']);
        if (! $passwordChanged) {
            unset($data['password']);
        }
        $user->update($data);

        // Nouveau mot de passe : les autres sessions (jetons) sont fermées, la session actuelle est conservée.
        if ($passwordChanged) {
            $user->tokens()->whereKeyNot($user->currentAccessToken()?->getKey())->delete();
        }

        return $this->ok(['user' => $user->fresh()->toAuthPayload()], 'Vos informations ont été mises à jour.');
    }
}
