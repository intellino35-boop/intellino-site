import { useParams } from 'react-router';
import DataPage from '../../Components/DataPage';
import { useApi } from '../../hooks/useApi';
import { asArray } from '../../lib/safe';
import { solutionsService } from '../../services/solutions';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Approach from '../../Components/Approach';
import { Accent, CtaBanner, PageHero, Reveal, SubHeader } from '../../Components/ui';
import SiteLayout from '../../Layouts/SiteLayout';
import { Head, Link } from '../../Components/nav';

// Sujet du formulaire de contact correspondant à chaque solution.
const contactSubjects = { securite: 'securite', cloud: 'cloud', ia: 'ia', iot: 'iot' };

function SolutionView({ solution, others }) {
    return (
        <SiteLayout>
            <Head title={solution.title} />
            <PageHero
                breadcrumb={[
                    ['Solutions', '/solutions'],
                    [solution.title],
                ]}
                icon={solution.icon}
                title={solution.title}
                subtitle={solution.description}
            >
                <a
                    href={`/contact?sujet=${contactSubjects[solution.slug] ?? 'solutions'}`}
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-primary/90"
                >
                    Demander un devis <ArrowRight size={16} />
                </a>
            </PageHero>

            <section className="bg-[#080808] pb-24">
                <div className="mx-auto max-w-7xl px-4">
                    <SubHeader
                        title={
                            <>
                                Ce que nous <Accent>proposons</Accent>
                            </>
                        }
                    />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {asArray(solution.items).map((item, i) => (
                            <Reveal key={item} y={20} delay={i * 0.06}>
                                <div className="flex h-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-primary/30 hover:bg-primary/5">
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-bold text-primary">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="font-semibold text-white">{item}</span>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    {asArray(solution.benefits).length > 0 && (
                        <Reveal className="mt-16">
                            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-10">
                                <h2 className="mb-6 text-2xl font-black text-white md:text-3xl">
                                    Ce que vous <Accent>y gagnez</Accent>
                                </h2>
                                <ul className="grid gap-4 md:grid-cols-2">
                                    {asArray(solution.benefits).map((b) => (
                                        <li key={b} className="flex items-start gap-3 text-white/85">
                                            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>
                    )}
                </div>
            </section>

            <Approach />

            <section className="bg-[#080808] py-20">
                <div className="mx-auto max-w-7xl px-4">
                    <SubHeader
                        title={
                            <>
                                Nos autres <Accent>solutions</Accent>
                            </>
                        }
                    />
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                        {asArray(others).map((o) => (
                            <Link
                                key={o.slug}
                                href={`/solutions/${o.slug}`}
                                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5"
                            >
                                <span className="text-3xl">{o.icon}</span>
                                <span className="text-sm font-semibold text-white/80 group-hover:text-primary">{o.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <CtaBanner
                title={
                    <>
                        Besoin de <Accent>{solution.title.toLowerCase()}</Accent> ?
                    </>
                }
                text="Nos experts étudient votre projet et vous proposent une solution adaptée à votre budget et à vos contraintes."
                sujet={contactSubjects[solution.slug] ?? 'solutions'}
            />
        </SiteLayout>
    );
}

/** Page : fiche chargée depuis l'API selon le slug de l'adresse (404 → page « introuvable »). */
export default function Page() {
    const { slug } = useParams();
    const state = useApi(() => solutionsService.show(slug), [slug]);

    return (
        <DataPage state={state} title="Solution" isMissing={(data) => !data?.item}>
            {(data) => <SolutionView solution={data.item} others={data.others} />}
        </DataPage>
    );
}
