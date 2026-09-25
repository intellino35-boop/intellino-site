import { Head, Link } from '../Components/nav';
import { ArrowLeft, Clock } from 'lucide-react';
import { Accent, Eyebrow } from '../Components/ui';
import SiteLayout from '../Layouts/SiteLayout';

export default function ComingSoon() {
    return (
        <SiteLayout>
            <Head title="Bientôt disponible" />
            <div className="flex flex-1 items-center justify-center px-4 pt-32 pb-24">
                <div className="max-w-lg text-center">
                    <div className="mb-6 text-6xl">🧪</div>
                    <Eyebrow className="mb-6">
                        <Clock size={12} />
                        En développement
                    </Eyebrow>
                    <h1 className="mb-4 text-3xl font-black text-white md:text-4xl">
                        Cette page arrive <Accent>bientôt</Accent>
                    </h1>
                    <p className="mb-8 text-muted-foreground">
                        Notre équipe travaille activement sur cette section. Revenez bientôt ou contactez-nous directement.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-primary/50"
                        >
                            <ArrowLeft size={16} />
                            Retour à l'accueil
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-primary/90"
                        >
                            Contactez-nous
                        </Link>
                    </div>
                </div>
            </div>
        </SiteLayout>
    );
}
