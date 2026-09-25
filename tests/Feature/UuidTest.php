<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\Post;
use App\Models\Product;
use App\Models\Realisation;
use App\Models\Software;
use App\Models\Solution;
use App\Models\User;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class UuidTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->seed(ContentSeeder::class);
    }

    public function test_every_model_uses_a_uuid_primary_key(): void
    {
        ContactMessage::create(['nom' => 'Awa', 'email' => 'awa@example.com', 'sujet' => 'ia', 'message' => 'Bonjour']);
        User::factory()->create();

        foreach ([User::class, Solution::class, Product::class, Software::class, Realisation::class, Post::class, ContactMessage::class] as $model) {
            $record = $model::first();
            $this->assertTrue(Str::isUuid($record->getKey()), "$model n'a pas d'UUID");
            $this->assertFalse($record->getIncrementing(), "$model est encore auto-incrémenté");
        }
    }

    public function test_session_is_linked_to_the_uuid_of_the_admin(): void
    {
        config(['session.driver' => 'database']);
        $user = User::factory()->create(['password' => 'secret-password']);

        $this->post('/admin/login', ['email' => $user->email, 'password' => 'secret-password'])->assertRedirect('/admin');

        $this->assertSame($user->id, DB::table('sessions')->value('user_id'));
    }

    public function test_admin_urls_use_uuids_and_reject_numeric_ids(): void
    {
        $admin = User::factory()->create();
        $solution = Solution::first();
        $message = ContactMessage::create(['nom' => 'Awa', 'email' => 'awa@example.com', 'sujet' => 'ia', 'message' => 'Bonjour']);

        $this->actingAs($admin)->get("/admin/contenu/solutions/{$solution->id}")->assertOk();
        $this->actingAs($admin)->get("/admin/messages/{$message->id}")->assertOk();

        $this->actingAs($admin)->get('/admin/contenu/solutions/1')->assertNotFound();
        $this->actingAs($admin)->get('/admin/messages/1')->assertNotFound();
    }
}
