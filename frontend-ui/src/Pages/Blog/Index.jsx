import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { PostCard } from '../../Components/cards';
import { formatPostDate } from '../../lib/format';
import { Head, Link } from '../../Components/nav';
import { AsyncContent } from '../../Components/states';
import { Accent, PageHero, Reveal } from '../../Components/ui';
import { useApi } from '../../hooks/useApi';
import SiteLayout from '../../Layouts/SiteLayout';
import { asArray } from '../../lib/safe';
import { postsService } from '../../services/posts';

function FeaturedPost({ post }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group relative block overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-8 transition-all hover:-translate-y-1 md:p-12"
        >
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-black">À la une</span>
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">{post.category}</span>
                <span className="text-xs text-muted-foreground">
                    {formatPostDate(post.date)} · {post.reading_time} min de lecture
                </span>
            </div>
            <h2 className="mb-4 max-w-3xl text-3xl leading-tight font-black text-white transition-colors group-hover:text-primary md:text-4xl">
                {post.title}
            </h2>
            <p className="mb-6 max-w-2xl text-lg text-muted-foreground">{post.excerpt}</p>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-all group-hover:gap-3">
                Lire l'article <ArrowRight size={16} />
            </span>
        </Link>
    );
}

const pill = (on) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
        on ? 'border-primary bg-primary text-black' : 'border-white/15 text-white/70 hover:border-primary/40 hover:text-white'
    }`;

/** Adresse d'une page du blog en conservant la catégorie choisie. */
function blogUrl(category, page) {
    const params = new URLSearchParams();
    if (category) params.set('categorie', category);
    if (page > 1) params.set('page', String(page));
    const query = params.toString();
    return query ? `/blog?${query}` : '/blog';
}

function PostsList({ posts, meta }) {
    const items = asArray(posts);
    const category = meta?.category ?? null;
    const currentPage = meta?.currentPage ?? 1;
    const lastPage = meta?.lastPage ?? 1;
    const categories = asArray(meta?.categories);

    // L'article le plus récent est mis en avant sur la première page non filtrée.
    const featured = !category && currentPage === 1 ? (items[0] ?? null) : null;
    const list = featured ? items.slice(1) : items;

    return (
        <div className="mx-auto max-w-7xl px-4">
            {categories.length > 1 && (
                <div className="mb-10 flex flex-wrap justify-center gap-2">
                    <Link href="/blog" className={pill(!category)}>
                        Tous
                    </Link>
                    {categories.map((c) => (
                        <Link key={c} href={blogUrl(c, 1)} className={pill(category === c)}>
                            {c}
                        </Link>
                    ))}
                </div>
            )}

            {featured && (
                <Reveal className="mb-8">
                    <FeaturedPost post={featured} />
                </Reveal>
            )}

            {items.length === 0 ? (
                <p className="py-16 text-center text-muted-foreground">Aucun article dans cette catégorie pour le moment.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {list.map((post, i) => (
                        <Reveal key={post.id ?? post.slug} delay={i * 0.08}>
                            <PostCard post={post} showReadingTime />
                        </Reveal>
                    ))}
                </div>
            )}

            {lastPage > 1 && (
                <div className="mt-12 flex items-center justify-center gap-3 text-sm">
                    {currentPage > 1 && (
                        <Link href={blogUrl(category, currentPage - 1)} className="rounded-lg border border-white/15 px-4 py-2 text-white hover:border-primary/40">
                            ← Articles plus récents
                        </Link>
                    )}
                    <span className="text-muted-foreground">
                        Page {currentPage} / {lastPage}
                    </span>
                    {currentPage < lastPage && (
                        <Link href={blogUrl(category, currentPage + 1)} className="rounded-lg border border-white/15 px-4 py-2 text-white hover:border-primary/40">
                            Articles plus anciens →
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}

export default function BlogIndex() {
    // Filtre et pagination dans l'adresse (partageable) : /blog?categorie=IoT&page=2
    const [searchParams] = useSearchParams();
    const category = searchParams.get('categorie') || null;
    const page = Number(searchParams.get('page')) || 1;
    const state = useApi(() => postsService.list({ category, page }), [category, page]);

    return (
        <SiteLayout>
            <Head title="Blog" />
            <PageHero
                breadcrumb={[['Blog']]}
                eyebrow="Actualités"
                title={
                    <>
                        Blog & <Accent>Innovations</Accent>
                    </>
                }
                subtitle="Analyses, retours d'expérience et nouveautés du IntellIno Technology Lab."
            />

            <section className="bg-[#080808] pb-24">
                <AsyncContent state={state}>{(data) => <PostsList posts={data?.posts} meta={data?.meta} />}</AsyncContent>
            </section>
        </SiteLayout>
    );
}
