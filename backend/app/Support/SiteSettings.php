<?php

namespace App\Support;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Throwable;

/**
 * Paramètres du site modifiables dans l'admin.
 * Une valeur enregistrée remplace celle de config/intellino.php (issue du .env) ; vide = valeur du .env.
 */
class SiteSettings
{
    public const CACHE_KEY = 'site_settings';

    /** clé => [chemin de config, libellé, section, type] */
    public const FIELDS = [
        'email' => ['intellino.email', 'E-mail de contact', 'contact', 'email'],
        'phone' => ['intellino.phone', 'Téléphone (ex. +229 01 00 00 00 00)', 'contact', 'text'],
        'whatsapp' => ['intellino.whatsapp', 'WhatsApp (numéro international sans « + », ex. 22901000000)', 'contact', 'text'],
        'location' => ['intellino.location', 'Localisation affichée', 'contact', 'text'],
        'notify_email' => ['intellino.notify_email', 'Recevoir une copie des messages de contact à cette adresse', 'contact', 'email'],

        'logo' => ['intellino.logo', 'Logo', 'images', 'image'],
        'hero_image' => ['intellino.hero_image', "Image de fond de l'accueil", 'images', 'image'],

        'legal_company' => ['intellino.legal.company', 'Raison sociale', 'legal', 'text'],
        'legal_form' => ['intellino.legal.legal_form', 'Forme juridique (SARL, SAS…)', 'legal', 'text'],
        'legal_capital' => ['intellino.legal.capital', 'Capital social', 'legal', 'text'],
        'legal_registration' => ['intellino.legal.registration', 'Immatriculation (RCCM, NIF / IFU…)', 'legal', 'text'],
        'legal_address' => ['intellino.legal.address', 'Adresse du siège', 'legal', 'text'],
        'legal_country' => ['intellino.legal.country', 'Pays', 'legal', 'text'],
        'legal_director' => ['intellino.legal.director', 'Responsable de la publication', 'legal', 'text'],
        'legal_host_name' => ['intellino.legal.host_name', 'Hébergeur du site', 'legal', 'text'],
        'legal_host_address' => ['intellino.legal.host_address', "Adresse de l'hébergeur", 'legal', 'text'],
        'legal_privacy_email' => ['intellino.legal.privacy_email', 'E-mail pour les données personnelles', 'legal', 'email'],
        'legal_retention_months' => ['intellino.legal.retention_months', 'Conservation des messages (en mois)', 'legal', 'number'],
        'legal_law' => ['intellino.legal.law', 'Loi applicable sur la protection des données', 'legal', 'text'],
        'legal_updated_at' => ['intellino.legal.updated_at', 'Date de mise à jour des pages légales', 'legal', 'date'],
    ];

    /** Valeurs enregistrées en base (clé => valeur non vide). */
    public static function stored(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, fn () => Setting::whereNotNull('value')->where('value', '!=', '')
            ->pluck('value', 'key')->all());
    }

    /** Applique les paramètres enregistrés à la configuration ; sans effet si la base n'est pas encore prête. */
    public static function apply(): void
    {
        try {
            $stored = self::stored();
        } catch (Throwable) {
            return; // installation en cours, migrations non lancées…
        }

        foreach ($stored as $key => $value) {
            if (isset(self::FIELDS[$key])) {
                config([self::FIELDS[$key][0] => $value]);
            }
        }

        // Sans e-mail dédié, les pages légales reprennent l'e-mail de contact (éventuellement modifié dans l'admin).
        if (! isset($stored['legal_privacy_email']) && isset($stored['email'])) {
            config(['intellino.legal.privacy_email' => $stored['email']]);
        }
    }

    /** Valeurs effectives (base ou .env), pour pré-remplir le formulaire de l'admin. */
    public static function current(): array
    {
        return collect(self::FIELDS)->map(fn (array $field) => $field[3] === 'image'
            ? self::imageUrl(config($field[0]))
            : config($field[0]))->all();
    }

    /**
     * URL d'une image utilisable par le front :
     * - image envoyée depuis l'admin (/images/uploads/…) : servie par l'API → URL absolue du backend ;
     * - image par défaut (/images/logo.png…) : fournie par le front → chemin relatif inchangé ;
     * - URL complète : inchangée.
     */
    public static function imageUrl(?string $path): ?string
    {
        if (! $path || preg_match('#^https?://#', $path)) {
            return $path;
        }

        return str_starts_with($path, '/images/uploads/') ? url($path) : $path;
    }
}
