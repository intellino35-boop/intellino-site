import { useParams } from 'react-router';
import DataPage from '../../Components/DataPage';
import { useApi } from '../../hooks/useApi';
import { asArray } from '../../lib/safe';
import { productsService } from '../../services/products';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ProductBadge } from '../../Components/cards';
import { Accent, CtaBanner, Eyebrow, PageHero, Reveal, SubHeader } from '../../Components/ui';
import SiteLayout from '../../Layouts/SiteLayout';
import { Head, Link } from '../../Components/nav';

function ProductView({ product, others }) {
    return (
        <SiteLayout>
            <Head title={product.name} />
            <PageHero
                breadcrumb={[
                    ['Produits', '/produits'],
                    [product.name],
                ]}
                icon={product.icon}
                title={product.name}
                subtitle={product.description}
            >
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <Eyebrow className="">{product.category}</Eyebrow>
                    <ProductBadge product={product} className="" />
                </div>
                <a
                    href="/contact?sujet=produit"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-primary/90"
                >
                    Demander une démo <ArrowRight size={16} />
                </a>
            </PageHero>

            <section className="bg-[#080808] pb-24">
                <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 lg:grid-cols-5">
                    <Reveal x={-30} y={0} className="lg:col-span-3">
                        <h2 className="mb-5 text-3xl font-black text-white md:text-4xl">
                            Présentation <Accent>du produit</Accent>
                        </h2>
                        <p className="text-lg leading-relaxed whitespace-pre-line text-muted-foreground">
                            {product.details || product.description}
                        </p>
                    </Reveal>
                    <Reveal x={30} y={0} className="lg:col-span-2">
                        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-7">
                            <h3 className="mb-5 text-sm font-semibold tracking-wider text-white uppercase">Fonctionnalités clés</h3>
                            <ul className="space-y-3">
                                {asArray(product.features).map((f) => (
                                    <li key={f} className="flex items-start gap-3 text-white/85">
                                        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-primary" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                </div>
            </section>

            {asArray(product.use_cases).length > 0 && (
                <section className="bg-[#0a0a0a] py-24">
                    <div className="mx-auto max-w-7xl px-4">
                        <SubHeader
                            title={
                                <>
                                    Pour qui <Accent>?</Accent>
                                </>
                            }
                            subtitle="Quelques exemples d'environnements où ce produit fait la différence."
                        />
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {asArray(product.use_cases).map((u, i) => (
                                <Reveal key={u} y={20} delay={i * 0.07}>
                                    <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 text-center font-semibold text-white/85 transition-all hover:border-primary/30 hover:bg-primary/5">
                                        {u}
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {asArray(others).length > 0 && (
                <section className="bg-[#080808] py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <SubHeader title="Découvrez aussi" />
                        <div className="grid gap-5 md:grid-cols-2">
                            {asArray(others).map((o) => (
                                <Link
                                    key={o.slug}
                                    href={`/produits/${o.slug}`}
                                    className="group flex items-center gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5"
                                >
                                    <span className="text-4xl">{o.icon}</span>
                                    <div className="flex-1">
                                        <div className="text-xs font-semibold tracking-wider text-primary uppercase">{o.category}</div>
                                        <div className="font-bold text-white group-hover:text-primary">{o.name}</div>
                                    </div>
                                    <ArrowRight size={18} className="text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <CtaBanner
                title={
                    <>
                        Intéressé par <Accent>{product.name}</Accent> ?
                    </>
                }
                text="Demandez une démonstration ou un devis : notre équipe vous accompagne de l'installation à la formation."
                sujet="produit"
            />
        </SiteLayout>
    );
}

/** Page : fiche chargée depuis l'API selon le slug de l'adresse (404 → page « introuvable »). */
export default function Page() {
    const { slug } = useParams();
    const state = useApi(() => productsService.show(slug), [slug]);

    return (
        <DataPage state={state} title="Produit" isMissing={(data) => !data?.item}>
            {(data) => <ProductView product={data.item} others={data.others} />}
        </DataPage>
    );
}
