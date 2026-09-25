<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RealisationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'icon' => $this->icon,
            'category' => $this->category,
            'title' => $this->title,
            'client' => $this->client,
            'year' => $this->year,
            'description' => $this->description,
            'details' => $this->details,
            'color' => $this->color,
            'tags' => $this->tags ?? [],
        ];
    }
}
