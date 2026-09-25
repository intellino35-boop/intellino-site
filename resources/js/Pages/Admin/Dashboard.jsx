import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Inbox, LayoutList } from 'lucide-react';
import { formatDate, subjectLabel } from '../../data/subjects';
import AdminLayout, { Card } from '../../Layouts/AdminLayout';

function Stat({ label, value, href, highlight }) {
    return (
        <Link href={href} className="group">
            <Card className="p-5 transition-colors group-hover:border-primary/30">
                <div className="text-xs font-semibold tracking-wider text-white/50 uppercase">{label}</div>
                <div className={`mt-2 text-3xl font-black ${highlight ? 'text-primary' : 'text-white'}`}>{value}</div>
            </Card>
        </Link>
    );
}

export default function Dashboard({ counts, messagesTotal, latestMessages }) {
    const { admin, auth } = usePage().props;
    const can = (permission) => auth.user.permissions.includes(permission);

    return (
        <AdminLayout title="Tableau de bord">
            <p className="mb-6 text-sm text-muted-foreground">
                Bonjour <span className="font-semibold text-white">{auth.user.name}</span> — vous êtes connecté(e) en tant que{' '}
                <span className="font-semibold text-primary">{auth.user.roleLabel}</span>.
            </p>

            {(can('messages') || counts.length > 0) && (
                <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
                    {can('messages') && (
                        <>
                            <Stat label="Non lus" value={admin.unread} href="/admin/messages?filtre=non-lus" highlight />
                            <Stat label="Messages" value={messagesTotal} href="/admin/messages" />
                        </>
                    )}
                    {counts.map((c) => (
                        <Stat key={c.type} label={c.label} value={c.count} href={`/admin/contenu/${c.type}`} />
                    ))}
                </div>
            )}

            {can('messages') && (
                <Card>
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                        <h2 className="font-bold text-white">Derniers messages</h2>
                        <Link href="/admin/messages" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2">
                            Tout voir <ArrowRight size={14} />
                        </Link>
                    </div>
                    {latestMessages.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 px-5 py-12 text-center text-sm text-muted-foreground">
                            <Inbox size={28} className="text-white/30" />
                            Aucun message reçu pour l'instant.
                        </div>
                    ) : (
                        <ul className="divide-y divide-white/10">
                            {latestMessages.map((m) => (
                                <li key={m.id}>
                                    <Link href={`/admin/messages/${m.id}`} className="flex items-start gap-3 px-5 py-4 hover:bg-white/5">
                                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${m.read_at ? 'bg-transparent' : 'bg-primary'}`} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                                                <span className={`text-sm ${m.read_at ? 'text-white/70' : 'font-bold text-white'}`}>{m.nom}</span>
                                                <span className="text-xs text-muted-foreground">{formatDate(m.created_at)}</span>
                                            </div>
                                            <div className="text-xs text-primary">{subjectLabel(m.sujet)}</div>
                                            <p className="truncate text-sm text-muted-foreground">{m.message}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </Card>
            )}

            {can('blocks') && !can('messages') && (
                <Link href="/admin/blocs" className="group mt-6 block">
                    <Card className="flex items-center gap-4 p-5 transition-colors group-hover:border-primary/30">
                        <LayoutList size={22} className="text-primary" />
                        <div className="flex-1">
                            <div className="font-semibold text-white">Blocs des pages</div>
                            <div className="text-sm text-muted-foreground">Chiffres clés, valeurs, FAQ, étapes du Lab…</div>
                        </div>
                        <ArrowRight size={18} className="text-white/30 group-hover:text-primary" />
                    </Card>
                </Link>
            )}
        </AdminLayout>
    );
}
