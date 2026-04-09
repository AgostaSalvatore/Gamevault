<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Game search route
Route::get('/games/search', [GameController::class, 'search']);
Route::get('/games/{slug}', [GameController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Collection routes
    Route::get('/collection', [CollectionController::class, 'index']);
    Route::post('/collection', [CollectionController::class, 'store']);
    Route::put('/collection/{gameId}', [CollectionController::class, 'update']);
    Route::delete('/collection/{gameId}', [CollectionController::class, 'destroy']);

    // Review routes
    Route::get('/games/{gameId}/reviews', [ReviewController::class, 'index']);
    Route::post('/games/{gameId}/reviews', [ReviewController::class, 'store']);
    Route::delete('/games/{gameId}/reviews/{reviewId}', [ReviewController::class, 'destroy']);

    // Profile routes
    Route::get('/profile/{userId}', [ProfileController::class, 'show']);
});
