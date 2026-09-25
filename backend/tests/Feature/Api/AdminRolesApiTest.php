<?php

namespace Tests\Feature\Api;

use App\Models\ContactMessage;
use App\Models\SiteBlock;
use App\Models\Solution;
use App\Models\User;
use Database\Seeders\BlocksSeeder;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class AdminRolesApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([ContentSeeder::class, BlocksSeeder::class]);
    }

    /** [url, administrateur, éditeur, chargé de clientèle] */
    public static function accessMatrix(): array
    {
        return [
            'messages' => ['/api/admin/messages', true, false, true],
            'contenu' => ['/api/admin/content/solutions', true, true, false],
            'schéma' => ['/api/admin/content/products/schema', true, true, false],
            'blocs' => ['/api/admin/blocks', true, true, false],
            'un bloc' => ['/api/admin/content/faq', true, true, false],
            'paramètres' => ['/api/admin/settings', true, false, false],
            'utilisateurs' => ['/api/admin/users', true, false, false],
            'rôles' => ['/api/admin/roles', true, false, false],
            'mon compte' => ['/api/admin/profile', true, true, true],
            'tableau de bord' => ['/api/admin/dashboard', true, true, true],
        ];
    }

    #[DataProvider('accessMatrix')]
    public function test_role_permissions(string $url, bool $admin, bool $editor, bool $support): void
    {
        foreach (['admin' => $admin, 'editeur' => $editor, 'support' => $support] as $role => $allowed) {
            Sanctum::actingAs(User::factory()->create(['role' => $role]));
            $response = $this->getJson($url);

            $allowed
                ? $response->assertOk()->assertJsonPath('status', true)
                : $response->assertForbidden()->assertExactJson([
                    'data' => null, 'message' => 'Vous n\'avez pas l\'autorisation d\'effectuer cette action.', 'status' => false,
                ]);
        }
    }

    public function test_forbidden_writes_are_blocked_server_side(): void
    {
        $message = ContactMessage::create(['nom' => 'A', 'email' => 'a@example.com', 'sujet' => 'ia', 'message' => 'x']);
        $solution = Solution::first();
        $block = SiteBlock::where('collection', 'faq')->first();

        Sanctum::actingAs(User::factory()->editor()->create());
        $this->deleteJson("/api/admin/messages/{$message->id}")->assertForbidden();
        $this->postJson('/api/admin/settings', ['email' => 'pirate@example.com'])->assertForbidden();
        $this->postJson('/api/admin/users', ['name' => 'X', 'email' => 'x@example.com', 'role' => 'admin', 'password' => 'motdepasse1', 'password_confirmation' => 'motdepasse1'])
            ->assertForbidden();

        Sanctum::actingAs(User::factory()->support()->create());
        $this->deleteJson("/api/admin/content/solutions/{$solution->id}")->assertForbidden();
        $this->deleteJson("/api/admin/content/faq/{$block->id}")->assertForbidden();

        $this->assertModelExists($message);
        $this->assertModelExists($solution);
        $this->assertModelExists($block);
        $this->assertFalse(User::where('email', 'x@example.com')->exists());
    }

    public function test_dashboard_only_exposes_allowed_data(): void
    {
        Sanctum::actingAs(User::factory()->support()->create());
        $this->getJson('/api/admin/dashboard')->assertOk()
            ->assertJsonPath('data.counts', [])
            ->assertJsonPath('data.messagesTotal', 0);

        Sanctum::actingAs(User::factory()->editor()->create());
        $this->getJson('/api/admin/dashboard')->assertOk()
            ->assertJsonCount(5, 'data.counts')
            ->assertJsonPath('data.latestMessages', null);
    }

    public function test_admin_creates_updates_and_deletes_a_user(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $id = $this->postJson('/api/admin/users', [
            'name' => 'Koffi', 'email' => 'koffi@example.com', 'role' => 'editeur', 'active' => true,
            'password' => 'motdepasse-solide', 'password_confirmation' => 'motdepasse-solide',
        ])->assertCreated()->assertJsonPath('data.role', 'editeur')->json('data.id');

        $koffi = User::findOrFail($id);
        $this->assertTrue(Hash::check('motdepasse-solide', $koffi->password));
        $this->getJson("/api/admin/users/{$id}")->assertOk()->assertJsonPath('meta.isSelf', false);

        // Mot de passe vide = inchangé ; désactivation = jetons révoqués.
        $koffi->createToken('admin');
        $this->putJson("/api/admin/users/{$id}", [
            'name' => 'Koffi A.', 'email' => 'koffi@example.com', 'role' => 'support', 'active' => false, 'password' => '',
        ])->assertOk()->assertJsonPath('data.active', false);
        $koffi->refresh();
        $this->assertSame(['Koffi A.', 'support'], [$koffi->name, $koffi->role]);
        $this->assertTrue(Hash::check('motdepasse-solide', $koffi->password));
        $this->assertSame(0, $koffi->tokens()->count());

        $this->deleteJson("/api/admin/users/{$id}")->assertOk();
        $this->assertModelMissing($koffi);
    }

    public function test_user_validation_returns_422(): void
    {
        $admin = User::factory()->create();
        Sanctum::actingAs($admin);

        $this->postJson('/api/admin/users', [
            'name' => '', 'email' => $admin->email, 'role' => 'superadmin', 'password' => 'court', 'password_confirmation' => 'autre',
        ])->assertStatus(422)->assertJsonValidationErrors(['name', 'email', 'role', 'password']);
    }

    public function test_admin_cannot_delete_demote_or_deactivate_own_account(): void
    {
        $admin = User::factory()->create();
        Sanctum::actingAs($admin);
        $payload = ['name' => $admin->name, 'email' => $admin->email];

        $this->deleteJson("/api/admin/users/{$admin->id}")->assertStatus(422)
            ->assertJsonPath('errors.user.0', 'Vous ne pouvez pas supprimer votre propre compte.');
        $this->putJson("/api/admin/users/{$admin->id}", [...$payload, 'role' => 'editeur', 'active' => true])->assertStatus(422)->assertJsonValidationErrors('role');
        $this->putJson("/api/admin/users/{$admin->id}", [...$payload, 'role' => 'admin', 'active' => false])->assertStatus(422)->assertJsonValidationErrors('role');

        $admin->refresh();
        $this->assertSame(['admin', true], [$admin->role, $admin->active]);
        $this->putJson("/api/admin/users/{$admin->id}", [...$payload, 'name' => 'Nouveau', 'role' => 'admin', 'active' => true])->assertOk();
    }

    public function test_another_admin_can_be_demoted_while_an_admin_remains(): void
    {
        $first = User::factory()->create();
        Sanctum::actingAs(User::factory()->create());

        $this->putJson("/api/admin/users/{$first->id}", ['name' => $first->name, 'email' => $first->email, 'role' => 'editeur', 'active' => true])->assertOk();
        $this->assertSame(1, User::activeAdminCount());
    }

    public function test_non_uuid_identifiers_are_rejected(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/admin/users/1')->assertNotFound();
        $this->getJson('/api/admin/messages/1')->assertNotFound();
        $this->getJson('/api/admin/content/solutions/1')->assertNotFound();
    }

    public function test_profile_requires_current_password_and_keeps_role(): void
    {
        $user = User::factory()->support()->create(['password' => 'ancien-mot-de-passe']);
        Sanctum::actingAs($user);

        $this->getJson('/api/admin/profile')->assertOk()->assertJsonPath('data.role.label', 'Chargé de clientèle');

        $this->putJson('/api/admin/profile', ['name' => 'Nouveau nom', 'email' => $user->email, 'current_password' => 'faux'])
            ->assertStatus(422)->assertJsonPath('errors.current_password.0', 'Mot de passe actuel incorrect.');

        $this->putJson('/api/admin/profile', [
            'name' => 'Nouveau nom', 'email' => $user->email, 'role' => 'admin',
            'current_password' => 'ancien-mot-de-passe', 'password' => 'nouveau-mot-de-passe', 'password_confirmation' => 'nouveau-mot-de-passe',
        ])->assertOk()->assertJsonPath('data.user.role', 'support');

        $user->refresh();
        $this->assertSame('Nouveau nom', $user->name);
        $this->assertTrue(Hash::check('nouveau-mot-de-passe', $user->password));
    }

    public function test_admin_command_always_grants_active_admin(): void
    {
        $user = User::factory()->support()->inactive()->create();

        $this->artisan('intellino:admin', ['email' => $user->email, '--password' => 'motdepasse-recuperation'])->assertSuccessful();

        $user->refresh();
        $this->assertSame(['admin', true], [$user->role, $user->active]);
    }
}
