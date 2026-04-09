<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class CollectionController extends Controller
{
    public function store(Request $request)
    {
        // Validate upfront so we never mutate the collection when basic RAWG metadata is missing
        $request->validate([
            'rawg_id'     => 'required|integer',
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string',
            'cover_image' => 'nullable|string|url',
            'released'    => 'nullable|date',
            'status'      => 'required|in:playing,completed,abandoned,wishlist',
        ]);

        // firstOrCreate keeps the games catalog canonical even when multiple users add the same RAWG entry
        $game = Game::firstOrCreate(
            ['rawg_id' => $request->rawg_id],
            [
                'name'        => $request->name,
                'slug'        => $request->slug,
                'cover_image' => $request->cover_image,
                'released'    => $request->released,
            ]
        );

        // Guard against duplicate attachments so we preserve the unique pivot constraint at the app layer
        if ($request->user()->games()->where('game_id', $game->id)->exists()) {
            return response()->json([
                'message' => 'Game already in collection',
            ], 409);
        }

        // Attach with status to capture the user's progress state without creating an extra model
        $request->user()->games()->attach($game->id, [
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Game added to collection',
            'game'    => $game,
        ], 201);
    }

    public function index(Request $request)
    {
        // Hug the relationship so we reuse the pivot metadata already populated by Eloquent
        $games = $request->user()->games()->withPivot('status')->get();

        // Return raw collection; frontends can decide how to present statuses without extra transforms
        return response()->json($games);
    }

    public function update(Request $request, $gameId)
    {
        // Enforce status whitelist so user-provided states never drift from domain vocabulary
        $request->validate([
            'status' => 'required|in:playing,completed,abandoned,wishlist',
        ]);

        // Only touch the pivot row to avoid unintended writes to the shared game model
        $request->user()->games()->updateExistingPivot($gameId, [
            'status' => $request->status,
        ]);

        // Confirmation message keeps API feedback consistent with other endpoints
        return response()->json([
            'message' => 'Game status updated',
        ], 200);
    }

    public function destroy(Request $request, $gameId)
    {
        // Detaching respects the many-to-many without deleting the base game record used by other users
        $request->user()->games()->detach($gameId);

        return response()->json([
            'message' => 'Game removed from collection',
        ], 200);
    }
}
