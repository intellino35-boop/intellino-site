import Approach from '../../Components/Approach';
import { SolutionCard } from '../../Components/cards';
import { Head } from '../../Components/nav';
import { AsyncContent } from '../../Components/states';
import { Accent, CtaBanner, PageHero, Reveal } from '../../Components/ui';
import { useApi } from '../../hooks/useApi';
import SiteLayout from '../../Layouts/SiteLayout';
import { asArray } from '../../lib/safe';
import { solutionsService } from '../../services/solutions';

export default function SolutionsIndex() {
    const state = useApi(() => solutionsService.list(), []);

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
                <AsyncContent state={state} isEmpty={(data) => asArray(data).length === 0} empty="Aucune solution pour le moment.">
                    {(solutions) => (
                        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-2 lg:grid-cols-3">
                            {asArray(solutions).map((s, i) => (
                                <Reveal key={s.id ?? s.slug} delay={i * 0.08}>
                                    <SolutionCard solution={s} showDescription />
                                </Reveal>
                            ))}
                        </div>
                    )}
                </AsyncContent>
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
