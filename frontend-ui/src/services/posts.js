import api, { unwrap } from '../lib/axios';
import { asArray, asObject } from '../lib/safe';

// Articles du blog : GET /posts?categorie=&page=, GET /posts/{slug}
export const postsService = {
    async list({ category, page } = {}) {
        const params = {};
        if (category) params.categorie = category;
        if (page && Number(page) > 1) params.page = Number(page);

        const { data, meta } = unwrap(await api.get('/posts', { params }));
        return {
            posts: asArray(data),
            meta: {
                currentPage: Number(meta.current_page) || 1,
                lastPage: Number(meta.last_page) || 1,
                total: Number(meta.total) || 0,
                category: meta.category ?? null,
                categories: asArray(meta.categories),
            },
        };
    },

    async show(slug) {
        const { data } = unwrap(await api.get(`/posts/${encodeURIComponent(slug)}`));
        const payload = asObject(data);
        return { item: payload.item ?? null, related: asArray(payload.related) };
    },
};
