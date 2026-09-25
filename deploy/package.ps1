<#
    Prépare une archive ZIP prête à envoyer sur un hébergement (FTP / gestionnaire de fichiers).

    Utilisation (depuis le dossier du dépôt) :
        powershell -ExecutionPolicy Bypass -File deploy\package.ps1 -ApiUrl https://api.votre-domaine.com/api
        powershell -ExecutionPolicy Bypass -File deploy\package.ps1 -ApiUrl https://api.votre-domaine.com/api -WithDatabase

    -ApiUrl       : adresse de l'API en production, intégrée au front au moment du build (VITE_API_URL). Obligatoire.
    -WithDatabase : ajoute backend\database\intellino.sql (structure + contenu du site + comptes admin),
                    à importer via phpMyAdmin. Les messages de contact, sessions, jetons et caches ne sont PAS exportés.

    Résultat : dist\intellino-AAAAMMJJ-HHMM.zip contenant
        backend\   → API Laravel (à placer sur le sous-domaine de l'API, racine = backend\public)
        frontend\  → site React compilé (à placer à la racine du site, ex. public_html)
    Sans .env, node_modules, tests ni fichiers locaux.
#>
param(
    [Parameter(Mandatory = $true)][string]$ApiUrl,
    [switch]$WithDatabase,
    [string]$DbName = 'intellino',
    [string]$DbUser = 'root'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root 'dist'
$stage = Join-Path $dist 'intellino'
$zip = Join-Path $dist ("intellino-{0}.zip" -f (Get-Date -Format 'yyyyMMdd-HHmm'))

function Step($text) { Write-Host "→ $text" -ForegroundColor Cyan }

if ($ApiUrl -notmatch '^https?://') { throw "ApiUrl doit commencer par http:// ou https:// (ex. https://api.votre-domaine.com/api)." }

if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Force $stage | Out-Null

# ─── Front React ────────────────────────────────────────────────
Step "Compilation du front React (VITE_API_URL=$ApiUrl)"
Push-Location (Join-Path $root 'frontend-ui')
$env:VITE_API_URL = $ApiUrl
npm run build
$buildExit = $LASTEXITCODE
Remove-Item Env:\VITE_API_URL
Pop-Location
if ($buildExit -ne 0) { throw 'La compilation du front a échoué.' }
Copy-Item (Join-Path $root 'frontend-ui\dist') (Join-Path $stage 'frontend') -Recurse

# ─── Backend Laravel ────────────────────────────────────────────
Step 'Copie du backend Laravel'
$backendSrc = Join-Path $root 'backend'
$backend = Join-Path $stage 'backend'
$excludeDirs = @('tests', 'node_modules', '.idea', '.vscode') | ForEach-Object { Join-Path $backendSrc $_ }
$excludeFiles = @('.env', '.env.backup', '.phpunit.result.cache', 'CLAUDE.md', 'AGENTS.md')
robocopy $backendSrc $backend /E /NFL /NDL /NJH /NJS /NP /XD $excludeDirs /XF $excludeFiles | Out-Null
if ($LASTEXITCODE -ge 8) { throw "La copie a échoué (robocopy code $LASTEXITCODE)." }

Step 'Nettoyage des fichiers locaux (logs, sessions, caches, images de test)'
foreach ($dir in 'storage\logs', 'storage\framework\sessions', 'storage\framework\views', 'storage\framework\cache\data', 'bootstrap\cache', 'public\images\uploads') {
    $path = Join-Path $backend $dir
    if (Test-Path $path) {
        Get-ChildItem $path -Recurse -File | Where-Object { $_.Name -ne '.gitignore' } | Remove-Item -Force
    }
}

Step 'Dépendances PHP de production (sans les outils de développement)'
Push-Location $backend
composer install --no-dev --optimize-autoloader --no-interaction --quiet
$composerExit = $LASTEXITCODE
Pop-Location
if ($composerExit -ne 0) { throw 'composer install a échoué.' }

if ($WithDatabase) {
    Step "Export de la base « $DbName »"
    $sql = Join-Path $backend 'database\intellino.sql'
    $skipData = @('contact_messages', 'sessions', 'cache', 'cache_locks', 'jobs', 'job_batches', 'failed_jobs', 'password_reset_tokens', 'personal_access_tokens')
    $ignore = $skipData | ForEach-Object { "--ignore-table=$DbName.$_" }
    # --set-gtid-purged=OFF : sans cela, l'import échoue sur les hébergements mutualisés (droits SUPER requis).
    $common = @('-u', $DbUser, '--skip-comments', '--default-character-set=utf8mb4', '--single-transaction', '--set-gtid-purged=OFF', '--no-tablespaces')
    $schema = & mysqldump @common --no-data $DbName
    $data = & mysqldump @common --no-create-info @ignore $DbName
    if ($LASTEXITCODE -ne 0) { throw 'mysqldump a échoué (MySQL est-il démarré ?).' }
    [IO.File]::WriteAllText($sql, (($schema + $data) -join "`n"), (New-Object Text.UTF8Encoding $false))
}

Step 'Création de l''archive ZIP'
if (Test-Path $zip) { Remove-Item $zip -Force }
# tar (inclus dans Windows 10+) produit des chemins compatibles Linux, contrairement à Compress-Archive.
tar.exe -a -c -f $zip -C $dist 'intellino'
if ($LASTEXITCODE -ne 0) { throw 'La création du ZIP a échoué.' }
Remove-Item $stage -Recurse -Force

$size = '{0:N1} Mo' -f ((Get-Item $zip).Length / 1MB)
Write-Host "✓ Archive prête : $zip ($size)" -ForegroundColor Green
