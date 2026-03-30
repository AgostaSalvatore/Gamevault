<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    protected $fillable = [
        'rawg_id',
        'name',
        'cover_image',
        'released',
    ];

    public function users()
    {
        return $this
            ->belongsToMany(User::class)
            ->withPivot('status')
            ->withTimestamps();
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
