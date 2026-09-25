<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteBlock extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    public const CACHE_KEY = 'site_blocks';

    protected $fillable = ['collection', 'icon', 'title', 'text', 'link', 'sort_order'];

    protected static function booted(): void
    {
        // Les blocs sont mis en cache pour le site public : on vide le cache à chaque modification.
        static::saved(fn () => Cache::forget(self::CACHE_KEY));
        static::deleted(fn () => Cache::forget(self::CACHE_KEY));
    }

    /**
     * Tous les blocs, regroupés par collection, pour le site public.
     * Uniquement des tableaux PHP simples : Laravel refuse de reconstruire des objets lus depuis le cache.
     */
    public static function forFrontend(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, fn () => self::orderBy('sort_order')->get()
            ->groupBy('collection')
            ->map(fn ($blocks) => $blocks->map->only('icon', 'title', 'text', 'link')->values()->all())
            ->all());
    }
}
