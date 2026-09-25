import { Alert, Snackbar } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FORBIDDEN_EVENT } from '../lib/axios';
import { NotifyContext } from './contexts';

/** Notifications éphémères (Material UI Snackbar) : notify('Message', 'success' | 'error' | 'info' | 'warning'). */
export function NotifyProvider({ children }) {
    const [toast, setToast] = useState(null);

    const notify = useCallback((message, severity = 'success') => {
        if (message) setToast({ message: String(message), severity, key: Date.now() });
    }, []);

    // Accès refusé (403) renvoyé par l'API : message affiché partout dans l'admin.
    useEffect(() => {
        const onForbidden = (event) => notify(event.detail || "Vous n'avez pas l'autorisation d'effectuer cette action.", 'error');
        window.addEventListener(FORBIDDEN_EVENT, onForbidden);
        return () => window.removeEventListener(FORBIDDEN_EVENT, onForbidden);
    }, [notify]);

    const value = useMemo(() => ({ notify }), [notify]);

    return (
        <NotifyContext.Provider value={value}>
            {children}
            <Snackbar
                key={toast?.key}
                open={Boolean(toast)}
                autoHideDuration={5000}
                onClose={(_, reason) => reason !== 'clickaway' && setToast(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                {toast ? (
                    <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)} sx={{ width: '100%' }}>
                        {toast.message}
                    </Alert>
                ) : undefined}
            </Snackbar>
        </NotifyContext.Provider>
    );
}
