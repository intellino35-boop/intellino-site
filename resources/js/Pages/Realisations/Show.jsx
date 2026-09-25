import { Head } from '@inertiajs/react';
import ArticleBody from '../../Components/ArticleBody';
import { RealisationCard } from '../../Components/cards';
import { Accent, CtaBanner, PageHero, Reveal, SubHeader } from '../../Components/ui';
import SiteLayout from '../../Layouts/SiteLayout';

function Fact({ label, value }) {
    if (!value) return null;
    return (
        <div>
            <div className="text-xs font-semibold tracking-wider text-white/50 uppercase">{label}</div>
            <div className="mt-1 font-semibold text-white">{value}</div>
        </div>
    );
}

export default function RealisationShow({ realisation: r, others }) {
    return (
        <SiteLayout>
            <Head title={r.title} />
            <PageHero
                breadcrumb={[
                    ['Réalisations', '/realisations'],
                    [r.title],
                ]}
                icon={r.icon}
                eyebrow={r.category}
                title={r.title}
                subtitle={r.description}
            />

            <section className="bg-[#080808] pb-24">
                <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 lg:grid-cols-3">
                    <Reveal x={-30} y={0} className="lg:col-span-2">
                        <h2 className="mb-6 text-3xl font-black text-white">
                            Le <Accent>projet</Accent>
                        </h2>
                        <ArticleBody text={r.details || r.description} />
                    </Reveal>
                    <Reveal x={30} y={0}>
                        <div className="space-y-5 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-7 lg:sticky lg:top-28">
                            <Fact label="Client" value={r.client} />
                            <Fact label="Domaine" value={r.category} />
                            <Fact label="Année" value={r.year} />
                            <div>
                                <div className="mb-2 text-xs font-semibold tracking-wider text-white/50 uppercase">Prestations</div>
                                <div className="flex flex-wrap gap-2">
                                    {r.tags.map((tag) => (
                                        <span key={tag} className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs text-primary">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {others.length > 0 && (
                <section className="bg-[#0a0a0a] py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <SubHeader
                            title={
                                <>
                                    Autres <Accent>réalisations</Accent>
                                </>
                            }
                        />
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {others.map((o, i) => (
                                <Reveal key={o.slug} delay={i * 0.08}>
                                    <RealisationCard realisation={o} />
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <CtaBanner
                title={
                    <>
                        Un projet <Accent>similaire</Accent> ?
                    </>
                }
                text="Nous pouvons reproduire et adapter cette solution à votre organisation."
            />
        </SiteLayout>
    );
}
