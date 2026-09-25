import { ImageUp, Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { AsyncContent } from '../../Components/states';
import { useNotify } from '../../hooks/useNotify';
import { useApi } from '../../hooks/useApi';
import { useForm } from '../../hooks/useForm';
import AdminLayout, { Card } from '../../Layouts/AdminLayout';
import { asArray, asObject } from '../../lib/safe';
import { settingsService } from '../../services/admin';

const sections = [
    ['contact', 'Coordonnées', 'Affichées dans le pied de page, la section contact et la page Contact.'],
    ['images', 'Images', 'Formats JPG, PNG ou WebP, 4 Mo maximum. Logo : de préférence carré, fond transparent (PNG).'],
    ['legal', 'Informations légales', 'Utilisées par les pages Mentions légales et Confidentialité. Un champ vide y affiche « [À compléter] ».'],
];

const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none';

function ImageField({ field, current, form }) {
    const resetImages = asArray(form.data.reset_images);
    const resetting = resetImages.includes(field.key);
    const file = form.data[field.key] instanceof File ? form.data[field.key] : null;

    // Aperçu de l'image choisie (URL temporaire libérée ensuite pour éviter les fuites mémoire).
    const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
    useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

    const toggleReset = (checked) =>
        form.setData('reset_images', checked ? [...resetImages, field.key] : resetImages.filter((k) => k !== field.key));

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40 sm:w-44">
                <img src={preview ?? current} alt={field.label} className={`max-h-full max-w-full object-contain ${resetting ? 'opacity-30' : ''}`} />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-white hover:border-primary/40">
                    <ImageUp size={16} />
                    {file ? file.name : 'Choisir une nouvelle image'}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => form.setData(field.key, e.target.files?.[0] ?? null)}
                    />
                </label>
                {/* Image envoyée depuis l'admin (servie par l'API) : possibilité de revenir à celle du site. */}
                {String(current ?? '').includes('/images/uploads/') && !file && (
                    <label className="flex items-center gap-2 text-sm text-white/70">
                        <input type="checkbox" checked={resetting} onChange={(e) => toggleReset(e.target.checked)} />
                        Revenir à l'image d'origine du site
                    </label>
                )}
                <p className="truncate text-xs text-muted-foreground">Actuellement : {current}</p>
            </div>
        </div>
    );
}

/** Données du formulaire → multipart/form-data (texte + fichiers). */
function toFormData(fields, data) {
    const formData = new FormData();
    asArray(fields).forEach((f) => {
        const value = data[f.key];
        if (f.type === 'image') {
            if (value instanceof File) formData.append(f.key, value);
        } else {
            formData.append(f.key, value ?? '');
        }
    });
    asArray(data.reset_images).forEach((key) => formData.append('reset_images[]', key));
    return formData;
}

function SettingsForm({ fields, values, overridden, onSaved }) {
    const { notify } = useNotify();
    const safeFields = asArray(fields);
    const safeValues = asObject(values);
    const safeOverridden = asArray(overridden);

    const form = useForm({
        reset_images: [],
        ...Object.fromEntries(safeFields.map((f) => [f.key, f.type === 'image' ? null : (safeValues[f.key] ?? '')])),
    });

    const onSubmit = (e) => {
        e.preventDefault();
        form.submit(() => settingsService.save(toFormData(safeFields, form.data)), {
            onSuccess: (response) => {
                notify(response?.message || 'Paramètres enregistrés.');
                onSaved(); // recharge les valeurs effectives (base ou .env)
            },
        });
    };

    return (
        <form onSubmit={onSubmit} className="max-w-4xl space-y-6">
            <p className="text-sm text-muted-foreground">
                Les valeurs saisies ici remplacent celles du fichier <code className="text-white/70">.env</code> du serveur. Videz un champ
                pour revenir à la valeur du fichier .env.
            </p>
            {form.errors.form && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{form.errors.form}</div>}

            {sections.map(([section, title, help]) => (
                <Card key={section} className="p-6">
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <p className="mb-5 text-sm text-muted-foreground">{help}</p>
                    <div className={section === 'images' ? 'space-y-6' : 'grid gap-5 md:grid-cols-2'}>
                        {safeFields
                            .filter((f) => f.section === section)
                            .map((field) => (
                                <div key={field.key} className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/70 uppercase">
                                        {field.label}
                                        {field.type !== 'image' && !safeOverridden.includes(field.key) && safeValues[field.key] && (
                                            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-normal tracking-normal text-white/50 normal-case">
                                                valeur du .env
                                            </span>
                                        )}
                                    </label>
                                    {field.type === 'image' ? (
                                        <ImageField field={field} current={safeValues[field.key]} form={form} />
                                    ) : (
                                        <input
                                            type={field.type}
                                            className={inputClass}
                                            value={form.data[field.key] ?? ''}
                                            onChange={(e) => form.setData(field.key, e.target.value)}
                                        />
                                    )}
                                    {form.errors[field.key] && <p className="text-xs text-red-400">{form.errors[field.key]}</p>}
                                </div>
                            ))}
                    </div>
                </Card>
            ))}

            <button
                type="submit"
                disabled={form.processing}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-black hover:bg-primary/90 disabled:opacity-60"
            >
                <Save size={16} />
                {form.processing ? 'Enregistrement…' : 'Enregistrer les paramètres'}
            </button>
        </form>
    );
}

export default function Settings() {
    const state = useApi(() => settingsService.get(), []);
    // Après enregistrement, le formulaire est recréé avec les nouvelles valeurs (clé = version des données).
    const version = JSON.stringify(state.data?.values ?? null);

    return (
        <AdminLayout title="Paramètres">
            <AsyncContent state={state}>{(data) => <SettingsForm key={version} {...data} onSaved={state.reload} />}</AsyncContent>
        </AdminLayout>
    );
}
