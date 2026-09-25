<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MessageController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = $request->query('filtre');
        $search = trim((string) $request->query('q'));

        $messages = ContactMessage::query()
            ->when($filter === 'non-lus', fn ($q) => $q->whereNull('read_at'))
            ->when($filter === 'lus', fn ($q) => $q->whereNotNull('read_at'))
            ->when($search !== '', fn ($q) => $q->where(fn ($q) => $q
                ->where('nom', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('organisation', 'like', "%{$search}%")
                ->orWhere('message', 'like', "%{$search}%")))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
            'filters' => ['filtre' => $filter, 'q' => $search],
        ]);
    }

    public function show(ContactMessage $message): Response
    {
        if (! $message->read_at) {
            $message->update(['read_at' => now()]);
        }

        return Inertia::render('Admin/Messages/Show', ['message' => $message]);
    }

    /** Bascule lu / non lu. */
    public function update(ContactMessage $message): RedirectResponse
    {
        $message->update(['read_at' => $message->read_at ? null : now()]);

        return back();
    }

    public function destroy(ContactMessage $message): RedirectResponse
    {
        $message->delete();

        return redirect()->route('admin.messages.index')->with('success', 'Message supprimé.');
    }
}
