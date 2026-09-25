<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Base commune des contenus publics adressés par leur slug
 * (solutions, produits, logiciels, réalisations) : liste triée + fiche avec « autres » éléments.
 */
abstract class CatalogController extends Controller
{
    /** @var class-string<Model> */
    protected string $model;

    /** @var class-string<\Illuminate\Http\Resources\Json\JsonResource> */
    protected string $resource;

    protected ?int $othersLimit = null;

    public function index(Request $request): JsonResponse
    {
        $items = $this->model::orderBy('sort_order')->get();

        return $this->ok($this->resource::collection($items)->resolve($request));
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $item = $this->model::where('slug', $slug)->firstOrFail();

        $others = $this->model::whereKeyNot($item->getKey())->orderBy('sort_order')
            ->when($this->othersLimit, fn ($q) => $q->take($this->othersLimit))
            ->get();

        return $this->ok([
            'item' => (new $this->resource($item))->resolve($request),
            'others' => $this->resource::collection($others)->resolve($request),
        ]);
    }
}
