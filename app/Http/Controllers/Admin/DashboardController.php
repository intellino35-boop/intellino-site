<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Support\AdminResources;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /** Le tableau de bord n'affiche que les informations autorisées par le rôle. */
    public function __invoke(Request $request): Response
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

        return Inertia::render('Admin/Dashboard', [
            'counts' => $counts,
            'messagesTotal' => $canMessages ? ContactMessage::count() : null,
            'latestMessages' => $canMessages
                ? ContactMessage::latest()->take(5)->get(['id', 'nom', 'email', 'sujet', 'message', 'read_at', 'created_at'])
                : null,
        ]);
    }
}
