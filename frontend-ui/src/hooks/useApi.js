import { useCallback, useEffect, useRef, useState } from 'react';
import { asFunction } from '../lib/safe';

/**
 * Charge des données via un service : { data, loading, error, reload }.
 * - `fetcher` : fonction asynchrone d'un service (jamais un appel Axios direct) ;
 * - `deps` : relance le chargement quand elles changent (ex. slug) ;
 * - ignore les réponses arrivées après un changement de page (pas d'état incohérent).
 */
export function useApi(fetcher, deps = []) {
    const [state, setState] = useState({ data: null, loading: true, error: null });
    const [version, setVersion] = useState(0);
    const fetcherRef = useRef(fetcher);

    useEffect(() => {
        fetcherRef.current = fetcher;
    });

    useEffect(() => {
        let active = true;
        const run = asFunction(fetcherRef.current);

        Promise.resolve()
            .then(() => {
                if (active) setState((s) => ({ ...s, loading: true, error: null }));
                return run();
            })
            .then((data) => {
                if (active) setState({ data, loading: false, error: null });
            })
            .catch((error) => {
                if (active) setState({ data: null, loading: false, error });
            });

        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- `deps` est fourni par l'appelant
    }, [...deps, version]);

    const reload = useCallback(() => setVersion((v) => v + 1), []);

    return { ...state, reload };
}
