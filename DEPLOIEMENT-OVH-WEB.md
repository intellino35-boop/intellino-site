# Mise en ligne sur l'hébergement web OVH (test.intellino.tech)

Guide pour publier IntellIno sur un **hébergement web OVH** (offres Perso, Pro, Performance), d'abord en test :

| Partie | Adresse | Dossier sur l'hébergement |
|---|---|---|
| Site (React) | `https://test.intellino.tech` | `test-intellino/` |
| Administration | `https://test.intellino.tech/admin` | *(même dossier)* |
| API (Laravel) | `https://api.test.intellino.tech` | `test-intellino-api/` (racine web : `test-intellino-api/public`) |

Le site actuel (`intellino.tech`, dossier `www/`) n'est **pas touché**. Le site de test est marqué « ne pas indexer ».

> Pour un **VPS** OVH, suivez plutôt [DEPLOIEMENT-OVH.md](DEPLOIEMENT-OVH.md).

---

## Étape 1 — Préparer l'archive (sur votre PC)

MySQL local démarré, depuis la racine du dépôt (PowerShell) :

```powershell
powershell -ExecutionPolicy Bypass -File deploy\package.ps1 -ApiUrl https://api.test.intellino.tech/api -FrontendUrl https://test.intellino.tech -Ovh -NoIndex -WithDatabase
```

Résultat : `dist\intellino-AAAAMMJJ-HHMM.zip`. Décompressez-le : il contient

- `intellino\frontend\` : le site compilé (déjà relié à `https://api.test.intellino.tech/api`, non indexé) ;
- `intellino\backend\` : l'API avec ses dépendances, et
  - `.env.a-completer` : configuration de production **déjà remplie** (adresses, CORS, clé de chiffrement générée) ;
  - `public\.ovhconfig` : demande PHP 8.3 à OVH pour l'API ;
  - `database\intellino.sql` : structure et contenu de votre base locale (solutions, produits, blog, blocs, paramètres,
    **comptes admin**) — sans les messages de contact.

## Étape 2 — Créer la base de données

Espace client OVH → *Web Cloud* → *Hébergements* → votre hébergement → onglet **Bases de données** → **Créer une base
de données** : type **MySQL 8.0**, choisissez l'identifiant et un mot de passe solide.

Quand elle est prête, notez :

| Information | Où la trouver | Ligne du `.env` |
|---|---|---|
| Adresse du serveur (ex. `intellixxx.mysql.db`) | colonne « Adresse du serveur » | `DB_HOST` |
| Nom de la base | colonne « Nom de la base » | `DB_DATABASE` |
| Utilisateur (souvent identique au nom) | colonne « Utilisateur » | `DB_USERNAME` |
| Mot de passe | celui choisi à la création | `DB_PASSWORD` |

Puis importez le contenu : menu **…** de la base → **Accéder à phpMyAdmin** → connectez-vous → onglet **Importer** →
fichier `backend\database\intellino.sql` → **Importer**.
(Autre possibilité : menu **…** → **Importer un fichier** dans l'espace client.)

## Étape 3 — Compléter la configuration de l'API

Ouvrez `backend\.env.a-completer` (Bloc-notes) et renseignez :

```dotenv
DB_HOST=intellixxx.mysql.db
DB_DATABASE=…
DB_USERNAME=…
DB_PASSWORD=…
```

Pour recevoir les messages de contact par e-mail (facultatif, possible plus tard) : `MAIL_HOST=ssl0.ovh.net`,
`MAIL_PORT=587`, `MAIL_USERNAME` / `MAIL_PASSWORD` = une adresse e-mail OVH (ex. `no-reply@intellino.tech`) et son mot
de passe, `MAIL_FROM_ADDRESS` = cette même adresse, `INTELLINO_NOTIFY_EMAIL` = l'adresse qui reçoit les copies.

Enregistrez, puis **renommez le fichier en `.env`** (exactement, sans extension).

> Le Bloc-notes peut ajouter `.txt` : dans l'Explorateur, activez *Affichage → Extensions de noms de fichiers* pour vérifier.

## Étape 4 — Envoyer les fichiers (FTP)

Identifiants : onglet **FTP - SSH** de l'hébergement (serveur `ftp.clusterXXX.hosting.ovh.net`, identifiant ; mot de
passe modifiable au même endroit). Logiciel conseillé : [FileZilla](https://filezilla-project.org/) (port 21, ou SFTP).

À la **racine** de l'hébergement (au même niveau que `www/`, pas dedans), créez deux dossiers et envoyez :

| Sur votre PC | Vers l'hébergement |
|---|---|
| **le contenu** de `intellino\frontend\` (dont `.htaccess`) | `test-intellino/` |
| **le contenu** de `intellino\backend\` (dont `.env`, `.htaccess`, `vendor\`) | `test-intellino-api/` |

- L'envoi de `vendor\` (plusieurs milliers de petits fichiers) prend 10 à 20 minutes.
- Vérifiez que les fichiers commençant par un point (`.env`, `.htaccess`, `.ovhconfig`) sont bien présents
  (FileZilla : *Serveur → Forcer l'affichage des fichiers cachés*).

> **Offre avec SSH (Pro, Performance)** : plus rapide, envoyez seulement le ZIP puis, en SSH :
> `unzip intellino-*.zip && mv intellino/frontend test-intellino && mv intellino/backend test-intellino-api`
> (le `.env` complété à l'étape 3 est à envoyer ensuite dans `test-intellino-api/`).

## Étape 5 — Relier les adresses aux dossiers (multisite)

Onglet **Multisite** de l'hébergement :

1. **`test.intellino.tech`** (déjà créé) : icône **…** → **Modifier le domaine** → dossier racine **`test-intellino`**,
   cochez **SSL**.
2. **Ajouter un domaine ou sous-domaine** → *Sélectionner un domaine enregistré chez OVHcloud* → `intellino.tech` →
   sous-domaine **`api.test`** → dossier racine **`test-intellino-api/public`** → cochez **SSL** → laissez OVH
   **configurer automatiquement la zone DNS** → **Valider**.

Puis onglet **Informations générales** → *Certificat SSL* → **…** → **Regénérer le certificat SSL**, pour y inclure
les deux adresses. La prise en compte (DNS + certificat) peut prendre **jusqu'à quelques heures**.

## Étape 6 — Vérifications

- [ ] `https://api.test.intellino.tech/api/home` affiche du JSON commençant par `{"data":`
- [ ] `https://test.intellino.tech` affiche le site avec ses contenus, cadenas HTTPS présent
- [ ] `https://test.intellino.tech/solutions` (ou une autre page) s'ouvre aussi en rechargeant la page (F5)
- [ ] `https://test.intellino.tech/admin` : connexion avec **votre compte admin local** (importé avec la base)
- [ ] Formulaire de contact : le message apparaît dans *Admin → Messages*
- [ ] Aucune erreur **CORS** dans la console du navigateur (F12)

Ensuite, par sécurité :

- **changez tout de suite le mot de passe admin** (*Admin → Mon compte*, en bas du menu) : c'est celui de votre site local ;
- supprimez `test-intellino-api/database/intellino.sql` de l'hébergement (il contient les comptes).

---

## Mettre à jour le site de test

1. Relancez la commande de l'étape 1 **sans `-WithDatabase`**.
2. Envoyez `frontend\` dans `test-intellino/` (supprimez d'abord l'ancien dossier `assets/` sur le serveur).
3. Envoyez `backend\` dans `test-intellino-api/` **sans écraser** : `.env`, `storage/`, `public/images/uploads/`
   (et ne renvoyez pas `.env.a-completer`).
4. Si la mise à jour ajoute des tables ou des colonnes (nouvelle migration), il faut les appliquer : en SSH
   `cd test-intellino-api && php artisan migrate --force` ; sans SSH, demandez-moi le fichier SQL correspondant.

## Passage en production (intellino.tech)

Quand le test vous convient :

1. Préparez une nouvelle archive avec les adresses définitives :
   ```powershell
   powershell -ExecutionPolicy Bypass -File deploy\package.ps1 -ApiUrl https://api.intellino.tech/api -FrontendUrl "https://intellino.tech,https://www.intellino.tech" -Ovh
   ```
   (sans `-NoIndex` pour que Google référence le site ; sans `-WithDatabase` pour garder la base du test.)
2. Envoyez **le contenu** de `frontend\` dans un nouveau dossier `intellino-front/` (l'API, elle, reste dans
   `test-intellino-api/` : inutile de la renvoyer).
3. Dans `test-intellino-api/.env` : `APP_URL=https://api.intellino.tech` et
   `FRONTEND_URL=https://intellino.tech,https://www.intellino.tech`, puis supprimez les fichiers de
   `bootstrap/cache/` (sauf `.gitignore`) pour que la nouvelle configuration soit lue.
4. **Multisite** : `intellino.tech` et `www.intellino.tech` → dossier `intellino-front` ; ajoutez `api.intellino.tech`
   → dossier `test-intellino-api/public` ; SSL coché partout, puis **Regénérer le certificat SSL**.
   Si `intellino.tech` pointe aujourd'hui ailleurs qu'à cet hébergement, modifiez ses entrées **A** (`@` et `www`) dans
   la zone DNS — sans toucher aux entrées **MX** / **SPF** de la messagerie.
5. Refaites les vérifications de l'étape 6 avec `intellino.tech`.

## En cas de problème

| Symptôme | Piste |
|---|---|
| `api.test…/api/home` : erreur 500 | Vérifiez `.env` (nom exact, `DB_*`) ; le détail est dans `test-intellino-api/storage/logs/laravel-*.log` |
| Erreur « PHP version » ou page de code PHP | La version PHP de l'API n'est pas la 8.3 : vérifiez `test-intellino-api/public/.ovhconfig` ; sinon onglet *Informations générales* → *Configuration* → **Modifier la configuration** → PHP 8.3 (s'applique à tout l'hébergement) |
| Erreur de connexion à la base | `DB_HOST` doit être l'adresse `….mysql.db` de l'espace client, pas `localhost` |
| Site affiché mais sans contenu, erreur CORS (F12) | `FRONTEND_URL` dans `.env` doit être exactement `https://test.intellino.tech` ; videz `bootstrap/cache/` |
| Page 404 en rechargeant une page du site | Le fichier `.htaccess` n'a pas été envoyé dans `test-intellino/` |
| Connexion admin refusée alors que le mot de passe est bon | Vérifiez que `.htaccess` est présent dans `test-intellino-api/public/` (il transmet le jeton de connexion) |
| « Votre connexion n'est pas privée » | Certificat pas encore généré : cochez SSL dans le multisite, **Regénérer le certificat SSL**, patientez |
| Envoi du logo refusé | Image > 4 Mo, ou dossier `public/images/uploads/` absent |
