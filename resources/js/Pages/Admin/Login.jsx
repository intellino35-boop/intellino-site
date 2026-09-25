import { Head, useForm, usePage } from '@inertiajs/react';
import { LogIn } from 'lucide-react';

const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none';

export default function Login() {
    const { contact } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '', remember: false });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
            <Head title="Connexion" />
            <div className="pointer-events-none fixed top-1/3 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

            <form onSubmit={submit} className="relative w-full max-w-sm space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8">
                <div className="text-center">
                    <img src={contact.logo} alt="IntellIno" className="mx-auto mb-4 h-12 w-auto" />
                    <h1 className="text-2xl font-black text-white">Espace administration</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Connectez-vous pour gérer le site.</p>
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="username"
                        autoFocus
                        className={inputClass}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="password" className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                        Mot de passe
                    </label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        className={inputClass}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
                </div>

                <label className="flex items-center gap-2 text-sm text-white/70">
                    <input
                        type="checkbox"
                        className="accent-[oklch(0.65_0.22_41)]"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    Se souvenir de moi
                </label>

                <button
                    type="submit"
                    disabled={processing}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-black transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                    <LogIn size={16} />
                    {processing ? 'Connexion…' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
}
