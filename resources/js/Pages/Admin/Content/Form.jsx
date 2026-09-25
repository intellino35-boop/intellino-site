import { Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import AdminLayout, { Card } from '../../../Layouts/AdminLayout';

const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-primary/50 focus:outline-none';

// Valeur initiale d'un champ : les listes sont éditées sous forme de texte (une ligne par élément).
function initialValue(field, item) {
    const value = item?.[field.name];
    if (field.type === 'list') return (value ?? []).join('\n');
    if (field.type === 'date') return value ? value.slice(0, 10) : new Date().toISOString().slice(0, 10);
    if (field.type === 'number') return value ?? field.default ?? '';
    if (field.type === 'select') return value ?? field.options[0];
    return value ?? '';
}

function toPayload(fields, data) {
    return Object.fromEntries(
        fields.map((f) => [
            f.name,
            f.type === 'list'
                ? data[f.name]
                      .split('\n')
                      .map((s) => s.trim())
                      .filter(Boolean)
                : data[f.name],
        ]),
    );
}

function Input({ field, value, onChange }) {
    switch (field.type) {
        case 'textarea':
            return <textarea rows={field.rows ?? 4} className={`${inputClass} resize-y`} value={value} onChange={onChange} />;
        case 'list':
            return <textarea rows={5} className={`${inputClass} resize-y`} value={value} onChange={onChange} />;
        case 'select':
            return (
                <select className={`${inputClass} bg-[#111]`} value={value} onChange={onChange}>
                    {field.options.map((o) => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
            );
        default:
            return <input type={field.type} className={inputClass} value={value} onChange={onChange} />;
    }
}

export default function ContentForm({ resource, item }) {
    const base = `/admin/contenu/${resource.type}`;
    const initial = Object.fromEntries(resource.fields.map((f) => [f.name, initialValue(f, item)]));
    const form = useForm(initial);

    const submit = (e) => {
        e.preventDefault();
        form.transform((data) => toPayload(resource.fields, data));
        item ? form.put(`${base}/${item.id}`) : form.post(base);
    };

    // Les erreurs d'une liste peuvent porter sur un élément (ex. "items.2").
    const errorFor = (name) =>
        form.errors[name] ?? Object.entries(form.errors).find(([key]) => key.startsWith(`${name}.`))?.[1];

    return (
        <AdminLayout title={item ? `Modifier : ${item[resource.title]}` : `Nouvel élément — ${resource.label}`}>
            <form onSubmit={submit} className="max-w-3xl">
                <Card className="space-y-5 p-6">
                    {resource.fields.map((field) => (
                        <div key={field.name} className="space-y-1.5">
                            <label className="text-xs font-semibold tracking-wider text-white/70 uppercase">
                                {field.label}
                                {field.required && <span className="text-primary"> *</span>}
                            </label>
                            <Input field={field} value={form.data[field.name]} onChange={(e) => form.setData(field.name, e.target.value)} />
                            {errorFor(field.name) && <p className="text-xs text-red-400">{errorFor(field.name)}</p>}
                        </div>
                    ))}
                </Card>

                <div className="mt-5 flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-black hover:bg-primary/90 disabled:opacity-60"
                    >
                        <Save size={16} />
                        {form.processing ? 'Enregistrement…' : 'Enregistrer'}
                    </button>
                    <Link href={base} className="px-3 py-2.5 text-sm text-white/60 hover:text-white">
                        Annuler
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
