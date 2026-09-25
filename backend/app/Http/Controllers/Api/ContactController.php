<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactController extends Controller
{
    public function store(ContactRequest $request): JsonResponse
    {
        $contactMessage = ContactMessage::create($request->validated());

        // Copie par e-mail à l'équipe ; un échec d'envoi ne doit pas faire échouer le formulaire (le message est déjà en base).
        if ($to = config('intellino.notify_email')) {
            try {
                Mail::to($to)->send(new ContactMessageReceived($contactMessage));
            } catch (Throwable $e) {
                report($e);
            }
        }

        return $this->ok(
            ['id' => $contactMessage->id],
            'Merci ! Votre message a bien été envoyé. Notre équipe vous répondra rapidement.',
            201,
        );
    }
}
