import { Head, Link } from '../Components/nav';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import ContactChannels from '../Components/ContactChannels';
import ContactForm from '../Components/ContactForm';
import { Accent, PageHero, Reveal, SectionHeader } from '../Components/ui';
import { useBlockTuples } from '../hooks/useSite';
import SiteLayout from '../Layouts/SiteLayout';

function FaqItem({ question, answer, link }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 transition-colors hover:border-primary/20">
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-white"
            >
                {question}
                <ChevronDown size={18} className={`shrink-0 text-primary transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {answer}
                    {link && (
                        <>
                            {' '}
                            <Link href={link} className="font-semibold text-primary hover:underline">
                                En savoir plus
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default function Contact() {
    // Textes gérés dans l'admin → « Blocs des pages ».
    const nextSteps = useBlockTuples('apres-contact', 'icon', 'title', 'text');
    const faq = useBlockTuples('faq', 'title', 'text', 'link');

    return (
        <SiteLayout>
            <Head title="Contact" />
            <PageHero
                breadcrumb={[['Contact']]}
                eyebrow="Nous contacter"
                title={
                    <>
                        Parlons de votre <Accent>projet</Accent>
                    </>
                }
                subtitle="Vous avez un besoin technologique ou une idée ? Notre équipe vous accompagne de la réflexion à la mise en œuvre."
            />

            <section className="bg-[#080808] pb-24">
                <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-3">
                    <Reveal x={-30} y={0}>
                        <ContactChannels />
                        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-relaxed text-white/80">
                            <span className="font-semibold text-primary">Partenariats & presse : </span>
                            choisissez le sujet « Partenariat » dans le formulaire, votre demande sera orientée vers la bonne personne.
                        </div>
                    </Reveal>
                    <Reveal x={30} y={0} className="lg:col-span-2">
                        <ContactForm />
                    </Reveal>
                </div>
            </section>

            <section className="bg-[#0a0a0a] py-24">
                <div className="mx-auto max-w-7xl px-4">
                    <SectionHeader
                        eyebrow="Et ensuite ?"
                        title={
                            <>
                                Après votre <Accent>message</Accent>
                            </>
                        }
                    />
                    <div className="grid gap-6 md:grid-cols-3">
                        {nextSteps.map(([icon, title, text], i) => (
                            <Reveal key={title} delay={i * 0.1}>
                                <div className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                                    <span className="absolute top-5 right-5 text-xs font-bold text-primary">0{i + 1}</span>
                                    <div className="mb-3 text-4xl">{icon}</div>
                                    <h3 className="mb-2 font-bold text-white">{title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#080808] py-24">
                <div className="mx-auto max-w-3xl px-4">
                    <SectionHeader
                        eyebrow="FAQ"
                        title={
                            <>
                                Questions <Accent>fréquentes</Accent>
                            </>
                        }
                    />
                    <div className="space-y-3">
                        {faq.map(([question, answer, link]) => (
                            <FaqItem key={question} question={question} answer={answer} link={link} />
                        ))}
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
