import axios from 'axios';
import { asObject } from './safe';

/*
 * Instance Axios unique de l'application. Aucun composant n'appelle Axios directement :
 * tout passe par les services de src/services/.
 *
 * Format des réponses de l'API : { data, message, status } (+ errors pour les 422, meta pour les listes paginées).
 */

export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api').replace(/\/+$/, '');

const TOKEN_KEY = 'intellino_admin_token';

// ─── Jeton de l'administration ────────────────────────────────
// Stocké dans le navigateur de l'administrateur uniquement ; jamais utilisé par le site public.
export const tokenStorage = {
    get() {
        try {
            return window.localStorage.getItem(TOKEN_KEY);
        } catch {
            return null;
        }
    },
    set(token) {
        try {
            window.localStorage.setItem(TOKEN_KEY, token);
        } catch {
            /* stockage indisponible (navigation privée) : le jeton reste valable jusqu'au rechargement */
        }
    },
    clear() {
        try {
            window.localStorage.removeItem(TOKEN_KEY);
        } catch {
            /* rien à faire */
        }
    },
};

// ─── Erreur normalisée ────────────────────────────────────────
export class ApiError extends Error {
    constructor({ message, status = 0, errors = {}, data = null }) {
        super(message);
        this.name = 'ApiError';
        this.status = status; // 0 = erreur réseau
        this.errors = errors; // { champ: 'premier message' } pour les 422
        this.data = data;
    }

    get isValidation() {
        return this.status === 422;
    }

    get isNotFound() {
        return this.status === 404;
    }
}

/** { champ: ['msg1', 'msg2'] } → { champ: 'msg1' } (un message par champ pour les formulaires). */
function flattenErrors(errors) {
    return Object.fromEntries(
        Object.entries(asObject(errors)).map(([field, messages]) => [field, Array.isArray(messages) ? messages[0] : String(messages)]),
    );
}

// Événements écoutés par AuthContext / NotifyContext (évite une dépendance circulaire avec React).
export const AUTH_EXPIRED_EVENT = 'intellino:auth-expired';
export const FORBIDDEN_EVENT = 'intellino:forbidden';

const api = axios.create({
    baseURL: API_URL,
    timeout: 20000,
    headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
});

api.interceptors.request.use((config) => {
    const token = tokenStorage.get();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Pas de réponse : serveur arrêté, réseau coupé, CORS refusé ou délai dépassé.
        if (!error.response) {
            const message =
                error.code === 'ECONNABORTED'
                    ? 'Le serveur met trop de temps à répondre. Merci de réessayer.'
                    : 'Impossible de joindre le serveur. Vérifiez votre connexion ou réessayez dans un instant.';
            return Promise.reject(new ApiError({ message, status: 0 }));
        }

        const { status, data } = error.response;
        const body = asObject(data);
        const apiError = new ApiError({
            status,
            message: body.message || `Erreur ${status}.`,
            errors: flattenErrors(body.errors),
            data: body.data ?? null,
        });

        const isLoginRequest = String(error.config?.url ?? '').includes('/auth/login');

        if (status === 401 && !isLoginRequest) {
            // Jeton expiré, révoqué ou compte désactivé : on repasse en visiteur.
            tokenStorage.clear();
            window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT, { detail: apiError.message }));
        }

        if (status === 403 && !isLoginRequest) {
            window.dispatchEvent(new CustomEvent(FORBIDDEN_EVENT, { detail: apiError.message }));
        }

        return Promise.reject(apiError);
    },
);

/**
 * Vérifie le format { data, message, status } et renvoie { data, message, meta }.
 * Une réponse mal formée est une vraie erreur (on ne la masque pas avec des données vides).
 */
export function unwrap(response) {
    const body = response?.data;
    if (!body || typeof body !== 'object' || body.status !== true || !('data' in body)) {
        throw new ApiError({ message: 'Réponse inattendue du serveur.', status: response?.status ?? 0 });
    }
    return { data: body.data, message: body.message ?? '', meta: asObject(body.meta) };
}

export default api;
