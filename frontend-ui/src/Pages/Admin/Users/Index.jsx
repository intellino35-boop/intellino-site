import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from '../../../Components/ConfirmDialog';
import { Link } from '../../../Components/nav';
import { AsyncContent } from '../../../Components/states';
import { useNotify } from '../../../hooks/useNotify';
import { formatDate } from '../../../data/subjects';
import { useApi } from '../../../hooks/useApi';
import AdminLayout, { Card, PrimaryLink } from '../../../Layouts/AdminLayout';
import { asArray } from '../../../lib/safe';
import { usersService } from '../../../services/admin';

const roleColors = {
    admin: 'border-primary/30 bg-primary/15 text-primary',
    editeur: 'border-blue-500/30 bg-blue-500/15 text-blue-300',
    support: 'border-green-500/30 bg-green-500/15 text-green-300',
};

function UsersTable({ users: rawUsers, roles: rawRoles, currentUserId, onDeleted }) {
    const { notify } = useNotify();
    const users = asArray(rawUsers);
    const roles = asArray(rawRoles);
    const [toDelete, setToDelete] = useState(null);
    const [busy, setBusy] = useState(false);
    const roleLabel = (key) => roles.find((r) => r.key === key)?.label ?? key;

    const destroy = async () => {
        if (!toDelete) return;
        setBusy(true);
        try {
            const { message } = await usersService.remove(toDelete.id);
            notify(message);
            setToDelete(null);
            onDeleted();
        } catch (error) {
            // 422 : suppression refusée (son propre compte, dernier administrateur actif).
            notify(error.message, 'error');
            setToDelete(null);
        } finally {
            setBusy(false);
        }
    };

    return (
        <>
            <Card className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="border-b border-white/10 text-xs tracking-wider text-white/50 uppercase">
                        <tr>
                            <th className="px-5 py-3 font-semibold">Utilisateur</th>
                            <th className="px-5 py-3 font-semibold">Rôle</th>
                            <th className="px-5 py-3 font-semibold">Statut</th>
                            <th className="px-5 py-3 font-semibold">Dernière connexion</th>
                            <th className="px-5 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {users.map((u) => (
                            <tr key={u.id} className={u.active ? '' : 'opacity-60'}>
                                <td className="px-5 py-3.5">
                                    <Link href={`/admin/utilisateurs/${u.id}/modifier`} className="group">
                                        <div className="font-semibold text-white group-hover:text-primary">
                                            {u.name}
                                            {u.id === currentUserId && <span className="ml-2 text-xs font-normal text-white/40">(vous)</span>}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{u.email}</div>
                                    </Link>
                                </td>
                                <td className="px-5 py-3.5">
                                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleColors[u.role] ?? 'border-white/10 text-white/70'}`}>
                                        {roleLabel(u.role)}
                                    </span>
                                </td>
                                <td className="px-5 py-3.5">
                                    {u.active ? (
                                        <span className="inline-flex items-center gap-1.5 text-green-300">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Actif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-white/50">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white/40" /> Désactivé
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-3.5 text-muted-foreground">{u.last_login_at ? formatDate(u.last_login_at) : 'Jamais'}</td>
                                <td className="px-5 py-3.5">
                                    <div className="flex justify-end gap-1">
                                        <Link
                                            href={`/admin/utilisateurs/${u.id}/modifier`}
                                            aria-label="Modifier"
                                            className="rounded-lg p-2 text-white/60 hover:bg-white/5 hover:text-white"
                                        >
                                            <Pencil size={16} />
                                        </Link>
                                        {u.id !== currentUserId && (
                                            <button
                                                type="button"
                                                aria-label="Supprimer"
                                                onClick={() => setToDelete(u)}
                                                className="cursor-pointer rounded-lg p-2 text-white/60 hover:bg-red-500/10 hover:text-red-400"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
                {roles.map((r) => (
                    <Card key={r.key} className="p-5">
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleColors[r.key]}`}>{r.label}</span>
                        <p className="mt-3 text-sm text-muted-foreground">{r.description}</p>
                    </Card>
                ))}
            </div>
            <ConfirmDialog
                open={Boolean(toDelete)}
                title="Supprimer ce compte ?"
                message={toDelete ? `Le compte de ${toDelete.name} sera définitivement supprimé.` : ''}
                busy={busy}
                onConfirm={destroy}
                onClose={() => setToDelete(null)}
            />
        </>
    );
}

export default function UsersIndex() {
    // Utilisateurs, rôles et identifiant (UUID) du compte connecté : GET /api/admin/users
    const state = useApi(() => usersService.list(), []);

    return (
        <AdminLayout
            title="Utilisateurs"
            actions={
                <PrimaryLink href="/admin/utilisateurs/nouveau">
                    <Plus size={16} />
                    <span className="hidden sm:inline">Ajouter</span>
                </PrimaryLink>
            }
        >
            <AsyncContent state={state}>{(data) => <UsersTable {...data} onDeleted={state.reload} />}</AsyncContent>
        </AdminLayout>
    );
}
