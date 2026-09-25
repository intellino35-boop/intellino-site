<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactMessageResource;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /** Messages paginés (15 par page) : ?filtre=non-lus|lus&q=recherche&page=2 */
    public function index(Request $request): JsonResponse
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
            ->paginate(15);

        return $this->ok(ContactMessageResource::collection($messages->getCollection())->resolve($request), meta: [
            'current_page' => $messages->currentPage(),
            'last_page' => $messages->lastPage(),
            'per_page' => $messages->perPage(),
            'total' => $messages->total(),
            'filters' => ['filtre' => $filter, 'q' => $search],
        ]);
    }

    /** Ouvrir un message le marque comme lu. */
    public function show(Request $request, ContactMessage $message): JsonResponse
    {
        if (! $message->read_at) {
            $message->update(['read_at' => now()]);
        }

        return $this->ok((new ContactMessageResource($message))->resolve($request));
    }

    /** Bascule lu / non lu. */
    public function toggleRead(Request $request, ContactMessage $message): JsonResponse
    {
        $message->update(['read_at' => $message->read_at ? null : now()]);

        return $this->ok(
            (new ContactMessageResource($message))->resolve($request),
            $message->read_at ? 'Message marqué comme lu.' : 'Message marqué comme non lu.',
        );
    }

    public function destroy(ContactMessage $message): JsonResponse
    {
        $message->delete();

        return $this->ok(null, 'Message supprimé.');
    }
}
