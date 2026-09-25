import { useSite } from '../hooks/useSite';
import { Link } from './nav';
import { AtSign, Globe, Mail, MapPin, MessagesSquare, Phone, Share2 } from 'lucide-react';
import { footerProducts, footerSolutions } from '../data/navigation';

const socials = [Share2, Globe, AtSign, MessagesSquare];

export default function Footer() {
    const { contact } = useSite();

    return (
        <footer className="border-t border-white/10 bg-[#080808]">
            <div className="mx-auto max-w-7xl px-4 py-16">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <img src={contact.logo} alt="IntellIno" className="mb-4 h-12 w-auto" />
                        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                            Connecter l'Afrique, sécuriser ses rêves. Solutions technologiques intelligentes pour les entreprises et
                            institutions.
                        </p>
                        <div className="flex gap-3">
                            {socials.map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <FooterColumn title="Solutions" items={footerSolutions} href="/solutions" />
                    <FooterColumn title="Produits & Logiciels" items={footerProducts} href="/produits" />

                    <div>
                        <h4 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                                {contact.location}
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                <Phone size={16} className="shrink-0 text-primary" />
                                <a href={`tel:${contact.phone || '+'}`} className="transition-colors hover:text-primary">
                                    {contact.phone || 'Contactez-nous'}
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                <Mail size={16} className="shrink-0 text-primary" />
                                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-primary">
                                    {contact.email}
                                </a>
                            </li>
                        </ul>
                        <div className="mt-6">
                            <Link
                                href="/contact"
                                className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-primary/90"
                            >
                                Parler à un expert
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10 py-5">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:flex-row">
                    <p>© {new Date().getFullYear()} IntellIno. Tous droits réservés. Intelligence — Innovation.</p>
                    <div className="flex gap-4">
                        <Link href="/mentions-legales" className="transition-colors hover:text-primary">
                            Mentions légales
                        </Link>
                        <Link href="/confidentialite" className="transition-colors hover:text-primary">
                            Confidentialité
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterColumn({ title, items, href }) {
    return (
        <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">{title}</h4>
            <ul className="space-y-2.5">
                {items.map((item) => (
                    <li key={item}>
                        <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                            {item}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
