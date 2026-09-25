import { Accent, Reveal, SectionHeader } from '../../Components/ui';
import { useBlockTuples } from '../../data/blocks';
import LabLayout from '../../Layouts/LabLayout';

export default function Vision() {
    const principles = useBlockTuples('principes-lab', 'icon', 'title', 'text');

    return (
        <LabLayout
            title="Notre vision"
            heading={
                <>
                    Imaginer aujourd'hui. <Accent>Construire demain.</Accent>
                </>
            }
            subtitle="Le IntellIno Technology Lab est notre pôle de recherche, d'innovation et de développement de produits technologiques."
        >
            <section className="bg-[#080808] py-24">
                <div className="mx-auto max-w-5xl px-4">
                    <Reveal>
                        <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-10 text-center md:p-14">
                            <p className="text-3xl leading-snug font-black text-balance text-white md:text-4xl">
                                L'Afrique ne doit pas seulement <Accent>consommer</Accent> la technologie.
                                <br />
                                Elle doit aussi la <Accent>créer.</Accent>
                            </p>
                        </div>
                    </Reveal>

                    <Reveal className="mx-auto mt-16 max-w-3xl space-y-6 text-lg leading-relaxed text-muted-foreground">
                        <p>
                            Le continent adopte le numérique à grande vitesse, mais la plupart des technologies utilisées sont conçues ailleurs,
                            pour d'autres réalités. Le Technology Lab est né de la volonté de changer cela : transformer les défis rencontrés
                            sur le terrain en solutions concrètes, conçues pour l'Afrique et ouvertes sur le monde.
                        </p>
                        <p>
                            Notre ambition : <span className="font-semibold text-white">imaginer aujourd'hui, construire demain et industrialiser l'avenir</span>.
                            Autrement dit, ne pas s'arrêter à l'idée ou au prototype, mais aller jusqu'à des produits fiables, utilisés au
                            quotidien par les entreprises et les institutions.
                        </p>
                    </Reveal>
                </div>
            </section>

            <section className="bg-[#0a0a0a] py-24">
                <div className="mx-auto max-w-7xl px-4">
                    <SectionHeader
                        eyebrow="Nos principes"
                        title={
                            <>
                                Ce qui guide <Accent>le Lab</Accent>
                            </>
                        }
                    />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {principles.map(([icon, title, text], i) => (
                            <Reveal key={title} delay={i * 0.08}>
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
        </LabLayout>
    );
}
