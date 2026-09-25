import { ChevronDown, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useSite } from '../hooks/useSite';
import { links, menus } from '../data/navigation';
import { Link } from './nav';

function DesktopDropdown({ menu }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-primary"
            >
                {menu.label}
                <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-56 overflow-hidden rounded-lg border border-white/10 bg-[#111] shadow-2xl"
                    >
                        {menu.items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-primary"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MobileAccordion({ menu }) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:text-primary"
            >
                {menu.label}
                <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="mb-1 ml-3 space-y-0.5 border-l border-white/10 pl-3">
                    {menu.items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block px-3 py-2 text-sm text-white/60 transition-colors hover:text-primary"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Navbar() {
    const { pathname: url } = useLocation();
    const { contact } = useSite();
    const [scrolled, setScrolled] = useState(false);
    // Le menu mobile est ouvert « pour une page » : il se referme tout seul quand l'adresse change.
    const [mobileOpenOn, setMobileOpenOn] = useState(null);
    const mobileOpen = mobileOpenOn === url;
    const setMobileOpen = (update) =>
        setMobileOpenOn((current) => ((typeof update === 'function' ? update(current === url) : update) ? url : null));

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isHome = url === '/';
    const solid = scrolled || mobileOpen;

    return (
        <nav
            className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
                solid ? 'border-b border-white/10 bg-[#0a0a0a]/95 py-3 backdrop-blur-md' : 'bg-transparent py-5'
            }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
                <Link href="/" className="flex shrink-0 items-center gap-2">
                    <img src={contact.logo} alt="IntellIno" className="h-10 w-auto" />
                </Link>

                <div className="hidden items-center gap-1 lg:flex">
                    <Link
                        href="/"
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5 ${
                            isHome ? 'text-primary' : 'text-white/80 hover:text-white'
                        }`}
                    >
                        Accueil
                    </Link>
                    {menus.map((menu) => (
                        <DesktopDropdown key={menu.label} menu={menu} />
                    ))}
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5 ${
                                url.startsWith(link.href) ? 'text-primary' : 'text-white/80 hover:text-white'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/contact"
                        className="hidden items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-primary/90 lg:inline-flex"
                    >
                        Parler à un expert
                    </Link>
                    <button
                        type="button"
                        aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                        onClick={() => setMobileOpen((o) => !o)}
                        className="cursor-pointer p-2 text-white lg:hidden"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/10 bg-[#0d0d0d] lg:hidden"
                    >
                        <div className="max-h-[80vh] space-y-1 overflow-y-auto px-4 py-4">
                            <Link href="/" className="block px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:text-primary">
                                Accueil
                            </Link>
                            {menus.map((menu) => (
                                <MobileAccordion key={menu.label} menu={menu} />
                            ))}
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:text-primary"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-3">
                                <Link
                                    href="/contact"
                                    className="block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-black"
                                >
                                    Parler à un expert
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
