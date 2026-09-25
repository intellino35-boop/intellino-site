<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'icon' => $this->icon,
            'category' => $this->category,
            'name' => $this->name,
            'description' => $this->description,
            'details' => $this->details,
            'badge' => $this->badge,
            'badge_color' => $this->badge_color,
            'features' => $this->features ?? [],
            'use_cases' => $this->use_cases ?? [],
        ];
    }
}
