<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /** Le contenu complet n'est inclus que sur la page de l'article (withBody). */
    private bool $withBody = false;

    public function withBody(): static
    {
        $this->withBody = true;

        return $this;
    }

    public function toArray(Request $request): array
    {
        $text = trim($this->body ?? $this->excerpt ?? '');

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'category' => $this->category,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'date' => $this->published_at?->toDateString(),
            // ~200 mots par minute
            'reading_time' => max(1, (int) ceil(count(preg_split('/\s+/u', $text, -1, PREG_SPLIT_NO_EMPTY)) / 200)),
            'body' => $this->when($this->withBody, $this->body),
        ];
    }
}
