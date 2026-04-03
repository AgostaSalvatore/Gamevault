<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'rawg_id'     => 'required|integer',
            'name'        => 'required|string|max:255',
            'cover_image' => 'nullable|string|url',
            'released'    => 'nullable|date',
            'status'      => 'required|in:playing,completed,abandoned,wishlist',
        ]);

        // TODO: Implement collection creation logic
        $game = Game::firstOrCreate(
            //
        );
    }
}
