<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Admin/Login');
    }

    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ], [
            'required' => 'Ce champ est obligatoire.',
            'email' => 'Veuillez saisir une adresse e-mail valide.',
        ]);

        if (! Auth::validate($credentials)) {
            throw ValidationException::withMessages(['email' => 'Identifiants incorrects.']);
        }

        // Compte désactivé : identifiants corrects mais connexion refusée.
        if (! Auth::attempt([...$credentials, 'active' => true], $request->boolean('remember'))) {
            throw ValidationException::withMessages(['email' => 'Votre compte a été désactivé. Contactez un administrateur.']);
        }

        $request->session()->regenerate();
        $request->user()->forceFill(['last_login_at' => now()])->save();

        return redirect()->intended(route('admin.dashboard'));
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
