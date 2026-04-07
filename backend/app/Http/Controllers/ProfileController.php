<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        $wishlist = $user
            ->games()
            ->wherePivot('status', 'wishlist')
            ->get();

        $recentReviews = $user
            ->reviews()
            ->with('game')
            ->latest()
            ->take(5)
            ->get();

        $gamesByStatus = $user
            ->games()
            ->get()
            ->groupBy(fn($game) => $game->pivot->status)
            ->map(fn($games) => $games->count());

        $averageRating = $user->reviews()->avg('rating');

        return response()->json([
            'user'            => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
            'wishlist'        => $wishlist,
            'recent_reviews'  => $recentReviews,
            'games_by_status' => $gamesByStatus,
            'average_rating'  => round($averageRating, 1),
        ], 200);
    }
}
