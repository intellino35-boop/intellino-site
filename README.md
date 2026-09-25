# Site IntellIno — Laravel + React + MySQL

Site vitrine IntellIno : Laravel 13, Inertia.js v3, React 19, Tailwind CSS v4, MySQL.

## Installation

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Créer la base puis la remplir :

```bash
mysql -u root -e "CREATE DATABASE intellino CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
php artisan migrate --seed
```

## Lancer en local

```bash
npm run build
php artisan serve
```

Pour le développement avec rechargement à chaud : `npm run dev` dans un second terminal.

## Mise en ligne

Voir **[DEPLOIEMENT.md](DEPLOIEMENT.md)** (hébergement mutualisé ou VPS). Archive prête à envoyer :

```powershell
powershell -ExecutionPolicy Bypass -File deploy\package.ps1 -WithDatabase
```

## Espace d'administration

Accessible sur `/admin` (pas d'inscription publique). Créer un compte ou réinitialiser son mot de passe :

```bash
php artisan intellino:admin email@exemple.com --password="votre-mot-de-passe"
```

Sans `--password`, un mot de passe aléatoire est généré et affiché.

- **Utilisateurs et rôles** (`/admin/utilisateurs`, réservé aux administrateurs) : trois rôles définis dans `app/Support/Roles.php` — *Administrateur* (tout), *Éditeur* (contenu + blocs des pages), *Chargé de clientèle* (messages). Comptes activables/désactivables ; impossible de supprimer, rétrograder ou désactiver son propre compte. Chaque utilisateur modifie ses informations dans « Mon compte ». La commande `intellino:admin` crée toujours un administrateur actif (utile pour récupérer l'accès).
- **Messages** : liste filtrable (tous / non lus / lus), recherche, lecture (marque automatiquement comme lu), réponse par e-mail, suppression.
- **Contenu** : ajout / modification / suppression des solutions, produits, logiciels, réalisations et articles, avec lien « Voir sur le site ». Les champs de chaque type sont définis dans `app/Support/AdminResources.php`.
- **Blocs des pages** (`/admin/blocs`) : les 15 listes de textes des pages (chiffres clés, domaines, secteurs, valeurs, FAQ, étapes et axes du Lab, démarche…), stockées dans la table `site_blocks` et mises en cache.
- **Paramètres** (`/admin/parametres`) : coordonnées, e-mail de notification, informations légales, logo et image d'accueil (envoyés dans `public/images/uploads/`). Ils remplacent les valeurs du `.env` ; un champ vidé revient à la valeur du `.env`.

## Tests

Les tests utilisent une base MySQL séparée `intellino_test` (vidée à chaque exécution) :

```bash
mysql -u root -e "CREATE DATABASE intellino_test"
php artisan test
```

## Structure

| Élément | Emplacement |
| --- | --- |
| Routes | `routes/web.php` |
| Page d'accueil (données MySQL) | `app/Http/Controllers/HomeController.php` → `resources/js/Pages/Home.jsx` |
| Formulaire de contact (enregistré dans `contact_messages`) | `app/Http/Controllers/ContactController.php`, `resources/js/Components/ContactForm.jsx` |
| Pages « bientôt disponible » | `resources/js/Pages/ComingSoon.jsx` |
| Menu / pied de page | `resources/js/Components/Navbar.jsx`, `Footer.jsx`, `resources/js/data/navigation.js` |
| Contenu initial | `database/seeders/ContentSeeder.php` |
| Téléphone, WhatsApp, e-mail, logo | `.env` : `INTELLINO_PHONE`, `INTELLINO_WHATSAPP`, `INTELLINO_EMAIL`, `INTELLINO_LOCATION`, `INTELLINO_LOGO` |

Tables MySQL (identifiants UUID) : `solutions`, `products`, `softwares`, `realisations`, `posts`, `contact_messages`, `site_blocks`, `settings`, `users`.
