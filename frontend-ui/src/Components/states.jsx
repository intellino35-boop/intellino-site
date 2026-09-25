import { CircularProgress } from '@mui/material';
import { Inbox, RefreshCw, TriangleAlert } from 'lucide-react';
import { asFunction } from '../lib/safe';

/** État « chargement » (Material UI). */
export function Loading({ label = 'Chargement…', className = 'py-24' }) {
    return (
        <div role="status" aria-live="polite" className={`flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground ${className}`}>
            <CircularProgress size={32} sx={{ color: 'var(--color-primary)' }} />
            {label}
        </div>
    );
}

/** État « erreur » avec bouton pour réessayer. */
export function ErrorState({ error, onRetry, className = 'py-24' }) {
    const retry = typeof onRetry === 'function' ? onRetry : null;

    return (
        <div role="alert" className={`mx-auto flex max-w-lg flex-col items-center gap-4 px-4 text-center ${className}`}>
            <TriangleAlert size={32} className="text-primary" />
            <p className="text-white">{error?.message ?? 'Une erreur est survenue.'}</p>
            {retry && (
                <button
                    type="button"
                    onClick={() => asFunction(retry)()}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-primary/50"
                >
                    <RefreshCw size={16} /> Réessayer
                </button>
            )}
        </div>
    );
}

/** État « vide ». */
export function EmptyState({ children = 'Aucun élément pour le moment.', className = 'py-16' }) {
    return (
        <div className={`flex flex-col items-center gap-2 text-center text-sm text-muted-foreground ${className}`}>
            <Inbox size={28} className="text-white/30" />
            {children}
        </div>
    );
}

/**
 * Affiche le bon état selon une requête useApi : chargement, erreur, vide, puis le contenu.
 * `children` peut être une fonction recevant les données.
 */
export function AsyncContent({ state, isEmpty, empty, loadingLabel, children, className }) {
    if (state?.loading) return <Loading label={loadingLabel} className={className} />;
    if (state?.error) return <ErrorState error={state.error} onRetry={state.reload} className={className} />;
    if (typeof isEmpty === 'function' && isEmpty(state?.data)) return <EmptyState className={className}>{empty}</EmptyState>;
    return typeof children === 'function' ? children(state?.data) : children;
}
