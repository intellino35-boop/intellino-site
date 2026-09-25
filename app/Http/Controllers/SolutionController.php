<?php

namespace App\Http\Controllers;

use App\Models\Solution;
use Inertia\Inertia;
use Inertia\Response;

class SolutionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Solutions/Index', [
            'solutions' => Solution::orderBy('sort_order')->get(['slug', 'icon', 'title', 'description', 'color', 'items']),
        ]);
    }

    public function show(string $slug): Response
    {
        $solution = Solution::where('slug', $slug)->first();

        // Entrée de menu sans fiche en base (ex. « Réseaux ») : page « bientôt disponible ».
        if (! $solution) {
            return Inertia::render('ComingSoon');
        }

        return Inertia::render('Solutions/Show', [
            'solution' => $solution->only('slug', 'icon', 'title', 'description', 'color', 'items', 'benefits'),
            'others' => Solution::where('id', '!=', $solution->id)->orderBy('sort_order')->get(['slug', 'icon', 'title']),
        ]);
    }
}
