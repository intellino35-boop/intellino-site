<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    public function notice(): Response
    {
        return Inertia::render('Legal/Notice', ['legal' => config('intellino.legal')]);
    }

    public function privacy(): Response
    {
        return Inertia::render('Legal/Privacy', [
            'legal' => config('intellino.legal'),
            'sessionMinutes' => (int) config('session.lifetime'),
        ]);
    }
}
