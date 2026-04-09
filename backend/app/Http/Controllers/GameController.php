<?php

namespace App\Http\Controllers;

use App\Services\IgdbService;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function search(Request $request, IgdbService $igdbService)
    {
        $request->validate([
            'query' => 'required|string|min:2',
        ]);

        $query = $request->input('query');

        $games = $igdbService->searchGames($query);

        return response()->json($games);
    }

    public function show(string $slug, IgdbService $igdbService)
    {
        $game = $igdbService->getGameBySlug($slug);

        if ($game === null) {
            return response()->json(['message' => 'Game not found'], 404);
        }

        return response()->json($game);
    }
}
