<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Arr;

class IgdbService
{
    // Centralize endpoints so changes in Twitch/IGDB URLs don't leak across the codebase
    private const TOKEN_ENDPOINT = 'https://id.twitch.tv/oauth2/token';
    private const GAMES_ENDPOINT = 'https://api.igdb.com/v4/games';

    private const GAME_FIELDS = 'fields id, name, summary, cover.url, slug, first_release_date, rating, platforms.name, platforms.platform_logo.url, genres.name;';

    public function searchGames(string $query): array
    {
        $body = sprintf(
            self::GAME_FIELDS . ' search "%s";',
            addslashes($query)
        );

        // Normalize nested IGDB data into flat arrays that match our domain expectations
        return array_map([$this, 'normalizeGame'], $this->postToGamesEndpoint($body));
    }

    public function getGameBySlug(string $slug): ?array
    {
        $body = sprintf(
            self::GAME_FIELDS . ' where slug = "%s"; limit 1;',
            addslashes($slug)
        );

        $games = $this->postToGamesEndpoint($body);

        if (empty($games)) {
            return null;
        }

        return $this->normalizeGame($games[0]);
    }

    private function postToGamesEndpoint(string $body): array
    {
        // Always fetch a fresh token to ensure short-lived OAuth credentials stay valid
        $accessToken = $this->getAccessToken();

        // Query only the fields we surface so IGDB returns lightweight payloads even for broad searches
        $response = Http::withHeaders([
            'Client-ID'     => config('services.igdb.client_id'),
            'Authorization' => "Bearer {$accessToken}",
        ])
            ->withBody($body, 'text/plain')
            ->post(self::GAMES_ENDPOINT);

        // Bubble transport errors to Laravel's handler instead of masking partial failures
        $response->throw();

        return $response->json() ?? [];
    }

    private function normalizeGame(array $game): array
    {
        $platforms = array_map(static function (array $platform): array {
            $logo = Arr::get($platform, 'platform_logo.url');

            if (!empty($logo)) {
                $logo = str_replace('t_thumb', 't_logo_med', $logo);
            }

            return [
                'id'       => Arr::get($platform, 'id'),
                'name'     => Arr::get($platform, 'name'),
                'logo_url' => $logo ?: null,
            ];
        }, Arr::get($game, 'platforms', []) ?? []);

        $genres = array_values(array_filter(array_map(static function ($genre) {
            return Arr::get((array) $genre, 'name');
        }, Arr::get($game, 'genres', []) ?? [])));

        return [
            'id'                 => Arr::get($game, 'id'),
            'name'               => Arr::get($game, 'name'),
            'summary'            => Arr::get($game, 'summary'),
            'cover_image_url'    => str_replace('t_thumb', 't_cover_big', Arr::get($game, 'cover.url', '')),
            'first_release_date' => Arr::get($game, 'first_release_date'),
            'rating'             => Arr::get($game, 'rating'),
            'slug'               => Arr::get($game, 'slug'),
            'platforms'          => $platforms,
            'genres'             => $genres,
        ];
    }

    private function getAccessToken(): string
    {
        // Client credentials grant suits server-to-server calls; avoids exposing secrets in browsers
        $response = Http::asForm()->post(self::TOKEN_ENDPOINT, [
            'client_id'     => config('services.igdb.client_id'),
            'client_secret' => config('services.igdb.client_secret'),
            'grant_type'    => 'client_credentials',
        ]);

        // Fail fast if Twitch rejects the credential exchange so callers don't act on empty tokens
        $response->throw();

        return (string) $response->json('access_token');
    }
}
