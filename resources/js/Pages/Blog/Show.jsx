import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ArticleBody from '../../Components/ArticleBody';
import { formatPostDate, PostCard } from '../../Components/cards';
import { Accent, CtaBanner, Reveal, SubHeader } from '../../Components/ui';
import SiteLayout from '../../Layouts/SiteLayout';

export default function BlogShow({ post, related }) {
    return (
        <SiteLayout>
            <Head title={post.title} />

            <article className="relative bg-[#080808] pt-36 pb-20">
                <div className="pointer-events-none absolute top-0 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
                <div className="relative z-10 mx-auto max-w-3xl px-4">
                    <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                        <ArrowLeft size={16} /> Tous les articles
                    </Link>

                    <Reveal y={20}>
                        <Link
                            href={`/blog?categorie=${encodeURIComponent(post.category)}`}
                            className="mb-5 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/30"
                        >
                            {post.category}
                        </Link>
                        <h1 className="mb-5 text-4xl leading-tight font-black text-balance text-white md:text-5xl">{post.title}</h1>
                        <p className="mb-6 text-xl text-muted-foreground">{post.excerpt}</p>
                        <div className="mb-10 flex flex-wrap items-center gap-5 border-b border-white/10 pb-8 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-2">
                                <Calendar size={16} className="text-primary" /> {formatPostDate(post.date)}
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <Clock size={16} className="text-primary" /> {post.reading_time} min de lecture
                            </span>
                        </div>
                    </Reveal>

                    {post.body ? (
                        <ArticleBody text={post.body} />
                    ) : (
                        <p className="text-muted-foreground">L'article complet sera bientôt disponible.</p>
                    )}
                </div>
            </article>

            {related.length > 0 && (
                <section className="bg-[#0a0a0a] py-20">
                    <div className="mx-auto max-w-7xl px-4">
                        <SubHeader
                            title={
                                <>
                                    À lire <Accent>aussi</Accent>
                                </>
                            }
                        />
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {related.map((p, i) => (
                                <Reveal key={p.slug} delay={i * 0.08}>
                                    <PostCard post={p} showReadingTime />
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <CtaBanner
                title={
                    <>
                        Un sujet vous <Accent>concerne</Accent> ?
                    </>
                }
                text="Nos experts peuvent analyser votre situation et vous conseiller sur la meilleure approche."
            />
        </SiteLayout>
    );
}
