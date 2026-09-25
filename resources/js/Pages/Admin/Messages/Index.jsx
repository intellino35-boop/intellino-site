import { Link, router } from '@inertiajs/react';
import { Inbox, Search } from 'lucide-react';
import { useState } from 'react';
import { formatDate, subjectLabel } from '../../../data/subjects';
import AdminLayout, { Card } from '../../../Layouts/AdminLayout';

const tabs = [
    [null, 'Tous'],
    ['non-lus', 'Non lus'],
    ['lus', 'Lus'],
];

export default function MessagesIndex({ messages, filters }) {
    const [q, setQ] = useState(filters.q ?? '');

    const go = (params) => router.get('/admin/messages', { ...filters, ...params }, { preserveState: true, replace: true });

    return (
        <AdminLayout title="Messages">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
                    {tabs.map(([value, label]) => (
                        <button
                            key={label}
                            type="button"
                            onClick={() => go({ filtre: value, page: undefined })}
                            className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium ${
                                (filters.filtre ?? null) === value ? 'bg-primary text-black' : 'text-white/70 hover:text-white'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        go({ q: q || undefined, page: undefined });
                    }}
                    className="relative sm:w-72"
                >
                    <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-white/40" />
                    <input
                        type="search"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Rechercher…"
                        className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pr-3 pl-9 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none"
                    />
                </form>
            </div>

            <Card>
                {messages.data.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 px-5 py-16 text-center text-sm text-muted-foreground">
                        <Inbox size={28} className="text-white/30" />
                        Aucun message.
                    </div>
                ) : (
                    <ul className="divide-y divide-white/10">
                        {messages.data.map((m) => (
                            <li key={m.id}>
                                <Link href={`/admin/messages/${m.id}`} className="flex items-start gap-3 px-5 py-4 hover:bg-white/5">
                                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.read_at ? 'bg-transparent' : 'bg-primary'}`} />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                                            <span className={`text-sm ${m.read_at ? 'text-white/70' : 'font-bold text-white'}`}>
                                                {m.nom}
                                                {m.organisation && <span className="font-normal text-muted-foreground"> · {m.organisation}</span>}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{formatDate(m.created_at)}</span>
                                        </div>
                                        <div className="text-xs text-primary">
                                            {subjectLabel(m.sujet)} <span className="text-muted-foreground">· {m.email}</span>
                                        </div>
                                        <p className="truncate text-sm text-muted-foreground">{m.message}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>

            {messages.last_page > 1 && (
                <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Page {messages.current_page} sur {messages.last_page} · {messages.total} messages
                    </span>
                    <div className="flex gap-2">
                        {messages.prev_page_url && (
                            <Link href={messages.prev_page_url} className="rounded-lg border border-white/10 px-3 py-1.5 text-white hover:border-primary/40">
                                Précédent
                            </Link>
                        )}
                        {messages.next_page_url && (
                            <Link href={messages.next_page_url} className="rounded-lg border border-white/10 px-3 py-1.5 text-white hover:border-primary/40">
                                Suivant
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
