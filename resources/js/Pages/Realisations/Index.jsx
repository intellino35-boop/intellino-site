import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { RealisationCard } from '../../Components/cards';
import { Accent, CtaBanner, PageHero, Reveal } from '../../Components/ui';
import SiteLayout from '../../Layouts/SiteLayout';

export default function RealisationsIndex({ realisations }) {
    const categories = useMemo(() => [...new Set(realisations.map((r) => r.category))], [realisations]);
    const [active, setActive] = useState(null);
    const visible = active ? realisations.filter((r) => r.category === active) : realisations;

    const filterClass = (on) =>
        `cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            on ? 'border-primary bg-primary text-black' : 'border-white/15 text-white/70 hover:border-primary/40 hover:text-white'
        }`;

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
                <div className="mx-auto max-w-7xl px-4">
                    {categories.length > 1 && (
                        <div className="mb-10 flex flex-wrap justify-center gap-2">
                            <button type="button" onClick={() => setActive(null)} className={filterClass(active === null)}>
                                Tous ({realisations.length})
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
                            <Reveal key={r.slug} delay={i * 0.06}>
                                <RealisationCard realisation={r} />
                            </Reveal>
                        ))}
                    </div>
                </div>
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
