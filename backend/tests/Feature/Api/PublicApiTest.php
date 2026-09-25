<?php

namespace Tests\Feature\Api;

use App\Models\Post;
use Database\Seeders\BlocksSeeder;
use Database\Seeders\ContentSeeder;
use Database\Seeders\DetailsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([ContentSeeder::class, DetailsSeeder::class, BlocksSeeder::class]);
    }

    public function test_home_returns_every_section_in_the_standard_envelope(): void
    {
        $this->getJson('/api/home')->assertOk()
            ->assertJsonStructure(['data' => ['solutions', 'products', 'softwares', 'realisations', 'posts'], 'message', 'status'])
            ->assertJsonPath('status', true)
            ->assertJsonCount(6, 'data.solutions')
            ->assertJsonCount(3, 'data.products')
            ->assertJsonCount(4, 'data.softwares')
            ->assertJsonCount(4, 'data.realisations')
            ->assertJsonCount(3, 'data.posts')
            ->assertJsonPath('data.posts.0.slug', 'tech-lab-vision')
            ->assertJsonPath('data.posts.0.date', '2025-03-01');
    }

    public function test_catalog_lists_and_details(): void
    {
        foreach (['solutions' => 6, 'products' => 3, 'softwares' => 4, 'realisations' => 4] as $endpoint => $count) {
            $response = $this->getJson("/api/{$endpoint}")->assertOk()->assertJsonCount($count, 'data');
            $this->assertTrue(Str::isUuid($response->json('data.0.id')), "$endpoint : id UUID attendu");
        }

        $this->getJson('/api/solutions/securite')->assertOk()
            ->assertJsonPath('data.item.title', 'Sécurité & Cybersécurité')
            ->assertJsonCount(4, 'data.item.benefits')
            ->assertJsonCount(5, 'data.others');

        $this->getJson('/api/products/smart-energy')->assertOk()
            ->assertJsonPath('data.item.name', 'IntellIno Smart Energy')
            ->assertJsonCount(4, 'data.item.use_cases')
            ->assertJsonCount(2, 'data.others');

        $this->getJson('/api/softwares/scolaire')->assertOk()
            ->assertJsonCount(6, 'data.item.features')
            ->assertJsonCount(3, 'data.others');

        $this->getJson('/api/realisations/systeme-de-presence-biometrique')->assertOk()
            ->assertJsonPath('data.item.client', 'Institution publique')
            ->assertJsonPath('data.item.year', 2024)
            ->assertJsonCount(3, 'data.others');
    }

    public function test_unknown_slug_returns_404_in_the_standard_envelope(): void
    {
        $this->getJson('/api/products/inexistant')->assertNotFound()
            ->assertExactJson(['data' => null, 'message' => 'Ressource introuvable.', 'status' => false]);

        $this->getJson('/api/route-inconnue')->assertNotFound()->assertJsonPath('status', false);
    }

    public function test_posts_pagination_filter_and_detail(): void
    {
        $this->getJson('/api/posts')->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.total', 3)
            ->assertJsonCount(3, 'meta.categories')
            ->assertJsonMissingPath('data.0.body');

        $this->getJson('/api/posts?categorie=IoT')->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('meta.category', 'IoT');

        $this->getJson('/api/posts/cybersecurite-afrique')->assertOk()
            ->assertJsonPath('data.item.reading_time', 1)
            ->assertJsonCount(2, 'data.related');
        $this->assertNotEmpty($this->getJson('/api/posts/cybersecurite-afrique')->json('data.item.body'));

        // Pagination : 3 + 8 articles = 11, soit 2 pages de 9.
        foreach (range(1, 8) as $i) {
            Post::create(['slug' => "article-$i", 'category' => 'Test', 'title' => "Article $i", 'excerpt' => 'Résumé', 'published_at' => '2024-01-0'.min($i, 9)]);
        }
        $this->getJson('/api/posts?page=2')->assertOk()->assertJsonCount(2, 'data')->assertJsonPath('meta.last_page', 2);
    }

    public function test_lab_blocks_and_public_settings(): void
    {
        $this->getJson('/api/lab/projects')->assertOk()->assertJsonCount(3, 'data');

        $this->getJson('/api/blocks')->assertOk()
            ->assertJsonCount(15, 'data')
            ->assertJsonCount(4, 'data.chiffres')
            ->assertJsonPath('data.chiffres.0.title', '8+')
            ->assertJsonPath('data.faq.0.link', '/solutions');

        $this->getJson('/api/settings')->assertOk()
            ->assertJsonStructure(['data' => ['contact' => ['email', 'phone', 'whatsapp', 'location', 'logo', 'heroImage'], 'legal' => ['company', 'privacy_email'], 'tokenLifetimeHours']])
            ->assertJsonPath('data.contact.logo', '/images/logo.png');
    }
}
