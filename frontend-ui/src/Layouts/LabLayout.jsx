import { useLocation } from 'react-router';
import { Head, Link } from '../Components/nav';
import { Accent, CtaBanner, PageHero } from '../Components/ui';
import { labTabs } from '../data/lab';
import SiteLayout from './SiteLayout';

// Gabarit commun aux pages du Technology Lab : en-tête, onglets entre les 4 pages et appel à l'action.
export default function LabLayout({ title, heading, subtitle, cta, children }) {
    const { pathname: url } = useLocation();
    const current = labTabs.find((t) => url.startsWith(t.href));

    return (
        <SiteLayout>
            <Head title={`${title} — Technology Lab`} />
            <PageHero
                breadcrumb={[['Technology Lab', '/lab/vision'], [title]]}
                eyebrow="🧪 IntellIno Technology Lab"
                title={heading}
                subtitle={subtitle}
            />

            <div className="sticky top-[65px] z-30 border-y border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md">
                <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
                    {labTabs.map((tab) => (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            preserveScroll
                            className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                current?.href === tab.href ? 'bg-primary text-black' : 'text-white/70 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </Link>
                    ))}
                </nav>
            </div>

            {children}

            <CtaBanner
                title={
                    cta?.title ?? (
                        <>
                            Un défi à <Accent>relever</Accent> ?
                        </>
                    )
                }
                text={cta?.text ?? 'Présentez-nous votre problématique : elle pourrait devenir le prochain projet du Technology Lab.'}
                sujet={cta?.sujet}
            />
        </SiteLayout>
    );
}
