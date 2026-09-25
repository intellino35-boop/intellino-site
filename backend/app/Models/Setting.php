<?php

namespace App\Models;

use App\Support\SiteSettings;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['key', 'value'];

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget(SiteSettings::CACHE_KEY));
        static::deleted(fn () => Cache::forget(SiteSettings::CACHE_KEY));
    }
}
