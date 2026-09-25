<?php

/*
| CORS : seul le front React (FRONTEND_URL) peut appeler l'API depuis un navigateur.
| Plusieurs origines possibles, séparées par des virgules (ex. https://intellino.tech,https://www.intellino.tech).
| Ne jamais mettre « * » en production.
*/

$origins = array_values(array_filter(array_map(
    fn (string $origin) => rtrim(trim($origin), '/'),
    explode(',', env('FRONTEND_URL') ?: 'http://localhost:5174'),
)));

return [

    // L'API uniquement (le sitemap et la santé /up ne sont pas appelés depuis le navigateur).
    'paths' => ['api/*'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => $origins,

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Accept', 'Authorization', 'Content-Type', 'X-Requested-With'],

    'exposed_headers' => ['Retry-After'],

    // Réponse aux requêtes préliminaires OPTIONS mise en cache 1 h par le navigateur.
    'max_age' => 3600,

    // Authentification par jeton (en-tête Authorization) : aucun cookie n'est échangé entre les domaines.
    'supports_credentials' => false,

];
