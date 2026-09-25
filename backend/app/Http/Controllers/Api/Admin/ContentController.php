<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Support\AdminResources;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/**
 * CRUD générique des contenus (solutions, produits, logiciels, réalisations, articles)
 * et des blocs de pages. Les champs de chaque type sont définis dans App\Support\AdminResources.
 */
class ContentController extends Controller
{
    /** Définition d'un type (libellés, champs) pour construire les formulaires du front. */
    public function schema(string $type): JsonResponse
    {
        $this->authorizeType($type);

        return $this->ok(AdminResources::forFrontend($type));
    }

    public function index(string $type): JsonResponse
    {
        $this->authorizeType($type);
        $resource = AdminResources::get($type);
        [$column, $direction] = $resource['order'];

        return $this->ok($this->query($resource)->orderBy($column, $direction)->get(), meta: [
            'resource' => AdminResources::forFrontend($type),
        ]);
    }

    public function show(string $type, string $id): JsonResponse
    {
        $this->authorizeType($type);

        return $this->ok($this->find($type, $id), meta: ['resource' => AdminResources::forFrontend($type)]);
    }

    public function store(Request $request, string $type): JsonResponse
    {
        $this->authorizeType($type);
        $resource = AdminResources::get($type);
        // Les blocs de pages reçoivent automatiquement leur collection.
        $item = $resource['model']::create([...$this->validated($request, $resource), ...($resource['scope'] ?? [])]);

        return $this->ok($item->fresh(), ucfirst($resource['singular']).' ajouté(e).', 201);
    }

    public function update(Request $request, string $type, string $id): JsonResponse
    {
        $this->authorizeType($type);
        $resource = AdminResources::get($type);
        $item = $this->find($type, $id);
        $item->update($this->validated($request, $resource, $item->getKey()));

        return $this->ok($item->fresh(), ucfirst($resource['singular']).' mis(e) à jour.');
    }

    public function destroy(string $type, string $id): JsonResponse
    {
        $this->authorizeType($type);
        $resource = AdminResources::get($type);
        $this->find($type, $id)->delete();

        return $this->ok(null, ucfirst($resource['singular']).' supprimé(e).');
    }

    /** Blocs des pages : permission « blocks » ; autres contenus : permission « content ». */
    private function authorizeType(string $type): void
    {
        Gate::authorize((AdminResources::get($type)['group'] ?? null) === 'blocks' ? 'blocks' : 'content');
    }

    /** Requête limitée à la collection du type (blocs de pages) ; sans effet pour les autres contenus. */
    private function query(array $resource): Builder
    {
        return $resource['model']::query()->where($resource['scope'] ?? []);
    }

    private function find(string $type, string $id): Model
    {
        return $this->query(AdminResources::get($type))->findOrFail($id);
    }

    private function validated(Request $request, array $resource, ?string $ignoreId = null): array
    {
        $data = $request->validate(AdminResources::rules($resource, $ignoreId), [
            'required' => 'Ce champ est obligatoire.',
            'unique' => 'Cette valeur est déjà utilisée.',
            'integer' => 'Veuillez saisir un nombre entier.',
            'date' => 'Date invalide.',
            'in' => 'Valeur non autorisée.',
            'array' => 'Liste invalide.',
            'max' => 'Ce champ ne doit pas dépasser :max caractères.',
        ]);

        // Nombre vide : valeur par défaut du champ (ex. ordre = 0), sinon null.
        foreach ($resource['fields'] as $field) {
            if ($field['type'] === 'number') {
                $value = $data[$field['name']] ?? null;
                $data[$field['name']] = $value === null ? ($field['default'] ?? null) : (int) $value;
            }
        }

        return $data;
    }
}
