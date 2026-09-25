import { useCallback, useEffect, useMemo, useState } from 'react';
import { AUTH_EXPIRED_EVENT } from '../lib/axios';
import { asArray } from '../lib/safe';
import { authService } from '../services/auth';
import { AuthContext } from './contexts';

const EMPTY_ADMIN = { unread: 0, resources: [], blockTypes: [] };

/**
 * Session de l'administration (accès : hooks/useAuth) : { status: 'loading' | 'authenticated' | 'guest', user, admin, can(), login(), logout(), refresh() }.
 * Le jeton est ajouté aux requêtes par l'intercepteur Axios ; un 401 renvoie automatiquement en mode visiteur.
 */
export function AuthProvider({ children }) {
    const [state, setState] = useState(() => ({
        status: authService.hasToken() ? 'loading' : 'guest',
        user: null,
        admin: EMPTY_ADMIN,
        notice: null,
    }));

    const refresh = useCallback(async () => {
        if (!authService.hasToken()) {
            setState((s) => ({ ...s, status: 'guest', user: null, admin: EMPTY_ADMIN }));
            return;
        }
        try {
            const session = await authService.me();
            setState((s) => ({ ...s, status: 'authenticated', ...session }));
        } catch {
            setState((s) => ({ ...s, status: 'guest', user: null, admin: EMPTY_ADMIN }));
        }
    }, []);

    // Au chargement : un jeton existant est vérifié auprès de l'API.
    useEffect(() => {
        if (!authService.hasToken()) return;
        let active = true;
        authService
            .me()
            .then((session) => active && setState((s) => ({ ...s, status: 'authenticated', ...session })))
            .catch(() => active && setState((s) => ({ ...s, status: 'guest', user: null, admin: EMPTY_ADMIN })));
        return () => {
            active = false;
        };
    }, []);

    // 401 reçu de l'API (jeton expiré, révoqué, compte désactivé) : retour à l'écran de connexion avec le message.
    useEffect(() => {
        const onExpired = (event) => setState({ status: 'guest', user: null, admin: EMPTY_ADMIN, notice: event.detail || null });
        window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
        return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
    }, []);

    const login = useCallback(async (credentials) => {
        const session = await authService.login(credentials);
        setState({ status: 'authenticated', notice: null, ...session });
        return session;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } finally {
            setState({ status: 'guest', user: null, admin: EMPTY_ADMIN, notice: null });
        }
    }, []);

    const can = useCallback((permission) => asArray(state.user?.permissions).includes(permission), [state.user]);

    const value = useMemo(() => ({ ...state, can, login, logout, refresh }), [state, can, login, logout, refresh]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
