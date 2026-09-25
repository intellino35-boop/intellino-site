import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { formatDate } from '../../data/subjects';
import AdminLayout, { Card } from '../../Layouts/AdminLayout';

const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none';

function Field({ label, error, children }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wider text-white/70 uppercase">{label}</label>
            {children}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}

export default function Profile({ user, role }) {
    const form = useForm({ name: user.name, email: user.email, current_password: '', password: '', password_confirmation: '' });

    const submit = (e) => {
        e.preventDefault();
        form.put('/admin/mon-compte', {
            preserveScroll: true,
            onSuccess: () => form.reset('current_password', 'password', 'password_confirmation'),
        });
    };

    const bind = (name, type = 'text', autoComplete) => ({
        type,
        autoComplete,
        className: inputClass,
        value: form.data[name],
        onChange: (e) => form.setData(name, e.target.value),
    });

    return (
        <AdminLayout title="Mon compte">
            <form onSubmit={submit} className="max-w-3xl space-y-6">
                {role && (
                    <Card className="p-5 text-sm">
                        <span className="text-muted-foreground">Rôle : </span>
                        <span className="font-semibold text-primary">{role.label}</span>
                        <span className="text-muted-foreground"> — {role.description}</span>
                        {user.last_login_at && (
                            <div className="mt-1 text-xs text-muted-foreground">Dernière connexion : {formatDate(user.last_login_at)}</div>
                        )}
                    </Card>
                )}

                <Card className="grid gap-5 p-6 md:grid-cols-2">
                    <Field label="Nom" error={form.errors.name}>
                        <input {...bind('name')} />
                    </Field>
                    <Field label="E-mail (identifiant de connexion)" error={form.errors.email}>
                        <input {...bind('email', 'email', 'username')} />
                    </Field>
                </Card>

                <Card className="grid gap-5 p-6 md:grid-cols-2">
                    <h2 className="font-bold text-white md:col-span-2">
                        Changer de mot de passe <span className="ml-1 text-xs font-normal text-muted-foreground">facultatif · 10 caractères minimum</span>
                    </h2>
                    <Field label="Nouveau mot de passe" error={form.errors.password}>
                        <input {...bind('password', 'password', 'new-password')} />
                    </Field>
                    <Field label="Confirmation">
                        <input {...bind('password_confirmation', 'password', 'new-password')} />
                    </Field>
                </Card>

                <Card className="p-6">
                    <Field label="Mot de passe actuel (obligatoire pour enregistrer)" error={form.errors.current_password}>
                        <input {...bind('current_password', 'password', 'current-password')} />
                    </Field>
                </Card>

                <button
                    type="submit"
                    disabled={form.processing}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-black hover:bg-primary/90 disabled:opacity-60"
                >
                    <Save size={16} />
                    {form.processing ? 'Enregistrement…' : 'Enregistrer'}
                </button>
            </form>
        </AdminLayout>
    );
}
