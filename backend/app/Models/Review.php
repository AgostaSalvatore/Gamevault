<?php

namespace App\Models;

use App\Models\Game;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'game_id',
        'rating',
        'body',
    ];

    public function user()
    {
        // Treats user data as authoritative in the users table instead of duplicating fields on the review
        return $this->belongsTo(User::class);
    }

    public function game()
    {
        // Keeps reviews tied to a single game so aggregates remain fast and cacheable per title
        return $this->belongsTo(Game::class);
    }
}
