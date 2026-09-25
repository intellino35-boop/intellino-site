<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteBlock;
use App\Support\AdminResources;
use Inertia\Inertia;
use Inertia\Response;

class BlockController extends Controller
{
    /** Vue d'ensemble des blocs de pages, avec le nombre d'éléments de chaque liste. */
    public function __invoke(): Response
    {
        $counts = SiteBlock::selectRaw('collection, count(*) as total')->groupBy('collection')->pluck('total', 'collection');

        return Inertia::render('Admin/Blocks', [
            'collections' => collect(AdminResources::blocks())->map(fn (array $r, string $type) => [
                'type' => $type,
                'label' => $r['label'],
                'page' => $r['page'],
                'count' => (int) ($counts[$type] ?? 0),
            ])->values(),
        ]);
    }
}
