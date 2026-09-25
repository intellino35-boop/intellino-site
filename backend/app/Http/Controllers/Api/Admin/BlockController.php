<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteBlock;
use App\Support\AdminResources;
use Illuminate\Http\JsonResponse;

class BlockController extends Controller
{
    /** Vue d'ensemble des blocs de pages, avec le nombre d'éléments de chaque liste. */
    public function __invoke(): JsonResponse
    {
        $counts = SiteBlock::selectRaw('collection, count(*) as total')->groupBy('collection')->pluck('total', 'collection');

        return $this->ok(collect(AdminResources::blocks())->map(fn (array $r, string $type) => [
            'type' => $type,
            'label' => $r['label'],
            'page' => $r['page'],
            'count' => (int) ($counts[$type] ?? 0),
        ])->values());
    }
}
