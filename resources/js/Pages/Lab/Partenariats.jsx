import { Accent, Reveal, SectionHeader } from '../../Components/ui';
import { useBlockTuples } from '../../data/blocks';
import LabLayout from '../../Layouts/LabLayout';

export default function Partenariats() {
    const partnerTypes = useBlockTuples('partenaires-lab', 'icon', 'title', 'text');
    const offers = useBlockTuples('apports-lab', 'icon', 'title', 'text');

    return (
        <LabLayout
            title="Partenariats"
            heading={
                <>
                    Innover <Accent>ensemble</Accent>
                </>
            }
            subtitle="Le Technology Lab est ouvert aux collaborations avec celles et ceux qui veulent construire les technologies africaines de demain."
            cta={{
                title: (
                    <>
                        Devenons <Accent>partenaires</Accent>
                    </>
                ),
                text: 'Présentez-nous votre organisation et votre idée de collaboration : nous reviendrons vers vous pour en discuter.',
                sujet: 'partenariat',
            }}
        >
            <section className="bg-[#080808] py-24">
                <div className="mx-auto max-w-7xl px-4">
                    <SectionHeader
                        eyebrow="Avec qui ?"
                        title={
                            <>
                                Les partenariats que <Accent>nous recherchons</Accent>
                            </>
                        }
                    />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {partnerTypes.map(([icon, title, text], i) => (
                            <Reveal key={title} delay={i * 0.06}>
                                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-primary/30 hover:bg-primary/5">
                                    <div className="mb-3 text-4xl">{icon}</div>
                                    <h3 className="mb-2 font-bold text-white">{title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#0a0a0a] py-24">
                <div className="mx-auto max-w-7xl px-4">
                    <SectionHeader
                        eyebrow="Ce que nous apportons"
                        title={
                            <>
                                Pourquoi collaborer <Accent>avec le Lab</Accent> ?
                            </>
                        }
                    />
                    <div className="grid gap-6 md:grid-cols-3">
                        {offers.map(([icon, title, text], i) => (
                            <Reveal key={title} delay={i * 0.1}>
                                <div className="h-full rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
                                    <div className="mb-3 text-4xl">{icon}</div>
                                    <h3 className="mb-2 font-bold text-white">{title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>
        </LabLayout>
    );
}
