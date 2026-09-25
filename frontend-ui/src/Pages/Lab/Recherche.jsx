import { Accent, Reveal, SectionHeader } from '../../Components/ui';
import { useBlockTuples } from '../../hooks/useSite';
import LabLayout from '../../Layouts/LabLayout';

export default function Recherche() {
    const researchAxes = useBlockTuples('axes-recherche', 'icon', 'title', 'text');
    const labProcess = useBlockTuples('etapes-lab', 'icon', 'title', 'text');

    return (
        <LabLayout
            title="Recherche & Innovation"
            heading={
                <>
                    Recherche & <Accent>Innovation</Accent>
                </>
            }
            subtitle="Nos axes de travail et la méthode qui nous mène de l'idée au produit commercialisé."
        >
            <section className="bg-[#080808] py-24">
                <div className="mx-auto max-w-7xl px-4">
                    <SectionHeader
                        eyebrow="Axes de recherche"
                        title={
                            <>
                                Nos domaines <Accent>d'exploration</Accent>
                            </>
                        }
                    />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {researchAxes.map(([icon, title, text], i) => (
                            <Reveal key={title} delay={i * 0.06}>
                                <div className="h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 transition-all hover:-translate-y-1 hover:border-primary/30">
                                    <div className="mb-4 text-4xl">{icon}</div>
                                    <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#0a0a0a] py-24">
                <div className="mx-auto max-w-4xl px-4">
                    <SectionHeader
                        eyebrow="Notre méthode"
                        title={
                            <>
                                De l'idée au <Accent>produit</Accent>
                            </>
                        }
                        subtitle="Sept étapes pour transformer un défi réel en solution industrialisée."
                    />
                    <ol className="relative space-y-4">
                        {labProcess.map(([icon, title, text], i) => (
                            <Reveal key={title} x={30} y={0} delay={i * 0.06}>
                                <li className="flex gap-5">
                                    <div className="relative flex flex-col items-center">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xl">
                                            {icon}
                                        </div>
                                        {i < labProcess.length - 1 && <div className="w-0.5 flex-1 bg-primary/30" />}
                                    </div>
                                    <div className="mb-2 flex-1 rounded-2xl border border-white/10 bg-white/5 p-5">
                                        <div className="mb-1 text-xs font-semibold tracking-wider text-primary uppercase">Étape {i + 1}</div>
                                        <h3 className="mb-1 font-bold text-white">{title}</h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                                    </div>
                                </li>
                            </Reveal>
                        ))}
                    </ol>
                </div>
            </section>
        </LabLayout>
    );
}
