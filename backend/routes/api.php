<?php

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\BlockController;
use App\Http\Controllers\Api\Admin\ContentController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\MessageController;
use App\Http\Controllers\Api\Admin\ProfileController;
use App\Http\Controllers\Api\Admin\SettingsController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\LabController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\RealisationController;
use App\Http\Controllers\Api\SiteController;
use App\Http\Controllers\Api\SoftwareController;
use App\Http\Controllers\Api\SolutionController;
use App\Http\Middleware\EnsureUserIsActive;
use App\Support\AdminResources;
use Illuminate\Support\Facades\Route;

/*
| API REST IntellIno (préfixe /api). Réponses : { data, message, status }.
*/

// ─── Site public ───────────────────────────────────────────────
Route::get('home', HomeController::class);
Route::get('settings', [SiteController::class, 'settings']);
Route::get('blocks', [SiteController::class, 'blocks']);

Route::get('solutions', [SolutionController::class, 'index']);
Route::get('solutions/{slug}', [SolutionController::class, 'show']);
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{slug}', [ProductController::class, 'show']);
Route::get('softwares', [SoftwareController::class, 'index']);
Route::get('softwares/{slug}', [SoftwareController::class, 'show']);
Route::get('realisations', [RealisationController::class, 'index']);
Route::get('realisations/{slug}', [RealisationController::class, 'show']);
Route::get('posts', [PostController::class, 'index']);
Route::get('posts/{slug}', [PostController::class, 'show']);
Route::get('lab/projects', [LabController::class, 'projects']);

Route::post('contact', [ContactController::class, 'store'])->middleware('throttle:5,1');

// ─── Authentification de l'administration (jeton Sanctum) ──────
Route::post('auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

Route::middleware(['auth:sanctum', EnsureUserIsActive::class])->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    // ─── Administration ────────────────────────────────────────
    Route::prefix('admin')->group(function () {
        Route::get('dashboard', DashboardController::class);

        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);

        Route::middleware('can:messages')->whereUuid('message')->group(function () {
            Route::get('messages', [MessageController::class, 'index']);
            Route::get('messages/{message}', [MessageController::class, 'show']);
            Route::patch('messages/{message}/toggle-read', [MessageController::class, 'toggleRead']);
            Route::delete('messages/{message}', [MessageController::class, 'destroy']);
        });

        Route::get('blocks', BlockController::class)->middleware('can:blocks');

        Route::middleware('can:settings')->group(function () {
            Route::get('settings', [SettingsController::class, 'show']);
            // POST : envoi multipart/form-data (logo, image d'accueil).
            Route::post('settings', [SettingsController::class, 'update']);
        });

        Route::middleware('can:users')->whereUuid('user')->group(function () {
            Route::get('roles', [UserController::class, 'roles']);
            Route::get('users', [UserController::class, 'index']);
            Route::post('users', [UserController::class, 'store']);
            Route::get('users/{user}', [UserController::class, 'show']);
            Route::put('users/{user}', [UserController::class, 'update']);
            Route::delete('users/{user}', [UserController::class, 'destroy']);
        });

        // Contenus et blocs : permission « content » ou « blocks » vérifiée dans le contrôleur selon le type.
        Route::whereIn('type', array_keys(AdminResources::all()))->whereUuid('id')
            ->controller(ContentController::class)->group(function () {
                Route::get('content/{type}/schema', 'schema');
                Route::get('content/{type}', 'index');
                Route::post('content/{type}', 'store');
                Route::get('content/{type}/{id}', 'show');
                Route::put('content/{type}/{id}', 'update');
                Route::delete('content/{type}/{id}', 'destroy');
            });
    });
});
