<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Support\Roles;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    private const MESSAGES = [
        'required' => 'Ce champ est obligatoire.',
        'email' => 'Adresse e-mail invalide.',
        'email.unique' => 'Un utilisateur utilise déjà cette adresse.',
        'confirmed' => 'La confirmation ne correspond pas.',
        'in' => 'Rôle inconnu.',
        'max' => 'Ce champ ne doit pas dépasser :max caractères.',
        'password.min' => 'Le mot de passe doit contenir au moins :min caractères.',
    ];

    public function roles(): JsonResponse
    {
        return $this->ok(Roles::forFrontend());
    }

    public function index(Request $request): JsonResponse
    {
        $users = User::orderByRaw("role = 'admin' desc")->orderBy('name')->get();

        return $this->ok(UserResource::collection($users)->resolve($request), meta: [
            'roles' => Roles::forFrontend(),
            'currentUserId' => $request->user()->id,
        ]);
    }

    public function show(Request $request, User $user): JsonResponse
    {
        return $this->ok((new UserResource($user))->resolve($request), meta: [
            'roles' => Roles::forFrontend(),
            'isSelf' => $user->is($request->user()),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules(), self::MESSAGES);
        $user = User::create($data);

        return $this->ok((new UserResource($user->fresh()))->resolve($request), "Utilisateur {$user->name} créé.", 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate($this->rules($user), self::MESSAGES);
        $data['active'] = (bool) ($data['active'] ?? $user->active);

        if ($user->is($request->user()) && ($data['role'] !== $user->role || ! $data['active'])) {
            throw ValidationException::withMessages(['role' => 'Vous ne pouvez pas modifier votre propre rôle ni désactiver votre compte.']);
        }
        $this->guardLastAdmin($user, $data['role'], $data['active']);

        if (empty($data['password'])) {
            unset($data['password']); // champ vide = mot de passe inchangé
        }
        $user->update($data);

        // Compte désactivé : ses jetons sont révoqués immédiatement.
        if (! $user->active) {
            $user->tokens()->delete();
        }

        return $this->ok((new UserResource($user->fresh()))->resolve($request), "Utilisateur {$user->name} mis à jour.");
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($user->is($request->user())) {
            return $this->fail('Vous ne pouvez pas supprimer votre propre compte.', 422, ['user' => ['Vous ne pouvez pas supprimer votre propre compte.']]);
        }
        if ($user->isAdmin() && $user->active && User::activeAdminCount() <= 1) {
            return $this->fail('Impossible de supprimer le dernier administrateur actif.', 422, ['user' => ['Impossible de supprimer le dernier administrateur actif.']]);
        }

        $user->tokens()->delete();
        $user->delete();

        return $this->ok(null, "Utilisateur {$user->name} supprimé.");
    }

    private function rules(?User $user = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user?->id)],
            'role' => ['required', Rule::in(Roles::keys())],
            'active' => ['boolean'],
            // Obligatoire à la création ; à la modification, vide = inchangé.
            'password' => [$user ? 'nullable' : 'required', 'confirmed', Password::min(10)],
        ];
    }

    /** Le site doit toujours garder au moins un administrateur actif. */
    private function guardLastAdmin(User $user, string $newRole, bool $newActive): void
    {
        $losesAdmin = $user->isAdmin() && $user->active && ($newRole !== Roles::ADMIN || ! $newActive);

        if ($losesAdmin && User::activeAdminCount() <= 1) {
            throw ValidationException::withMessages(['role' => 'Il doit rester au moins un administrateur actif.']);
        }
    }
}
