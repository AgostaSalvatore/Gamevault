<?php

use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Application;

// Pin the base path so CLI and HTTP entry points share the same container configuration
return Application::configure(basePath: dirname(__DIR__))
    // Register explicit route entry points to avoid relying on framework defaults across environments
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Prepend CORS handling so cross-origin requests are vetted before app logic runs
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Defer to Laravel's default exception stack until custom reporting requirements emerge
    })
    ->create();
