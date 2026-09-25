# IntellIno — Laravel API + React/Vite

Site vitrine et administration d'IntellIno, en deux projets séparés :

```
intellino-site/
├── backend/       # Laravel 13 : API REST, authentification (Sanctum), base MySQL, administration (API)
├── frontend-ui/   # React 19 + Vite : pages, composants, animations, appels API (Axios)
└── deploy/        # Script d'archive, script VPS, configuration Nginx, ovh/ (installation automatisée d'un VPS OVH)
```

| | Technologies |
|---|---|
| **Backend** | Laravel 13, Sanctum (jetons), MySQL, identifiants **UUID** sur toutes les tables de l'application |
| **Frontend** | React 19, Vite 8, React Router 8, Axios, Material UI 9, Tailwind CSS 4, Motion, Lucide, React Helmet |

## Lancer en local

**1. API (port 8000)**

```bash
cd backend
composer install
cp .env.example .env          # puis renseigner DB_* (base MySQL « intellino »)
php artisan key:generate
php artisan migrate --seed
php artisan intellino:admin votre@email.com --password="mot-de-passe-solide"
php artisan serve             # http://localhost:8000
```

**2. Front (port 5174)**

```bash
cd frontend-ui
npm install
cp .env.example .env          # VITE_API_URL=http://localhost:8000/api
npm run dev                   # http://localhost:5174
```

- Site : http://localhost:5174 — Administration : http://localhost:5174/admin
- API : http://localhost:8000/api (ex. `/api/home`, `/api/solutions`)

Le CORS n'autorise que l'origine indiquée par `FRONTEND_URL` dans `backend/.env` (par défaut `http://localhost:5174`).

## API

Toutes les réponses (succès et erreurs) suivent le format :

```json
{ "data": [], "message": "", "status": true }
```

+ `errors` (par champ) pour les erreurs de validation **422**, + `meta` pour les listes paginées.
Codes : **401** non connecté / jeton expiré, **403** rôle insuffisant, **404** introuvable, **422** validation, **429** trop de requêtes.

| Public | |
|---|---|
| `GET /api/home` | Données de l'accueil |
| `GET /api/solutions`, `/api/solutions/{slug}` | Solutions |
| `GET /api/products`, `/api/products/{slug}` | Produits |
| `GET /api/softwares`, `/api/softwares/{slug}` | Logiciels |
| `GET /api/realisations`, `/api/realisations/{slug}` | Réalisations |
| `GET /api/posts?categorie=&page=`, `/api/posts/{slug}` | Blog |
| `GET /api/lab/projects` | Projets du Technology Lab |
| `GET /api/blocks` | Blocs de textes des pages |
| `GET /api/settings` | Coordonnées, images, informations légales |
| `POST /api/contact` | Formulaire de contact (limité à 5/min) |

| Authentification | |
|---|---|
| `POST /api/auth/login` | Connexion → jeton (8 h, ou 30 j avec « Se souvenir de moi ») |
| `GET /api/auth/me`, `POST /api/auth/logout` | Session, déconnexion |

| Administration (`Authorization: Bearer <jeton>`) | Permission |
|---|---|
| `GET /api/admin/dashboard` | tous |
| `GET/PUT /api/admin/profile` | tous |
| `GET/PATCH/DELETE /api/admin/messages[/{uuid}]` | messages |
| `GET/POST/PUT/DELETE /api/admin/content/{type}[/{uuid}]` (+ `/schema`) | content / blocks |
| `GET /api/admin/blocks` | blocks |
| `GET/POST /api/admin/settings` | settings |
| `GET/POST/PUT/DELETE /api/admin/users[/{uuid}]`, `GET /api/admin/roles` | users |

Rôles (`backend/app/Support/Roles.php`) : **Administrateur** (tout), **Éditeur** (contenu + blocs), **Chargé de clientèle** (messages).

## Organisation du front

| Dossier | Rôle |
|---|---|
| `src/lib/axios.js` | Instance Axios unique : `VITE_API_URL`, jeton, gestion 401 / 403 / 422 / erreurs réseau |
| `src/services/` | Un service par domaine (produits, solutions, logiciels, réalisations, articles, contact, auth, admin) — aucun appel Axios dans les composants |
| `src/hooks/` | `useApi` (chargement / erreur / vide), `useForm`, `useAuth`, `useSite`, `useNotify` |
| `src/context/` | Fournisseurs : site (paramètres + blocs), authentification, notifications |
| `src/Pages/`, `src/Components/`, `src/Layouts/` | Pages (React Router, chargées à la demande), composants, mises en page |

## Tests et vérifications

```bash
cd backend && php artisan test        # base MySQL séparée « intellino_test »
cd frontend-ui && npm run lint && npm run build
```

## Mise en ligne

Voir **[DEPLOIEMENT.md](DEPLOIEMENT.md)** (hébergement mutualisé ou VPS), **[DEPLOIEMENT-OVH-WEB.md](DEPLOIEMENT-OVH-WEB.md)** (hébergement web OVH) et **[DEPLOIEMENT-OVH.md](DEPLOIEMENT-OVH.md)** (VPS OVH, installation automatisée).
