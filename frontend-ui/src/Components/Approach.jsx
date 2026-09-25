import { useBlockTuples } from '../hooks/useSite';
import { Accent, Reveal, SectionHeader } from './ui';

export default function Approach() {
    const steps = useBlockTuples('demarche', 'icon', 'title', 'text');

    return (
        <section className="bg-[#0a0a0a] py-24">
            <div className="mx-auto max-w-7xl px-4">
                <SectionHeader
                    eyebrow="Notre démarche"
                    title={
                        <>
                            Un accompagnement <Accent>de bout en bout</Accent>
                        </>
                    }
                    subtitle="De la première rencontre au support après mise en service, un seul interlocuteur."
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {steps.map(([icon, title, text], i) => (
                        <Reveal key={title} delay={i * 0.08}>
                            <div className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-primary/30 hover:bg-primary/5">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-3xl">{icon}</span>
                                    <span className="text-xs font-bold text-primary">0{i + 1}</span>
                                </div>
                                <h3 className="mb-1 font-bold text-white">{title}</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
