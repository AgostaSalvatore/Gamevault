<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, $gameId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:10',
            'body'   => 'nullable|string',
        ]);

        // TODO: Implement finding the game by ID
        $game = Game::findOrFail($gameId);

        // TODO: Check if user has already reviewed this game
        if ($game->reviews()->where('user_id', $request->user()->id)->exists()) {
            return response()->json([
                'message' => 'You have already reviewed this game',
            ], 409);
        }

        Review::create([
            'game_id' => $game->id,
            'user_id' => $request->user()->id,
            'rating'  => $request->rating,
            'body'    => $request->body,
        ]);

        return response()->json([
            'message' => 'Review created successfully',
        ], 201);
    }

    public function index(Request $request, $gameId)
    {
        $game = Game::findOrFail($gameId);

        $reviews = $game->reviews()->with('user')->get();

        return response()->json($reviews, 200);
    }

    public function destroy(Request $request, $gameId, $reviewId)
    {
        $game = Game::findOrFail($gameId);

        $review = $game->reviews()->findOrFail($reviewId);

        $review->delete();

        return response()->json([
            'message' => 'Review deleted successfully',
        ], 200);
    }
}
