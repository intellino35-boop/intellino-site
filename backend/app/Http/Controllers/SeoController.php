<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Product;
use App\Models\Realisation;
use App\Models\Software;
use App\Models\Solution;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    /** Le backend ne sert que l'API : rien à indexer (le robots.txt du site est fourni par le front). */
    public function robots(): Response
    {
        return response("User-agent: *\nDisallow: /\n")->header('Content-Type', 'text/plain; charset=UTF-8');
    }

    /** Plan du site du front React (FRONTEND_URL), généré depuis la base de données. */
    public function sitemap(): Response
    {
        $static = ['/', '/solutions', '/produits', '/logiciels', '/realisations', '/blog', '/a-propos', '/contact',
            '/lab/vision', '/lab/recherche', '/lab/projets', '/lab/partenariats', '/mentions-legales', '/confidentialite'];

        $urls = collect($static)->map(fn ($path) => ['loc' => $this->front($path), 'lastmod' => null])
            ->merge($this->entries(Solution::class, '/solutions/'))
            ->merge($this->entries(Product::class, '/produits/'))
            ->merge($this->entries(Software::class, '/logiciels/'))
            ->merge($this->entries(Realisation::class, '/realisations/'))
            ->merge($this->entries(Post::class, '/blog/'));

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
        foreach ($urls as $url) {
            $xml .= '  <url><loc>'.e($url['loc']).'</loc>'.($url['lastmod'] ? '<lastmod>'.$url['lastmod'].'</lastmod>' : '')."</url>\n";
        }

        return response($xml.'</urlset>'."\n")->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    private function front(string $path): string
    {
        return config('intellino.frontend_url').($path === '/' ? '/' : $path);
    }

    private function entries(string $model, string $prefix)
    {
        return $model::get(['slug', 'updated_at'])->map(fn ($item) => [
            'loc' => $this->front($prefix.$item->slug),
            'lastmod' => $item->updated_at?->toDateString(),
        ]);
    }
}
