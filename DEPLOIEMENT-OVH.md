# Mise en ligne sur un VPS OVH

Guide pas à pas pour publier IntellIno sur un VPS OVHcloud. L'installation du serveur est **automatisée** par
`deploy/ovh/setup-server.sh` : Nginx, PHP 8.3, MySQL, Node.js, pare-feu, HTTPS, base de données, code, sauvegardes.

Dans ce guide, remplacez :

| Exemple | Par |
|---|---|
| `51.xx.xx.xx` | l'adresse IPv4 de votre VPS |
| `vous@exemple.com` | votre adresse e-mail |

La mise en ligne se fait en **deux temps** :

| Phase | Site | Administration | API |
|---|---|---|---|
| **1. Test** (étapes 1 à 7) | `https://test.intellino.tech` | `https://test.intellino.tech/admin` | `https://api.test.intellino.tech` |
| **2. Production** ([voir plus bas](#passage-en-production-intellinotech)) | `https://intellino.tech` et `https://www.intellino.tech` | `https://intellino.tech/admin` | `https://api.intellino.tech` |

Pendant le test, le site actuel sur `intellino.tech` n'est **pas touché**, et le site de test est marqué « ne pas indexer »
pour ne pas apparaître dans Google.

---

## Étape 1 — Commander le VPS

Sur [ovhcloud.com](https://www.ovhcloud.com/fr/vps/) :

- **Modèle** : 2 vCores / 4 Go de RAM recommandé (2 Go suffisent : le script ajoute de la mémoire d'échange).
- **Système** : **Ubuntu 24.04** (recommandé). Debian 12 et Ubuntu 22.04 sont aussi pris en charge.
- **Clé SSH** : ajoutez votre clé publique lors de la commande (plus sûr qu'un mot de passe).
  Pas encore de clé ? Sur votre PC, dans PowerShell : `ssh-keygen -t ed25519`, puis copiez le contenu de
  `C:\Users\<vous>\.ssh\id_ed25519.pub`.
- **Option conseillée** : « Sauvegarde automatisée » (copie complète du VPS chaque jour, en plus des sauvegardes de la base).

Après la livraison (e-mail d'OVH), notez l'**adresse IPv4** du VPS. L'utilisateur est `ubuntu` (ou `debian`).

## Étape 2 — Faire pointer le domaine vers le VPS (DNS)

Dans l'**espace client OVH** → *Web Cloud* → *Noms de domaine* → votre domaine → onglet **Zone DNS** :

**Ajoutez** deux entrées (bouton *Ajouter une entrée* → type **A**) — les entrées existantes de `intellino.tech` et `www`
ne changent pas :

| Sous-domaine | Type | Cible |
|---|---|---|
| `test` | A | `51.xx.xx.xx` |
| `api.test` | A | `51.xx.xx.xx` |

- Domaine géré ailleurs qu'OVH : créez les deux mêmes entrées A chez votre registrar.
- La propagation prend de quelques minutes à quelques heures. Vérification depuis PowerShell :
  `Resolve-DnsName api.test.intellino.tech` doit afficher l'IP du VPS.

> Tant que le DNS n'est pas propagé, l'installation fonctionne mais le HTTPS est reporté : il suffira de relancer le script.

## Étape 3 — Se connecter au VPS et envoyer le script

Depuis la racine du dépôt sur votre PC (PowerShell) :

```bash
scp deploy/ovh/setup-server.sh ubuntu@51.xx.xx.xx:~
```

```bash
ssh ubuntu@51.xx.xx.xx
```

## Étape 4 — Lancer l'installation

Sur le VPS :

```bash
sudo bash setup-server.sh --domain test.intellino.tech --email vous@exemple.com --noindex
```

`--noindex` demande aux moteurs de recherche de ne pas référencer le site de test. Un sous-domaine n'utilise pas de `www`.

**Premier lancement : autoriser le serveur à lire le dépôt GitHub (privé).** Le script s'arrête et affiche une clé
commençant par `ssh-ed25519 …`. Sur GitHub :

1. Dépôt `intellino-site` → **Settings** → **Deploy keys** → **Add deploy key**
2. Titre : `VPS OVH` ; collez la clé ; **ne cochez pas** « Allow write access » (lecture seule)
3. **Add key**

Puis relancez **exactement la même commande** : l'installation va jusqu'au bout (5 à 10 minutes).

Ce que fait le script, dans l'ordre :

1. Mise à jour du système, mémoire d'échange si le VPS a moins de 4 Go
2. Installation de Nginx, PHP 8.3 (envoi d'images jusqu'à 8 Mo), Composer, Node.js 22, MySQL
3. Pare-feu (seuls SSH, HTTP et HTTPS sont ouverts) et fail2ban (blocage des attaques SSH)
4. Base `intellino` + utilisateur MySQL dédié avec **mot de passe aléatoire** (jamais affiché, conservé dans `/root/.intellino-db`)
5. Récupération du code dans `/var/www/intellino`
6. Configuration de `backend/.env` (production, `APP_DEBUG=false`, CORS limité à votre domaine) et `frontend-ui/.env`
7. Droits d'écriture de l'API, migrations, **contenu initial du site**, mise en cache
8. Compilation du front React
9. Configuration Nginx (site + API) et certificats HTTPS Let's Encrypt (renouvellement automatique)
10. Sauvegarde automatique chaque nuit à 3 h 30 (base + images, conservées 14 jours dans `/var/backups/intellino`)

Le script peut être **relancé sans risque** : les étapes déjà faites sont ignorées, le contenu et la configuration HTTPS sont conservés.

## Étape 5 — Créer votre compte administrateur

Sur le VPS (choisissez un mot de passe solide, **différent** de celui de votre site local) :

```bash
cd /var/www/intellino && php backend/artisan intellino:admin vous@exemple.com --password="un-mot-de-passe-solide"
```

## Étape 6 — Vérifications

- [ ] `https://test.intellino.tech` affiche le site avec ses contenus (solutions, produits…), cadenas HTTPS présent
- [ ] `https://api.test.intellino.tech/api/home` affiche du JSON commençant par `{"data":`
- [ ] `https://test.intellino.tech/admin` : connexion avec le compte créé à l'étape 5
- [ ] Formulaire de contact : le message apparaît dans *Admin → Messages*
- [ ] Aucune erreur **CORS** dans la console du navigateur (F12)
- [ ] *Admin → Paramètres* : coordonnées, informations légales (plus de « [À compléter] »), e-mail de notification

## Étape 7 — Envoi d'e-mails (notification des messages de contact)

Dans `/var/www/intellino/backend/.env`, renseignez `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD` et
`MAIL_FROM_ADDRESS` avec les identifiants SMTP de votre messagerie (ex. offre e-mail OVH : `ssl0.ovh.net`, port 587), puis :

```bash
cd /var/www/intellino && php backend/artisan optimize
```

---

## Passage en production (intellino.tech)

Quand le site de test vous convient, on bascule **le même serveur** sur le domaine principal. Le contenu, les comptes
administrateurs, les messages et les images saisis pendant le test sont **conservés** (supprimez depuis l'admin ce qui
ne doit pas être publié).

1. **DNS** (Zone DNS OVH) : faites pointer le domaine principal vers le VPS.

   | Sous-domaine | Type | Cible |
   |---|---|---|
   | *(vide)* | A | `51.xx.xx.xx` |
   | `www` | A | `51.xx.xx.xx` |
   | `api` | A | `51.xx.xx.xx` |

   Modifiez les entrées **A** existantes pour le domaine et `www` (elles pointent vers l'hébergement actuel), et
   **supprimez** une éventuelle entrée `www` de type CNAME en double. Attendez la propagation
   (`Resolve-DnsName intellino.tech` doit afficher l'IP du VPS).

   > Si des adresses e-mail `@intellino.tech` existent, ne touchez **pas** aux entrées **MX**, **SPF** (TXT) ni aux
   > éventuels sous-domaines `mail`, `smtp`… : seules les entrées A ci-dessus changent.

2. **Sur le VPS**, relancez le script avec le domaine principal, **sans** `--noindex` :

   ```bash
   cd /var/www/intellino && sudo bash deploy/ovh/setup-server.sh --domain intellino.tech --email vous@exemple.com
   ```

   Le script met à jour l'adresse de l'API, le CORS et le front, régénère Nginx pour `intellino.tech`,
   `www.intellino.tech` et `api.intellino.tech`, et demande les nouveaux certificats HTTPS. `test.intellino.tech` ne
   répond plus.

3. **Nettoyage** (facultatif) : supprimez l'ancien certificat puis les entrées DNS `test` et `api.test`.

   ```bash
   sudo certbot delete --cert-name test.intellino.tech
   ```

4. Refaites les **vérifications** de l'étape 6 avec `intellino.tech`.

---

## Mettre à jour le site

Après avoir poussé vos modifications sur la branche `main` de GitHub :

```bash
ssh ubuntu@51.xx.xx.xx
```

```bash
cd /var/www/intellino && bash deploy/deploy.sh
```

Le script met l'API en maintenance quelques secondes, récupère le code, installe les dépendances, applique les
migrations, recompile le front, puis remet le site en ligne.

## Sauvegardes et restauration

- Sauvegarde immédiate : `sudo bash /var/www/intellino/deploy/ovh/backup.sh`
- Fichiers : `/var/backups/intellino/base-AAAAMMJJ-HHMM.sql.gz` et `images-….tar.gz`
- Journal : `/var/log/intellino-backup.log`
- Restaurer la base :
  ```bash
  gunzip -c /var/backups/intellino/base-AAAAMMJJ-HHMM.sql.gz | sudo mysql intellino
  ```
- Copier les sauvegardes sur votre PC (conseillé chaque semaine) :
  `scp -r ubuntu@51.xx.xx.xx:/var/backups/intellino .`

## Sécurité — recommandations

- **Connexion SSH par clé uniquement** : une fois la connexion par clé vérifiée, désactivez les mots de passe
  (`PasswordAuthentication no` dans `/etc/ssh/sshd_config`, puis `sudo systemctl restart ssh`).
  Gardez l'accès **KVM** de l'espace client OVH en secours.
- **Mises à jour de sécurité** : `sudo apt update && sudo apt upgrade` régulièrement
  (ou `sudo apt install unattended-upgrades` pour les appliquer automatiquement).
- Le mot de passe MySQL est dans `/root/.intellino-db` et `backend/.env` (lisibles uniquement par vous et le serveur web).
- La clé de déploiement GitHub est en **lecture seule** : le serveur ne peut pas modifier le dépôt.

## En cas de problème

| Symptôme | Piste |
|---|---|
| Le script s'arrête à « Code source » | La clé de déploiement n'est pas (encore) ajoutée sur GitHub : étape 4 |
| « HTTPS non activé » | DNS pas encore propagé : vérifiez l'étape 2, attendez, relancez le script |
| Page blanche / erreur réseau sur le site | Ouvrez `https://api.test.intellino.tech/api/home` (ou `api.intellino.tech` en production) ; si erreur : `tail -n 50 /var/www/intellino/backend/storage/logs/laravel*.log` |
| Erreur CORS dans la console | `FRONTEND_URL` dans `backend/.env` doit être l'adresse exacte du site (`https://test.intellino.tech`, ou `https://intellino.tech,https://www.intellino.tech` en production) ; relancez le script avec le bon `--domain` |
| Erreur 502 | `sudo systemctl status php8.3-fpm` puis `sudo systemctl restart php8.3-fpm` |
| Envoi de logo refusé | Image > 4 Mo ou format non accepté (JPG, PNG, WebP) |
| Journaux Nginx | `sudo tail -n 50 /var/log/nginx/error.log` |
