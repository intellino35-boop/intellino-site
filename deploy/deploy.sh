#!/usr/bin/env bash
# Mise à jour du site sur un VPS, depuis la racine du dépôt : bash deploy/deploy.sh
# Prérequis : PHP 8.3+, Composer, Node.js 20+, MySQL,
#             backend/.env (copie de backend/.env.production.example) et frontend-ui/.env (VITE_API_URL=https://api…/api).
set -euo pipefail

cd "$(dirname "$0")/.."

[ -f backend/.env ] || { echo "backend/.env introuvable : copiez backend/.env.production.example et complétez-le." >&2; exit 1; }
[ -f frontend-ui/.env ] || { echo "frontend-ui/.env introuvable : créez-le avec VITE_API_URL=https://api.votre-domaine.com/api" >&2; exit 1; }

echo "→ API en maintenance"
php backend/artisan down --retry=30 || true
# Sortie de maintenance garantie, même si une étape échoue.
trap 'php backend/artisan up' EXIT

if [ -d .git ]; then
    echo "→ Récupération du code"
    git pull --ff-only
fi

echo "→ Backend : dépendances PHP"
(cd backend && composer install --no-dev --optimize-autoloader --no-interaction)

echo "→ Backend : base de données"
php backend/artisan migrate --force

echo "→ Backend : mise en cache (configuration, routes, événements)"
php backend/artisan optimize

echo "→ Front : dépendances et compilation"
(cd frontend-ui && npm ci && npm run build)

echo "✓ Déploiement terminé — front : frontend-ui/dist, API : backend/public"
