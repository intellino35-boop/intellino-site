<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasUuids;

    protected $fillable = ['slug', 'icon', 'category', 'name', 'description', 'details', 'badge', 'badge_color', 'features', 'use_cases', 'sort_order'];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'use_cases' => 'array',
        ];
    }
}
