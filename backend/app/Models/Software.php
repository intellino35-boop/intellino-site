<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Software extends Model
{
    use HasUuids;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $table = 'softwares';

    protected $fillable = ['slug', 'icon', 'name', 'description', 'details', 'features', 'audiences', 'sort_order'];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'audiences' => 'array',
        ];
    }
}
