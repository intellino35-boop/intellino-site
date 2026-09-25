import { Head } from '@inertiajs/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SoftwareCard } from '../../Components/cards';
import { Accent, CtaBanner, PageHero, Reveal, SubHeader } from '../../Components/ui';
import { useBlockTuples } from '../../data/blocks';
import SiteLayout from '../../Layouts/SiteLayout';

export default function SoftwareShow({ software, others }) {
    const advantages = useBlockTuples('atouts-logiciels', 'icon', 'title', 'text');

    return (
        <SiteLayout>
            <Head title={software.name} />
            <PageHero
                breadcrumb={[
                    ['Logiciels', '/logiciels'],
                    [software.name],
                ]}
                icon={software.icon}
                title={software.name}
                subtitle={software.description}
            >
                <a
                    href="/contact?sujet=solutions"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-primary/90"
                >
                    Demander une démo <ArrowRight size={16} />
                </a>
            </PageHero>

            <section className="bg-[#080808] pb-24">
                <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 lg:grid-cols-5">
                    <Reveal x={-30} y={0} className="lg:col-span-3">
                        <h2 className="mb-5 text-3xl font-black text-white md:text-4xl">
                            Présentation <Accent>du logiciel</Accent>
                        </h2>
                        <p className="mb-8 text-lg leading-relaxed whitespace-pre-line text-muted-foreground">
                            {software.details || software.description}
                        </p>
                        {software.audiences?.length > 0 && (
                            <>
                                <h3 className="mb-3 text-sm font-semibold tracking-wider text-white uppercase">Pour qui ?</h3>
                                <div className="flex flex-wrap gap-2">
                                    {software.audiences.map((a) => (
                                        <span key={a} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
                                            {a}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </Reveal>
                    {software.features?.length > 0 && (
                        <Reveal x={30} y={0} className="lg:col-span-2">
                            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-7">
                                <h3 className="mb-5 text-sm font-semibold tracking-wider text-white uppercase">Modules</h3>
                                <ul className="space-y-3">
                                    {software.features.map((f) => (
                                        <li key={f} className="flex items-start gap-3 text-white/85">
                                            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    )}
                </div>
            </section>

            <section className="bg-[#0a0a0a] py-24">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3">
                    {advantages.map(([icon, title, text], i) => (
                        <Reveal key={title} delay={i * 0.1}>
                            <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                                <div className="mb-3 text-4xl">{icon}</div>
                                <h3 className="mb-2 font-bold text-white">{title}</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {others.length > 0 && (
                <section className="bg-[#080808] py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <SubHeader
                            title={
                                <>
                                    Nos autres <Accent>logiciels</Accent>
                                </>
                            }
                        />
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {others.map((o) => (
                                <SoftwareCard key={o.slug} software={o} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <CtaBanner
                title={
                    <>
                        Découvrez <Accent>{software.name}</Accent> en action
                    </>
                }
                text="Demandez une démonstration : nous vous présentons le logiciel et étudions son adaptation à votre organisation."
                sujet="solutions"
            />
        </SiteLayout>
    );
}
