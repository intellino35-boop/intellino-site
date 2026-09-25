import { Head, Link } from '../Components/nav';
import { ArrowRight } from 'lucide-react';
import { Accent, CtaBanner, Eyebrow, PageHero, Reveal, SectionHeader, SubHeader } from '../Components/ui';
import { useBlocks, useBlockTuples } from '../hooks/useSite';
import SiteLayout from '../Layouts/SiteLayout';

export default function About() {
    // Textes gérés dans l'admin → « Blocs des pages ».
    const stats = useBlockTuples('chiffres', 'title', 'text');
    const pillars = useBlocks('piliers');
    const values = useBlockTuples('valeurs', 'icon', 'title', 'text');
    const domains = useBlockTuples('domaines', 'icon', 'title');
    const labSteps = useBlockTuples('etapes-lab', 'icon', 'title');
    const reasons = useBlockTuples('pourquoi', 'icon', 'title', 'text');
    const sectors = useBlockTuples('secteurs', 'icon', 'title');

    return (
        <SiteLayout>
            <Head title="À propos" />
            <PageHero
                breadcrumb={[['À propos']]}
                eyebrow="Qui sommes-nous ?"
                title={
                    <>
                        La technologie au service des <Accent>ambitions africaines</Accent>
                    </>
                }
                subtitle="IntellIno conçoit, intègre et développe des solutions technologiques pour les entreprises, les institutions et l'avenir de l'Afrique."
            />

            {/* Présentation + chiffres */}
            <section className="bg-[#080808] pb-24">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
                    <Reveal x={-30} y={0}>
                        <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                            IntellIno est une entreprise technologique qui accompagne les organisations dans leur transformation numérique tout
                            en développant progressivement ses propres solutions logicielles, électroniques et intelligentes.
                        </p>
                        <p className="leading-relaxed text-muted-foreground">
                            Nous intervenons dans 8 domaines clés, avec une équipe passionnée par l'innovation et ancrée dans les réalités
                            africaines. Au cœur de notre démarche, le IntellIno Technology Lab transforme les défis rencontrés sur le terrain
                            en produits concrets.
                        </p>
                    </Reveal>
                    <Reveal x={30} y={0} className="grid grid-cols-2 gap-4">
                        {stats.map(([value, label]) => (
                            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                                <div className="text-3xl font-black text-primary">{value}</div>
                                <div className="mt-1 text-sm text-muted-foreground">{label}</div>
                            </div>
                        ))}
                    </Reveal>
                </div>
            </section>

            {/* Mission, vision, approche */}
            <section className="bg-[#0a0a0a] py-24">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3">
                    {pillars.map((p, i) => (
                        <Reveal key={p.title} delay={i * 0.1}>
                            <div className="h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-7 transition-all hover:border-primary/30">
                                <div className="mb-4 text-4xl">{p.icon}</div>
                                <h2 className="mb-3 text-xl font-bold text-white">{p.title}</h2>
                                <p className="leading-relaxed text-muted-foreground">{p.text}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Valeurs */}
            <section className="bg-[#080808] py-24">
                <div className="mx-auto max-w-7xl px-4">
                    <SectionHeader
                        eyebrow="Nos valeurs"
                        title={
                            <>
                                Ce qui nous <Accent>guide</Accent>
                            </>
                        }
                    />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map(([icon, title, text], i) => (
                            <Reveal key={title} delay={i * 0.08}>
                                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all hover:border-primary/30 hover:bg-primary/5">
                                    <div className="mb-3 text-4xl">{icon}</div>
                                    <h3 className="mb-2 font-bold text-white">{title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Domaines */}
            <section className="bg-[#0a0a0a] py-24">
                <div className="mx-auto max-w-7xl px-4">
                    <SubHeader
                        title={
                            <>
                                Nos <Accent>8 domaines</Accent> d'expertise
                            </>
                        }
                        subtitle="Une offre complète, du logiciel à l'électronique, pour couvrir l'ensemble de vos besoins technologiques."
                    />
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {domains.map(([icon, label], i) => (
                            <Reveal key={label} y={20} delay={i * 0.05}>
                                <div className="flex h-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-primary/30 hover:bg-primary/5">
                                    <span className="text-2xl">{icon}</span>
                                    <span className="text-sm font-medium text-white/80">{label}</span>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Lab */}
            <section className="relative overflow-hidden bg-[#080808] py-24">
                <div className="pointer-events-none absolute top-1/2 left-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]" />
                <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
                    <Reveal>
                        <Eyebrow className="mb-6">🧪 Technology Lab</Eyebrow>
                        <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">
                            De l'idée au <Accent>produit</Accent>
                        </h2>
                        <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground italic">
                            "Imaginer aujourd'hui. Construire demain. Industrialiser l'avenir."
                        </p>
                    </Reveal>
                    <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
                        {labSteps.map(([icon, label], i) => (
                            <Reveal key={label} y={0} scale={0.9} delay={i * 0.06} className="flex items-center gap-2">
                                <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
                                    <span>{icon}</span>
                                    <span className="text-sm font-semibold text-white">{label}</span>
                                </div>
                                {i < labSteps.length - 1 && <ArrowRight size={16} className="text-primary/50" />}
                            </Reveal>
                        ))}
                    </div>
                    <Link
                        href="/lab/vision"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-primary/90"
                    >
                        Découvrir le Technology Lab <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Pourquoi IntellIno + secteurs */}
            <section className="bg-[#0a0a0a] py-24">
                <div className="mx-auto max-w-7xl px-4">
                    <SectionHeader
                        eyebrow="Pourquoi nous choisir ?"
                        title={
                            <>
                                Pourquoi <Accent>IntellIno</Accent> ?
                            </>
                        }
                    />
                    <div className="mb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {reasons.map(([icon, title, text], i) => (
                            <Reveal key={title} delay={i * 0.1}>
                                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all hover:border-primary/30 hover:bg-primary/5">
                                    <div className="mb-4 text-4xl">{icon}</div>
                                    <h3 className="mb-2 font-bold text-white">{title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <SubHeader
                        title={
                            <>
                                Les secteurs que nous <Accent>accompagnons</Accent>
                            </>
                        }
                    />
                    <div className="flex flex-wrap justify-center gap-3">
                        {sectors.map(([icon, label]) => (
                            <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
                                {icon} {label}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            <CtaBanner
                title={
                    <>
                        Construisons <Accent>ensemble</Accent>
                    </>
                }
                text="Vous avez un projet, un besoin ou une idée de partenariat ? Notre équipe est à votre écoute."
            />
        </SiteLayout>
    );
}
