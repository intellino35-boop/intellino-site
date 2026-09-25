<?php

namespace App\Support;

/**
 * Rôles de l'administration et permissions associées.
 * Permissions : messages, content (contenus principaux), blocks (blocs des pages), settings, users.
 */
class Roles
{
    public const ADMIN = 'admin';

    public const DEFINITIONS = [
        'admin' => [
            'label' => 'Administrateur',
            'description' => 'Accès complet, y compris les paramètres du site et la gestion des utilisateurs.',
            'permissions' => ['messages', 'content', 'blocks', 'settings', 'users'],
        ],
        'editeur' => [
            'label' => 'Éditeur',
            'description' => 'Gère le contenu du site (solutions, produits, articles…) et les blocs des pages.',
            'permissions' => ['content', 'blocks'],
        ],
        'support' => [
            'label' => 'Chargé de clientèle',
            'description' => 'Consulte et traite les messages reçus via le formulaire de contact.',
            'permissions' => ['messages'],
        ],
    ];

    public const PERMISSIONS = ['messages', 'content', 'blocks', 'settings', 'users'];

    public static function keys(): array
    {
        return array_keys(self::DEFINITIONS);
    }

    public static function permissions(?string $role): array
    {
        return self::DEFINITIONS[$role]['permissions'] ?? [];
    }

    public static function allows(?string $role, string $permission): bool
    {
        return in_array($permission, self::permissions($role), true);
    }

    /** Pour le front : [{ key, label, description, permissions }] */
    public static function forFrontend(): array
    {
        return collect(self::DEFINITIONS)->map(fn (array $r, string $key) => ['key' => $key, ...$r])->values()->all();
    }
}
