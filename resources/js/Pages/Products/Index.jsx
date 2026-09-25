import { Head } from '@inertiajs/react';
import { ProductCard, SoftwareCard } from '../../Components/cards';
import { Accent, CtaBanner, PageHero, Reveal, SubHeader } from '../../Components/ui';
import SiteLayout from '../../Layouts/SiteLayout';

export default function ProductsIndex({ products, softwares }) {
    return (
        <SiteLayout>
            <Head title="Nos produits" />
            <PageHero
                breadcrumb={[['Produits']]}
                eyebrow="Nos produits"
                title={
                    <>
                        Produits <Accent>IntellIno</Accent>
                    </>
                }
                subtitle="Des produits technologiques conçus et développés par le IntellIno Technology Lab, pensés pour l'Afrique et ouverts sur le monde."
            />

            <section className="bg-[#080808] pb-24">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3">
                    {products.map((p, i) => (
                        <Reveal key={p.slug} delay={i * 0.1}>
                            <ProductCard product={p} />
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="bg-[#0a0a0a] py-24">
                <div className="mx-auto max-w-7xl px-4">
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
                </div>
            </section>

            <CtaBanner
                title={
                    <>
                        Envie d'une <Accent>démonstration</Accent> ?
                    </>
                }
                text="Nous vous présentons nos produits en situation réelle et étudions leur intégration dans votre organisation."
                sujet="produit"
            />
        </SiteLayout>
    );
}
