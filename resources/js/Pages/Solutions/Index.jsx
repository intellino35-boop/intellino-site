import { Head } from '@inertiajs/react';
import Approach from '../../Components/Approach';
import { SolutionCard } from '../../Components/cards';
import { Accent, CtaBanner, PageHero, Reveal } from '../../Components/ui';
import SiteLayout from '../../Layouts/SiteLayout';

export default function SolutionsIndex({ solutions }) {
    return (
        <SiteLayout>
            <Head title="Nos solutions" />
            <PageHero
                breadcrumb={[['Solutions']]}
                eyebrow="Ce que nous faisons"
                title={
                    <>
                        Nos <Accent>Solutions</Accent>
                    </>
                }
                subtitle="Logiciels, sécurité, cloud, intelligence artificielle et IoT : des solutions conçues pour les réalités des entreprises et institutions africaines."
            />

            <section className="bg-[#080808] pb-24">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 lg:grid-cols-3">
                    {solutions.map((s, i) => (
                        <Reveal key={s.slug} delay={i * 0.08}>
                            <SolutionCard solution={s} showDescription />
                        </Reveal>
                    ))}
                </div>
            </section>

            <Approach />

            <CtaBanner
                title={
                    <>
                        Un projet ? <Accent>Parlons-en.</Accent>
                    </>
                }
                text="Décrivez-nous votre besoin : notre équipe vous répond et vous propose la solution la plus adaptée."
            />
        </SiteLayout>
    );
}
