import { useMemo, useState } from 'react';
import { RealisationCard } from '../../Components/cards';
import { Head } from '../../Components/nav';
import { AsyncContent } from '../../Components/states';
import { Accent, CtaBanner, PageHero, Reveal } from '../../Components/ui';
import { useApi } from '../../hooks/useApi';
import SiteLayout from '../../Layouts/SiteLayout';
import { asArray } from '../../lib/safe';
import { realisationsService } from '../../services/realisations';

const filterClass = (on) =>
    `cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        on ? 'border-primary bg-primary text-black' : 'border-white/15 text-white/70 hover:border-primary/40 hover:text-white'
    }`;

/** Liste filtrable par catégorie (filtre côté navigateur : peu d'éléments). */
function RealisationsGrid({ realisations }) {
    const items = asArray(realisations);
    const categories = useMemo(() => [...new Set(items.map((r) => r?.category).filter(Boolean))], [items]);
    const [active, setActive] = useState(null);
    const visible = active ? items.filter((r) => r?.category === active) : items;

    return (
        <div className="mx-auto max-w-7xl px-4">
            {categories.length > 1 && (
                <div className="mb-10 flex flex-wrap justify-center gap-2">
                    <button type="button" onClick={() => setActive(null)} className={filterClass(active === null)}>
                        Tous ({items.length})
                    </button>
                    {categories.map((c) => (
                        <button key={c} type="button" onClick={() => setActive(c)} className={filterClass(active === c)}>
                            {c}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {visible.map((r, i) => (
                    <Reveal key={r.id ?? r.slug} delay={i * 0.06}>
                        <RealisationCard realisation={r} />
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

export default function RealisationsIndex() {
    const state = useApi(() => realisationsService.list(), []);

    return (
        <SiteLayout>
            <Head title="Nos réalisations" />
            <PageHero
                breadcrumb={[['Réalisations']]}
                eyebrow="Ils nous font confiance"
                title={
                    <>
                        Nos <Accent>Réalisations</Accent>
                    </>
                }
                subtitle="Des projets concrets, des résultats mesurables : découvrez comment nous accompagnons entreprises et institutions."
            />

            <section className="bg-[#080808] pb-24">
                <AsyncContent state={state} isEmpty={(data) => asArray(data).length === 0} empty="Aucune réalisation pour le moment.">
                    {(realisations) => <RealisationsGrid realisations={realisations} />}
                </AsyncContent>
            </section>

            <CtaBanner
                title={
                    <>
                        Votre projet sera <Accent>le prochain</Accent> ?
                    </>
                }
                text="Parlez-nous de votre besoin : nous étudions votre contexte et vous proposons une solution sur mesure."
            />
        </SiteLayout>
    );
}
