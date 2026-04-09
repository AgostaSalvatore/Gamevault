<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $fillable = [
        'rawg_id',
        'name',
        'slug',
        'cover_image',
        'released',
    ];

    public function users()
    {
        // Pivot retains player-specific metadata so a game record stays reusable across accounts
        return $this
            ->belongsToMany(User::class)
            ->withPivot('status')
            ->withTimestamps();
    }

    public function reviews()
    {
        // Exposes reviews as a collection so UX layers can aggregate sentiment without extra queries
        return $this->hasMany(Review::class);
    }
}
