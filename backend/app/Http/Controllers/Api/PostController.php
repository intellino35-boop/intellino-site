<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /** Articles paginés (9 par page), filtrables par catégorie : ?categorie=IoT&page=2 */
    public function index(Request $request): JsonResponse
    {
        $category = $request->query('categorie');

        $posts = Post::query()
            ->when($category, fn ($q) => $q->where('category', $category))
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString();

        return $this->ok(PostResource::collection($posts->getCollection())->resolve($request), meta: [
            'current_page' => $posts->currentPage(),
            'last_page' => $posts->lastPage(),
            'per_page' => $posts->perPage(),
            'total' => $posts->total(),
            'category' => $category,
            'categories' => Post::distinct()->orderBy('category')->pluck('category')->all(),
        ]);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $post = Post::where('slug', $slug)->firstOrFail();

        // Articles liés : même catégorie en priorité, puis les plus récents.
        $related = Post::whereKeyNot($post->getKey())
            ->orderByRaw('category = ? desc', [$post->category])
            ->latest('published_at')
            ->take(3)
            ->get();

        return $this->ok([
            'item' => (new PostResource($post))->withBody()->resolve($request),
            'related' => PostResource::collection($related)->resolve($request),
        ]);
    }
}
