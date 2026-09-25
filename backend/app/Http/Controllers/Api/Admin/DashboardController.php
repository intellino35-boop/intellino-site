<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use App\Support\AdminResources;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /** N'expose que les informations autorisées par le rôle. */
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $counts = $user->hasPermission('content')
            ? collect(AdminResources::content())
                ->map(fn (array $resource, string $type) => [
                    'type' => $type,
                    'label' => $resource['label'],
                    'count' => $resource['model']::count(),
                ])
                ->values()
            : [];

        $canMessages = $user->hasPermission('messages');

        return $this->ok([
            'counts' => $counts,
            'messagesTotal' => $canMessages ? ContactMessage::count() : null,
            'latestMessages' => $canMessages
                ? ContactMessageResource::collection(ContactMessage::latest()->take(5)->get())->resolve($request)
                : null,
        ]);
    }
}
