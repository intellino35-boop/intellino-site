<?php

namespace Tests\Feature;

use Database\Seeders\ContentSeeder;
use Database\Seeders\DetailsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SoftwareLabPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->seed([ContentSeeder::class, DetailsSeeder::class]);
    }

    public function test_softwares_index_and_detail(): void
    {
        $this->get('/logiciels')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Softwares/Index')->has('softwares', 4));

        $this->get('/logiciels/scolaire')->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Softwares/Show')
                ->where('software.name', 'Gestion Scolaire')
                ->has('software.features', 6)
                ->has('software.audiences', 4)
                ->has('others', 3));

        $this->get('/logiciels/inexistant')->assertNotFound();
    }

    public function test_lab_pages(): void
    {
        $this->get('/lab')->assertRedirect('/lab/vision');

        foreach (['vision' => 'Lab/Vision', 'recherche' => 'Lab/Recherche', 'partenariats' => 'Lab/Partenariats'] as $slug => $component) {
            $this->get("/lab/{$slug}")->assertOk()->assertInertia(fn (Assert $page) => $page->component($component));
        }

        $this->get('/lab/projets')->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Lab/Projets')->has('products', 3));

        $this->get('/lab/inconnu')->assertNotFound();
    }
}
