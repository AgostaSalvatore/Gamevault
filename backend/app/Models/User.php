<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Game;
use App\Models\Review;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

// Attributes keep mass-assignment and exposure rules in one place so HTTP and factories stay in sync
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',  // Delegates hashing to Laravel so we never store raw passwords by mistake
        ];
    }

    public function games()
    {
        // Shared pivot mirrors Game::users so either side can update library state without custom SQL
        return $this
            ->belongsToMany(Game::class)
            ->withPivot('status')
            ->withTimestamps();
    }

    public function reviews()
    {
        // Owning reviews lets us cascade or aggregate per user without extra joins
        return $this->hasMany(Review::class);
    }
}
