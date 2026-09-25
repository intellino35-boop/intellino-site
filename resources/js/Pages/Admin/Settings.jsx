import { useForm } from '@inertiajs/react';
import { ImageUp, Save } from 'lucide-react';
import AdminLayout, { Card } from '../../Layouts/AdminLayout';

const sections = [
    ['contact', 'Coordonnées', 'Affichées dans le pied de page, la section contact et la page Contact.'],
    ['images', 'Images', 'Formats JPG, PNG ou WebP, 4 Mo maximum. Logo : de préférence carré, fond transparent (PNG).'],
    ['legal', 'Informations légales', 'Utilisées par les pages Mentions légales et Confidentialité. Un champ vide y affiche « [À compléter] ».'],
];

const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none';

function ImageField({ field, current, form }) {
    const resetting = form.data.reset_images.includes(field.key);
    const file = form.data[field.key];

    const toggleReset = (checked) =>
        form.setData('reset_images', checked ? [...form.data.reset_images, field.key] : form.data.reset_images.filter((k) => k !== field.key));

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40 sm:w-44">
                <img
                    src={file ? URL.createObjectURL(file) : current}
                    alt={field.label}
                    className={`max-h-full max-w-full object-contain ${resetting ? 'opacity-30' : ''}`}
                />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-white hover:border-primary/40">
                    <ImageUp size={16} />
                    {file ? file.name : 'Choisir une nouvelle image'}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => form.setData(field.key, e.target.files[0] ?? null)}
                    />
                </label>
                {current?.startsWith('/images/uploads/') && !file && (
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

export default function Settings({ fields, values, overridden }) {
    const initial = { reset_images: [] };
    fields.forEach((f) => (initial[f.key] = f.type === 'image' ? null : (values[f.key] ?? '')));
    const form = useForm(initial);

    const submit = (e) => {
        e.preventDefault();
        form.post('/admin/parametres', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => form.setData((data) => ({ ...data, reset_images: [], logo: null, hero_image: null })),
        });
    };

    return (
        <AdminLayout title="Paramètres">
            <form onSubmit={submit} className="max-w-4xl space-y-6">
                <p className="text-sm text-muted-foreground">
                    Les valeurs saisies ici remplacent celles du fichier <code className="text-white/70">.env</code> du serveur. Videz un
                    champ pour revenir à la valeur du fichier .env.
                </p>

                {sections.map(([section, title, help]) => (
                    <Card key={section} className="p-6">
                        <h2 className="text-lg font-bold text-white">{title}</h2>
                        <p className="mb-5 text-sm text-muted-foreground">{help}</p>
                        <div className={section === 'images' ? 'space-y-6' : 'grid gap-5 md:grid-cols-2'}>
                            {fields
                                .filter((f) => f.section === section)
                                .map((field) => (
                                    <div key={field.key} className="space-y-1.5">
                                        <label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/70 uppercase">
                                            {field.label}
                                            {field.type !== 'image' && !overridden.includes(field.key) && values[field.key] && (
                                                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-normal tracking-normal text-white/50 normal-case">
                                                    valeur du .env
                                                </span>
                                            )}
                                        </label>
                                        {field.type === 'image' ? (
                                            <ImageField field={field} current={values[field.key]} form={form} />
                                        ) : (
                                            <input
                                                type={field.type}
                                                className={inputClass}
                                                value={form.data[field.key]}
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
        </AdminLayout>
    );
}
