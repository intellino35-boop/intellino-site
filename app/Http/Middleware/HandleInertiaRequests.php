<?php

namespace App\Http\Middleware;

use App\Models\ContactMessage;
use App\Models\SiteBlock;
use App\Support\AdminResources;
use App\Support\Roles;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ],
            'auth' => [
                'user' => fn () => $request->user() ? [
                    ...$request->user()->only('id', 'name', 'email', 'role'),
                    'roleLabel' => Roles::DEFINITIONS[$request->user()->role]['label'] ?? $request->user()->role,
                    // Le menu de l'admin n'affiche que ce que le rôle autorise (le serveur vérifie aussi chaque accès).
                    'permissions' => $request->user()->active ? Roles::permissions($request->user()->role) : [],
                ] : null,
            ],
            'admin' => fn () => $request->user() ? [
                'unread' => $request->user()->hasPermission('messages') ? ContactMessage::whereNull('read_at')->count() : 0,
                'resources' => collect(AdminResources::content())
                    ->map(fn (array $r, string $type) => ['type' => $type, 'label' => $r['label']])
                    ->values(),
                'blockTypes' => array_keys(AdminResources::blocks()),
            ] : null,
            // Blocs de textes des pages publiques (mis en cache) ; inutiles dans l'admin.
            'blocks' => fn () => $request->is('admin', 'admin/*') ? null : SiteBlock::forFrontend(),
            'contact' => [
                'email' => config('intellino.email'),
                'phone' => config('intellino.phone'),
                'whatsapp' => config('intellino.whatsapp'),
                'location' => config('intellino.location'),
                'logo' => config('intellino.logo'),
                'heroImage' => config('intellino.hero_image'),
            ],
        ];
    }
}
