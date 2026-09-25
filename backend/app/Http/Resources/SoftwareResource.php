<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SoftwareResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'icon' => $this->icon,
            'name' => $this->name,
            'description' => $this->description,
            'details' => $this->details,
            'features' => $this->features ?? [],
            'audiences' => $this->audiences ?? [],
        ];
    }
}
