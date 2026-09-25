<?php

namespace App\Support;

use App\Models\Post;
use App\Models\Product;
use App\Models\Realisation;
use App\Models\SiteBlock;
use App\Models\Software;
use App\Models\Solution;
use Illuminate\Validation\Rule;

/**
 * Définition des contenus éditables dans l'admin.
 * Types de champ : text, textarea, number, date, select (avec "options"), list (un élément par ligne → tableau JSON).
 */
class AdminResources
{
    /** Tous les types gérés par le CRUD générique (contenus principaux + blocs de pages). */
    public static function all(): array
    {
        return [...self::content(), ...self::blocks()];
    }

    /** Contenus principaux (menu « Contenu du site »). */
    public static function content(): array
    {
        return [
            'solutions' => [
                'model' => Solution::class,
                'label' => 'Solutions',
                'singular' => 'solution',
                'title' => 'title',
                'order' => ['sort_order', 'asc'],
                'url' => '/solutions/',
                'fields' => [
                    ['name' => 'title', 'label' => 'Titre', 'type' => 'text', 'required' => true],
                    ['name' => 'slug', 'label' => 'Slug (URL)', 'type' => 'text', 'required' => true, 'unique' => true],
                    ['name' => 'icon', 'label' => 'Icône (emoji)', 'type' => 'text', 'required' => true],
                    ['name' => 'color', 'label' => 'Couleur', 'type' => 'select', 'required' => true, 'options' => ['blue', 'purple', 'red', 'cyan', 'green', 'yellow']],
                    ['name' => 'description', 'label' => 'Présentation (page de détail)', 'type' => 'textarea'],
                    ['name' => 'items', 'label' => 'Prestations (une par ligne)', 'type' => 'list', 'required' => true],
                    ['name' => 'benefits', 'label' => 'Avantages (un par ligne)', 'type' => 'list'],
                    ['name' => 'sort_order', 'label' => 'Ordre', 'type' => 'number', 'default' => 0],
                ],
            ],
            'products' => [
                'model' => Product::class,
                'label' => 'Produits',
                'singular' => 'produit',
                'title' => 'name',
                'order' => ['sort_order', 'asc'],
                'url' => '/produits/',
                'fields' => [
                    ['name' => 'name', 'label' => 'Nom', 'type' => 'text', 'required' => true],
                    ['name' => 'slug', 'label' => 'Slug (URL)', 'type' => 'text', 'required' => true, 'unique' => true],
                    ['name' => 'icon', 'label' => 'Icône (emoji)', 'type' => 'text', 'required' => true],
                    ['name' => 'category', 'label' => 'Catégorie', 'type' => 'text', 'required' => true],
                    ['name' => 'description', 'label' => 'Description courte', 'type' => 'textarea', 'required' => true],
                    ['name' => 'details', 'label' => 'Présentation détaillée (page produit)', 'type' => 'textarea', 'rows' => 6],
                    ['name' => 'badge', 'label' => 'Badge (facultatif)', 'type' => 'text'],
                    ['name' => 'badge_color', 'label' => 'Couleur du badge', 'type' => 'select', 'required' => true, 'options' => ['primary', 'green', 'blue']],
                    ['name' => 'features', 'label' => 'Fonctionnalités (une par ligne)', 'type' => 'list', 'required' => true],
                    ['name' => 'use_cases', 'label' => "Cas d'usage (un par ligne)", 'type' => 'list'],
                    ['name' => 'sort_order', 'label' => 'Ordre', 'type' => 'number', 'default' => 0],
                ],
            ],
            'logiciels' => [
                'model' => Software::class,
                'label' => 'Logiciels',
                'singular' => 'logiciel',
                'title' => 'name',
                'order' => ['sort_order', 'asc'],
                'url' => '/logiciels/',
                'fields' => [
                    ['name' => 'name', 'label' => 'Nom', 'type' => 'text', 'required' => true],
                    ['name' => 'slug', 'label' => 'Slug (URL)', 'type' => 'text', 'required' => true, 'unique' => true],
                    ['name' => 'icon', 'label' => 'Icône (emoji)', 'type' => 'text', 'required' => true],
                    ['name' => 'description', 'label' => 'Description courte', 'type' => 'text', 'required' => true],
                    ['name' => 'details', 'label' => 'Présentation détaillée (page logiciel)', 'type' => 'textarea', 'rows' => 6],
                    ['name' => 'features', 'label' => 'Modules / fonctionnalités (un par ligne)', 'type' => 'list'],
                    ['name' => 'audiences', 'label' => 'Pour qui ? (un par ligne)', 'type' => 'list'],
                    ['name' => 'sort_order', 'label' => 'Ordre', 'type' => 'number', 'default' => 0],
                ],
            ],
            'realisations' => [
                'model' => Realisation::class,
                'label' => 'Réalisations',
                'singular' => 'réalisation',
                'title' => 'title',
                'order' => ['sort_order', 'asc'],
                'url' => '/realisations/',
                'fields' => [
                    ['name' => 'title', 'label' => 'Titre', 'type' => 'text', 'required' => true],
                    ['name' => 'slug', 'label' => 'Slug (URL)', 'type' => 'text', 'required' => true, 'unique' => true],
                    ['name' => 'icon', 'label' => 'Icône (emoji)', 'type' => 'text', 'required' => true],
                    ['name' => 'category', 'label' => 'Catégorie', 'type' => 'text', 'required' => true],
                    ['name' => 'client', 'label' => 'Type de client (ex. PME commerciale)', 'type' => 'text'],
                    ['name' => 'year', 'label' => 'Année', 'type' => 'number'],
                    ['name' => 'description', 'label' => 'Description courte', 'type' => 'textarea', 'required' => true],
                    ['name' => 'details', 'label' => 'Récit du projet (page de détail)', 'type' => 'textarea', 'rows' => 8],
                    ['name' => 'color', 'label' => 'Couleur de bordure', 'type' => 'select', 'required' => true, 'options' => ['red', 'blue', 'green', 'purple']],
                    ['name' => 'tags', 'label' => 'Étiquettes (une par ligne)', 'type' => 'list', 'required' => true],
                    ['name' => 'sort_order', 'label' => 'Ordre', 'type' => 'number', 'default' => 0],
                ],
            ],
            'articles' => [
                'model' => Post::class,
                'label' => 'Articles',
                'singular' => 'article',
                'title' => 'title',
                'order' => ['published_at', 'desc'],
                'url' => '/blog/',
                'fields' => [
                    ['name' => 'title', 'label' => 'Titre', 'type' => 'text', 'required' => true],
                    ['name' => 'slug', 'label' => 'Slug (URL)', 'type' => 'text', 'required' => true, 'unique' => true],
                    ['name' => 'category', 'label' => 'Catégorie', 'type' => 'text', 'required' => true],
                    ['name' => 'published_at', 'label' => 'Date de publication', 'type' => 'date', 'required' => true],
                    ['name' => 'excerpt', 'label' => 'Résumé', 'type' => 'textarea', 'required' => true],
                    ['name' => 'body', 'label' => 'Contenu — « ## » pour un intertitre, « - » pour une liste, ligne vide entre les paragraphes', 'type' => 'textarea', 'rows' => 16],
                ],
            ],
        ];
    }

    public static function get(string $type): array
    {
        return self::all()[$type] ?? abort(404);
    }

    /**
     * Blocs de textes des pages, stockés dans la table site_blocks (une collection par type).
     * [collection, libellé, page(s) concernée(s), libellé du titre, libellé du texte (null = pas de texte), icône ?, lien ?]
     */
    public static function blocks(): array
    {
        $definitions = [
            ['chiffres', 'Chiffres clés', 'Accueil · À propos', 'Valeur (ex. 8+)', 'Libellé', false],
            ['domaines', "Domaines d'expertise", 'Accueil · À propos', 'Domaine', null],
            ['pourquoi', 'Pourquoi IntellIno ?', 'Accueil · À propos', 'Titre', 'Texte'],
            ['secteurs', 'Secteurs', 'Accueil · À propos', 'Secteur', null],
            ['etapes-lab', 'Étapes du Technology Lab', 'Accueil · À propos · Lab (Recherche)', 'Étape', 'Description (page Recherche)'],
            ['piliers', 'Mission, vision, approche', 'À propos', 'Titre', 'Texte'],
            ['valeurs', 'Valeurs', 'À propos', 'Valeur', 'Texte'],
            ['faq', 'Questions fréquentes', 'Contact', 'Question', 'Réponse', false, true],
            ['apres-contact', 'Après votre message', 'Contact', 'Étape', 'Texte'],
            ['demarche', 'Notre démarche', 'Solutions', 'Étape', 'Texte'],
            ['atouts-logiciels', 'Atouts des logiciels', 'Pages des logiciels', 'Atout', 'Texte'],
            ['principes-lab', 'Principes du Lab', 'Lab · Notre vision', 'Principe', 'Texte'],
            ['axes-recherche', 'Axes de recherche', 'Lab · Recherche & Innovation', 'Axe', 'Texte'],
            ['partenaires-lab', 'Partenaires recherchés', 'Lab · Partenariats', 'Type de partenaire', 'Texte'],
            ['apports-lab', 'Apports du Lab', 'Lab · Partenariats', 'Apport', 'Texte'],
        ];

        $blocks = [];
        foreach ($definitions as $def) {
            [$collection, $label, $page, $titleLabel, $textLabel] = $def;
            $withIcon = $def[5] ?? true;
            $withLink = $def[6] ?? false;

            $blocks[$collection] = [
                'model' => SiteBlock::class,
                'scope' => ['collection' => $collection],
                'group' => 'blocks',
                'page' => $page,
                'label' => $label,
                'singular' => 'élément',
                'title' => 'title',
                'order' => ['sort_order', 'asc'],
                'fields' => array_values(array_filter([
                    $withIcon ? ['name' => 'icon', 'label' => 'Icône (emoji)', 'type' => 'text', 'required' => true] : null,
                    ['name' => 'title', 'label' => $titleLabel, 'type' => 'text', 'required' => true],
                    $textLabel ? ['name' => 'text', 'label' => $textLabel, 'type' => 'textarea', 'required' => $collection !== 'etapes-lab'] : null,
                    $withLink ? ['name' => 'link', 'label' => 'Lien (facultatif, ex. /solutions)', 'type' => 'text'] : null,
                    ['name' => 'sort_order', 'label' => 'Ordre', 'type' => 'number', 'default' => 0],
                ])),
            ];
        }

        return $blocks;
    }

    public static function rules(array $resource, ?string $ignoreId = null): array
    {
        $table = (new $resource['model'])->getTable();

        return collect($resource['fields'])->mapWithKeys(function (array $field) use ($table, $ignoreId) {
            $rules = [empty($field['required']) ? 'nullable' : 'required'];
            $rules[] = match ($field['type']) {
                'number' => 'integer',
                'date' => 'date',
                'list' => 'array',
                default => 'string',
            };
            if ($field['type'] === 'select') {
                $rules[] = Rule::in($field['options']);
            }
            if (in_array($field['type'], ['text', 'select'])) {
                $rules[] = 'max:255';
            }
            if (! empty($field['unique'])) {
                $rules[] = Rule::unique($table, $field['name'])->ignore($ignoreId);
            }

            $fieldRules = [$field['name'] => $rules];
            if ($field['type'] === 'list') {
                $fieldRules[$field['name'].'.*'] = ['string', 'max:255'];
            }

            return $fieldRules;
        })->all();
    }

    /** Champs envoyés au front, sans la classe du modèle. */
    public static function forFrontend(string $type): array
    {
        $resource = self::get($type);

        return ['type' => $type, ...collect($resource)->only('label', 'singular', 'title', 'fields', 'url', 'group', 'page')->all()];
    }
}
