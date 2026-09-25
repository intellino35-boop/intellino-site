<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    public const SUBJECTS = ['solutions', 'securite', 'cloud', 'ia', 'iot', 'produit', 'partenariat', 'autre'];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nom' => ['required', 'string', 'max:255'],
            'organisation' => ['nullable', 'string', 'max:255'],
            'telephone' => ['nullable', 'string', 'max:40'],
            'email' => ['required', 'email', 'max:255'],
            'sujet' => ['required', 'in:'.implode(',', self::SUBJECTS)],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => 'Ce champ est obligatoire.',
            'email' => 'Veuillez saisir une adresse e-mail valide.',
            'max' => 'Ce champ ne doit pas dépasser :max caractères.',
            'sujet.in' => 'Veuillez choisir un sujet dans la liste.',
        ];
    }
}
