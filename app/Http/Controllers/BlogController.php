<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(Request $request): Response
    {
        $category = $request->query('categorie');

        $posts = Post::query()
            ->when($category, fn ($q) => $q->where('category', $category))
            ->latest('published_at')
            ->paginate(9, ['slug', 'category', 'title', 'excerpt', 'body', 'published_at'])
            ->withQueryString()
            ->through(fn (Post $post) => $this->card($post));

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'categories' => Post::distinct()->orderBy('category')->pluck('category'),
            'category' => $category,
        ]);
    }

    public function show(string $slug): Response
    {
        $post = Post::where('slug', $slug)->firstOrFail();

        $related = Post::where('id', '!=', $post->id)
            ->orderByRaw('category = ? desc', [$post->category])
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('Blog/Show', [
            'post' => [...$this->card($post), 'body' => $post->body],
            'related' => $related->map(fn (Post $p) => $this->card($p)),
        ]);
    }

    private function card(Post $post): array
    {
        return [
            ...$post->only('slug', 'category', 'title', 'excerpt'),
            'date' => $post->published_at->toDateString(),
            // ~200 mots par minute
            'reading_time' => max(1, (int) ceil(count(preg_split('/\s+/u', trim($post->body ?? $post->excerpt))) / 200)),
        ];
    }
}
