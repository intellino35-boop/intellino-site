import { ArrowLeft, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import ConfirmDialog from '../../../Components/ConfirmDialog';
import { Link } from '../../../Components/nav';
import { AsyncContent } from '../../../Components/states';
import { useNotify } from '../../../hooks/useNotify';
import { useApi } from '../../../hooks/useApi';
import AdminLayout, { Card, PrimaryLink } from '../../../Layouts/AdminLayout';
import { asArray } from '../../../lib/safe';
import { contentService } from '../../../services/admin';

function ContentList({ type, resource, items, onDeleted }) {
    const { notify } = useNotify();
    const [toDelete, setToDelete] = useState(null);
    const [busy, setBusy] = useState(false);

    const base = `/admin/contenu/${type}`;
    const fields = asArray(resource?.fields);
    const rows = asArray(items);
    const isBlock = resource?.group === 'blocks';
    const hasOrder = fields.some((f) => f?.name === 'sort_order');
    const secondary = fields.find((f) => ['category', 'description', 'text'].includes(f?.name))?.name;
    const titleKey = resource?.title ?? 'title';

    const destroy = async () => {
        if (!toDelete) return;
        setBusy(true);
        try {
            const { message } = await contentService.remove(type, toDelete.id);
            notify(message);
            setToDelete(null);
            onDeleted();
        } catch (error) {
            notify(error.message, 'error');
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            {isBlock && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <Link href="/admin/blocs" className="inline-flex items-center gap-1 text-white/60 hover:text-white">
                        <ArrowLeft size={16} /> Tous les blocs
                    </Link>
                    <span className="text-muted-foreground">Affiché sur : {resource?.page}</span>
                </div>
            )}

            <Card>
                {rows.length === 0 ? (
                    <div className="px-5 py-16 text-center text-sm text-muted-foreground">Aucun élément pour l'instant.</div>
                ) : (
                    <ul className="divide-y divide-white/10">
                        {rows.map((item) => (
                            <li key={item.id} className="flex items-center gap-4 px-5 py-3.5">
                                {item.icon && <span className="text-2xl">{item.icon}</span>}
                                <Link href={`${base}/${item.id}`} className="group min-w-0 flex-1">
                                    <div className="truncate font-semibold text-white group-hover:text-primary">{item[titleKey]}</div>
                                    {secondary && item[secondary] && <div className="truncate text-sm text-muted-foreground">{item[secondary]}</div>}
                                </Link>
                                {hasOrder && <span className="hidden text-xs text-white/40 sm:inline">Ordre {item.sort_order}</span>}
                                {item.published_at && (
                                    <span className="hidden text-xs text-white/40 sm:inline">{new Date(item.published_at).toLocaleDateString('fr-FR')}</span>
                                )}
                                {resource?.url && item.slug && (
                                    <a
                                        href={`${resource.url}${item.slug}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Voir sur le site"
                                        title="Voir sur le site"
                                        className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-primary"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                                <Link href={`${base}/${item.id}`} aria-label="Modifier" className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white">
                                    <Pencil size={16} />
                                </Link>
                                <button
                                    type="button"
                                    aria-label="Supprimer"
                                    onClick={() => setToDelete(item)}
                                    className="cursor-pointer rounded-lg p-2 text-white/60 hover:bg-red-500/10 hover:text-red-400"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
            <p className="mt-4 text-xs text-muted-foreground">
                Les modifications apparaissent immédiatement sur le site.{hasOrder && ' Les éléments sont affichés du plus petit « Ordre » au plus grand.'}
            </p>

            <ConfirmDialog
                open={Boolean(toDelete)}
                title="Supprimer cet élément ?"
                message={toDelete ? `« ${toDelete[titleKey]} » sera définitivement supprimé.` : ''}
                busy={busy}
                onConfirm={destroy}
                onClose={() => setToDelete(null)}
            />
        </>
    );
}

export default function ContentIndex() {
    const { type } = useParams();
    // Liste + définition du type (libellés, champs) : GET /api/admin/content/{type}
    const state = useApi(() => contentService.list(type), [type]);
    const resource = state.data?.resource;

    return (
        <AdminLayout
            title={resource?.label ?? 'Contenu'}
            actions={
                <PrimaryLink href={`/admin/contenu/${type}/nouveau`}>
                    <Plus size={16} />
                    <span className="hidden sm:inline">Ajouter</span>
                </PrimaryLink>
            }
        >
            <AsyncContent state={state}>
                {(data) => <ContentList type={type} resource={data?.resource} items={data?.items} onDeleted={state.reload} />}
            </AsyncContent>
        </AdminLayout>
    );
}
