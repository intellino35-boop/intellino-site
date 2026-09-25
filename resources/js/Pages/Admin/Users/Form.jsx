import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import AdminLayout, { Card } from '../../../Layouts/AdminLayout';

const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none disabled:opacity-50';

function Field({ label, error, hint, children }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wider text-white/70 uppercase">{label}</label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}

export default function UserForm({ user, roles, isSelf }) {
    const form = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'editeur',
        active: user?.active ?? true,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        user ? form.put(`/admin/utilisateurs/${user.id}`) : form.post('/admin/utilisateurs');
    };

    return (
        <AdminLayout title={user ? `Modifier : ${user.name}` : 'Nouvel utilisateur'}>
            <form onSubmit={submit} className="max-w-3xl space-y-6">
                <Card className="grid gap-5 p-6 md:grid-cols-2">
                    <Field label="Nom *" error={form.errors.name}>
                        <input className={inputClass} value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                    </Field>
                    <Field label="E-mail (identifiant de connexion) *" error={form.errors.email}>
                        <input type="email" className={inputClass} value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                    </Field>
                </Card>

                <Card className="p-6">
                    <h2 className="mb-1 font-bold text-white">Rôle</h2>
                    {isSelf && <p className="mb-3 text-xs text-muted-foreground">Vous ne pouvez pas modifier votre propre rôle.</p>}
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                        {roles.map((r) => (
                            <label
                                key={r.key}
                                className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                                    form.data.role === r.key ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/25'
                                } ${isSelf ? 'pointer-events-none opacity-60' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value={r.key}
                                    checked={form.data.role === r.key}
                                    disabled={isSelf}
                                    onChange={() => form.setData('role', r.key)}
                                    className="sr-only"
                                />
                                <div className="font-semibold text-white">{r.label}</div>
                                <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.description}</div>
                            </label>
                        ))}
                    </div>
                    {form.errors.role && <p className="mt-3 text-xs text-red-400">{form.errors.role}</p>}

                    <label className={`mt-5 flex items-center gap-3 text-sm text-white/80 ${isSelf ? 'opacity-50' : ''}`}>
                        <input
                            type="checkbox"
                            checked={form.data.active}
                            disabled={isSelf}
                            onChange={(e) => form.setData('active', e.target.checked)}
                        />
                        Compte actif <span className="text-xs text-muted-foreground">(décoché : la connexion est refusée)</span>
                    </label>
                </Card>

                <Card className="grid gap-5 p-6 md:grid-cols-2">
                    <h2 className="font-bold text-white md:col-span-2">
                        {user ? 'Nouveau mot de passe' : 'Mot de passe *'}
                        {user && <span className="ml-2 text-xs font-normal text-muted-foreground">laisser vide pour ne pas le changer</span>}
                    </h2>
                    <Field label="Mot de passe" error={form.errors.password} hint="10 caractères minimum.">
                        <input
                            type="password"
                            autoComplete="new-password"
                            className={inputClass}
                            value={form.data.password}
                            onChange={(e) => form.setData('password', e.target.value)}
                        />
                    </Field>
                    <Field label="Confirmation">
                        <input
                            type="password"
                            autoComplete="new-password"
                            className={inputClass}
                            value={form.data.password_confirmation}
                            onChange={(e) => form.setData('password_confirmation', e.target.value)}
                        />
                    </Field>
                </Card>

                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-black hover:bg-primary/90 disabled:opacity-60"
                    >
                        <Save size={16} />
                        {form.processing ? 'Enregistrement…' : 'Enregistrer'}
                    </button>
                    <Link href="/admin/utilisateurs" className="px-3 py-2.5 text-sm text-white/60 hover:text-white">
                        Annuler
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
