<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\SiteBlock;
use App\Models\User;
use App\Support\SiteSettings;
use Database\Seeders\BlocksSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminPersonalizationTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->seed(BlocksSeeder::class);
        $this->admin = User::factory()->create();
    }

    protected function tearDown(): void
    {
        // Supprime les images envoyées pendant les tests (le .gitignore du dossier est conservé).
        foreach (File::glob(public_path('images/uploads/*-2*.*')) as $file) {
            File::delete($file);
        }
        parent::tearDown();
    }

    public function test_blocks_overview_lists_every_collection_with_counts(): void
    {
        $this->actingAs($this->admin)->get('/admin/blocs')->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Blocks')
                ->has('collections', 15)
                ->where('collections.0.type', 'chiffres')
                ->where('collections.0.count', 4));
    }

    public function test_block_crud_is_scoped_to_its_collection(): void
    {
        $this->actingAs($this->admin)->post('/admin/contenu/faq', [
            'title' => 'Intervenez-vous à distance ?', 'text' => 'Oui.', 'link' => '/contact', 'sort_order' => 9,
        ])->assertRedirect('/admin/contenu/faq');

        $created = SiteBlock::where('title', 'Intervenez-vous à distance ?')->firstOrFail();
        $this->assertSame('faq', $created->collection);

        $this->actingAs($this->admin)->get('/admin/contenu/faq')
            ->assertInertia(fn (Assert $page) => $page->has('items', 6)->where('resource.group', 'blocks'));

        // Un élément d'une autre collection n'est pas accessible via ce type.
        $valeur = SiteBlock::where('collection', 'valeurs')->first();
        $this->actingAs($this->admin)->get("/admin/contenu/faq/{$valeur->id}")->assertNotFound();

        $this->actingAs($this->admin)->delete("/admin/contenu/faq/{$created->id}");
        $this->assertModelMissing($created);
    }

    public function test_public_pages_receive_blocks_and_cache_is_refreshed_after_edit(): void
    {
        $this->get('/a-propos')->assertInertia(fn (Assert $page) => $page
            ->has('blocks.chiffres', 4)
            ->where('blocks.valeurs.0.title', 'Innovation'));

        $valeur = SiteBlock::where('collection', 'valeurs')->orderBy('sort_order')->first();
        $this->actingAs($this->admin)->put("/admin/contenu/valeurs/{$valeur->id}", [
            'icon' => '🚀', 'title' => 'Audace', 'text' => 'Oser innover.', 'sort_order' => 0,
        ])->assertSessionHasNoErrors();

        $this->get('/a-propos')->assertInertia(fn (Assert $page) => $page->where('blocks.valeurs.0.title', 'Audace'));
    }

    public function test_blocks_and_settings_survive_a_real_persistent_cache(): void
    {
        // Le cache « array » des tests ne sérialise rien : on passe par le cache fichier, comme en production.
        config(['cache.default' => 'file']);
        cache()->forget(SiteBlock::CACHE_KEY);
        cache()->forget(SiteSettings::CACHE_KEY);
        Setting::create(['key' => 'phone', 'value' => '+229 01 02 03 04 05']);

        SiteBlock::forFrontend();          // remplit le cache
        $blocks = SiteBlock::forFrontend(); // relit depuis le cache
        SiteSettings::stored();
        $settings = SiteSettings::stored();

        $this->assertIsArray($blocks['faq']);
        $this->assertIsArray($blocks['faq'][0]);
        $this->assertSame('8+', $blocks['chiffres'][0]['title']);
        $this->assertSame('+229 01 02 03 04 05', $settings['phone']);

        cache()->forget(SiteBlock::CACHE_KEY);
        cache()->forget(SiteSettings::CACHE_KEY);
    }

    public function test_admin_pages_do_not_receive_blocks(): void
    {
        $this->actingAs($this->admin)->get('/admin')->assertInertia(fn (Assert $page) => $page
            ->where('blocks', null)
            ->has('admin.resources', 5)
            ->has('admin.blockTypes', 15));
    }

    public function test_blocks_seeder_keeps_admin_edits(): void
    {
        SiteBlock::where('collection', 'faq')->delete();
        SiteBlock::create(['collection' => 'faq', 'title' => 'Ma question', 'text' => 'Ma réponse']);

        $this->seed(BlocksSeeder::class);

        $this->assertSame(['Ma question'], SiteBlock::where('collection', 'faq')->pluck('title')->all());
    }

    public function test_settings_override_env_and_empty_value_falls_back(): void
    {
        $this->actingAs($this->admin)->get('/admin/parametres')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Settings')->has('fields', count(SiteSettings::FIELDS)));

        $this->actingAs($this->admin)->post('/admin/parametres', [
            'email' => 'bonjour@intellino.africa', 'phone' => '+229 01 00 00 00 00', 'legal_country' => 'Bénin', 'legal_retention_months' => 12,
        ])->assertSessionHasNoErrors()->assertSessionHas('success');

        $this->assertSame('+229 01 00 00 00 00', Setting::where('key', 'phone')->value('value'));

        SiteSettings::apply();
        $this->assertSame('+229 01 00 00 00 00', config('intellino.phone'));
        $this->assertSame('Bénin', config('intellino.legal.country'));
        // Sans e-mail dédié, les pages légales reprennent le nouvel e-mail de contact.
        $this->assertSame('bonjour@intellino.africa', config('intellino.legal.privacy_email'));

        // Champ vidé : le réglage est supprimé et le .env reprend la main.
        $this->actingAs($this->admin)->post('/admin/parametres', ['phone' => ''])->assertSessionHasNoErrors();
        $this->assertFalse(Setting::where('key', 'phone')->exists());
    }

    public function test_settings_validation(): void
    {
        $this->actingAs($this->admin)->post('/admin/parametres', ['email' => 'pas-un-email', 'legal_retention_months' => 500])
            ->assertSessionHasErrors(['email', 'legal_retention_months']);
    }

    public function test_logo_upload_and_reset(): void
    {
        $this->actingAs($this->admin)->post('/admin/parametres', [
            'logo' => UploadedFile::fake()->image('mon-logo.png', 300, 300),
        ])->assertSessionHasNoErrors();

        $path = Setting::where('key', 'logo')->value('value');
        $this->assertStringStartsWith('/images/uploads/logo-', $path);
        $this->assertFileExists(public_path(ltrim($path, '/')));

        $this->actingAs($this->admin)->post('/admin/parametres', ['reset_images' => ['logo']])->assertSessionHasNoErrors();
        $this->assertFalse(Setting::where('key', 'logo')->exists());
    }

    public function test_non_image_upload_is_rejected(): void
    {
        $this->actingAs($this->admin)->post('/admin/parametres', [
            'hero_image' => UploadedFile::fake()->create('virus.php', 10, 'application/x-php'),
        ])->assertSessionHasErrors('hero_image');
    }

    public function test_guests_cannot_access_personalization(): void
    {
        $this->get('/admin/blocs')->assertRedirect('/admin/login');
        $this->get('/admin/parametres')->assertRedirect('/admin/login');
        $this->post('/admin/parametres', ['email' => 'x@y.z'])->assertRedirect('/admin/login');
    }
}
