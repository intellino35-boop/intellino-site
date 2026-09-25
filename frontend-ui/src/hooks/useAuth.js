import { useContext } from 'react';
import { AuthContext } from '../context/contexts';

/** Session de l'administration : { status, user, admin, can(), login(), logout(), refresh() }. */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans <AuthProvider>.');
    }
    return context;
}
