import { ProductCard } from '../../Components/cards';
import { Accent, Reveal, SectionHeader } from '../../Components/ui';
import LabLayout from '../../Layouts/LabLayout';

export default function Projets({ products }) {
    return (
        <LabLayout
            title="Nos projets"
            heading={
                <>
                    Nos <Accent>projets</Accent>
                </>
            }
            subtitle="Des défis du terrain devenus produits : découvrez les réalisations issues du IntellIno Technology Lab."
        >
            <section className="bg-[#080808] py-24">
                <div className="mx-auto max-w-7xl px-4">
                    <SectionHeader
                        eyebrow="Issus du Lab"
                        title={
                            <>
                                Du prototype au <Accent>produit</Accent>
                            </>
                        }
                        subtitle="Ces produits ont suivi l'ensemble de notre méthode, de la recherche jusqu'à la commercialisation."
                    />
                    <div className="grid gap-6 md:grid-cols-3">
                        {products.map((p, i) => (
                            <Reveal key={p.slug} delay={i * 0.1}>
                                <ProductCard product={p} />
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#0a0a0a] py-24">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <Reveal>
                        <div className="mb-4 text-5xl">🔭</div>
                        <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">
                            Et <Accent>demain</Accent> ?
                        </h2>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            Le Lab travaille en continu sur de nouvelles solutions dans ses domaines d'exploration : énergie, sécurité,
                            intelligence artificielle, IoT et gestion des organisations. Les prochains projets seront présentés ici au fil de
                            leur avancement.
                        </p>
                    </Reveal>
                </div>
            </section>
        </LabLayout>
    );
}
