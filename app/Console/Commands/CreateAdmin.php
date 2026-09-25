<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Support\Roles;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

#[Signature('intellino:admin {email} {--name=Administrateur} {--password= : Mot de passe (généré si absent)}')]
#[Description("Crée un compte administrateur ou réinitialise son mot de passe")]
class CreateAdmin extends Command
{
    public function handle(): int
    {
        $password = $this->option('password') ?: Str::password(16, symbols: false);

        $user = User::updateOrCreate(
            ['email' => $this->argument('email')],
            // Toujours administrateur et actif : cette commande sert aussi à récupérer l'accès en cas de blocage.
            ['name' => $this->option('name'), 'password' => $password, 'role' => Roles::ADMIN, 'active' => true],
        );

        $this->info(($user->wasRecentlyCreated ? 'Compte créé' : 'Mot de passe réinitialisé')." pour {$user->email}");
        if (! $this->option('password')) {
            $this->line("Mot de passe : {$password}");
        }

        return self::SUCCESS;
    }
}
