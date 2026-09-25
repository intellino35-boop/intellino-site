<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AboutContactPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_about_and_contact_pages_render(): void
    {
        $this->get('/a-propos')->assertOk()->assertInertia(fn (Assert $page) => $page->component('About'));
        $this->get('/contact')->assertOk()->assertInertia(fn (Assert $page) => $page->component('Contact'));
    }

    public function test_contact_page_form_saves_message_and_returns_to_contact(): void
    {
        $this->from('/contact?sujet=partenariat')->post('/contact', [
            'nom' => 'Awa Koné', 'email' => 'awa@example.com', 'sujet' => 'partenariat', 'message' => 'Bonjour',
        ])->assertRedirect('/contact?sujet=partenariat')->assertSessionHas('success');

        $this->assertSame('partenariat', ContactMessage::sole()->sujet);
    }
}
