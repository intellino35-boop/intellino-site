<?php

namespace Tests\Feature\Api;

use App\Models\ContactMessage;
use App\Models\PersonalAccessToken;
use App\Models\Post;
use App\Models\Product;
use App\Models\Realisation;
use App\Models\Setting;
use App\Models\SiteBlock;
use App\Models\Software;
use App\Models\Solution;
use App\Models\User;
use Database\Seeders\BlocksSeeder;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\TestCase;

/** CORS, UUID, en-têtes de sécurité, sitemap et format des réponses. */
class PlatformApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_cors_preflight_accepts_only_the_frontend_origin(): void
    {
        $this->call('OPTIONS', '/api/home', server: [
            'HTTP_ORIGIN' => 'http://localhost:5174',
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'GET',
            'HTTP_ACCESS_CONTROL_REQUEST_HEADERS' => 'Authorization, Content-Type',
        ])->assertNoContent()
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5174')
            ->assertHeader('Access-Control-Max-Age', '3600');

        // Origine étrangère : jamais autorisée. (Avec une seule origine configurée, la bibliothèque CORS renvoie
        // toujours l'origine autorisée ; le navigateur bloque alors la requête car elle ne correspond pas.)
        $refused = $this->call('OPTIONS', '/api/home', server: [
            'HTTP_ORIGIN' => 'https://site-pirate.example',
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'GET',
        ]);
        $this->assertNotSame('https://site-pirate.example', $refused->headers->get('Access-Control-Allow-Origin'));
        $this->assertNotSame('*', $refused->headers->get('Access-Control-Allow-Origin'));

        // Avec plusieurs origines configurées, une origine inconnue ne reçoit aucun en-tête d'autorisation.
        config(['cors.allowed_origins' => ['http://localhost:5174', 'https://www.intellino.tech']]);
        $this->app->forgetInstance(\Illuminate\Http\Middleware\HandleCors::class);
        $this->app->forgetInstance(\Fruitcake\Cors\CorsService::class);
        $multi = $this->call('OPTIONS', '/api/home', server: [
            'HTTP_ORIGIN' => 'https://site-pirate.example',
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'GET',
        ]);
        $this->assertFalse($multi->headers->has('Access-Control-Allow-Origin'));
    }

    public function test_cors_header_on_real_requests(): void
    {
        $this->getJson('/api/settings', ['Origin' => 'http://localhost:5174'])->assertOk()
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5174');
    }

    public function test_every_application_table_uses_uuid_primary_keys(): void
    {
        $this->seed([ContentSeeder::class, BlocksSeeder::class]);
        $user = User::factory()->create();
        $user->createToken('admin');
        ContactMessage::create(['nom' => 'A', 'email' => 'a@example.com', 'sujet' => 'ia', 'message' => 'x']);
        Setting::create(['key' => 'phone', 'value' => '1']);

        foreach ([User::class, Solution::class, Product::class, Software::class, Realisation::class, Post::class,
            ContactMessage::class, SiteBlock::class, Setting::class, PersonalAccessToken::class] as $model) {
            $record = $model::first();
            $this->assertTrue(Str::isUuid($record->getKey()), "$model n'a pas d'UUID");
            $this->assertFalse($record->getIncrementing(), "$model est encore auto-incrémenté");
            $this->assertSame('string', $record->getKeyType());
        }

        $this->assertTrue(Str::isUuid(PersonalAccessToken::first()->tokenable_id));
        $this->assertSame('char', Schema::getColumnType('sessions', 'user_id'));
    }

    public function test_security_headers_on_api_responses(): void
    {
        $this->getJson('/api/home')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_sitemap_points_to_the_frontend_and_backend_is_not_indexed(): void
    {
        $this->seed(ContentSeeder::class);
        config(['intellino.frontend_url' => 'https://www.intellino.tech']);

        $this->get('/sitemap.xml')->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee('https://www.intellino.tech/produits/smart-energy', false)
            ->assertSee('https://www.intellino.tech/lab/vision', false);

        $this->get('/robots.txt')->assertOk()->assertSee('Disallow: /');
    }

    public function test_root_describes_the_api(): void
    {
        $this->getJson('/')->assertOk()->assertJsonPath('status', true)->assertJsonPath('data.api', url('/api'));
    }

    public function test_method_not_allowed_uses_the_envelope(): void
    {
        $this->deleteJson('/api/home')->assertStatus(405)->assertJsonPath('status', false);
    }
}
