<?php

namespace Tests\Feature\Api;

use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use RuntimeException;
use Tests\TestCase;

class ContactApiTest extends TestCase
{
    use RefreshDatabase;

    private array $form = ['nom' => 'Awa Koné', 'email' => 'awa@example.com', 'sujet' => 'partenariat', 'message' => 'Bonjour'];

    public function test_message_is_saved_with_uuid_and_201(): void
    {
        $response = $this->postJson('/api/contact', $this->form)->assertCreated()
            ->assertJsonPath('status', true)
            ->assertJsonPath('message', 'Merci ! Votre message a bien été envoyé. Notre équipe vous répondra rapidement.');

        $this->assertTrue(Str::isUuid($response->json('data.id')));
        $this->assertSame('partenariat', ContactMessage::sole()->sujet);
    }

    public function test_validation_errors_return_422_in_the_standard_envelope(): void
    {
        $this->postJson('/api/contact', ['nom' => '', 'email' => 'pas-un-email', 'sujet' => 'inconnu'])
            ->assertStatus(422)
            ->assertJsonPath('status', false)
            ->assertJsonPath('data', null)
            ->assertJsonPath('message', 'Les données envoyées sont invalides.')
            ->assertJsonPath('errors.email.0', 'Veuillez saisir une adresse e-mail valide.')
            ->assertJsonPath('errors.sujet.0', 'Veuillez choisir un sujet dans la liste.')
            ->assertJsonPath('errors.nom.0', 'Ce champ est obligatoire.');
    }

    public function test_notification_email_is_sent_when_configured(): void
    {
        Mail::fake();
        config(['intellino.notify_email' => 'equipe@example.com', 'intellino.frontend_url' => 'http://localhost:5174']);

        $this->postJson('/api/contact', $this->form)->assertCreated();

        Mail::assertSent(ContactMessageReceived::class, function (ContactMessageReceived $mail) {
            $this->assertStringContainsString('http://localhost:5174/admin/messages/', $mail->render());

            return $mail->hasTo('equipe@example.com') && $mail->hasReplyTo('awa@example.com');
        });
    }

    public function test_mail_failure_does_not_break_the_form(): void
    {
        config(['intellino.notify_email' => 'equipe@example.com']);
        Mail::shouldReceive('to')->andThrow(new RuntimeException('SMTP indisponible'));

        $this->postJson('/api/contact', $this->form)->assertCreated();
        $this->assertSame(1, ContactMessage::count());
    }

    public function test_contact_is_rate_limited(): void
    {
        foreach (range(1, 5) as $i) {
            $this->postJson('/api/contact', $this->form)->assertCreated();
        }

        $this->postJson('/api/contact', $this->form)->assertStatus(429)
            ->assertJsonPath('status', false)
            ->assertJsonPath('message', 'Trop de requêtes. Merci de réessayer dans une minute.');
    }
}
