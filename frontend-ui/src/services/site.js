import api, { unwrap } from '../lib/axios';
import { asArray, asObject } from '../lib/safe';

// Données générales du site public.
export const siteService = {
    /** Page d'accueil : GET /home */
    async home() {
        const { data } = unwrap(await api.get('/home'));
        const payload = asObject(data);
        return {
            solutions: asArray(payload.solutions),
            products: asArray(payload.products),
            softwares: asArray(payload.softwares),
            realisations: asArray(payload.realisations),
            posts: asArray(payload.posts),
        };
    },

    /** Coordonnées, images et informations légales : GET /settings */
    async settings() {
        const { data } = unwrap(await api.get('/settings'));
        const payload = asObject(data);
        return { contact: asObject(payload.contact), legal: asObject(payload.legal), tokenLifetimeHours: payload.tokenLifetimeHours ?? null };
    },

    /** Blocs de textes des pages, par collection : GET /blocks */
    async blocks() {
        const { data } = unwrap(await api.get('/blocks'));
        return Object.fromEntries(Object.entries(asObject(data)).map(([collection, blocks]) => [collection, asArray(blocks)]));
    },

    /** Projets du Technology Lab : GET /lab/projects */
    async labProjects() {
        const { data } = unwrap(await api.get('/lab/projects'));
        return asArray(data);
    },
};
