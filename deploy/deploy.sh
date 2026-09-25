#!/usr/bin/env bash
# Mise à jour du site sur un VPS, à lancer depuis le dossier du projet : bash deploy/deploy.sh
# Prérequis : PHP 8.3+, Composer, Node.js 20+, MySQL, et un fichier .env de production déjà en place.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
    echo "Fichier .env introuvable : copiez .env.production.example en .env et complétez-le." >&2
    exit 1
fi

echo "→ Passage en maintenance"
php artisan down --retry=30 || true

# Sortie de maintenance garantie, même si une étape échoue.
trap 'php artisan up' EXIT

if [ -d .git ]; then
    echo "→ Récupération du code"
    git pull --ff-only
fi

echo "→ Dépendances PHP"
composer install --no-dev --optimize-autoloader --no-interaction

echo "→ Compilation du front-end"
npm ci
npm run build

echo "→ Base de données"
php artisan migrate --force

echo "→ Mise en cache (configuration, routes, vues)"
php artisan optimize

echo "✓ Déploiement terminé"
