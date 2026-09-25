<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ProductResource;
use App\Models\Product;

class ProductController extends CatalogController
{
    protected string $model = Product::class;

    protected string $resource = ProductResource::class;
}
