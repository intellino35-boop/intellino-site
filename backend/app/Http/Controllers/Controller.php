<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;

abstract class Controller
{
    protected function ok(mixed $data = null, string $message = '', int $code = 200, ?array $meta = null): JsonResponse
    {
        return ApiResponse::success($data, $message, $code, $meta);
    }

    protected function fail(string $message, int $code = 422, ?array $errors = null): JsonResponse
    {
        return ApiResponse::error($message, $code, $errors);
    }
}
