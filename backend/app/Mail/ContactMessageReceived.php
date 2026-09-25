<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ContactMessageReceived extends Mailable
{
    public function __construct(public ContactMessage $contactMessage) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            replyTo: [new Address($this->contactMessage->email, $this->contactMessage->nom)],
            subject: 'Nouveau message de contact — '.$this->contactMessage->nom,
        );
    }

    public function content(): Content
    {
        return new Content(
            text: 'emails.contact-message',
            // Lien vers la page du message dans l'administration React (FRONTEND_URL).
            with: ['adminUrl' => config('intellino.frontend_url').'/admin/messages/'.$this->contactMessage->id],
        );
    }
}
