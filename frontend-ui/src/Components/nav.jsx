import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router';

/**
 * Lien du site (remplace Link d'Inertia) : les adresses internes (« /… ») passent par React Router,
 * les autres (https://, mailto:, tel:, #ancre) restent des liens classiques.
 */
export function Link({ href, to, children, preserveScroll: _preserveScroll, replace, state, ...rest }) {
    const target = to ?? href ?? '';
    const isInternal = typeof target === 'string' && target.startsWith('/') && !target.startsWith('//');

    if (!isInternal) {
        return (
            <a href={target || undefined} {...rest}>
                {children}
            </a>
        );
    }

    return (
        <RouterLink to={target} replace={replace} state={state} {...rest}>
            {children}
        </RouterLink>
    );
}

/** Titre et description de la page (remplace Head d'Inertia, via React Helmet). */
export function Head({ title, description }) {
    const fullTitle = title && title !== 'Accueil' ? `${title} — IntellIno` : 'IntellIno';

    return (
        <Helmet>
            <title>{fullTitle}</title>
            {description ? <meta name="description" content={description} /> : null}
        </Helmet>
    );
}
