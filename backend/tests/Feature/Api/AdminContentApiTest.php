<?php

namespace Tests\Feature\Api;

use App\Models\ContactMessage;
use App\Models\Realisation;
use App\Models\Setting;
use App\Models\SiteBlock;
use App\Models\Solution;
use App\Models\User;
use App\Support\SiteSettings;
use Database\Seeders\BlocksSeeder;
use Database\Seeders\ContentSeeder;
use Database\Seeders\DetailsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminContentApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([ContentSeeder::class, DetailsSeeder::class, BlocksSeeder::class]);
        Sanctum::actingAs(User::factory()->create());
    }

    protected function tearDown(): void
    {
        foreach (File::glob(public_path('images/uploads/*-2*.*')) as $file) {
            File::delete($file);
        }
        parent::tearDown();
    }

    public function test_content_crud(): void
    {
        $this->getJson('/api/admin/content/solutions')->assertOk()
            ->assertJsonCount(6, 'data')
            ->assertJsonPath('meta.resource.url', '/solutions/');

        $id = $this->postJson('/api/admin/content/solutions', [
            'title' => 'Formation', 'slug' => 'formation', 'icon' => '🎓', 'color' => 'green', 'items' => ['Ateliers', 'Certifications'],
        ])->assertCreated()->assertJsonPath('data.sort_order', 0)->json('data.id');

        $this->assertSame(['Ateliers', 'Certifications'], Solution::findOrFail($id)->items);
        $this->getJson("/api/admin/content/solutions/{$id}")->assertOk()->assertJsonPath('data.slug', 'formation');

        $this->putJson("/api/admin/content/solutions/{$id}", [
            'title' => 'Formation pro', 'slug' => 'formation', 'icon' => '🎓', 'color' => 'blue', 'items' => ['Ateliers'], 'sort_order' => 7,
        ])->assertOk()->assertJsonPath('data.title', 'Formation pro');

        $this->postJson('/api/admin/content/solutions', ['title' => 'X', 'slug' => 'cloud', 'icon' => 'x', 'color' => 'pink', 'items' => ['a']])
            ->assertStatus(422)->assertJsonValidationErrors(['slug', 'color']);

        $this->deleteJson("/api/admin/content/solutions/{$id}")->assertOk();
        $this->assertNull(Solution::find($id));

        // Les modifications sont visibles sur l'API publique.
        Solution::where('slug', 'ia')->update(['title' => 'IA générative']);
        $this->getJson('/api/solutions/ia')->assertJsonPath('data.item.title', 'IA générative');
    }

    public function test_optional_number_stays_empty(): void
    {
        $realisation = Realisation::where('slug', 'systeme-de-videosurveillance')->firstOrFail();

        $this->putJson("/api/admin/content/realisations/{$realisation->id}", [
            'title' => $realisation->title, 'slug' => 'videosurveillance-industrie', 'icon' => '📹', 'category' => 'Sécurité',
            'year' => null, 'description' => 'Desc', 'color' => 'red', 'tags' => ['HD'], 'sort_order' => null,
        ])->assertOk();

        $realisation->refresh();
        $this->assertSame([null, 0], [$realisation->year, $realisation->sort_order]);
    }

    public function test_blocks_are_scoped_and_cache_is_refreshed(): void
    {
        $this->getJson('/api/admin/blocks')->assertOk()->assertJsonCount(15, 'data')
            ->assertJsonPath('data.0.type', 'chiffres')->assertJsonPath('data.0.count', 4);

        $id = $this->postJson('/api/admin/content/faq', ['title' => 'Intervenez-vous à distance ?', 'text' => 'Oui.', 'link' => '/contact'])
            ->assertCreated()->json('data.id');
        $this->assertSame('faq', SiteBlock::findOrFail($id)->collection);

        $valeur = SiteBlock::where('collection', 'valeurs')->first();
        $this->getJson("/api/admin/content/faq/{$valeur->id}")->assertNotFound();

        $this->getJson('/api/blocks')->assertJsonPath('data.valeurs.0.title', 'Innovation');
        $this->putJson("/api/admin/content/valeurs/{$valeur->id}", ['icon' => '🚀', 'title' => 'Audace', 'text' => 'Oser.', 'sort_order' => 0])->assertOk();
        $this->getJson('/api/blocks')->assertJsonPath('data.valeurs.0.title', 'Audace');
    }

    public function test_blocks_and_settings_survive_a_real_persistent_cache(): void
    {
        config(['cache.default' => 'file']);
        cache()->forget(SiteBlock::CACHE_KEY);
        cache()->forget(SiteSettings::CACHE_KEY);
        Setting::create(['key' => 'phone', 'value' => '+229 01 02 03 04 05']);

        SiteBlock::forFrontend();
        $blocks = SiteBlock::forFrontend();
        SiteSettings::stored();
        $settings = SiteSettings::stored();

        $this->assertIsArray($blocks['faq'][0]);
        $this->assertSame('+229 01 02 03 04 05', $settings['phone']);

        cache()->forget(SiteBlock::CACHE_KEY);
        cache()->forget(SiteSettings::CACHE_KEY);
    }

    public function test_messages_list_filter_show_toggle_delete(): void
    {
        $unread = ContactMessage::create(['nom' => 'Awa', 'email' => 'awa@example.com', 'sujet' => 'ia', 'message' => 'Bonjour']);
        ContactMessage::create(['nom' => 'Paul', 'email' => 'paul@example.com', 'sujet' => 'iot', 'message' => 'Salut', 'read_at' => now()]);

        $this->getJson('/api/admin/messages?filtre=non-lus')->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('meta.total', 1);
        $this->getJson('/api/admin/messages?q=paul')->assertOk()->assertJsonPath('data.0.nom', 'Paul');

        $this->getJson("/api/admin/messages/{$unread->id}")->assertOk()->assertJsonPath('data.id', $unread->id);
        $this->assertNotNull($unread->fresh()->read_at);

        $this->patchJson("/api/admin/messages/{$unread->id}/toggle-read")->assertOk()->assertJsonPath('data.read_at', null);
        $this->getJson('/api/auth/me')->assertJsonPath('data.admin.unread', 1);

        $this->deleteJson("/api/admin/messages/{$unread->id}")->assertOk();
        $this->assertModelMissing($unread);
    }

    public function test_settings_override_env_fallback_and_public_endpoint(): void
    {
        $this->getJson('/api/admin/settings')->assertOk()->assertJsonCount(count(SiteSettings::FIELDS), 'data.fields');

        $this->postJson('/api/admin/settings', ['email' => 'bonjour@intellino.africa', 'phone' => '+229 01 00 00 00 00', 'legal_country' => 'Bénin'])
            ->assertOk()->assertJsonPath('message', 'Paramètres enregistrés.');
        $this->assertSame('+229 01 00 00 00 00', Setting::where('key', 'phone')->value('value'));

        SiteSettings::apply();
        $this->assertSame('bonjour@intellino.africa', config('intellino.legal.privacy_email'));
        $this->getJson('/api/settings')->assertJsonPath('data.contact.phone', '+229 01 00 00 00 00')
            ->assertJsonPath('data.legal.country', 'Bénin');

        // Champ envoyé vide : retour au .env ; champ absent : inchangé.
        $this->postJson('/api/admin/settings', ['phone' => ''])->assertOk();
        $this->assertFalse(Setting::where('key', 'phone')->exists());
        $this->assertTrue(Setting::where('key', 'legal_country')->exists());

        $this->postJson('/api/admin/settings', ['email' => 'pas-un-email', 'legal_retention_months' => 500])
            ->assertStatus(422)->assertJsonValidationErrors(['email', 'legal_retention_months']);
    }

    public function test_logo_upload_returns_absolute_url_and_can_be_reset(): void
    {
        $this->post('/api/admin/settings', ['logo' => UploadedFile::fake()->image('logo.png', 300, 300)], ['Accept' => 'application/json'])->assertOk();

        $path = Setting::where('key', 'logo')->value('value');
        $this->assertStringStartsWith('/images/uploads/logo-', $path);
        $this->assertFileExists(public_path(ltrim($path, '/')));

        SiteSettings::apply();
        $this->getJson('/api/settings')->assertJsonPath('data.contact.logo', url($path));

        $this->postJson('/api/admin/settings', ['reset_images' => ['logo']])->assertOk();
        $this->assertFalse(Setting::where('key', 'logo')->exists());

        $this->post('/api/admin/settings', ['hero_image' => UploadedFile::fake()->create('virus.php', 10, 'application/x-php')], ['Accept' => 'application/json'])
            ->assertStatus(422)->assertJsonValidationErrors('hero_image');
    }
}
