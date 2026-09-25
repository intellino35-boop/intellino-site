<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\RealisationResource;
use App\Http\Resources\SoftwareResource;
use App\Http\Resources\SolutionResource;
use App\Models\Post;
use App\Models\Product;
use App\Models\Realisation;
use App\Models\Software;
use App\Models\Solution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /** Toutes les données de la page d'accueil en une requête. */
    public function __invoke(Request $request): JsonResponse
    {
        return $this->ok([
            'solutions' => SolutionResource::collection(Solution::orderBy('sort_order')->get())->resolve($request),
            'products' => ProductResource::collection(Product::orderBy('sort_order')->get())->resolve($request),
            'softwares' => SoftwareResource::collection(Software::orderBy('sort_order')->get())->resolve($request),
            'realisations' => RealisationResource::collection(Realisation::orderBy('sort_order')->get())->resolve($request),
            'posts' => PostResource::collection(Post::latest('published_at')->take(3)->get())->resolve($request),
        ]);
    }
}
