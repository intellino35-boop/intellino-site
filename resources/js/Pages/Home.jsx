import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { PostCard, ProductCard, RealisationCard, SoftwareCard, SolutionCard } from '../Components/cards';
import ContactChannels from '../Components/ContactChannels';
import ContactForm from '../Components/ContactForm';
import { Accent, Eyebrow, Reveal, SectionHeader, SubHeader } from '../Components/ui';
import { useBlockTuples } from '../data/blocks';
import { gridPattern } from '../data/company';
import SiteLayout from '../Layouts/SiteLayout';

function PrimaryButton({ href, children, className = 'px-6 py-3' }) {
    return (
        <Link
            href={href}
            className={`inline-flex items-center gap-2 rounded-lg bg-primary text-sm font-bold text-black transition-all hover:scale-105 hover:bg-primary/90 ${className}`}
        >
            {children}
            <ArrowRight size={16} />
        </Link>
    );
}

function OutlineButton({ href, children }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-lg border border-primary/40 px-7 py-3.5 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-black"
        >
            {children}
            <ArrowRight size={16} />
        </Link>
    );
}

function Hero() {
    const { contact } = usePage().props;
    const stats = useBlockTuples('chiffres', 'title', 'text');

    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#080808]">
            <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: `url(${contact.heroImage})` }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-transparent to-[#080808]" />
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: gridPattern }} />
            <div className="pointer-events-none absolute top-1/3 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

            <div className="relative z-10 mx-auto max-w-5xl px-4 pt-24 text-center">
                <Reveal y={20}>
                    <Eyebrow className="mb-6 px-4 py-1.5">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                        Technologie · Innovation · Intelligence
                    </Eyebrow>
                </Reveal>
                <Reveal y={30} delay={0.1}>
                    <h1 className="mb-3 text-5xl leading-tight font-black tracking-tight text-white md:text-7xl">
                        <span className="text-primary">Intell</span>
                        <span className="text-white">ino</span>
                    </h1>
                </Reveal>
                <Reveal y={30} delay={0.2}>
                    <p className="mb-4 text-2xl font-semibold text-balance text-white/90 md:text-3xl">
                        Connecter l'Afrique, sécuriser ses rêves.
                    </p>
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-balance text-muted-foreground">
                        Nous concevons, intégrons et développons des solutions technologiques pour les entreprises, les institutions et
                        l'avenir de l'Afrique.
                    </p>
                </Reveal>
                <Reveal y={30} delay={0.3} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <PrimaryButton href="/solutions" className="px-7 py-3.5">
                        Nos solutions
                    </PrimaryButton>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-primary/50 hover:bg-white/5"
                    >
                        Parler à un expert
                    </Link>
                </Reveal>
                <Reveal y={30} delay={0.4} className="mt-16 flex flex-wrap items-center justify-center gap-8">
                    {stats.map(([value, label]) => (
                        <div key={label} className="text-center">
                            <div className="text-2xl font-black text-primary">{value}</div>
                            <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
                        </div>
                    ))}
                </Reveal>
            </div>

            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <ChevronDown size={24} />
            </motion.div>
        </section>
    );
}

function About() {
    const domains = useBlockTuples('domaines', 'icon', 'title');

    return (
        <section className="bg-[#0a0a0a] py-24">
            <div className="mx-auto max-w-7xl px-4">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    <Reveal x={-40} y={0}>
                        <Eyebrow className="mb-6">Qui sommes-nous ?</Eyebrow>
                        <h2 className="mb-6 text-4xl leading-tight font-black text-white md:text-5xl">
                            La technologie au service des <Accent>ambitions africaines</Accent>
                        </h2>
                        <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                            IntellIno est une entreprise technologique qui accompagne les organisations dans leur transformation numérique
                            tout en développant progressivement ses propres solutions logicielles, électroniques et intelligentes.
                        </p>
                        <p className="mb-8 leading-relaxed text-muted-foreground">
                            Nous intervenons dans 8 domaines clés, avec une équipe passionnée par l'innovation et ancrée dans les réalités
                            africaines.
                        </p>
                        <PrimaryButton href="/a-propos">Découvrir IntellIno</PrimaryButton>
                    </Reveal>
                    <div className="grid grid-cols-2 gap-3">
                        {domains.map(([icon, label], i) => (
                            <Reveal key={label} y={20} delay={i * 0.05}>
                                <div className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-primary/30 hover:bg-primary/5">
                                    <span className="text-2xl">{icon}</span>
                                    <span className="text-sm font-medium text-white/80 transition-colors group-hover:text-white">{label}</span>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Solutions({ solutions }) {
    return (
        <section id="solutions" className="bg-[#080808] py-24">
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeader
                    eyebrow="Ce que nous faisons"
                    title={
                        <>
                            Nos <Accent>Solutions</Accent>
                        </>
                    }
                    subtitle="Des solutions adaptées aux besoins des entreprises africaines, conçues pour être efficaces et durables."
                />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {solutions.map((s, i) => (
                        <Reveal key={s.slug} delay={i * 0.08}>
                            <SolutionCard solution={s} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TechnologyLab() {
    const labSteps = useBlockTuples('etapes-lab', 'icon', 'title');

    return (
        <section className="relative overflow-hidden bg-[#0a0a0a] py-24">
            <div className="pointer-events-none absolute top-1/2 right-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]" />
            <div className="relative z-10 mx-auto max-w-7xl px-4">
                <div className="grid items-center gap-16 lg:grid-cols-2">
                    <Reveal x={-40} y={0}>
                        <Eyebrow className="mb-6">🧪 Technology Lab</Eyebrow>
                        <h2 className="mb-4 text-4xl leading-tight font-black text-white md:text-5xl">
                            IntellIno <Accent>Technology Lab</Accent>
                        </h2>
                        <p className="mb-4 text-xl font-semibold text-white/80 italic">
                            "Imaginer aujourd'hui. Construire demain. Industrialiser l'avenir."
                        </p>
                        <p className="mb-6 leading-relaxed text-muted-foreground">
                            Le IntellIno Technology Lab est notre pôle de recherche, d'innovation et de développement de produits
                            technologiques. Nous transformons les défis réels en solutions concrètes conçues pour l'Afrique et ouvertes sur le
                            monde.
                        </p>
                        <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-4">
                            <p className="text-lg leading-relaxed font-semibold text-white">
                                L'Afrique ne doit pas seulement <Accent>consommer</Accent> la technologie.
                                <br />
                                Elle doit aussi la <Accent>créer.</Accent>
                            </p>
                        </div>
                        <PrimaryButton href="/lab/vision">Découvrir le Technology Lab</PrimaryButton>
                    </Reveal>
                    <div className="space-y-3">
                        {labSteps.map(([icon, label], i) => (
                            <Reveal key={label} x={30} y={0} delay={i * 0.07} className="flex items-center gap-4">
                                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-lg">
                                    {icon}
                                    {i < labSteps.length - 1 && (
                                        <div className="absolute top-full left-1/2 h-3 w-0.5 -translate-x-1/2 bg-primary/30" />
                                    )}
                                </div>
                                <div className="flex flex-1 items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5 transition-colors hover:border-primary/20">
                                    <span className="font-semibold text-white">{label}</span>
                                    <span className="text-xs text-muted-foreground">Étape {i + 1}</span>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Products({ products, softwares }) {
    return (
        <section id="produits" className="bg-[#080808] py-24">
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeader
                    eyebrow="Nos Produits"
                    title={
                        <>
                            Produits <Accent>IntellIno</Accent>
                        </>
                    }
                    subtitle="Des produits technologiques conçus et développés par le IntellIno Technology Lab."
                />
                <div className="mb-20 grid gap-6 md:grid-cols-3">
                    {products.map((p, i) => (
                        <Reveal key={p.slug} delay={i * 0.1}>
                            <ProductCard product={p} />
                        </Reveal>
                    ))}
                </div>

                <SubHeader
                    title={
                        <>
                            Logiciels & <Accent>SaaS</Accent>
                        </>
                    }
                    subtitle="Des solutions logicielles adaptées à chaque secteur d'activité."
                />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {softwares.map((s, i) => (
                        <Reveal key={s.slug} y={20} delay={i * 0.08}>
                            <SoftwareCard software={s} />
                        </Reveal>
                    ))}
                </div>
                <div className="mt-10 text-center">
                    <OutlineButton href="/produits">Découvrir tous nos produits</OutlineButton>
                </div>
            </div>
        </section>
    );
}

function WhyUs() {
    const reasons = useBlockTuples('pourquoi', 'icon', 'title', 'text');
    const sectors = useBlockTuples('secteurs', 'icon', 'title');

    return (
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
                <div className="mb-24 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                            Nos <Accent>Secteurs</Accent>
                        </>
                    }
                    subtitle="IntellIno intervient dans tous les secteurs d'activité pour une transformation numérique inclusive."
                />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {sectors.map(([icon, label], i) => (
                        <Reveal key={label} y={0} scale={0.9} delay={i * 0.05}>
                            <div className="group flex cursor-default flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition-all hover:border-primary/30 hover:bg-primary/5">
                                <span className="text-3xl">{icon}</span>
                                <span className="text-sm font-semibold text-white/80 transition-colors group-hover:text-white">{label}</span>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Realisations({ realisations, posts }) {
    return (
        <section className="bg-[#080808] py-24">
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeader
                    eyebrow="Ils nous font confiance"
                    title={
                        <>
                            Nos <Accent>Réalisations</Accent>
                        </>
                    }
                    subtitle="Des projets concrets, des résultats mesurables."
                />
                <div className="mb-10 grid gap-6 md:grid-cols-2">
                    {realisations.map((r, i) => (
                        <Reveal key={r.slug} delay={i * 0.08}>
                            <RealisationCard realisation={r} />
                        </Reveal>
                    ))}
                </div>
                <div className="mb-24 text-center">
                    <OutlineButton href="/realisations">Voir toutes nos réalisations</OutlineButton>
                </div>

                <Reveal className="mb-12 text-center">
                    <Eyebrow>Actualités</Eyebrow>
                    <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">
                        Blog & <Accent>Innovations</Accent>
                    </h2>
                </Reveal>
                <div className="grid gap-6 md:grid-cols-3">
                    {posts.map((post, i) => (
                        <Reveal key={post.slug} delay={i * 0.1}>
                            <PostCard post={post} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Contact() {
    return (
        <section id="contact" className="bg-[#0a0a0a] py-24">
            <div className="mx-auto mb-16 max-w-7xl px-4">
                <Reveal>
                    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-10 text-center md:p-14">
                        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: gridPattern }} />
                        <div className="relative z-10">
                            <h2 className="mb-4 text-3xl font-black text-balance text-white md:text-5xl">
                                L'Afrique ne doit pas seulement <Accent>consommer</Accent> la technologie.
                                <br />
                                Elle doit aussi la <Accent>créer.</Accent>
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                                IntellIno Technology Lab travaille à transformer les défis réels en produits technologiques conçus pour
                                l'Afrique et ouverts sur le monde.
                            </p>
                        </div>
                    </div>
                </Reveal>
            </div>

            <div className="mx-auto max-w-7xl px-4">
                <SectionHeader
                    className="mb-12"
                    eyebrow="Nous contacter"
                    title={
                        <>
                            Parlons de votre <Accent>projet</Accent>
                        </>
                    }
                    subtitle="Vous avez un besoin technologique ou une idée ? Notre équipe vous accompagne de la réflexion à la mise en œuvre."
                />
                <div className="grid gap-10 lg:grid-cols-3">
                    <Reveal x={-30} y={0}>
                        <ContactChannels />
                    </Reveal>
                    <Reveal x={30} y={0} className="lg:col-span-2">
                        <ContactForm />
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

export default function Home({ solutions, products, softwares, realisations, posts }) {
    return (
        <SiteLayout>
            <Head title="Accueil" />
            <Hero />
            <About />
            <Solutions solutions={solutions} />
            <TechnologyLab />
            <Products products={products} softwares={softwares} />
            <WhyUs />
            <Realisations realisations={realisations} posts={posts} />
            <Contact />
        </SiteLayout>
    );
}
