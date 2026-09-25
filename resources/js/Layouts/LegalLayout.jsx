import { Head, Link } from '@inertiajs/react';
import { Accent, PageHero } from '../Components/ui';
import SiteLayout from './SiteLayout';

// Valeur légale issue de la configuration ; affiche un repère visible tant qu'elle n'est pas renseignée.
export function Fill({ value, label }) {
    if (value) return <span className="text-white">{value}</span>;
    return (
        <span className="rounded bg-primary/15 px-1.5 py-0.5 font-semibold text-primary" title="À renseigner dans le fichier .env">
            [À compléter : {label}]
        </span>
    );
}

export function Section({ id, title, children }) {
    return (
        <section id={id} className="scroll-mt-28">
            <h2 className="mb-4 text-2xl font-black text-white">{title}</h2>
            <div className="space-y-4 leading-relaxed text-white/75 [&_a]:font-semibold [&_a]:text-primary [&_a:hover]:underline [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
                {children}
            </div>
        </section>
    );
}

export default function LegalLayout({ title, accent, updatedAt, sections, children }) {
    const updated = new Date(updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <SiteLayout>
            <Head title={`${title} ${accent}`} />
            <PageHero
                breadcrumb={[[`${title} ${accent}`]]}
                title={
                    <>
                        {title} <Accent>{accent}</Accent>
                    </>
                }
                subtitle={`Dernière mise à jour : ${updated}`}
            />

            <div className="bg-[#080808] pb-24">
                <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-4">
                    <aside className="hidden lg:block">
                        <nav className="sticky top-28 space-y-1 border-l border-white/10">
                            {sections.map(([id, label]) => (
                                <a key={id} href={`#${id}`} className="block border-l-2 border-transparent py-1.5 pl-4 text-sm text-muted-foreground -ml-px hover:border-primary hover:text-white">
                                    {label}
                                </a>
                            ))}
                        </nav>
                    </aside>
                    <article className="space-y-12 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-10 lg:col-span-3">{children}</article>
                </div>
                <p className="mx-auto mt-8 max-w-6xl px-4 text-center text-xs text-muted-foreground">
                    Voir aussi :{' '}
                    <Link href="/mentions-legales" className="text-primary hover:underline">
                        Mentions légales
                    </Link>{' '}
                    ·{' '}
                    <Link href="/confidentialite" className="text-primary hover:underline">
                        Politique de confidentialité
                    </Link>
                </p>
            </div>
        </SiteLayout>
    );
}
