import { useMemo } from 'react';
import { useApi } from '../hooks/useApi';
import { asObject } from '../lib/safe';
import { siteService } from '../services/site';
import { DEFAULT_CONTACT, SiteContext } from './contexts';

/** Charge une fois les paramètres publics et les blocs de pages, partagés par toutes les pages (accès : hooks/useSite). */
export function SiteProvider({ children }) {
    const settings = useApi(() => siteService.settings(), []);
    const blocks = useApi(() => siteService.blocks(), []);

    const value = useMemo(
        () => ({
            // Les valeurs vides de l'API ne remplacent pas les valeurs par défaut (logo, e-mail…).
            contact: {
                ...DEFAULT_CONTACT,
                ...Object.fromEntries(Object.entries(asObject(settings.data?.contact)).filter(([, v]) => v !== null && v !== '')),
            },
            legal: asObject(settings.data?.legal),
            tokenLifetimeHours: settings.data?.tokenLifetimeHours ?? null,
            blocks: asObject(blocks.data),
            loading: settings.loading || blocks.loading,
            error: settings.error ?? blocks.error,
        }),
        [settings.data, settings.loading, settings.error, blocks.data, blocks.loading, blocks.error],
    );

    return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
