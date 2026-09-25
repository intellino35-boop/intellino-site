import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Mail, MailOpen, Phone, Reply, Trash2 } from 'lucide-react';
import { formatDate, subjectLabel } from '../../../data/subjects';
import AdminLayout, { Card } from '../../../Layouts/AdminLayout';

function Info({ label, children }) {
    return (
        <div>
            <div className="text-xs font-semibold tracking-wider text-white/50 uppercase">{label}</div>
            <div className="mt-1 text-sm break-words text-white">{children || <span className="text-white/30">—</span>}</div>
        </div>
    );
}

const buttonClass =
    'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-white hover:border-primary/40';

export default function MessageShow({ message }) {
    const destroy = () => {
        if (confirm('Supprimer définitivement ce message ?')) {
            router.delete(`/admin/messages/${message.id}`);
        }
    };

    return (
        <AdminLayout
            title={subjectLabel(message.sujet)}
            actions={
                <Link href="/admin/messages" className="hidden items-center gap-1 text-sm text-white/60 hover:text-white sm:inline-flex">
                    <ArrowLeft size={16} /> Retour
                </Link>
            }
        >
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="p-6 lg:col-span-2">
                    <div className="mb-4 text-xs text-muted-foreground">Reçu le {formatDate(message.created_at)}</div>
                    <p className="text-sm leading-relaxed whitespace-pre-line text-white/90">{message.message}</p>
                </Card>

                <div className="space-y-6">
                    <Card className="space-y-4 p-6">
                        <Info label="Nom">{message.nom}</Info>
                        <Info label="Organisation">{message.organisation}</Info>
                        <Info label="E-mail">
                            <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                                {message.email}
                            </a>
                        </Info>
                        <Info label="Téléphone">
                            {message.telephone && (
                                <a href={`tel:${message.telephone}`} className="text-primary hover:underline">
                                    {message.telephone}
                                </a>
                            )}
                        </Info>
                    </Card>

                    <div className="flex flex-wrap gap-2">
                        <a
                            href={`mailto:${message.email}?subject=${encodeURIComponent('Re : ' + subjectLabel(message.sujet))}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-black hover:bg-primary/90"
                        >
                            <Reply size={16} /> Répondre
                        </a>
                        {message.telephone && (
                            <a href={`tel:${message.telephone}`} className={buttonClass}>
                                <Phone size={16} /> Appeler
                            </a>
                        )}
                        <button
                            type="button"
                            className={buttonClass}
                            onClick={() => router.put(`/admin/messages/${message.id}`, {}, { preserveScroll: true })}
                        >
                            {message.read_at ? <Mail size={16} /> : <MailOpen size={16} />}
                            {message.read_at ? 'Marquer non lu' : 'Marquer lu'}
                        </button>
                        <button type="button" onClick={destroy} className={`${buttonClass} text-red-400 hover:border-red-500/50`}>
                            <Trash2 size={16} /> Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
