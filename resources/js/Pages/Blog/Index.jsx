import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { formatPostDate, PostCard } from '../../Components/cards';
import { Accent, PageHero, Reveal } from '../../Components/ui';
import SiteLayout from '../../Layouts/SiteLayout';

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

export default function BlogIndex({ posts, categories, category }) {
    // L'article le plus récent est mis en avant sur la première page non filtrée.
    const featured = !category && posts.current_page === 1 ? posts.data[0] : null;
    const list = featured ? posts.data.slice(1) : posts.data;

    const pill = (on) =>
        `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            on ? 'border-primary bg-primary text-black' : 'border-white/15 text-white/70 hover:border-primary/40 hover:text-white'
        }`;

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
                <div className="mx-auto max-w-7xl px-4">
                    {categories.length > 1 && (
                        <div className="mb-10 flex flex-wrap justify-center gap-2">
                            <Link href="/blog" preserveScroll className={pill(!category)}>
                                Tous
                            </Link>
                            {categories.map((c) => (
                                <Link key={c} href={`/blog?categorie=${encodeURIComponent(c)}`} preserveScroll className={pill(category === c)}>
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

                    {posts.data.length === 0 ? (
                        <p className="py-16 text-center text-muted-foreground">Aucun article dans cette catégorie pour le moment.</p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {list.map((post, i) => (
                                <Reveal key={post.slug} delay={i * 0.08}>
                                    <PostCard post={post} showReadingTime />
                                </Reveal>
                            ))}
                        </div>
                    )}

                    {posts.last_page > 1 && (
                        <div className="mt-12 flex items-center justify-center gap-3 text-sm">
                            {posts.prev_page_url && (
                                <Link href={posts.prev_page_url} className="rounded-lg border border-white/15 px-4 py-2 text-white hover:border-primary/40">
                                    ← Articles plus récents
                                </Link>
                            )}
                            <span className="text-muted-foreground">
                                Page {posts.current_page} / {posts.last_page}
                            </span>
                            {posts.next_page_url && (
                                <Link href={posts.next_page_url} className="rounded-lg border border-white/15 px-4 py-2 text-white hover:border-primary/40">
                                    Articles plus anciens →
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </SiteLayout>
    );
}
