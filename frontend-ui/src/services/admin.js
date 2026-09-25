import api, { unwrap } from '../lib/axios';
import { asArray, asObject } from '../lib/safe';

// Services de l'administration (routes /admin/*, jeton requis).

export const dashboardService = {
    async get() {
        const { data } = unwrap(await api.get('/admin/dashboard'));
        const payload = asObject(data);
        return {
            counts: asArray(payload.counts),
            messagesTotal: payload.messagesTotal ?? null,
            latestMessages: payload.latestMessages === null ? null : asArray(payload.latestMessages),
        };
    },
};

export const messagesService = {
    async list({ filtre, q, page } = {}) {
        const params = {};
        if (filtre) params.filtre = filtre;
        if (q) params.q = q;
        if (page && Number(page) > 1) params.page = Number(page);

        const { data, meta } = unwrap(await api.get('/admin/messages', { params }));
        return {
            messages: asArray(data),
            meta: { currentPage: Number(meta.current_page) || 1, lastPage: Number(meta.last_page) || 1, total: Number(meta.total) || 0 },
        };
    },
    async show(id) {
        const { data } = unwrap(await api.get(`/admin/messages/${id}`));
        return asObject(data);
    },
    async toggleRead(id) {
        return unwrap(await api.patch(`/admin/messages/${id}/toggle-read`));
    },
    async remove(id) {
        return unwrap(await api.delete(`/admin/messages/${id}`));
    },
};

/** Contenus et blocs de pages : CRUD générique par type. */
export const contentService = {
    async schema(type) {
        const { data } = unwrap(await api.get(`/admin/content/${type}/schema`));
        return normalizeResource(data);
    },
    async list(type) {
        const { data, meta } = unwrap(await api.get(`/admin/content/${type}`));
        return { items: asArray(data), resource: normalizeResource(meta.resource) };
    },
    async show(type, id) {
        const { data, meta } = unwrap(await api.get(`/admin/content/${type}/${id}`));
        return { item: asObject(data), resource: normalizeResource(meta.resource) };
    },
    async create(type, payload) {
        return unwrap(await api.post(`/admin/content/${type}`, payload));
    },
    async update(type, id, payload) {
        return unwrap(await api.put(`/admin/content/${type}/${id}`, payload));
    },
    async remove(type, id) {
        return unwrap(await api.delete(`/admin/content/${type}/${id}`));
    },
};

function normalizeResource(resource) {
    const r = asObject(resource);
    return { ...r, fields: asArray(r.fields) };
}

export const blocksService = {
    async overview() {
        const { data } = unwrap(await api.get('/admin/blocks'));
        return asArray(data);
    },
};

export const settingsService = {
    async get() {
        const { data } = unwrap(await api.get('/admin/settings'));
        const payload = asObject(data);
        return { fields: asArray(payload.fields), values: asObject(payload.values), overridden: asArray(payload.overridden) };
    },
    /** Envoi multipart/form-data (images). */
    async save(formData) {
        return unwrap(await api.post('/admin/settings', formData, { headers: { 'Content-Type': 'multipart/form-data' } }));
    },
};

export const usersService = {
    async list() {
        const { data, meta } = unwrap(await api.get('/admin/users'));
        return { users: asArray(data), roles: asArray(meta.roles), currentUserId: meta.currentUserId ?? null };
    },
    async roles() {
        const { data } = unwrap(await api.get('/admin/roles'));
        return asArray(data);
    },
    async show(id) {
        const { data, meta } = unwrap(await api.get(`/admin/users/${id}`));
        return { user: asObject(data), roles: asArray(meta.roles), isSelf: Boolean(meta.isSelf) };
    },
    async create(payload) {
        return unwrap(await api.post('/admin/users', payload));
    },
    async update(id, payload) {
        return unwrap(await api.put(`/admin/users/${id}`, payload));
    },
    async remove(id) {
        return unwrap(await api.delete(`/admin/users/${id}`));
    },
};

export const profileService = {
    async get() {
        const { data } = unwrap(await api.get('/admin/profile'));
        const payload = asObject(data);
        return { user: asObject(payload.user), role: payload.role ?? null };
    },
    async update(payload) {
        return unwrap(await api.put('/admin/profile', payload));
    },
};
