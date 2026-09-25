import { createContext } from 'react';

/*
 * Objets de contexte partagés. Les Providers (composants) sont dans *Context.jsx et les hooks d'accès
 * dans src/hooks/ : chaque fichier n'exporte qu'un type d'élément (compatible avec le rechargement à chaud de Vite).
 */

// Valeurs affichées tant que l'API n'a pas répondu (ou si elle est injoignable) : le site reste utilisable.
export const DEFAULT_CONTACT = {
    email: 'contact@intellino.tech',
    phone: '',
    whatsapp: '',
    location: 'Afrique',
    logo: '/images/logo.png',
    heroImage: '/images/hero.jpg',
};

export const SiteContext = createContext({ contact: DEFAULT_CONTACT, legal: {}, blocks: {}, loading: true, error: null });

export const AuthContext = createContext(null);

export const NotifyContext = createContext({ notify: () => {} });
