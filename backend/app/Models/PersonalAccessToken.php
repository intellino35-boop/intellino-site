<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

/** Jeton Sanctum avec identifiant UUID (enregistré dans AppServiceProvider). */
class PersonalAccessToken extends SanctumPersonalAccessToken
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';
}
