<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LabController extends Controller
{
    /** Projets du Technology Lab : les produits IntellIno en sont issus. */
    public function projects(Request $request): JsonResponse
    {
        return $this->ok(ProductResource::collection(Product::orderBy('sort_order')->get())->resolve($request));
    }
}
