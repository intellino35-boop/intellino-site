import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useNotify } from '../hooks/useNotify';
import { Loading } from './states';

/**
 * Protège une page de l'admin : connexion obligatoire et, si `permission` est fourni, rôle autorisé.
 * L'API vérifie aussi chaque accès (401/403) : ce garde améliore seulement l'expérience.
 */
export default function RequireAuth({ permission, children }) {
    const { status, can } = useAuth();
    const location = useLocation();
    const { notify } = useNotify();
    const denied = status === 'authenticated' && permission && !can(permission);

    useEffect(() => {
        if (denied) notify('Votre rôle ne donne pas accès à cette page.', 'error');
    }, [denied, notify]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#080808]">
                <Loading label="Vérification de la session…" className="min-h-screen" />
            </div>
        );
    }

    if (status !== 'authenticated') {
        return <Navigate to="/admin/login" replace state={{ from: location.pathname + location.search }} />;
    }

    if (denied) {
        return <Navigate to="/admin" replace />;
    }

    return children;
}
