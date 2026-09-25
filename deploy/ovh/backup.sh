#!/usr/bin/env bash
# Sauvegarde de la base MySQL et des images envoyées depuis l'admin.
# Lancé chaque nuit par /etc/cron.d/intellino-backup (installé par setup-server.sh), ou à la main :
#   sudo bash /var/www/intellino/deploy/ovh/backup.sh
# Les sauvegardes de plus de 14 jours sont supprimées. Pensez aussi à l'option « Sauvegarde automatisée » d'OVH.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="$APP_DIR/backend/.env"
DEST="/var/backups/intellino"
KEEP_DAYS=14
STAMP="$(date +%Y%m%d-%H%M)"

[[ -f "$ENV_FILE" ]] || { echo "$(date -Is) backend/.env introuvable" >&2; exit 1; }

# Lit une valeur du .env (sans exécuter le fichier).
env_value() { grep -E "^$1=" "$ENV_FILE" | tail -n1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'; }

DB_NAME="$(env_value DB_DATABASE)"
DB_USER="$(env_value DB_USERNAME)"
DB_PASS="$(env_value DB_PASSWORD)"
DB_HOST="$(env_value DB_HOST)"

mkdir -p "$DEST"
chmod 700 "$DEST"

# Identifiants passés par un fichier temporaire (jamais visibles dans la liste des processus).
CNF="$(mktemp)"
trap 'rm -f "$CNF"' EXIT
printf '[client]\nuser=%s\npassword=%s\nhost=%s\n' "$DB_USER" "$DB_PASS" "${DB_HOST:-127.0.0.1}" > "$CNF"

mysqldump --defaults-extra-file="$CNF" --single-transaction --no-tablespaces --default-character-set=utf8mb4 "$DB_NAME" \
    | gzip -9 > "$DEST/base-$STAMP.sql.gz"

if [[ -d "$APP_DIR/backend/public/images/uploads" ]]; then
    tar -czf "$DEST/images-$STAMP.tar.gz" -C "$APP_DIR/backend/public/images" uploads
fi

find "$DEST" -type f -mtime +"$KEEP_DAYS" -delete
echo "$(date -Is) sauvegarde OK : $DEST/base-$STAMP.sql.gz"
