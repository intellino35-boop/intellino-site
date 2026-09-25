import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

// Apparition au défilement, comme sur le site d'origine.
export function Reveal({ children, className, x = 0, y = 30, scale = 1, delay = 0 }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, x, y, scale }}
            whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
}

export function Eyebrow({ children, className = 'mb-4' }) {
    return (
        <div
            className={`inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium tracking-widest text-primary uppercase ${className}`}
        >
            {children}
        </div>
    );
}

export function SectionHeader({ eyebrow, title, subtitle, className = 'mb-16' }) {
    return (
        <Reveal className={`text-center ${className}`}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">{title}</h2>
            {subtitle && <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
        </Reveal>
    );
}

export function SubHeader({ title, subtitle }) {
    return (
        <Reveal className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">{title}</h2>
            {subtitle && <p className="mx-auto max-w-xl text-muted-foreground">{subtitle}</p>}
        </Reveal>
    );
}

export function Accent({ children }) {
    return <span className="text-primary">{children}</span>;
}

export function Bullet({ children, big = false, className = 'text-muted-foreground' }) {
    return (
        <li className={`flex items-center gap-2 text-sm ${className}`}>
            <span className={`shrink-0 rounded-full bg-primary ${big ? 'h-1.5 w-1.5' : 'h-1 w-1'}`} />
            {children}
        </li>
    );
}

// En-tête des pages intérieures : fil d'Ariane, titre et halo orange.
export function PageHero({ breadcrumb = [], eyebrow, icon, title, subtitle, children }) {
    return (
        <section className="relative overflow-hidden bg-[#080808] pt-36 pb-20">
            <div className="pointer-events-none absolute top-0 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
            <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
                {breadcrumb.length > 0 && (
                    <nav className="mb-6 flex flex-wrap items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Link href="/" className="hover:text-primary">
                            Accueil
                        </Link>
                        {breadcrumb.map(([label, href]) => (
                            <span key={label} className="flex items-center gap-1">
                                <ChevronRight size={12} />
                                {href ? (
                                    <Link href={href} className="hover:text-primary">
                                        {label}
                                    </Link>
                                ) : (
                                    <span className="text-white/70">{label}</span>
                                )}
                            </span>
                        ))}
                    </nav>
                )}
                <Reveal y={20}>
                    {icon && <div className="mb-4 text-6xl">{icon}</div>}
                    {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
                    <h1 className="mb-5 text-4xl leading-tight font-black text-balance text-white md:text-6xl">{title}</h1>
                    {subtitle && <p className="mx-auto max-w-2xl text-lg text-balance text-muted-foreground">{subtitle}</p>}
                    {children}
                </Reveal>
            </div>
        </section>
    );
}

// Bandeau d'appel à l'action ; "sujet" pré-remplit le formulaire de la page Contact.
export function CtaBanner({ title, text, sujet }) {
    return (
        <section className="bg-[#0a0a0a] py-20">
            <div className="mx-auto max-w-7xl px-4">
                <Reveal>
                    <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-10 text-center md:p-14">
                        <h2 className="mb-4 text-3xl font-black text-balance text-white md:text-4xl">{title}</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">{text}</p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <a
                                href={sujet ? `/contact?sujet=${sujet}` : '/contact'}
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-primary/90"
                            >
                                Parler à un expert <ArrowRight size={16} />
                            </a>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-primary/50 hover:bg-white/5"
                            >
                                Retour à l'accueil
                            </Link>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
