import api, { tokenStorage, unwrap } from '../lib/axios';
import { asArray, asObject } from '../lib/safe';

function normalizeSession(data) {
    const payload = asObject(data);
    const user = asObject(payload.user);
    const admin = asObject(payload.admin);
    return {
        user: { ...user, permissions: asArray(user.permissions) },
        admin: { unread: Number(admin.unread) || 0, resources: asArray(admin.resources), blockTypes: asArray(admin.blockTypes) },
    };
}

// Authentification de l'administration (jeton Sanctum).
export const authService = {
    async login({ email, password, remember }) {
        const { data } = unwrap(await api.post('/auth/login', { email, password, remember: Boolean(remember) }));
        if (!data?.token) {
            throw new Error('Jeton manquant dans la réponse du serveur.');
        }
        tokenStorage.set(data.token);
        return normalizeSession(data);
    },

    async me() {
        const { data } = unwrap(await api.get('/auth/me'));
        return normalizeSession(data);
    },

    async logout() {
        try {
            await api.post('/auth/logout');
        } finally {
            tokenStorage.clear(); // déconnexion locale même si le serveur est injoignable
        }
    },

    hasToken: () => Boolean(tokenStorage.get()),
};
