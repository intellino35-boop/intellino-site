<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\Post;
use App\Models\Solution;
use App\Models\User;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->seed(ContentSeeder::class);
    }

    private function admin(): User
    {
        return User::factory()->create(['password' => 'secret-password']);
    }

    private function message(array $attrs = []): ContactMessage
    {
        return ContactMessage::create([
            'nom' => 'Awa Koné', 'email' => 'awa@example.com', 'sujet' => 'ia', 'message' => 'Bonjour', ...$attrs,
        ]);
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->get('/admin/messages')->assertRedirect('/admin/login');
        $this->get('/admin/login')->assertOk()->assertInertia(fn (Assert $page) => $page->component('Admin/Login'));
    }

    public function test_login_with_valid_and_invalid_credentials(): void
    {
        $user = $this->admin();

        $this->post('/admin/login', ['email' => $user->email, 'password' => 'mauvais'])
            ->assertSessionHasErrors(['email' => 'Identifiants incorrects.']);
        $this->assertGuest();

        $this->post('/admin/login', ['email' => $user->email, 'password' => 'secret-password'])
            ->assertRedirect('/admin');
        $this->assertAuthenticatedAs($user);

        $this->post('/admin/logout')->assertRedirect('/admin/login');
        $this->assertGuest();
    }

    public function test_dashboard_shows_counts_and_unread(): void
    {
        $this->message();
        $this->message(['read_at' => now()]);

        $this->actingAs($this->admin())->get('/admin')->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Dashboard')
                ->where('messagesTotal', 2)
                ->where('admin.unread', 1)
                ->has('counts', 5)
                ->has('latestMessages', 2));
    }

    public function test_messages_list_filter_show_toggle_delete(): void
    {
        $unread = $this->message();
        $this->message(['nom' => 'Paul', 'email' => 'paul@example.com', 'read_at' => now()]);
        $admin = $this->admin();

        $this->actingAs($admin)->get('/admin/messages?filtre=non-lus')
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Messages/Index')->has('messages.data', 1));
        $this->actingAs($admin)->get('/admin/messages?q=paul')
            ->assertInertia(fn (Assert $page) => $page->has('messages.data', 1)->where('messages.data.0.nom', 'Paul'));

        // Ouvrir un message le marque comme lu.
        $this->actingAs($admin)->get("/admin/messages/{$unread->id}")
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Messages/Show'));
        $this->assertNotNull($unread->fresh()->read_at);

        $this->actingAs($admin)->put("/admin/messages/{$unread->id}");
        $this->assertNull($unread->fresh()->read_at);

        $this->actingAs($admin)->delete("/admin/messages/{$unread->id}")->assertRedirect('/admin/messages');
        $this->assertModelMissing($unread);
    }

    public function test_content_crud(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)->get('/admin/contenu/solutions')
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Content/Index')->has('items', 6));
        $this->actingAs($admin)->get('/admin/contenu/solutions/nouveau')
            ->assertInertia(fn (Assert $page) => $page->component('Admin/Content/Form')->where('item', null));

        $this->actingAs($admin)->post('/admin/contenu/solutions', [
            'title' => 'Formation', 'slug' => 'formation', 'icon' => '🎓', 'color' => 'green',
            'items' => ['Ateliers', 'Certifications'], 'sort_order' => 7,
        ])->assertRedirect('/admin/contenu/solutions');
        $solution = Solution::where('slug', 'formation')->firstOrFail();
        $this->assertSame(['Ateliers', 'Certifications'], $solution->items);

        $this->actingAs($admin)->put("/admin/contenu/solutions/{$solution->id}", [
            'title' => 'Formation pro', 'slug' => 'formation', 'icon' => '🎓', 'color' => 'blue', 'items' => ['Ateliers'],
        ])->assertSessionHasNoErrors();
        $this->assertSame('Formation pro', $solution->fresh()->title);

        // Slug déjà utilisé et couleur hors liste : refusés.
        $this->actingAs($admin)->post('/admin/contenu/solutions', [
            'title' => 'X', 'slug' => 'cloud', 'icon' => 'x', 'color' => 'pink', 'items' => ['a'],
        ])->assertSessionHasErrors(['slug', 'color']);

        $this->actingAs($admin)->delete("/admin/contenu/solutions/{$solution->id}");
        $this->assertModelMissing($solution);

        // La page d'accueil reflète les articles modifiés.
        Post::where('slug', 'iot-energie')->update(['title' => 'Titre modifié']);
        $this->get('/')->assertInertia(fn (Assert $page) => $page->where('posts.2.title', 'Titre modifié'));
    }

    public function test_unknown_content_type_is_404(): void
    {
        $this->actingAs($this->admin())->get('/admin/contenu/inconnu')->assertNotFound();
    }
}
