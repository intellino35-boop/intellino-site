<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\Roles;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/** « Mon compte » : chaque utilisateur modifie son nom, son e-mail et son mot de passe (pas son rôle). */
class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Admin/Profile', [
            'user' => $user->only('name', 'email', 'last_login_at'),
            'role' => Roles::DEFINITIONS[$user->role] ?? null,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            // Mot de passe actuel exigé pour tout changement (protège une session laissée ouverte).
            'current_password' => ['required', 'current_password'],
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
        if (empty($data['password'])) {
            unset($data['password']);
        }
        $user->update($data);

        return back()->with('success', 'Vos informations ont été mises à jour.');
    }
}
