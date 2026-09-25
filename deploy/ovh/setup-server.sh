#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  IntellIno — installation complète d'un VPS OVH (Ubuntu 24.04 / 22.04, Debian 12)
#
#  À lancer sur le serveur, en tant qu'utilisateur « ubuntu » (ou « debian ») avec sudo.
#  Le dépôt étant privé, le fichier est d'abord copié depuis votre PC (voir DEPLOIEMENT-OVH.md) :
#     scp deploy/ovh/setup-server.sh ubuntu@IP_DU_VPS:~
#     ssh ubuntu@IP_DU_VPS
#     sudo bash setup-server.sh --domain intellino.tech --email vous@exemple.com
#
#  Le script peut être relancé sans risque : chaque étape déjà faite est ignorée.
#
#  Options :
#    --domain       domaine du site, sans « www » (obligatoire)         ex. intellino.tech
#    --email        e-mail pour les certificats HTTPS Let's Encrypt (obligatoire)
#    --api-domain   domaine de l'API (défaut : api.<domain>)
#    --repo         dépôt Git (défaut : git@github.com:intellino35-boop/intellino-site.git)
#    --branch       branche à déployer (défaut : main)
#    --dir          dossier d'installation (défaut : /var/www/intellino)
#    --user         utilisateur propriétaire du code (défaut : celui qui a lancé sudo)
#    --no-seed      ne pas remplir la base avec le contenu initial du site
#    --skip-ssl     ne pas demander les certificats HTTPS (DNS pas encore prêt)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

DOMAIN=""
EMAIL=""
API_DOMAIN=""
REPO="git@github.com:intellino35-boop/intellino-site.git"
BRANCH="main"
APP_DIR="/var/www/intellino"
DEPLOY_USER="${SUDO_USER:-}"
SEED=1
SKIP_SSL=0
PHP_VERSION="8.3"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --domain) DOMAIN="$2"; shift 2 ;;
        --email) EMAIL="$2"; shift 2 ;;
        --api-domain) API_DOMAIN="$2"; shift 2 ;;
        --repo) REPO="$2"; shift 2 ;;
        --branch) BRANCH="$2"; shift 2 ;;
        --dir) APP_DIR="$2"; shift 2 ;;
        --user) DEPLOY_USER="$2"; shift 2 ;;
        --no-seed) SEED=0; shift ;;
        --skip-ssl) SKIP_SSL=1; shift ;;
        -h|--help) sed -n '2,24p' "$0"; exit 0 ;;
        *) echo "Option inconnue : $1 (voir --help)" >&2; exit 1 ;;
    esac
done

# ─── Affichage ────────────────────────────────────────────────
step() { printf '\n\033[1;36m→ %s\033[0m\n' "$*"; }
ok() { printf '\033[1;32m✓ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m! %s\033[0m\n' "$*"; }
fail() { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

# Commande exécutée en tant qu'utilisateur propriétaire du code (jamais root).
as_user() { sudo -u "$DEPLOY_USER" -H bash -c "cd '$APP_DIR' && $*"; }

# ─── Vérifications ────────────────────────────────────────────
[[ $EUID -eq 0 ]] || fail "Lancez ce script avec sudo : sudo bash $0 --domain … --email …"
[[ -n "$DOMAIN" ]] || fail "Option --domain obligatoire (ex. --domain intellino.tech)."
[[ -n "$EMAIL" ]] || fail "Option --email obligatoire (utilisée pour les certificats HTTPS)."
[[ "$DOMAIN" =~ ^[a-z0-9.-]+\.[a-z]{2,}$ ]] || fail "Domaine invalide : $DOMAIN (sans http:// ni www)."
[[ -n "$DEPLOY_USER" && "$DEPLOY_USER" != "root" ]] || fail "Lancez le script avec sudo depuis votre utilisateur (ex. ubuntu), ou précisez --user."
id "$DEPLOY_USER" &>/dev/null || fail "Utilisateur inconnu : $DEPLOY_USER"
API_DOMAIN="${API_DOMAIN:-api.$DOMAIN}"

# shellcheck source=/dev/null
. /etc/os-release
case "${ID}:${VERSION_ID}" in
    ubuntu:24.04|ubuntu:22.04|debian:12) ;;
    *) fail "Système non pris en charge : $PRETTY_NAME. Choisissez Ubuntu 24.04 lors de l'installation du VPS." ;;
esac

echo "Installation IntellIno"
echo "  Site : https://$DOMAIN (et www.$DOMAIN)"
echo "  API  : https://$API_DOMAIN"
echo "  Code : $APP_DIR (utilisateur $DEPLOY_USER, branche $BRANCH)"
export DEBIAN_FRONTEND=noninteractive

# ─── 0. Mémoire d'échange (petits VPS) ────────────────────────
# Sur un VPS de 2 Go de RAM, la compilation du front peut manquer de mémoire : 2 Go de swap par sécurité.
if [[ "$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)" -lt 3500 ]] && ! swapon --show | grep -q .; then
    step "Création d'un fichier d'échange de 2 Go"
    fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile >/dev/null && swapon /swapfile
    grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
    ok "Swap activé"
fi

# ─── 1. Paquets système ───────────────────────────────────────
step "Mise à jour du système et paquets de base"
apt-get update -q
apt-get upgrade -yq
apt-get install -yq nginx git unzip curl ca-certificates gnupg acl ufw fail2ban cron \
    certbot python3-certbot-nginx dnsutils mysql-server 2>/dev/null \
    || apt-get install -yq nginx git unzip curl ca-certificates gnupg acl ufw fail2ban cron \
        certbot python3-certbot-nginx dnsutils default-mysql-server
ok "Paquets de base installés"

# ─── 2. PHP 8.3 ───────────────────────────────────────────────
step "PHP $PHP_VERSION"
if ! command -v "php$PHP_VERSION" &>/dev/null; then
    if [[ "$ID:$VERSION_ID" == "ubuntu:22.04" ]]; then
        apt-get install -yq software-properties-common
        add-apt-repository -y ppa:ondrej/php
    elif [[ "$ID" == "debian" ]]; then
        curl -fsSL https://packages.sury.org/php/apt.gpg -o /usr/share/keyrings/sury-php.gpg
        echo "deb [signed-by=/usr/share/keyrings/sury-php.gpg] https://packages.sury.org/php/ $VERSION_CODENAME main" \
            > /etc/apt/sources.list.d/sury-php.list
    fi
    apt-get update -q
fi
apt-get install -yq "php$PHP_VERSION-fpm" "php$PHP_VERSION-cli" "php$PHP_VERSION-mysql" "php$PHP_VERSION-mbstring" \
    "php$PHP_VERSION-xml" "php$PHP_VERSION-curl" "php$PHP_VERSION-bcmath" "php$PHP_VERSION-intl" \
    "php$PHP_VERSION-zip" "php$PHP_VERSION-gd"

# Envoi du logo / de l'image d'accueil depuis l'admin (4 Mo max côté application).
cat > "/etc/php/$PHP_VERSION/fpm/conf.d/99-intellino.ini" <<'INI'
upload_max_filesize = 8M
post_max_size = 10M
memory_limit = 256M
expose_php = Off
INI
systemctl enable --now "php$PHP_VERSION-fpm" >/dev/null
systemctl restart "php$PHP_VERSION-fpm"
PHP_SOCK="/run/php/php$PHP_VERSION-fpm.sock"
ok "$(php -v | head -n1)"

# ─── 3. Composer ──────────────────────────────────────────────
step "Composer"
if ! command -v composer &>/dev/null; then
    EXPECTED="$(curl -fsSL https://composer.github.io/installer.sig)"
    curl -fsSL https://getcomposer.org/installer -o /tmp/composer-setup.php
    ACTUAL="$(php -r "echo hash_file('sha384', '/tmp/composer-setup.php');")"
    [[ "$EXPECTED" == "$ACTUAL" ]] || fail "Somme de contrôle de l'installateur Composer invalide."
    php /tmp/composer-setup.php --quiet --install-dir=/usr/local/bin --filename=composer
    rm -f /tmp/composer-setup.php
fi
ok "$(composer --version --no-ansi 2>/dev/null | head -n1)"

# ─── 4. Node.js 22 (compilation du front) ─────────────────────
step "Node.js 22"
if ! command -v node &>/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - >/dev/null
    apt-get install -yq nodejs
fi
ok "Node $(node -v), npm $(npm -v)"

# ─── 5. Pare-feu et protection SSH ────────────────────────────
step "Pare-feu (UFW) et fail2ban"
ufw allow OpenSSH >/dev/null
ufw allow 'Nginx Full' >/dev/null
ufw --force enable >/dev/null
systemctl enable --now fail2ban >/dev/null
ok "Ports ouverts : SSH (22), HTTP (80), HTTPS (443)"

# ─── 6. Base de données MySQL ─────────────────────────────────
step "Base de données MySQL"
systemctl enable --now mysql >/dev/null 2>&1 || systemctl enable --now mariadb >/dev/null 2>&1
DB_NAME="intellino"
DB_USER="intellino"
DB_SECRET_FILE="/root/.intellino-db"
if [[ -f "$DB_SECRET_FILE" ]]; then
    DB_PASS="$(cat "$DB_SECRET_FILE")"
else
    DB_PASS="$(openssl rand -base64 32 | tr -dc 'A-Za-z0-9' | head -c 32)"
    install -m 600 /dev/null "$DB_SECRET_FILE"
    printf '%s' "$DB_PASS" > "$DB_SECRET_FILE"
fi
mysql <<SQL
CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
ALTER USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
SQL
ok "Base « $DB_NAME » et utilisateur « $DB_USER » prêts (mot de passe généré, conservé dans $DB_SECRET_FILE)"

# ─── 7. Code source (dépôt Git privé : clé de déploiement) ────
step "Code source"
USER_HOME="$(getent passwd "$DEPLOY_USER" | cut -d: -f6)"
KEY="$USER_HOME/.ssh/intellino_deploy"
if [[ "$REPO" == git@github.com:* ]]; then
    sudo -u "$DEPLOY_USER" mkdir -p "$USER_HOME/.ssh"
    chmod 700 "$USER_HOME/.ssh"
    if [[ ! -f "$KEY" ]]; then
        sudo -u "$DEPLOY_USER" ssh-keygen -t ed25519 -N "" -C "intellino-deploy@$(hostname)" -f "$KEY" -q
    fi
    sudo -u "$DEPLOY_USER" bash -c "ssh-keyscan -H github.com >> '$USER_HOME/.ssh/known_hosts' 2>/dev/null; sort -u -o '$USER_HOME/.ssh/known_hosts' '$USER_HOME/.ssh/known_hosts'"
    if ! grep -q "intellino_deploy" "$USER_HOME/.ssh/config" 2>/dev/null; then
        printf 'Host github.com\n    IdentityFile %s\n    IdentitiesOnly yes\n' "$KEY" | sudo -u "$DEPLOY_USER" tee -a "$USER_HOME/.ssh/config" >/dev/null
        chmod 600 "$USER_HOME/.ssh/config"
    fi
    if ! sudo -u "$DEPLOY_USER" -H git ls-remote "$REPO" &>/dev/null; then
        warn "Le serveur n'a pas encore accès au dépôt privé. Ajoutez cette clé de déploiement sur GitHub :"
        echo "   GitHub → dépôt → Settings → Deploy keys → Add deploy key (lecture seule, NE PAS cocher « Allow write access »)"
        echo
        cat "$KEY.pub"
        echo
        fail "Puis relancez exactement la même commande."
    fi
fi
mkdir -p "$APP_DIR"
chown "$DEPLOY_USER":"$DEPLOY_USER" "$APP_DIR"
if [[ ! -d "$APP_DIR/.git" ]]; then
    sudo -u "$DEPLOY_USER" -H git clone --branch "$BRANCH" "$REPO" "$APP_DIR"
else
    as_user "git fetch --quiet origin && git checkout --quiet '$BRANCH' && git pull --ff-only --quiet"
fi
ok "Code à jour ($(as_user 'git log -1 --format="%h %s"'))"

# ─── 8. Configuration (.env) ──────────────────────────────────
step "Configuration de l'API et du front"
ENV_FILE="$APP_DIR/backend/.env"
FIRST_INSTALL=0
if [[ ! -f "$ENV_FILE" ]]; then
    FIRST_INSTALL=1
    as_user "cp backend/.env.production.example backend/.env"
fi
set_env() { # set_env CLÉ VALEUR : remplace ou ajoute la ligne dans backend/.env
    local key="$1" value="$2"
    if grep -q "^${key}=" "$ENV_FILE"; then
        sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
    else
        echo "${key}=${value}" >> "$ENV_FILE"
    fi
}
set_env APP_ENV production
set_env APP_DEBUG false
set_env APP_URL "https://$API_DOMAIN"
set_env FRONTEND_URL "https://$DOMAIN,https://www.$DOMAIN"
set_env DB_HOST localhost # socket local : correspond au compte MySQL 'intellino'@'localhost'
set_env DB_DATABASE "$DB_NAME"
set_env DB_USERNAME "$DB_USER"
set_env DB_PASSWORD "$DB_PASS"
chown "$DEPLOY_USER":"$DEPLOY_USER" "$ENV_FILE"
chmod 640 "$ENV_FILE"
setfacl -m u:www-data:r "$ENV_FILE"
echo "VITE_API_URL=https://$API_DOMAIN/api" | sudo -u "$DEPLOY_USER" tee "$APP_DIR/frontend-ui/.env" >/dev/null
ok "backend/.env et frontend-ui/.env configurés (le mot de passe de la base n'est affiché nulle part)"

# ─── 9. Droits d'écriture (utilisateur + serveur web) ─────────
step "Droits d'écriture"
as_user "mkdir -p backend/storage/framework/{cache/data,sessions,views} backend/storage/logs backend/bootstrap/cache backend/public/images/uploads"
for dir in backend/storage backend/bootstrap/cache backend/public/images/uploads; do
    # ACL : PHP (www-data) et l'utilisateur de déploiement peuvent tous deux écrire, y compris dans les nouveaux fichiers.
    setfacl -R -m "u:www-data:rwX,u:$DEPLOY_USER:rwX" "$APP_DIR/$dir"
    setfacl -R -d -m "u:www-data:rwX,u:$DEPLOY_USER:rwX" "$APP_DIR/$dir"
done
ok "storage/, bootstrap/cache/ et images/uploads/ accessibles en écriture"

# ─── 10. Installation de l'application ────────────────────────
step "Installation de l'API (Composer, clé, migrations)"
as_user "cd backend && composer install --no-dev --optimize-autoloader --no-interaction --no-progress"
if ! grep -q '^APP_KEY=base64:' "$ENV_FILE"; then
    as_user "php backend/artisan key:generate --force"
fi
as_user "php backend/artisan migrate --force"
if [[ $FIRST_INSTALL -eq 1 && $SEED -eq 1 ]]; then
    as_user "php backend/artisan db:seed --force"
    ok "Contenu initial du site importé (solutions, produits, blocs…)"
fi
as_user "php backend/artisan optimize"

step "Compilation du front React"
as_user "cd frontend-ui && npm ci --no-audit --no-fund && npm run build"
ok "Front compilé dans $APP_DIR/frontend-ui/dist"

# ─── 11. Nginx ────────────────────────────────────────────────
step "Nginx (site + API)"
TEMPLATE="$APP_DIR/deploy/ovh/nginx.conf.template"
NGINX_SITE="/etc/nginx/sites-available/intellino"
if [[ -f "$NGINX_SITE" ]] && grep -q "managed by Certbot" "$NGINX_SITE"; then
    # Déjà configuré avec HTTPS : on ne réécrit pas le fichier (les blocs ajoutés par Certbot seraient perdus).
    warn "Configuration Nginx existante avec HTTPS conservée ($NGINX_SITE)."
else
    sed -e "s|__DOMAIN__|$DOMAIN|g" -e "s|__API_DOMAIN__|$API_DOMAIN|g" \
        -e "s|__APP_DIR__|$APP_DIR|g" -e "s|__PHP_SOCK__|$PHP_SOCK|g" \
        "$TEMPLATE" > "$NGINX_SITE"
fi
ln -sf /etc/nginx/sites-available/intellino /etc/nginx/sites-enabled/intellino
rm -f /etc/nginx/sites-enabled/default
nginx -t -q
systemctl reload nginx
ok "Nginx configuré"

# ─── 12. HTTPS (Let's Encrypt) ────────────────────────────────
step "Certificats HTTPS"
SERVER_IP="$(curl -4 -fsS --max-time 10 https://api.ipify.org || hostname -I | awk '{print $1}')"
DNS_OK=1
for host in "$DOMAIN" "www.$DOMAIN" "$API_DOMAIN"; do
    resolved="$(dig +short A "$host" | tail -n1)"
    if [[ "$resolved" != "$SERVER_IP" ]]; then
        warn "$host pointe vers « ${resolved:-rien} » au lieu de $SERVER_IP (enregistrement DNS A à créer ou en cours de propagation)."
        DNS_OK=0
    fi
done
if [[ $SKIP_SSL -eq 1 ]]; then
    warn "HTTPS ignoré (--skip-ssl)."
elif [[ $DNS_OK -eq 1 ]]; then
    certbot --nginx --non-interactive --agree-tos --redirect -m "$EMAIL" \
        -d "$DOMAIN" -d "www.$DOMAIN" -d "$API_DOMAIN"
    ok "HTTPS activé (renouvellement automatique)"
else
    warn "HTTPS non activé : corrigez le DNS chez OVH, attendez la propagation, puis relancez ce script."
fi

# ─── 13. Sauvegardes quotidiennes ─────────────────────────────
step "Sauvegardes"
cat > /etc/cron.d/intellino-backup <<CRON
# Sauvegarde quotidienne de la base et des images envoyées (conservées 14 jours dans /var/backups/intellino)
30 3 * * * root bash $APP_DIR/deploy/ovh/backup.sh >> /var/log/intellino-backup.log 2>&1
CRON
ok "Sauvegarde automatique tous les jours à 3 h 30 (/var/backups/intellino)"

# ─── Résumé ───────────────────────────────────────────────────
printf '\n\033[1;32m══════════ Installation terminée ══════════\033[0m\n'
echo "  Site  : https://$DOMAIN"
echo "  Admin : https://$DOMAIN/admin"
echo "  API   : https://$API_DOMAIN/api/home"
echo
echo "Créez votre compte administrateur (choisissez un mot de passe solide) :"
echo "  cd $APP_DIR && php backend/artisan intellino:admin votre@email.com --password=\"…\""
echo
echo "Mises à jour ensuite : cd $APP_DIR && bash deploy/deploy.sh"
