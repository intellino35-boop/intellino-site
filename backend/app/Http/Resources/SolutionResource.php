<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SolutionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'icon' => $this->icon,
            'title' => $this->title,
            'description' => $this->description,
            'color' => $this->color,
            'items' => $this->items ?? [],
            'benefits' => $this->benefits ?? [],
        ];
    }
}
