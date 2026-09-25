<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Solution extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['slug', 'icon', 'title', 'description', 'color', 'items', 'benefits', 'sort_order'];

    protected function casts(): array
    {
        return [
            'items' => 'array',
            'benefits' => 'array',
        ];
    }
}
