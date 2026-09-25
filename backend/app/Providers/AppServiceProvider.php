<?php

namespace App\Providers;

use App\Models\PersonalAccessToken;
use App\Models\User;
use App\Support\Roles;
use App\Support\SiteSettings;
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // En production, toutes les URL générées (liens, redirections, assets) sont en HTTPS.
        URL::forceHttps($this->app->isProduction());

        if ($proxies = config('intellino.trusted_proxies')) {
            TrustProxies::at($proxies === '*' ? '*' : array_map('trim', explode(',', $proxies)));
        }

        // Paramètres saisis dans l'admin (coordonnées, infos légales, images) : prioritaires sur le .env.
        SiteSettings::apply();

        // Jetons d'API de l'administration avec identifiant UUID.
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        // Une autorisation (Gate) par permission de rôle : messages, content, blocks, settings, users.
        foreach (Roles::PERMISSIONS as $permission) {
            Gate::define($permission, fn (User $user) => $user->hasPermission($permission));
        }
    }
}
