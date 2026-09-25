<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\BlockController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Middleware\EnsureUserIsActive;
use App\Http\Controllers\Admin\ContentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LabController;
use App\Http\Controllers\LegalController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RealisationController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\SoftwareController;
use App\Http\Controllers\SolutionController;
use App\Support\AdminResources;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.store');

// Espace d'administration
Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthController::class, 'create'])->name('login');
        Route::post('login', [AuthController::class, 'store'])->middleware('throttle:5,1');
    });

    Route::middleware(['auth', EnsureUserIsActive::class])->group(function () {
        Route::post('logout', [AuthController::class, 'destroy'])->name('logout');
        Route::get('/', DashboardController::class)->name('dashboard');

        // Mon compte : accessible à tous les rôles.
        Route::get('mon-compte', [ProfileController::class, 'edit'])->name('profile');
        Route::put('mon-compte', [ProfileController::class, 'update'])->name('profile.update');

        Route::resource('messages', MessageController::class)->only(['index', 'show', 'update', 'destroy'])
            ->middleware('can:messages');

        Route::get('blocs', BlockController::class)->middleware('can:blocks')->name('blocks');

        Route::middleware('can:settings')->group(function () {
            Route::get('parametres', [SettingsController::class, 'edit'])->name('settings');
            // POST (et non PUT) : l'envoi de fichiers (logo, image) ne fonctionne qu'en POST.
            Route::post('parametres', [SettingsController::class, 'update'])->name('settings.update');
        });

        Route::resource('utilisateurs', UserController::class)->except('show')
            ->parameters(['utilisateurs' => 'user'])->names('users')->middleware('can:users');

        // Contenus et blocs : la permission (content ou blocks) est vérifiée dans le contrôleur selon le type.
        Route::whereIn('type', array_keys(AdminResources::all()))->whereUuid('id')
            ->controller(ContentController::class)->name('content.')->group(function () {
                Route::get('contenu/{type}', 'index')->name('index');
                Route::get('contenu/{type}/nouveau', 'create')->name('create');
                Route::post('contenu/{type}', 'store')->name('store');
                Route::get('contenu/{type}/{id}', 'edit')->name('edit');
                Route::put('contenu/{type}/{id}', 'update')->name('update');
                Route::delete('contenu/{type}/{id}', 'destroy')->name('destroy');
            });
    });
});

Route::get('/solutions', [SolutionController::class, 'index'])->name('solutions.index');
Route::get('/solutions/{slug}', [SolutionController::class, 'show'])->name('solutions.show');
Route::get('/produits', [ProductController::class, 'index'])->name('products.index');
Route::get('/produits/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/realisations', [RealisationController::class, 'index'])->name('realisations.index');
Route::get('/realisations/{slug}', [RealisationController::class, 'show'])->name('realisations.show');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
Route::get('/logiciels', [SoftwareController::class, 'index'])->name('softwares.index');
Route::get('/logiciels/{slug}', [SoftwareController::class, 'show'])->name('softwares.show');
Route::redirect('/lab', '/lab/vision');
Route::get('/lab/{page}', [LabController::class, 'show'])->whereIn('page', LabController::PAGES)->name('lab.show');
Route::inertia('/a-propos', 'About')->name('about');
Route::inertia('/contact', 'Contact')->name('contact');

Route::get('/robots.txt', [SeoController::class, 'robots']);
Route::get('/sitemap.xml', [SeoController::class, 'sitemap']);
Route::get('/mentions-legales', [LegalController::class, 'notice'])->name('legal.notice');
Route::get('/confidentialite', [LegalController::class, 'privacy'])->name('legal.privacy');

// Adresse inconnue : page « bientôt disponible » avec un code 404.
Route::fallback(fn () => Inertia::render('ComingSoon')->toResponse(request())->setStatusCode(404));
