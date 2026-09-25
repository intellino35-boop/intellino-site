import { formatPostDate } from '../lib/format';
import { asArray } from '../lib/safe';
import { Link } from './nav';
import { ArrowRight } from 'lucide-react';
import { Bullet } from './ui';

// Classes complètes (et non construites dynamiquement) pour que Tailwind les détecte.
const solutionColors = {
    blue: 'from-blue-500/10 hover:border-blue-500/30',
    purple: 'from-purple-500/10 hover:border-purple-500/30',
    red: 'from-red-500/10 hover:border-red-500/30',
    cyan: 'from-cyan-500/10 hover:border-cyan-500/30',
    green: 'from-green-500/10 hover:border-green-500/30',
    yellow: 'from-yellow-500/10 hover:border-yellow-500/30',
};

const badgeColors = {
    green: 'bg-green-500/20 text-green-400',
    primary: 'bg-primary/20 text-primary',
    blue: 'bg-blue-500/20 text-blue-400',
};

export function DiscoverLink({ href, children = 'Découvrir' }) {
    return (
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2">
            {children} <ArrowRight size={14} />
        </Link>
    );
}

export function SolutionCard({ solution, showDescription = false }) {
    return (
        <div
            className={`group relative flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-br to-transparent p-6 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 ${solutionColors[solution.color] ?? solutionColors.blue}`}
        >
            <div className="mb-4 text-4xl">{solution.icon}</div>
            <h3 className="mb-2 text-lg font-bold text-white">{solution.title}</h3>
            {showDescription && solution.description && (
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{solution.description}</p>
            )}
            <ul className="mb-6 flex-1 space-y-1.5">
                {asArray(solution.items).map((item) => (
                    <Bullet key={item}>{item}</Bullet>
                ))}
            </ul>
            <DiscoverLink href={`/solutions/${solution.slug}`} />
        </div>
    );
}

export function ProductBadge({ product, className = 'absolute top-4 right-4' }) {
    if (!product.badge) return null;
    return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badgeColors[product.badge_color] ?? badgeColors.primary} ${className}`}>
            {product.badge}
        </span>
    );
}

export function ProductCard({ product }) {
    return (
        <div className="group relative flex h-full flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-7 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-black/50">
            <ProductBadge product={product} />
            <div className="mb-4 text-5xl">{product.icon}</div>
            <div className="mb-1 text-xs font-semibold tracking-wider text-primary uppercase">{product.category}</div>
            <h3 className="mb-2 text-xl font-bold text-white">{product.name}</h3>
            <p className="mb-5 text-sm text-muted-foreground">{product.description}</p>
            <ul className="mb-6 flex-1 space-y-2">
                {asArray(product.features).map((f) => (
                    <Bullet key={f} big className="text-white/70">
                        {f}
                    </Bullet>
                ))}
            </ul>
            <DiscoverLink href={`/produits/${product.slug}`} />
        </div>
    );
}

export function SoftwareCard({ software }) {
    return (
        <Link
            href={`/logiciels/${software.slug}`}
            className="group block h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5"
        >
            <div className="mb-3 text-4xl">{software.icon}</div>
            <h3 className="mb-1 font-bold text-white transition-colors group-hover:text-primary">{software.name}</h3>
            <p className="text-sm text-muted-foreground">{software.description}</p>
        </Link>
    );
}

const realisationBorders = {
    red: 'border-red-500/30',
    blue: 'border-blue-500/30',
    green: 'border-green-500/30',
    purple: 'border-purple-500/30',
};

export function RealisationCard({ realisation: r }) {
    return (
        <Link
            href={`/realisations/${r.slug}`}
            className={`group block h-full rounded-2xl border bg-white/5 p-6 transition-all hover:-translate-y-1 hover:shadow-xl ${realisationBorders[r.color] ?? 'border-white/10'}`}
        >
            <div className="flex items-start gap-4">
                <div className="shrink-0 text-4xl">{r.icon}</div>
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-x-2 text-xs">
                        <span className="font-semibold tracking-wider text-primary uppercase">{r.category}</span>
                        {r.year && <span className="text-muted-foreground">· {r.year}</span>}
                    </div>
                    <h3 className="mb-2 font-bold text-white transition-colors group-hover:text-primary">{r.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{r.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {asArray(r.tags).map((tag) => (
                            <span key={tag} className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-white/70">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export function PostCard({ post, showReadingTime = false }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/5"
        >
            <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">{post.category}</span>
                <span className="text-xs text-muted-foreground">{formatPostDate(post.date, showReadingTime)}</span>
            </div>
            <h3 className="mb-2 leading-snug font-bold text-white transition-colors group-hover:text-primary">{post.title}</h3>
            <p className="flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
            {showReadingTime && (
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Lire l'article · {post.reading_time} min <ArrowRight size={12} />
                </div>
            )}
        </Link>
    );
}
