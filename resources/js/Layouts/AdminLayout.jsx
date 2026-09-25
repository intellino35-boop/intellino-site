import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Boxes,
    BriefcaseBusiness,
    CheckCircle2,
    ExternalLink,
    FileText,
    Inbox,
    LayoutDashboard,
    Layers,
    LayoutList,
    LogOut,
    Menu,
    MonitorSmartphone,
    Settings,
    TriangleAlert,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const resourceIcons = {
    solutions: Layers,
    products: Boxes,
    logiciels: MonitorSmartphone,
    realisations: BriefcaseBusiness,
    articles: FileText,
};

function NavItem({ href, icon: Icon, active, children, badge }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? 'bg-primary/15 text-primary' : 'text-white/70 hover:bg-white/5 hover:text-white'
            }`}
        >
            <Icon size={18} />
            <span className="flex-1">{children}</span>
            {badge > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-black">{badge}</span>}
        </Link>
    );
}

export default function AdminLayout({ title, actions, children }) {
    const { url, props } = usePage();
    const { admin, auth, flash, contact, errors } = props;
    const [open, setOpen] = useState(false);
    const can = (permission) => auth.user?.permissions?.includes(permission);

    useEffect(() => setOpen(false), [url]);

    const path = url.split('?')[0];

    const sidebar = (
        <div className="flex h-full flex-col">
            <Link href="/admin" className="mb-8 flex items-center gap-3 px-3">
                <img src={contact.logo} alt="IntellIno" className="h-9 w-auto" />
                <span className="text-xs font-semibold tracking-widest text-primary uppercase">Admin</span>
            </Link>

            <nav className="flex-1 space-y-1">
                <NavItem href="/admin" icon={LayoutDashboard} active={path === '/admin'}>
                    Tableau de bord
                </NavItem>
                {can('messages') && (
                    <NavItem href="/admin/messages" icon={Inbox} active={path.startsWith('/admin/messages')} badge={admin.unread}>
                        Messages
                    </NavItem>
                )}

                {can('content') && (
                    <>
                        <div className="px-3 pt-6 pb-2 text-xs font-semibold tracking-wider text-white/40 uppercase">Contenu du site</div>
                        {admin.resources.map((r) => (
                            <NavItem
                                key={r.type}
                                href={`/admin/contenu/${r.type}`}
                                icon={resourceIcons[r.type] ?? FileText}
                                active={path.startsWith(`/admin/contenu/${r.type}`)}
                            >
                                {r.label}
                            </NavItem>
                        ))}
                    </>
                )}

                {(can('blocks') || can('settings')) && (
                    <div className="px-3 pt-6 pb-2 text-xs font-semibold tracking-wider text-white/40 uppercase">Personnalisation</div>
                )}
                {can('blocks') && (
                    <NavItem
                        href="/admin/blocs"
                        icon={LayoutList}
                        active={path === '/admin/blocs' || admin.blockTypes.some((t) => path.startsWith(`/admin/contenu/${t}`))}
                    >
                        Blocs des pages
                    </NavItem>
                )}
                {can('settings') && (
                    <NavItem href="/admin/parametres" icon={Settings} active={path.startsWith('/admin/parametres')}>
                        Paramètres
                    </NavItem>
                )}

                {can('users') && (
                    <>
                        <div className="px-3 pt-6 pb-2 text-xs font-semibold tracking-wider text-white/40 uppercase">Administration</div>
                        <NavItem href="/admin/utilisateurs" icon={Users} active={path.startsWith('/admin/utilisateurs')}>
                            Utilisateurs
                        </NavItem>
                    </>
                )}
            </nav>

            <div className="space-y-1 border-t border-white/10 pt-4">
                <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                >
                    <ExternalLink size={18} /> Voir le site
                </a>
                <button
                    type="button"
                    onClick={() => router.post('/admin/logout')}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                >
                    <LogOut size={18} /> Déconnexion
                </button>
                <Link
                    href="/admin/mon-compte"
                    className={`mt-2 flex items-center gap-3 rounded-lg px-3 py-2 ${path === '/admin/mon-compte' ? 'bg-primary/15' : 'hover:bg-white/5'}`}
                >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                        {auth.user?.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-white">{auth.user?.name}</span>
                        <span className="block truncate text-xs text-white/40">
                            {auth.user?.roleLabel} · Mon compte
                        </span>
                    </span>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#080808] lg:flex">
            <Head title={title} />

            <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#0a0a0a] p-4 lg:sticky lg:top-0 lg:block lg:h-screen">
                {sidebar}
            </aside>

            {open && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
                    <aside className="relative h-full w-72 max-w-[85%] border-r border-white/10 bg-[#0a0a0a] p-4">{sidebar}</aside>
                </div>
            )}

            <div className="min-w-0 flex-1">
                <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-[#080808]/95 px-4 py-4 backdrop-blur-md md:px-8">
                    <button type="button" aria-label="Menu" onClick={() => setOpen(!open)} className="cursor-pointer text-white lg:hidden">
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                    <h1 className="flex-1 truncate text-xl font-bold text-white">{title}</h1>
                    {actions}
                </header>

                <main className="px-4 py-6 md:px-8">
                    {flash.success && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
                            <CheckCircle2 size={18} className="shrink-0" />
                            {flash.success}
                        </div>
                    )}
                    {errors?.user && (
                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                            <TriangleAlert size={18} className="shrink-0" />
                            {errors.user}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}

export function Card({ children, className = '' }) {
    return <div className={`rounded-2xl border border-white/10 bg-white/5 ${className}`}>{children}</div>;
}

export function PrimaryLink({ href, children }) {
    return (
        <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-primary/90"
        >
            {children}
        </Link>
    );
}
