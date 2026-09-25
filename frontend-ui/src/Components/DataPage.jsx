import SiteLayout from '../Layouts/SiteLayout';
import ComingSoon from '../Pages/ComingSoon';
import { Head } from './nav';
import { AsyncContent } from './states';

/**
 * Page publique alimentée par l'API (useApi) :
 * chargement / erreur → message dans la mise en page du site ; 404 → page « introuvable » ;
 * sinon `children(data)` affiche la page.
 */
export default function DataPage({ state, title, isMissing, children }) {
    const missing = state?.error?.status === 404 || (!state?.loading && !state?.error && typeof isMissing === 'function' && isMissing(state?.data));

    if (missing) {
        return <ComingSoon />;
    }

    if (state?.loading || state?.error) {
        return (
            <SiteLayout>
                {title ? <Head title={title} /> : null}
                <div className="flex flex-1 items-center justify-center pt-24">
                    <AsyncContent state={state} className="py-32" />
                </div>
            </SiteLayout>
        );
    }

    return typeof children === 'function' ? children(state.data) : null;
}
