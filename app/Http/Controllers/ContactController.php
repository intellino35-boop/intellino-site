<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactController extends Controller
{
    public const SUBJECTS = ['solutions', 'securite', 'cloud', 'ia', 'iot', 'produit', 'partenariat', 'autre'];

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'organisation' => ['nullable', 'string', 'max:255'],
            'telephone' => ['nullable', 'string', 'max:40'],
            'email' => ['required', 'email', 'max:255'],
            'sujet' => ['required', 'in:'.implode(',', self::SUBJECTS)],
            'message' => ['required', 'string', 'max:5000'],
        ], [
            'required' => 'Ce champ est obligatoire.',
            'email' => 'Veuillez saisir une adresse e-mail valide.',
            'max' => 'Ce champ ne doit pas dépasser :max caractères.',
            'sujet.in' => 'Veuillez choisir un sujet dans la liste.',
        ]);

        $contactMessage = ContactMessage::create($data);

        // Copie par e-mail à l'équipe ; un échec d'envoi ne doit pas faire échouer le formulaire (le message est déjà en base).
        if ($to = config('intellino.notify_email')) {
            try {
                Mail::to($to)->send(new ContactMessageReceived($contactMessage));
            } catch (Throwable $e) {
                report($e);
            }
        }

        return back()->with('success', 'Merci ! Votre message a bien été envoyé. Notre équipe vous répondra rapidement.');
    }
}
