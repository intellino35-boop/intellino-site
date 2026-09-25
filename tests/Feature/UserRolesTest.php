<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use App\Models\SiteBlock;
use App\Models\Solution;
use App\Models\User;
use Database\Seeders\BlocksSeeder;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class UserRolesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->seed([ContentSeeder::class, BlocksSeeder::class]);
    }

    /** Matrice des accès : [url, admin, éditeur, chargé de clientèle] */
    public static function accessMatrix(): array
    {
        return [
            'messages' => ['/admin/messages', true, false, true],
            'contenu' => ['/admin/contenu/solutions', true, true, false],
            'blocs' => ['/admin/blocs', true, true, false],
            'un bloc' => ['/admin/contenu/faq', true, true, false],
            'paramètres' => ['/admin/parametres', true, false, false],
            'utilisateurs' => ['/admin/utilisateurs', true, false, false],
            'mon compte' => ['/admin/mon-compte', true, true, true],
            'tableau de bord' => ['/admin', true, true, true],
        ];
    }

    #[DataProvider('accessMatrix')]
    public function test_role_permissions(string $url, bool $admin, bool $editor, bool $support): void
    {
        foreach (['admin' => $admin, 'editeur' => $editor, 'support' => $support] as $role => $allowed) {
            $response = $this->actingAs(User::factory()->create(['role' => $role]))->get($url);

            $allowed
                ? $response->assertOk()
                : $response->assertRedirect('/admin')->assertSessionHasErrors('user');
        }
    }

    public function test_forbidden_actions_are_blocked_server_side(): void
    {
        $editor = User::factory()->editor()->create();
        $support = User::factory()->support()->create();
        $message = ContactMessage::create(['nom' => 'A', 'email' => 'a@example.com', 'sujet' => 'ia', 'message' => 'x']);
        $solution = Solution::first();

        // L'éditeur ne peut ni supprimer un message, ni modifier les paramètres, ni créer un utilisateur.
        $this->actingAs($editor)->delete("/admin/messages/{$message->id}")->assertRedirect('/admin');
        $this->actingAs($editor)->post('/admin/parametres', ['email' => 'pirate@example.com'])->assertRedirect('/admin');
        $this->actingAs($editor)->post('/admin/utilisateurs', ['name' => 'X', 'email' => 'x@example.com', 'role' => 'admin', 'password' => 'motdepasse1', 'password_confirmation' => 'motdepasse1'])
            ->assertRedirect('/admin');
        $this->assertModelExists($message);
        $this->assertFalse(User::where('email', 'x@example.com')->exists());

        // Le chargé de clientèle ne peut pas supprimer de contenu ni de bloc.
        $this->actingAs($support)->delete("/admin/contenu/solutions/{$solution->id}")->assertRedirect('/admin');
        $block = SiteBlock::where('collection', 'faq')->first();
        $this->actingAs($support)->delete("/admin/contenu/faq/{$block->id}")->assertRedirect('/admin');
        $this->assertModelExists($solution);
        $this->assertModelExists($block);
    }

    public function test_shared_permissions_follow_the_role(): void
    {
        $this->actingAs(User::factory()->support()->create())->get('/admin')
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.user.role', 'support')
                ->where('auth.user.roleLabel', 'Chargé de clientèle')
                ->where('auth.user.permissions', ['messages'])
                ->where('counts', [])
                ->where('messagesTotal', 0));

        $this->actingAs(User::factory()->editor()->create())->get('/admin')
            ->assertInertia(fn (Assert $page) => $page->has('counts', 5)->where('latestMessages', null));
    }

    public function test_admin_creates_updates_and_deletes_a_user(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)->post('/admin/utilisateurs', [
            'name' => 'Koffi', 'email' => 'koffi@example.com', 'role' => 'editeur', 'active' => true,
            'password' => 'motdepasse-solide', 'password_confirmation' => 'motdepasse-solide',
        ])->assertRedirect('/admin/utilisateurs')->assertSessionHasNoErrors();

        $koffi = User::where('email', 'koffi@example.com')->firstOrFail();
        $this->assertSame('editeur', $koffi->role);
        $this->assertTrue(Hash::check('motdepasse-solide', $koffi->password));

        // Mot de passe vide = inchangé.
        $this->actingAs($admin)->put("/admin/utilisateurs/{$koffi->id}", [
            'name' => 'Koffi A.', 'email' => 'koffi@example.com', 'role' => 'support', 'active' => false, 'password' => '',
        ])->assertSessionHasNoErrors();
        $koffi->refresh();
        $this->assertSame(['Koffi A.', 'support', false], [$koffi->name, $koffi->role, $koffi->active]);
        $this->assertTrue(Hash::check('motdepasse-solide', $koffi->password));

        $this->actingAs($admin)->delete("/admin/utilisateurs/{$koffi->id}")->assertRedirect('/admin/utilisateurs');
        $this->assertModelMissing($koffi);
    }

    public function test_user_validation(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin)->post('/admin/utilisateurs', [
            'name' => '', 'email' => $admin->email, 'role' => 'superadmin', 'password' => 'court', 'password_confirmation' => 'autre',
        ])->assertSessionHasErrors(['name', 'email', 'role', 'password']);
    }

    public function test_admin_cannot_delete_demote_or_deactivate_own_account(): void
    {
        $admin = User::factory()->create();
        $payload = ['name' => $admin->name, 'email' => $admin->email];

        $this->actingAs($admin)->delete("/admin/utilisateurs/{$admin->id}")->assertSessionHasErrors('user');
        $this->actingAs($admin)->put("/admin/utilisateurs/{$admin->id}", [...$payload, 'role' => 'editeur', 'active' => true])
            ->assertSessionHasErrors('role');
        $this->actingAs($admin)->put("/admin/utilisateurs/{$admin->id}", [...$payload, 'role' => 'admin', 'active' => false])
            ->assertSessionHasErrors('role');

        $admin->refresh();
        $this->assertSame(['admin', true], [$admin->role, $admin->active]);

        // Modifier son nom reste possible.
        $this->actingAs($admin)->put("/admin/utilisateurs/{$admin->id}", [...$payload, 'name' => 'Nouveau', 'role' => 'admin', 'active' => true])
            ->assertSessionHasNoErrors();
    }

    public function test_another_admin_can_be_demoted_while_an_admin_remains(): void
    {
        $first = User::factory()->create();
        $second = User::factory()->create();

        $this->actingAs($second)->put("/admin/utilisateurs/{$first->id}", [
            'name' => $first->name, 'email' => $first->email, 'role' => 'editeur', 'active' => true,
        ])->assertSessionHasNoErrors();

        $this->assertSame('editeur', $first->fresh()->role);
        $this->assertSame(1, User::activeAdminCount()); // il reste $second
    }

    public function test_inactive_user_cannot_log_in(): void
    {
        $user = User::factory()->inactive()->create(['password' => 'secret-password']);

        $this->post('/admin/login', ['email' => $user->email, 'password' => 'secret-password'])
            ->assertSessionHasErrors(['email' => 'Votre compte a été désactivé. Contactez un administrateur.']);
        $this->assertGuest();

        // Identifiants faux : message générique (ne révèle pas si le compte existe).
        $this->post('/admin/login', ['email' => $user->email, 'password' => 'mauvais'])
            ->assertSessionHasErrors(['email' => 'Identifiants incorrects.']);
    }

    public function test_user_deactivated_during_session_is_logged_out(): void
    {
        $user = User::factory()->editor()->create();
        $this->actingAs($user)->get('/admin')->assertOk();

        $user->update(['active' => false]);

        $this->actingAs($user->fresh())->get('/admin/contenu/solutions')->assertRedirect('/admin/login');
        $this->assertGuest();
    }

    public function test_login_records_last_login_date(): void
    {
        $user = User::factory()->create(['password' => 'secret-password', 'last_login_at' => null]);

        $this->post('/admin/login', ['email' => $user->email, 'password' => 'secret-password'])->assertRedirect('/admin');

        $this->assertNotNull($user->fresh()->last_login_at);
    }

    public function test_profile_requires_current_password_and_cannot_change_role(): void
    {
        $user = User::factory()->support()->create(['password' => 'ancien-mot-de-passe']);

        $this->actingAs($user)->put('/admin/mon-compte', [
            'name' => 'Nouveau nom', 'email' => $user->email, 'current_password' => 'faux', 'password' => '',
        ])->assertSessionHasErrors('current_password');

        $this->actingAs($user)->put('/admin/mon-compte', [
            'name' => 'Nouveau nom', 'email' => $user->email, 'role' => 'admin',
            'current_password' => 'ancien-mot-de-passe', 'password' => 'nouveau-mot-de-passe', 'password_confirmation' => 'nouveau-mot-de-passe',
        ])->assertSessionHasNoErrors();

        $user->refresh();
        $this->assertSame('Nouveau nom', $user->name);
        $this->assertSame('support', $user->role);
        $this->assertTrue(Hash::check('nouveau-mot-de-passe', $user->password));
    }

    public function test_admin_command_always_grants_active_admin(): void
    {
        $user = User::factory()->support()->inactive()->create();

        $this->artisan('intellino:admin', ['email' => $user->email, '--password' => 'motdepasse-recuperation'])->assertSuccessful();

        $user->refresh();
        $this->assertSame('admin', $user->role);
        $this->assertTrue($user->active);
    }
}
