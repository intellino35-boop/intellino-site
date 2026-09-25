import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** Remonte en haut à chaque changement de page, ou fait défiler jusqu'à l'ancre (#contact…). */
export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            return undefined;
        }
        // L'ancre peut n'apparaître qu'après le chargement des données : quelques essais espacés.
        let tries = 0;
        const timer = window.setInterval(() => {
            const target = document.getElementById(decodeURIComponent(hash.slice(1)));
            if (target || ++tries > 20) {
                window.clearInterval(timer);
                target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
        return () => window.clearInterval(timer);
    }, [pathname, hash]);

    return null;
}
