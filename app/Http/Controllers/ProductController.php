<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Software;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Products/Index', [
            'products' => Product::orderBy('sort_order')->get(['slug', 'icon', 'category', 'name', 'description', 'badge', 'badge_color', 'features']),
            'softwares' => Software::orderBy('sort_order')->get(['slug', 'icon', 'name', 'description']),
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::where('slug', $slug)->firstOrFail();

        return Inertia::render('Products/Show', [
            'product' => $product->only('slug', 'icon', 'category', 'name', 'description', 'details', 'badge', 'badge_color', 'features', 'use_cases'),
            'others' => Product::where('id', '!=', $product->id)->orderBy('sort_order')->get(['slug', 'icon', 'name', 'category']),
        ]);
    }
}
