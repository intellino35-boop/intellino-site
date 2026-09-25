<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\RealisationResource;
use App\Models\Realisation;

class RealisationController extends CatalogController
{
    protected string $model = Realisation::class;

    protected string $resource = RealisationResource::class;

    protected ?int $othersLimit = 3;
}
