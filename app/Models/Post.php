<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasUuids;

    protected $fillable = ['slug', 'category', 'title', 'excerpt', 'body', 'published_at'];

    protected function casts(): array
    {
        return [
            'published_at' => 'date',
        ];
    }
}
