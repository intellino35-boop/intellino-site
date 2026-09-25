<?php

namespace App\Http\Controllers;

use App\Models\Software;
use Inertia\Inertia;
use Inertia\Response;

class SoftwareController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Softwares/Index', [
            'softwares' => Software::orderBy('sort_order')->get(['slug', 'icon', 'name', 'description', 'features']),
        ]);
    }

    public function show(string $slug): Response
    {
        $software = Software::where('slug', $slug)->firstOrFail();

        return Inertia::render('Softwares/Show', [
            'software' => $software->only('slug', 'icon', 'name', 'description', 'details', 'features', 'audiences'),
            'others' => Software::where('id', '!=', $software->id)->orderBy('sort_order')->get(['slug', 'icon', 'name', 'description']),
        ]);
    }
}
