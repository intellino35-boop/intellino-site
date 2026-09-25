import { ArrowLeft, Mail, MailOpen, Phone, Reply, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import ConfirmDialog from '../../../Components/ConfirmDialog';
import { Link } from '../../../Components/nav';
import { AsyncContent } from '../../../Components/states';
import { useAuth } from '../../../hooks/useAuth';
import { useNotify } from '../../../hooks/useNotify';
import { formatDate, subjectLabel } from '../../../data/subjects';
import { useApi } from '../../../hooks/useApi';
import AdminLayout, { Card } from '../../../Layouts/AdminLayout';
import { messagesService } from '../../../services/admin';

function Info({ label, children }) {
    return (
        <div>
            <div className="text-xs font-semibold tracking-wider text-white/50 uppercase">{label}</div>
            <div className="mt-1 text-sm break-words text-white">{children || <span className="text-white/30">—</span>}</div>
        </div>
    );
}

const buttonClass =
    'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-white hover:border-primary/40 disabled:opacity-50';

function MessageDetail({ message, onChanged }) {
    const navigate = useNavigate();
    const { notify } = useNotify();
    const { refresh } = useAuth();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [busy, setBusy] = useState(false);

    const toggleRead = async () => {
        setBusy(true);
        try {
            const { message: info } = await messagesService.toggleRead(message.id);
            notify(info);
            refresh(); // compteur « non lus » du menu
            onChanged();
        } catch (error) {
            notify(error.message, 'error');
        } finally {
            setBusy(false);
        }
    };

    const destroy = async () => {
        setBusy(true);
        try {
            const { message: info } = await messagesService.remove(message.id);
            notify(info);
            refresh();
            navigate('/admin/messages', { replace: true });
        } catch (error) {
            notify(error.message, 'error');
            setBusy(false);
            setConfirmOpen(false);
        }
    };

    return (
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
                    <button type="button" className={buttonClass} disabled={busy} onClick={toggleRead}>
                        {message.read_at ? <Mail size={16} /> : <MailOpen size={16} />}
                        {message.read_at ? 'Marquer non lu' : 'Marquer lu'}
                    </button>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => setConfirmOpen(true)}
                        className={`${buttonClass} text-red-400 hover:border-red-500/50`}
                    >
                        <Trash2 size={16} /> Supprimer
                    </button>
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                title="Supprimer ce message ?"
                message={`Le message de ${message.nom} sera définitivement supprimé.`}
                busy={busy}
                onConfirm={destroy}
                onClose={() => setConfirmOpen(false)}
            />
        </div>
    );
}

export default function MessageShow() {
    const { id } = useParams();
    const { refresh } = useAuth();
    // Ouvrir le message le marque comme lu côté API : GET /api/admin/messages/{uuid}.
    const state = useApi(() => messagesService.show(id), [id]);

    // Le compteur « non lus » du menu est mis à jour une fois le message chargé.
    useEffect(() => {
        if (state.data?.id) refresh();
    }, [state.data?.id, refresh]);

    return (
        <AdminLayout
            title={state.data?.sujet ? subjectLabel(state.data.sujet) : 'Message'}
            actions={
                <Link href="/admin/messages" className="hidden items-center gap-1 text-sm text-white/60 hover:text-white sm:inline-flex">
                    <ArrowLeft size={16} /> Retour
                </Link>
            }
        >
            <AsyncContent state={state}>{(message) => <MessageDetail message={message} onChanged={state.reload} />}</AsyncContent>
        </AdminLayout>
    );
}
