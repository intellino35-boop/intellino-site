<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Realisation extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['slug', 'icon', 'category', 'title', 'client', 'year', 'description', 'details', 'color', 'tags', 'sort_order'];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
        ];
    }
}
