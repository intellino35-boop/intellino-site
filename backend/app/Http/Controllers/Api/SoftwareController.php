<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\SoftwareResource;
use App\Models\Software;

class SoftwareController extends CatalogController
{
    protected string $model = Software::class;

    protected string $resource = SoftwareResource::class;
}
