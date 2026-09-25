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
    public function robots(): Response
    {
        $lines = app()->isProduction()
            ? ['User-agent: *', 'Disallow: /admin', '', 'Sitemap: '.url('/sitemap.xml')]
            : ['User-agent: *', 'Disallow: /']; // hors production : ne pas indexer

        return response(implode("\n", $lines)."\n")->header('Content-Type', 'text/plain; charset=UTF-8');
    }

    public function sitemap(): Response
    {
        $static = ['/', '/solutions', '/produits', '/logiciels', '/realisations', '/blog', '/a-propos', '/contact',
            '/lab/vision', '/lab/recherche', '/lab/projets', '/lab/partenariats', '/mentions-legales', '/confidentialite'];

        $urls = collect($static)->map(fn ($path) => ['loc' => url($path), 'lastmod' => null])
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

    private function entries(string $model, string $prefix)
    {
        return $model::get(['slug', 'updated_at'])->map(fn ($item) => [
            'loc' => url($prefix.$item->slug),
            'lastmod' => $item->updated_at?->toDateString(),
        ]);
    }
}
