# Mise en ligne du site IntellIno (API Laravel + front React)

Le site est composé de **deux parties** à héberger séparément, idéalement sur deux adresses :

| Partie | Exemple d'adresse | Contenu | Racine web |
|---|---|---|---|
| Front React | `https://www.votre-domaine.com` | fichiers statiques compilés | le dossier `frontend` de l'archive (ou `frontend-ui/dist`) |
| API Laravel | `https://api.votre-domaine.com` | PHP + MySQL | le dossier `backend/public` |

## Prérequis chez l'hébergeur

- **PHP 8.3+** (extensions `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `fileinfo`, `bcmath`, `curl`)
- **MySQL 5.7+ ou MariaDB 10.3+**
- **HTTPS** sur les deux adresses (Let's Encrypt, gratuit chez la plupart des hébergeurs)
- La possibilité de créer un **sous-domaine** (`api.`) pointant vers un dossier choisi

---

## Option A — Hébergement mutualisé (cPanel, Hostinger, o2switch…)

> **Hébergement web OVH : suivez le guide dédié [DEPLOIEMENT-OVH-WEB.md](DEPLOIEMENT-OVH-WEB.md)** (multisite, `.ovhconfig`, `.env` pré-rempli).

### 1. Préparer l'archive (sur votre PC)

Depuis la racine du dépôt, en indiquant l'adresse **de production** de l'API :

```powershell
powershell -ExecutionPolicy Bypass -File deploy\package.ps1 -ApiUrl https://api.votre-domaine.com/api -WithDatabase
```

Résultat : `dist\intellino-AAAAMMJJ-HHMM.zip` avec `frontend\` (site compilé) et `backend\` (API + dépendances + export SQL).
Aucun fichier `.env` n'est inclus.

### 2. Base de données

Dans le panneau de l'hébergeur : créez une base MySQL, un utilisateur, et donnez-lui tous les droits sur la base.

### 3. API (sous-domaine `api.`)

1. Créez le sous-domaine `api.votre-domaine.com` et faites pointer sa racine sur **`…/backend/public`**.
2. Envoyez le dossier `backend` de l'archive (hors de `public_html`).
3. Copiez `backend/.env.production.example` en **`backend/.env`** et complétez :
   - `APP_URL=https://api.votre-domaine.com`
   - `FRONTEND_URL=https://www.votre-domaine.com,https://votre-domaine.com` (origines autorisées par le CORS)
   - `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, puis l'e-mail (`MAIL_*`)
4. Dans le Terminal, depuis `backend/` :

```bash
php artisan key:generate
php artisan migrate --force
php artisan optimize
php artisan intellino:admin votre@email.com --password="un-mot-de-passe-solide"
```

Sans Terminal : importez `backend/database/intellino.sql` dans phpMyAdmin et reprenez l'`APP_KEY` de votre `.env` local.

5. Vérifiez : `https://api.votre-domaine.com/api/home` doit renvoyer du JSON (`"status": true`).

### 4. Front (domaine principal)

Envoyez **le contenu** du dossier `frontend` de l'archive dans `public_html`. Le fichier `.htaccess` fourni renvoie toutes les adresses vers `index.html` (nécessaire au routage React). Ouvrez `https://www.votre-domaine.com` : les données doivent s'afficher.

> L'adresse de l'API est intégrée au front lors de la compilation : si elle change, relancez `package.ps1` avec la nouvelle `-ApiUrl`.

### Mettre à jour plus tard

Relancez `package.ps1` (sans `-WithDatabase`), renvoyez `frontend` et `backend` **sans écraser** `backend/.env`, `backend/storage/` ni `backend/public/images/uploads/`, puis `php artisan migrate --force` et `php artisan optimize`.

---

## Option B — VPS (Ubuntu / Debian)

> **VPS OVH : suivez le guide dédié [DEPLOIEMENT-OVH.md](DEPLOIEMENT-OVH.md)**, avec installation automatisée du serveur (`deploy/ovh/setup-server.sh`).

```bash
sudo apt install nginx mysql-server php8.3-fpm php8.3-mysql php8.3-mbstring php8.3-xml php8.3-curl php8.3-bcmath unzip
# + Composer (getcomposer.org) et Node.js 20+ (nodesource.com)

cd /var/www && git clone <votre-dépôt> intellino && cd intellino
cp backend/.env.production.example backend/.env && nano backend/.env    # APP_URL, FRONTEND_URL, DB_*, MAIL_*
php backend/artisan key:generate
echo "VITE_API_URL=https://api.votre-domaine.com/api" > frontend-ui/.env
sudo chown -R www-data:www-data backend/storage backend/bootstrap/cache backend/public/images/uploads

bash deploy/deploy.sh
php backend/artisan intellino:admin votre@email.com --password="un-mot-de-passe-solide"
```

Serveur web : adaptez `deploy/nginx.conf.example` (deux blocs : front + API), puis `sudo certbot --nginx` pour le HTTPS.
Chaque mise à jour : `bash deploy/deploy.sh`.

---

## Checklist après la mise en ligne

- [ ] `https://www.votre-domaine.com` s'affiche avec les données (solutions, produits…)
- [ ] `https://api.votre-domaine.com/api/home` renvoie du JSON ; `APP_DEBUG=false` dans `backend/.env`
- [ ] Le formulaire de contact fonctionne ; le message apparaît dans `/admin/messages`
- [ ] Connexion à `https://www.votre-domaine.com/admin` avec votre compte administrateur
- [ ] La console du navigateur ne signale aucune erreur **CORS** (sinon : vérifier `FRONTEND_URL`, puis `php artisan optimize`)
- [ ] Mentions légales et Confidentialité sans « [À compléter] » (réglables dans *Admin → Paramètres*)
- [ ] Plan du site : `https://api.votre-domaine.com/sitemap.xml` (à déclarer dans Google Search Console) ; mettre son adresse dans `frontend/robots.txt`
- [ ] Sauvegardes automatiques de la base activées

## Bon à savoir

- **CORS** : seules les origines listées dans `FRONTEND_URL` peuvent appeler l'API depuis un navigateur. Ne jamais mettre `*`.
- **Sessions de l'administration** : jetons valables 8 h (30 jours avec « Se souvenir de moi »), réglables avec `ADMIN_TOKEN_HOURS` / `ADMIN_TOKEN_REMEMBER_DAYS`. Désactiver un compte révoque immédiatement ses jetons.
- **Images envoyées depuis l'admin** : stockées dans `backend/public/images/uploads/` (dossier accessible en écriture, à ne jamais supprimer lors d'une mise à jour).
- **Derrière Cloudflare** : ajoutez `TRUSTED_PROXIES=*` dans `backend/.env`.
- **Maintenance** : `php artisan down` / `php artisan up` (l'API répond alors 503).
- **Journaux d'erreurs** : `backend/storage/logs/`.
