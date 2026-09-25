<?php

namespace Tests\Feature;

use Database\Seeders\ContentSeeder;
use Database\Seeders\DetailsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SolutionProductPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->seed([ContentSeeder::class, DetailsSeeder::class]);
    }

    public function test_solutions_index_and_detail(): void
    {
        $this->get('/solutions')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Solutions/Index')->has('solutions', 6));

        $this->get('/solutions/securite')->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Solutions/Show')
                ->where('solution.title', 'Sécurité & Cybersécurité')
                ->has('solution.benefits', 4)
                ->has('others', 5));
    }

    public function test_menu_solution_without_record_shows_coming_soon(): void
    {
        $this->get('/solutions/reseaux')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('ComingSoon'));
    }

    public function test_products_index_and_detail(): void
    {
        $this->get('/produits')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Products/Index')->has('products', 3)->has('softwares', 4));

        $this->get('/produits/smart-energy')->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Products/Show')
                ->where('product.name', 'IntellIno Smart Energy')
                ->has('product.use_cases', 4)
                ->has('others', 2));

        $this->get('/produits/inexistant')->assertNotFound();
    }
}
