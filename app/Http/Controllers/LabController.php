<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class LabController extends Controller
{
    public const PAGES = ['vision', 'recherche', 'projets', 'partenariats'];

    public function show(string $page): Response
    {
        return Inertia::render('Lab/'.ucfirst($page), match ($page) {
            // Les produits IntellIno sont les premiers projets issus du Lab.
            'projets' => ['products' => Product::orderBy('sort_order')->get(['slug', 'icon', 'category', 'name', 'description', 'badge', 'badge_color', 'features'])],
            default => [],
        });
    }
}
