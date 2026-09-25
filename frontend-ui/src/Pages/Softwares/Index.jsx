import { ArrowRight } from 'lucide-react';
import { Head, Link } from '../../Components/nav';
import { AsyncContent } from '../../Components/states';
import { Accent, Bullet, CtaBanner, PageHero, Reveal } from '../../Components/ui';
import { useApi } from '../../hooks/useApi';
import SiteLayout from '../../Layouts/SiteLayout';
import { asArray } from '../../lib/safe';
import { softwaresService } from '../../services/softwares';

export default function SoftwaresIndex() {
    const state = useApi(() => softwaresService.list(), []);

    return (
        <SiteLayout>
            <Head title="Logiciels & SaaS" />
            <PageHero
                breadcrumb={[['Logiciels']]}
                eyebrow="Logiciels & SaaS"
                title={
                    <>
                        Des logiciels pour <Accent>chaque secteur</Accent>
                    </>
                }
                subtitle="Des solutions en ligne, accessibles partout, conçues pour les écoles, les entreprises et les institutions africaines."
            />

            <section className="bg-[#080808] pb-24">
                <AsyncContent state={state} isEmpty={(data) => asArray(data).length === 0} empty="Aucun logiciel pour le moment.">
                    {(softwares) => (
                        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2">
                            {asArray(softwares).map((s, i) => {
                                const features = asArray(s.features);
                                return (
                                    <Reveal key={s.id ?? s.slug} delay={i * 0.08}>
                                        <Link
                                            href={`/logiciels/${s.slug}`}
                                            className="group flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-7 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-black/40"
                                        >
                                            <div className="mb-4 flex items-center gap-4">
                                                <span className="text-5xl">{s.icon}</span>
                                                <div>
                                                    <h2 className="text-xl font-bold text-white transition-colors group-hover:text-primary">{s.name}</h2>
                                                    <p className="text-sm text-muted-foreground">{s.description}</p>
                                                </div>
                                            </div>
                                            {features.length > 0 && (
                                                <ul className="mb-6 grid flex-1 gap-2 sm:grid-cols-2">
                                                    {features.slice(0, 6).map((f) => (
                                                        <Bullet key={f} big className="text-white/70">
                                                            {f}
                                                        </Bullet>
                                                    ))}
                                                </ul>
                                            )}
                                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                                                Découvrir <ArrowRight size={14} />
                                            </span>
                                        </Link>
                                    </Reveal>
                                );
                            })}
                        </div>
                    )}
                </AsyncContent>
            </section>

            <CtaBanner
                title={
                    <>
                        Besoin d'un logiciel <Accent>sur mesure</Accent> ?
                    </>
                }
                text="Nous adaptons nos logiciels à vos processus, ou développons l'outil dont vous avez besoin."
                sujet="solutions"
            />
        </SiteLayout>
    );
}
