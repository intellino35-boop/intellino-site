import { CheckCircle2, Send, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { subjects } from '../data/subjects';
import { useForm } from '../hooks/useForm';
import { contactService } from '../services/contact';

const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-colors placeholder:text-white/30 focus:border-primary/50 focus:outline-none';

function Field({ label, error, children }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold tracking-wider text-white/70 uppercase">{label}</label>
            {children}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}

export default function ContactForm() {
    const [searchParams] = useSearchParams();
    const [success, setSuccess] = useState(null);

    // Pré-rempli depuis les liens « Parler à un expert » des pages Solutions / Produits (?sujet=...).
    const presetSubject = searchParams.get('sujet');
    const { data, setData, errors, processing, reset, submit } = useForm({
        nom: '',
        organisation: '',
        telephone: '',
        email: '',
        sujet: subjects.some(([value]) => value === presetSubject) ? presetSubject : '',
        message: '',
    });

    const onSubmit = (e) => {
        e.preventDefault();
        setSuccess(null);
        submit(() => contactService.send(data), {
            onSuccess: (message) => {
                setSuccess(message || 'Merci ! Votre message a bien été envoyé.');
                reset();
            },
        });
    };

    const bind = (name) => ({ name, value: data[name] ?? '', onChange: (e) => setData(name, e.target.value) });

    return (
        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8" noValidate={false}>
            {success && (
                <div role="status" className="flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    {success}
                </div>
            )}
            {errors.form && (
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                    <TriangleAlert size={18} className="mt-0.5 shrink-0" />
                    {errors.form}
                </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nom *" error={errors.nom}>
                    <input required placeholder="Jean Dupont" className={inputClass} {...bind('nom')} />
                </Field>
                <Field label="Organisation" error={errors.organisation}>
                    <input placeholder="Ma société" className={inputClass} {...bind('organisation')} />
                </Field>
                <Field label="Téléphone" error={errors.telephone}>
                    <input placeholder="+XXX XX XX XX XX" className={inputClass} {...bind('telephone')} />
                </Field>
                <Field label="E-mail *" error={errors.email}>
                    <input required type="email" placeholder="exemple@gmail.com" className={inputClass} {...bind('email')} />
                </Field>
            </div>

            <Field label="Sujet *" error={errors.sujet}>
                <select required className={`${inputClass} bg-[#111]`} {...bind('sujet')}>
                    <option value="" disabled>
                        Choisir un sujet
                    </option>
                    {subjects.map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </Field>

            <Field label="Message *" error={errors.message}>
                <textarea
                    required
                    rows={5}
                    placeholder="Décrivez votre projet ou besoin..."
                    className={`${inputClass} resize-none`}
                    {...bind('message')}
                />
            </Field>

            <button
                type="submit"
                disabled={processing}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-black transition-all hover:scale-[1.01] hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
            >
                <Send size={16} />
                {processing ? 'Envoi en cours…' : 'Envoyer le message'}
            </button>
        </form>
    );
}
