<?php

namespace Tests\Feature;

use App\Mail\ContactMessageReceived;
use App\Models\ContactMessage;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use RuntimeException;
use Tests\TestCase;

class ProductionReadinessTest extends TestCase
{
    use RefreshDatabase;

    private array $form = ['nom' => 'Awa', 'email' => 'awa@example.com', 'sujet' => 'ia', 'message' => 'Bonjour'];

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_contact_message_is_emailed_when_notify_address_is_set(): void
    {
        Mail::fake();
        config(['intellino.notify_email' => 'equipe@example.com']);

        $this->post('/contact', $this->form)->assertSessionHas('success');

        Mail::assertSent(ContactMessageReceived::class, fn ($mail) => $mail->hasTo('equipe@example.com')
            && $mail->hasReplyTo('awa@example.com'));
    }

    public function test_no_email_without_notify_address(): void
    {
        Mail::fake();
        config(['intellino.notify_email' => null]);

        $this->post('/contact', $this->form)->assertSessionHas('success');

        Mail::assertNothingSent();
    }

    public function test_mail_failure_does_not_break_the_form(): void
    {
        config(['intellino.notify_email' => 'equipe@example.com']);
        Mail::shouldReceive('to')->andThrow(new RuntimeException('SMTP indisponible'));

        $this->post('/contact', $this->form)->assertSessionHas('success');
        $this->assertSame(1, ContactMessage::count());
    }

    public function test_unknown_record_renders_styled_404(): void
    {
        $this->get('/produits/inexistant')->assertNotFound()
            ->assertInertia(fn (Assert $page) => $page->component('ComingSoon'));
    }

    public function test_security_headers(): void
    {
        $this->get('/contact')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_sitemap_lists_static_and_database_pages(): void
    {
        $this->seed(ContentSeeder::class);

        $this->get('/sitemap.xml')->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee(url('/lab/vision'), false)
            ->assertSee(url('/produits/smart-energy'), false)
            ->assertSee(url('/blog/iot-energie'), false);
    }

    public function test_logo_and_hero_image_are_local_files(): void
    {
        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('contact.logo', '/images/logo.png')
            ->where('contact.heroImage', '/images/hero.jpg'));

        $this->assertFileExists(public_path('images/logo.png'));
        $this->assertFileExists(public_path('images/hero.jpg'));
    }

    public function test_empty_env_lines_fall_back_to_defaults(): void
    {
        $keys = ['INTELLINO_LOGO', 'INTELLINO_HERO_IMAGE', 'LEGAL_PRIVACY_EMAIL', 'LEGAL_COMPANY'];
        foreach ($keys as $key) {
            putenv("{$key}=");
            $_ENV[$key] = $_SERVER[$key] = '';
        }

        try {
            $config = require config_path('intellino.php');

            $this->assertSame('/images/logo.png', $config['logo']);
            $this->assertSame('/images/hero.jpg', $config['hero_image']);
            $this->assertSame('IntellIno', $config['legal']['company']);
            $this->assertNotSame('', $config['legal']['privacy_email']);
        } finally {
            foreach ($keys as $key) {
                putenv($key);
                unset($_ENV[$key], $_SERVER[$key]);
            }
        }
    }

    public function test_robots_blocks_everything_outside_production(): void
    {
        $this->get('/robots.txt')->assertOk()->assertSee('Disallow: /');
    }

    public function test_robots_in_production_allows_site_and_hides_admin(): void
    {
        $this->app['env'] = 'production';

        $this->get('/robots.txt')->assertOk()
            ->assertSee('Disallow: /admin')
            ->assertSee('Sitemap: ', false);
    }
}
