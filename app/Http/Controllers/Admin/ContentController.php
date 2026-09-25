<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\AdminResources;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    public function index(string $type): Response
    {
        $this->authorizeType($type);
        $resource = AdminResources::get($type);
        [$column, $direction] = $resource['order'];

        return Inertia::render('Admin/Content/Index', [
            'resource' => AdminResources::forFrontend($type),
            'items' => $this->query($resource)->orderBy($column, $direction)->get(),
        ]);
    }

    public function create(string $type): Response
    {
        $this->authorizeType($type);
        return Inertia::render('Admin/Content/Form', [
            'resource' => AdminResources::forFrontend($type),
            'item' => null,
        ]);
    }

    public function store(Request $request, string $type): RedirectResponse
    {
        $this->authorizeType($type);
        $resource = AdminResources::get($type);
        // Les blocs de pages reçoivent automatiquement leur collection.
        $resource['model']::create([...$this->validated($request, $resource), ...($resource['scope'] ?? [])]);

        return redirect()->route('admin.content.index', $type)
            ->with('success', ucfirst($resource['singular']).' ajouté(e).');
    }

    public function edit(string $type, string $id): Response
    {
        $this->authorizeType($type);
        $item = $this->find($type, $id);

        return Inertia::render('Admin/Content/Form', [
            'resource' => AdminResources::forFrontend($type),
            'item' => $item,
        ]);
    }

    public function update(Request $request, string $type, string $id): RedirectResponse
    {
        $this->authorizeType($type);
        $resource = AdminResources::get($type);
        $item = $this->find($type, $id);
        $item->update($this->validated($request, $resource, $item->id));

        return redirect()->route('admin.content.index', $type)
            ->with('success', ucfirst($resource['singular']).' mis(e) à jour.');
    }

    public function destroy(string $type, string $id): RedirectResponse
    {
        $this->authorizeType($type);
        $resource = AdminResources::get($type);
        $this->find($type, $id)->delete();

        return redirect()->route('admin.content.index', $type)
            ->with('success', ucfirst($resource['singular']).' supprimé(e).');
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
