<?php

use App\Http\Controllers\SeoController;
use App\Http\Responses\ApiResponse;
use Illuminate\Support\Facades\Route;

/*
| Le backend ne sert que l'API (routes/api.php). Les pages sont affichées par le front React (frontend-ui/).
*/

Route::get('/', fn () => ApiResponse::success([
    'name' => config('app.name').' API',
    'api' => url('/api'),
    'frontend' => config('intellino.frontend_url'),
], 'API IntellIno opérationnelle.'));

Route::get('/robots.txt', [SeoController::class, 'robots']);
Route::get('/sitemap.xml', [SeoController::class, 'sitemap']);
