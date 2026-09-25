<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\SiteSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class SettingsController extends Controller
{
    public function show(): JsonResponse
    {
        return $this->ok([
            'fields' => collect(SiteSettings::FIELDS)->map(fn (array $f, string $key) => [
                'key' => $key, 'label' => $f[1], 'section' => $f[2], 'type' => $f[3],
            ])->values(),
            'values' => SiteSettings::current(),
            // Clés réellement enregistrées dans l'admin (les autres viennent du fichier .env).
            'overridden' => array_keys(SiteSettings::stored()),
        ]);
    }

    /** Envoi en multipart/form-data (images). Le front recharge ensuite les valeurs avec GET. */
    public function update(Request $request): JsonResponse
    {
        $rules = [];
        foreach (SiteSettings::FIELDS as $key => [, , , $type]) {
            $rules[$key] = match ($type) {
                'email' => ['nullable', 'email', 'max:255'],
                'number' => ['nullable', 'integer', 'min:1', 'max:120'],
                'date' => ['nullable', 'date'],
                'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
                default => ['nullable', 'string', 'max:255'],
            };
        }
        $rules['reset_images'] = ['array'];
        $rules['reset_images.*'] = ['in:logo,hero_image'];

        $data = $request->validate($rules, [
            'email' => 'Adresse e-mail invalide.',
            'integer' => 'Veuillez saisir un nombre entier.',
            'min' => 'Valeur trop petite.',
            'max' => 'Valeur ou fichier trop grand (4 Mo maximum pour les images).',
            'date' => 'Date invalide.',
            'image' => 'Le fichier doit être une image.',
            'mimes' => 'Formats acceptés : JPG, PNG ou WebP.',
        ]);

        foreach (SiteSettings::FIELDS as $key => [, , , $type]) {
            if ($type === 'image') {
                if ($request->hasFile($key)) {
                    $this->save($key, $this->storeImage($request->file($key), $key));
                } elseif (in_array($key, $data['reset_images'] ?? [], true)) {
                    $this->save($key, null); // retour à l'image fournie avec le site
                }

                continue;
            }

            // Champ absent de la requête : inchangé ; champ envoyé vide : retour à la valeur du .env.
            if ($request->exists($key)) {
                $this->save($key, $data[$key] ?? null);
            }
        }

        return $this->ok(null, 'Paramètres enregistrés.');
    }

    /** Valeur vide = suppression : le site reprend la valeur du fichier .env. */
    private function save(string $key, ?string $value): void
    {
        $value === null || trim($value) === ''
            ? Setting::where('key', $key)->delete()
            : Setting::updateOrCreate(['key' => $key], ['value' => trim($value)]);
    }

    /** Enregistre l'image dans public/images/uploads du backend (sans lien symbolique : compatible mutualisé). */
    private function storeImage(UploadedFile $file, string $key): string
    {
        $name = Str::slug($key).'-'.now()->format('YmdHis').'.'.strtolower($file->guessExtension() ?? 'jpg');
        $file->move(public_path('images/uploads'), $name);

        return '/images/uploads/'.$name;
    }
}
