<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\Roles;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

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

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::orderByRaw("role = 'admin' desc")->orderBy('name')
                ->get(['id', 'name', 'email', 'role', 'active', 'last_login_at', 'created_at']),
            'roles' => Roles::forFrontend(),
            'currentUserId' => $request->user()->id,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Form', ['user' => null, 'roles' => Roles::forFrontend(), 'isSelf' => false]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate($this->rules(), self::MESSAGES);
        User::create($data);

        return redirect()->route('admin.users.index')->with('success', "Utilisateur {$data['name']} créé.");
    }

    public function edit(Request $request, User $user): Response
    {
        return Inertia::render('Admin/Users/Form', [
            'user' => $user->only('id', 'name', 'email', 'role', 'active', 'last_login_at'),
            'roles' => Roles::forFrontend(),
            'isSelf' => $user->is($request->user()),
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate($this->rules($user), self::MESSAGES);

        if ($user->is($request->user()) && ($data['role'] !== $user->role || ! $data['active'])) {
            throw ValidationException::withMessages(['role' => 'Vous ne pouvez pas modifier votre propre rôle ni désactiver votre compte.']);
        }
        $this->guardLastAdmin($user, $data['role'], $data['active']);

        if (empty($data['password'])) {
            unset($data['password']); // champ vide = mot de passe inchangé
        }
        $user->update($data);

        return redirect()->route('admin.users.index')->with('success', "Utilisateur {$user->name} mis à jour.");
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->is($request->user())) {
            return back()->withErrors(['user' => 'Vous ne pouvez pas supprimer votre propre compte.']);
        }
        if ($user->isAdmin() && $user->active && User::activeAdminCount() <= 1) {
            return back()->withErrors(['user' => 'Impossible de supprimer le dernier administrateur actif.']);
        }

        $user->delete();

        return redirect()->route('admin.users.index')->with('success', "Utilisateur {$user->name} supprimé.");
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
