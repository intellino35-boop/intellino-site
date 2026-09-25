<?php

namespace Tests\Feature\Api;

use App\Models\PersonalAccessToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    private function login(User $user, string $password = 'secret-password', bool $remember = false)
    {
        return $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => $password, 'remember' => $remember]);
    }

    public function test_login_returns_a_token_and_the_user_session(): void
    {
        $user = User::factory()->editor()->create(['password' => 'secret-password', 'last_login_at' => null]);

        $response = $this->login($user)->assertOk()
            ->assertJsonPath('status', true)
            ->assertJsonPath('data.user.id', $user->id)
            ->assertJsonPath('data.user.role', 'editeur')
            ->assertJsonPath('data.user.roleLabel', 'Éditeur')
            ->assertJsonPath('data.user.permissions', ['content', 'blocks'])
            ->assertJsonCount(5, 'data.admin.resources')
            ->assertJsonCount(15, 'data.admin.blockTypes');

        // Jeton Sanctum « uuid|secret » stocké avec un identifiant UUID.
        [$tokenId] = explode('|', $response->json('data.token'));
        $this->assertTrue(Str::isUuid($tokenId));
        $this->assertSame($user->id, PersonalAccessToken::sole()->tokenable_id);
        $this->assertNotNull($user->fresh()->last_login_at);

        $this->withToken($response->json('data.token'))->getJson('/api/auth/me')->assertOk()
            ->assertJsonPath('data.user.email', $user->email);
    }

    public function test_token_lifetime_depends_on_remember_me(): void
    {
        $user = User::factory()->create(['password' => 'secret-password']);

        $this->login($user);
        $this->assertEqualsWithDelta(now()->addHours(8)->timestamp, PersonalAccessToken::latest()->first()->expires_at->timestamp, 60);

        $this->login($user, remember: true);
        $this->assertEqualsWithDelta(now()->addDays(30)->timestamp, PersonalAccessToken::orderByDesc('expires_at')->first()->expires_at->timestamp, 60);
    }

    public function test_wrong_credentials_return_422_with_generic_message(): void
    {
        $user = User::factory()->create(['password' => 'secret-password']);

        $this->login($user, 'mauvais')->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'Identifiants incorrects.');
        $this->postJson('/api/auth/login', ['email' => 'inconnu@example.com', 'password' => 'x'])->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'Identifiants incorrects.');
        $this->postJson('/api/auth/login', [])->assertStatus(422)->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_inactive_account_is_refused_with_403(): void
    {
        $user = User::factory()->inactive()->create(['password' => 'secret-password']);

        $this->login($user)->assertForbidden()
            ->assertJsonPath('message', 'Votre compte a été désactivé. Contactez un administrateur.');
        $this->assertSame(0, PersonalAccessToken::count());
    }

    public function test_protected_routes_return_401_without_token(): void
    {
        foreach (['/api/auth/me', '/api/admin/dashboard', '/api/admin/messages', '/api/admin/users'] as $url) {
            $this->getJson($url)->assertUnauthorized()
                ->assertExactJson(['data' => null, 'message' => 'Authentification requise. Veuillez vous connecter.', 'status' => false]);
        }
        $this->withToken('faux-jeton')->getJson('/api/auth/me')->assertUnauthorized();
        // Sans en-tête Accept JSON : toujours du JSON, jamais de redirection.
        $this->get('/api/admin/dashboard')->assertUnauthorized()->assertJsonPath('status', false);
    }

    public function test_logout_revokes_the_token(): void
    {
        $user = User::factory()->create(['password' => 'secret-password']);
        $token = $this->login($user)->json('data.token');

        $this->withToken($token)->postJson('/api/auth/logout')->assertOk();
        $this->assertSame(0, PersonalAccessToken::count());

        $this->app['auth']->forgetGuards();
        $this->withToken($token)->getJson('/api/auth/me')->assertUnauthorized();
    }

    public function test_expired_token_is_refused(): void
    {
        $user = User::factory()->create(['password' => 'secret-password']);
        $token = $this->login($user)->json('data.token');

        $this->travel(9)->hours();

        $this->withToken($token)->getJson('/api/auth/me')->assertUnauthorized();
    }

    public function test_user_deactivated_during_session_gets_401_and_token_is_revoked(): void
    {
        $user = User::factory()->editor()->create(['password' => 'secret-password']);
        $token = $this->login($user)->json('data.token');

        $user->update(['active' => false]);

        $this->withToken($token)->getJson('/api/admin/dashboard')->assertUnauthorized()
            ->assertJsonPath('message', 'Votre compte a été désactivé. Contactez un administrateur.');
        $this->assertSame(0, PersonalAccessToken::count());
    }

    public function test_login_is_rate_limited(): void
    {
        $user = User::factory()->create(['password' => 'secret-password']);
        foreach (range(1, 5) as $i) {
            $this->login($user, 'mauvais');
        }

        $this->login($user)->assertStatus(429);
    }
}
