<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteBlock;
use App\Support\SiteSettings;
use Illuminate\Http\JsonResponse;

class SiteController extends Controller
{
    /** Paramètres publics : coordonnées, images et informations légales (valeurs de l'admin ou du .env). */
    public function settings(): JsonResponse
    {
        return $this->ok([
            'contact' => [
                'email' => config('intellino.email'),
                'phone' => config('intellino.phone'),
                'whatsapp' => config('intellino.whatsapp'),
                'location' => config('intellino.location'),
                'logo' => SiteSettings::imageUrl(config('intellino.logo')),
                'heroImage' => SiteSettings::imageUrl(config('intellino.hero_image')),
            ],
            'legal' => config('intellino.legal'),
            'tokenLifetimeHours' => config('intellino.token_hours'),
        ]);
    }

    /** Blocs de textes des pages, regroupés par collection (mis en cache). */
    public function blocks(): JsonResponse
    {
        return $this->ok(SiteBlock::forFrontend());
    }
}
