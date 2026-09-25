import { ProductCard, SoftwareCard } from '../../Components/cards';
import { Head } from '../../Components/nav';
import { AsyncContent } from '../../Components/states';
import { Accent, CtaBanner, PageHero, Reveal, SubHeader } from '../../Components/ui';
import { useApi } from '../../hooks/useApi';
import SiteLayout from '../../Layouts/SiteLayout';
import { asArray } from '../../lib/safe';
import { productsService } from '../../services/products';
import { softwaresService } from '../../services/softwares';

export default function ProductsIndex() {
    const products = useApi(() => productsService.list(), []);
    const softwares = useApi(() => softwaresService.list(), []);

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
                <AsyncContent state={products} isEmpty={(data) => asArray(data).length === 0} empty="Aucun produit pour le moment.">
                    {(items) => (
                        <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3">
                            {asArray(items).map((p, i) => (
                                <Reveal key={p.id ?? p.slug} delay={i * 0.1}>
                                    <ProductCard product={p} />
                                </Reveal>
                            ))}
                        </div>
                    )}
                </AsyncContent>
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
                    <AsyncContent state={softwares} className="py-12">
                        {(items) => (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {asArray(items).map((s, i) => (
                                    <Reveal key={s.id ?? s.slug} y={20} delay={i * 0.08}>
                                        <SoftwareCard software={s} />
                                    </Reveal>
                                ))}
                            </div>
                        )}
                    </AsyncContent>
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
