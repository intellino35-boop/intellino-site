# Mise en ligne du site IntellIno

## Prérequis chez l'hébergeur

- **PHP 8.3 ou plus récent**, avec les extensions : `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `fileinfo`, `bcmath`, `curl`
- **MySQL 5.7+ ou MariaDB 10.3+**
- Un certificat **HTTPS** (Let's Encrypt, gratuit chez la plupart des hébergeurs)
- Idéalement un accès **SSH / Terminal** (sinon, voir « Sans SSH » plus bas)

---

## Option A — Hébergement mutualisé (cPanel, Hostinger, o2switch, LWS…)

### 1. Préparer l'archive (sur votre PC)

Dans le dossier `intellino-site` :

```powershell
powershell -ExecutionPolicy Bypass -File deploy\package.ps1 -WithDatabase
```

Résultat : `dist\intellino-site-AAAAMMJJ-HHMM.zip` (front-end compilé, dépendances de production, export SQL). Il ne contient **pas** votre `.env`.

### 2. Créer la base de données

Dans le panneau de l'hébergeur (« Bases de données MySQL ») : créez une base, un utilisateur et donnez-lui tous les droits sur la base. Notez les trois informations.

### 3. Envoyer les fichiers

1. Envoyez le ZIP dans votre espace (gestionnaire de fichiers ou FTP), **à côté** de `public_html` et non dedans, puis décompressez-le. Vous obtenez un dossier `intellino-site/`.
2. Faites pointer le domaine sur **`intellino-site/public`** :
   - cPanel : *Domaines* → modifier la « racine du document » ;
   - si l'hébergeur ne le permet pas : décompressez dans `public_html` ; le fichier `.htaccess` fourni à la racine redirige automatiquement vers `public/` et protège les fichiers sensibles.

### 4. Configurer

1. Copiez `.env.production.example` en **`.env`** et complétez : `APP_URL`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, l'envoi d'e-mails (`MAIL_*`), vos coordonnées (`INTELLINO_*`) et vos informations légales (`LEGAL_*`).
2. Dans le Terminal de l'hébergeur, depuis `intellino-site/` :

```bash
php artisan key:generate
php artisan migrate --force
php artisan optimize
```

3. Créez (ou réinitialisez) votre compte administrateur :

```bash
php artisan intellino:admin votre@email.com --password="un-mot-de-passe-solide"
```

### Sans SSH ni Terminal

1. Dans **phpMyAdmin**, sélectionnez la base puis *Importer* le fichier `database/intellino.sql` (contenu du site + comptes admin existants ; aucun message de contact).
2. Dans `.env`, renseignez `APP_KEY` avec la valeur de votre `.env` local (ligne `APP_KEY=base64:…`).
3. Connectez-vous à `/admin` avec votre compte existant, puis changez le mot de passe dès que possible (demandez à l'hébergeur d'activer SSH pour les mises à jour futures).

> Sans `php artisan optimize`, le site fonctionne mais un peu moins vite.

### Mettre à jour le site plus tard

Relancez `deploy\package.ps1` (sans `-WithDatabase`), renvoyez les fichiers **sans écraser** `.env` ni `storage/`, puis exécutez `php artisan migrate --force` et `php artisan optimize`.

---

## Option B — VPS (Ubuntu / Debian)

```bash
# 1. Paquets
sudo apt install nginx mysql-server php8.3-fpm php8.3-mysql php8.3-mbstring php8.3-xml php8.3-curl php8.3-bcmath unzip
# + Composer (getcomposer.org) et Node.js 20+ (nodesource.com)

# 2. Code (via Git, ou envoi du ZIP dans /var/www puis unzip)
cd /var/www && git clone <votre-dépôt> intellino-site && cd intellino-site

# 3. Configuration
cp .env.production.example .env && nano .env
php artisan key:generate

# 4. Droits d'écriture
sudo chown -R www-data:www-data storage bootstrap/cache

# 5. Installation / mises à jour
bash deploy/deploy.sh
php artisan intellino:admin votre@email.com --password="un-mot-de-passe-solide"
```

Serveur web : adaptez `deploy/nginx.conf.example` (domaine, chemin, version de PHP), activez-le, puis installez le certificat HTTPS avec `sudo certbot --nginx`.

Chaque mise à jour ensuite : `bash deploy/deploy.sh` (maintenance automatique, dépendances, build, migrations, cache).

---

## Checklist après la mise en ligne

- [ ] Le site s'ouvre en **https://** et le cadenas s'affiche
- [ ] `APP_DEBUG=false` dans `.env` (sinon les erreurs affichent des informations sensibles)
- [ ] Le formulaire de contact fonctionne ; le message apparaît dans `/admin/messages`
- [ ] Si `INTELLINO_NOTIFY_EMAIL` est renseigné : l'e-mail de notification arrive bien
- [ ] Les pages **Mentions légales** et **Confidentialité** n'affichent plus de « [À compléter] »
- [ ] `https://votre-domaine/robots.txt` affiche `Disallow: /admin` et l'adresse du sitemap
- [ ] Soumettre `https://votre-domaine/sitemap.xml` dans Google Search Console
- [ ] Mot de passe administrateur fort et personnel
- [ ] Sauvegardes automatiques de la base activées chez l'hébergeur

## Bon à savoir

- **Paramètres modifiables en ligne** : coordonnées, informations légales, logo et image d'accueil se règlent dans `/admin/parametres` (prioritaires sur le `.env`). Le dossier `public/images/uploads/` doit être **accessible en écriture** par PHP (droits 755, propriétaire `www-data` sur un VPS).
- **Mises à jour** : ne supprimez jamais `public/images/uploads/` sur le serveur (il contient les images envoyées depuis l'admin).

- **Derrière Cloudflare** : ajoutez `TRUSTED_PROXIES=*` dans `.env`, sinon la limitation des envois du formulaire s'appliquerait à Cloudflare plutôt qu'aux visiteurs.
- **Logo et image d'accueil** : fichiers locaux `public/images/logo.png` (256×256, version pleine taille : `logo-1024.png`) et `public/images/hero.jpg`. Pour les changer, remplacez ces fichiers en gardant le même nom, ou indiquez un autre chemin avec `INTELLINO_LOGO` / `INTELLINO_HERO_IMAGE`.
- **Mode maintenance** : `php artisan down` / `php artisan up` (une page « Site en maintenance » s'affiche aux visiteurs).
- **Journaux d'erreurs** : `storage/logs/`.
