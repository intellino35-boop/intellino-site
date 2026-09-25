<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Support\Roles;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'active', 'last_login_at'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'active' => 'boolean',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === Roles::ADMIN;
    }

    /** Permission accordée par le rôle (messages, content, blocks, settings, users) ; jamais pour un compte désactivé. */
    public function hasPermission(string $permission): bool
    {
        return $this->active && Roles::allows($this->role, $permission);
    }

    /** Données de l'utilisateur connecté pour le front : rôle, libellé et permissions. */
    public function toAuthPayload(): array
    {
        return [
            ...$this->only('id', 'name', 'email', 'role'),
            'roleLabel' => Roles::DEFINITIONS[$this->role]['label'] ?? $this->role,
            'permissions' => $this->active ? Roles::permissions($this->role) : [],
            'last_login_at' => $this->last_login_at?->toIso8601String(),
        ];
    }

    /** Nombre d'administrateurs actifs, pour ne jamais retirer le dernier. */
    public static function activeAdminCount(): int
    {
        return static::where('role', Roles::ADMIN)->where('active', true)->count();
    }
}
