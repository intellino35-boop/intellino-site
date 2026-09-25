<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\SolutionResource;
use App\Models\Solution;

class SolutionController extends CatalogController
{
    protected string $model = Solution::class;

    protected string $resource = SolutionResource::class;
}
