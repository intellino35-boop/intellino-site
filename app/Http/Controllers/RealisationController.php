<?php

namespace App\Http\Controllers;

use App\Models\Realisation;
use Inertia\Inertia;
use Inertia\Response;

class RealisationController extends Controller
{
    private const CARD_FIELDS = ['slug', 'icon', 'category', 'title', 'client', 'year', 'description', 'color', 'tags'];

    public function index(): Response
    {
        return Inertia::render('Realisations/Index', [
            'realisations' => Realisation::orderBy('sort_order')->get(self::CARD_FIELDS),
        ]);
    }

    public function show(string $slug): Response
    {
        $realisation = Realisation::where('slug', $slug)->firstOrFail();

        return Inertia::render('Realisations/Show', [
            'realisation' => $realisation->only([...self::CARD_FIELDS, 'details']),
            'others' => Realisation::where('id', '!=', $realisation->id)->orderBy('sort_order')->take(3)->get(self::CARD_FIELDS),
        ]);
    }
}
