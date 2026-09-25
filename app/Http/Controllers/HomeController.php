<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Product;
use App\Models\Realisation;
use App\Models\Software;
use App\Models\Solution;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Home', [
            'solutions' => Solution::orderBy('sort_order')->get(['slug', 'icon', 'title', 'color', 'items']),
            'products' => Product::orderBy('sort_order')->get(['slug', 'icon', 'category', 'name', 'description', 'badge', 'badge_color', 'features']),
            'softwares' => Software::orderBy('sort_order')->get(['slug', 'icon', 'name', 'description']),
            'realisations' => Realisation::orderBy('sort_order')->get(['slug', 'icon', 'category', 'title', 'description', 'color', 'tags']),
            'posts' => Post::latest('published_at')->take(3)->get(['slug', 'category', 'title', 'excerpt', 'published_at'])
                ->map(fn (Post $post) => [...$post->only('slug', 'category', 'title', 'excerpt'), 'date' => $post->published_at->toDateString()]),
        ]);
    }
}
