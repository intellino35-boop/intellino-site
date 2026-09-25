<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Realisation;
use App\Models\User;
use Database\Seeders\ContentSeeder;
use Database\Seeders\DetailsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RealisationBlogPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->seed([ContentSeeder::class, DetailsSeeder::class]);
    }

    public function test_realisations_index_and_detail(): void
    {
        $this->get('/realisations')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Realisations/Index')->has('realisations', 4));

        $this->get('/realisations/systeme-de-presence-biometrique')->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Realisations/Show')
                ->where('realisation.client', 'Institution publique')
                ->where('realisation.year', 2024)
                ->has('others', 3));

        $this->get('/realisations/inexistant')->assertNotFound();
    }

    public function test_blog_index_filter_and_article(): void
    {
        $this->get('/blog')->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Blog/Index')
                ->has('posts.data', 3)
                ->has('categories', 3)
                ->where('posts.data.0.slug', 'tech-lab-vision'));

        $this->get('/blog?categorie=IoT')
            ->assertInertia(fn (Assert $page) => $page->has('posts.data', 1)->where('category', 'IoT'));

        $this->get('/blog/cybersecurite-afrique')->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Blog/Show')
                ->where('post.title', 'Les enjeux de la cybersécurité pour les entreprises africaines')
                ->where('post.reading_time', 1)
                ->has('related', 2));

        $this->get('/blog/inexistant')->assertNotFound();
    }

    public function test_home_cards_link_to_detail_pages(): void
    {
        $this->get('/')->assertInertia(fn (Assert $page) => $page
            ->where('realisations.0.slug', 'systeme-de-videosurveillance')
            ->where('posts.0.date', '2025-03-01'));
    }

    public function test_admin_can_edit_realisation_details_with_empty_year(): void
    {
        $realisation = Realisation::where('slug', 'systeme-de-videosurveillance')->firstOrFail();

        $this->actingAs(User::factory()->create())->put("/admin/contenu/realisations/{$realisation->id}", [
            'title' => $realisation->title, 'slug' => 'videosurveillance-industrie', 'icon' => '📹', 'category' => 'Sécurité',
            'client' => 'Usine', 'year' => null, 'description' => 'Desc', 'details' => "Paragraphe 1\n\n## Titre",
            'color' => 'red', 'tags' => ['HD'], 'sort_order' => null,
        ])->assertSessionHasNoErrors();

        $realisation->refresh();
        $this->assertSame('videosurveillance-industrie', $realisation->slug);
        $this->assertNull($realisation->year);
        $this->assertSame(0, $realisation->sort_order);
        $this->get('/realisations/videosurveillance-industrie')->assertOk();
    }

    public function test_seeder_does_not_overwrite_admin_edits(): void
    {
        Post::where('slug', 'iot-energie')->update(['body' => 'Texte personnalisé']);
        $this->seed(DetailsSeeder::class);
        $this->assertSame('Texte personnalisé', Post::where('slug', 'iot-energie')->value('body'));
    }
}
