<?php

// « ?: » plutôt que la valeur par défaut d'env() : une ligne vide dans .env (ex. « INTELLINO_LOGO= »)
// renvoie une chaîne vide, qui doit aussi retomber sur la valeur par défaut.

// Coordonnées affichées dans la section contact et le pied de page.
return [
    'email' => env('INTELLINO_EMAIL') ?: 'contact@intellino.tech',
    'phone' => env('INTELLINO_PHONE', ''),        // ex. +22500000000
    'whatsapp' => env('INTELLINO_WHATSAPP', ''),  // numéro international sans "+", ex. 22500000000
    'location' => env('INTELLINO_LOCATION') ?: 'Afrique',
    // Fichiers dans public/images/ ; une URL complète reste possible.
    'logo' => env('INTELLINO_LOGO') ?: '/images/logo.png',
    'hero_image' => env('INTELLINO_HERO_IMAGE') ?: '/images/hero.jpg',

    // Adresse qui reçoit une copie de chaque message du formulaire de contact (vide = pas d'e-mail).
    'notify_email' => env('INTELLINO_NOTIFY_EMAIL'),

    // Proxys de confiance (Cloudflare, répartiteur de charge…) : "*" ou liste d'IP séparées par des virgules.
    'trusted_proxies' => env('TRUSTED_PROXIES'),

    // Adresse du front React (liens des e-mails, sitemap). Si plusieurs origines CORS sont listées, la première est utilisée.
    'frontend_url' => rtrim(explode(',', env('FRONTEND_URL') ?: 'http://localhost:5174')[0], '/'),

    // Durée de validité des jetons de l'administration (en heures ; « Se souvenir de moi » : en jours).
    'token_hours' => (int) (env('ADMIN_TOKEN_HOURS') ?: 8),
    'token_remember_days' => (int) (env('ADMIN_TOKEN_REMEMBER_DAYS') ?: 30),

    // Informations légales (pages Mentions légales et Confidentialité).
    // Un champ vide s'affiche « [À compléter] » sur le site.
    'legal' => [
        'company' => env('LEGAL_COMPANY') ?: 'IntellIno',
        'legal_form' => env('LEGAL_FORM'),             // ex. SARL, SAS, entreprise individuelle
        'capital' => env('LEGAL_CAPITAL'),             // ex. 1 000 000 FCFA
        'registration' => env('LEGAL_REGISTRATION'),   // ex. RCCM, NIF / IFU
        'address' => env('LEGAL_ADDRESS'),
        'country' => env('LEGAL_COUNTRY'),
        'director' => env('LEGAL_DIRECTOR'),           // responsable de la publication
        'host_name' => env('LEGAL_HOST_NAME'),         // hébergeur du site
        'host_address' => env('LEGAL_HOST_ADDRESS'),
        'privacy_email' => env('LEGAL_PRIVACY_EMAIL') ?: (env('INTELLINO_EMAIL') ?: 'contact@intellino.tech'),
        'retention_months' => env('LEGAL_RETENTION_MONTHS'), // durée de conservation des messages de contact
        'law' => env('LEGAL_LAW'),                     // loi de protection des données applicable
        'updated_at' => env('LEGAL_UPDATED_AT') ?: '2026-09-24',
    ],
];
