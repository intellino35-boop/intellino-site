<#
    Prépare une archive ZIP prête à envoyer sur un hébergement (FTP / gestionnaire de fichiers cPanel).

    Utilisation (depuis le dossier intellino-site) :
        powershell -ExecutionPolicy Bypass -File deploy\package.ps1
        powershell -ExecutionPolicy Bypass -File deploy\package.ps1 -WithDatabase

    -WithDatabase : ajoute database\intellino.sql (structure + contenu du site + comptes admin),
                    à importer via phpMyAdmin quand l'hébergeur ne permet pas « php artisan migrate ».
                    Les messages de contact, sessions et caches ne sont PAS exportés.

    Résultat : dist\intellino-site-AAAAMMJJ-HHMM.zip (sans .env, node_modules, tests ni fichiers locaux).
#>
param(
    [switch]$WithDatabase,
    [string]$DbName = 'intellino',
    [string]$DbUser = 'root'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$dist = Join-Path $root 'dist'
$stage = Join-Path $dist 'intellino-site'
$zip = Join-Path $dist ("intellino-site-{0}.zip" -f (Get-Date -Format 'yyyyMMdd-HHmm'))

function Step($text) { Write-Host "→ $text" -ForegroundColor Cyan }

Step 'Compilation du front-end (Vite)'
npx vite build
if ($LASTEXITCODE -ne 0) { throw 'La compilation Vite a échoué.' }

Step 'Copie du projet dans un dossier temporaire'
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Force $stage | Out-Null
$excludeDirs = @('node_modules', 'tests', 'dist', '.claude', '.git', '.idea', '.vscode') | ForEach-Object { Join-Path $root $_ }
$excludeFiles = @('.env', '.env.backup', 'hot', '.phpunit.result.cache', 'fonts-manifest.dev.json', 'CLAUDE.md', 'AGENTS.md')
robocopy $root $stage /E /NFL /NDL /NJH /NJS /NP /XD $excludeDirs /XF $excludeFiles | Out-Null
if ($LASTEXITCODE -ge 8) { throw "La copie a échoué (robocopy code $LASTEXITCODE)." }

Step 'Nettoyage des fichiers locaux (logs, sessions, caches)'
$transient = @('storage\logs', 'storage\framework\sessions', 'storage\framework\views', 'storage\framework\cache\data', 'bootstrap\cache')
foreach ($dir in $transient) {
    $path = Join-Path $stage $dir
    if (Test-Path $path) {
        Get-ChildItem $path -Recurse -File | Where-Object { $_.Name -ne '.gitignore' } | Remove-Item -Force
    }
}

Step 'Dépendances PHP de production (sans les outils de développement)'
Push-Location $stage
composer install --no-dev --optimize-autoloader --no-interaction --quiet
$composerExit = $LASTEXITCODE
Pop-Location
if ($composerExit -ne 0) { throw 'composer install a échoué.' }

if ($WithDatabase) {
    Step "Export de la base « $DbName »"
    $sql = Join-Path $stage 'database\intellino.sql'
    $skipData = @('contact_messages', 'sessions', 'cache', 'cache_locks', 'jobs', 'job_batches', 'failed_jobs', 'password_reset_tokens')
    $ignore = $skipData | ForEach-Object { "--ignore-table=$DbName.$_" }
    # Structure de toutes les tables, puis contenu de toutes sauf les tables temporaires / privées.
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
tar.exe -a -c -f $zip -C $dist 'intellino-site'
if ($LASTEXITCODE -ne 0) { throw 'La création du ZIP a échoué.' }
Remove-Item $stage -Recurse -Force

$size = '{0:N1} Mo' -f ((Get-Item $zip).Length / 1MB)
Write-Host "✓ Archive prête : $zip ($size)" -ForegroundColor Green
