import api, { unwrap } from '../lib/axios';
import { asArray, asObject } from '../lib/safe';

/**
 * Fabrique de services pour les contenus adressés par slug (même format d'API) :
 * list() → tableau ; show(slug) → { item, others }.
 */
export function createCatalogService(endpoint) {
    return {
        async list() {
            const { data } = unwrap(await api.get(`/${endpoint}`));
            return asArray(data);
        },
        async show(slug) {
            const { data } = unwrap(await api.get(`/${endpoint}/${encodeURIComponent(slug)}`));
            const payload = asObject(data);
            return { item: payload.item ?? null, others: asArray(payload.others) };
        },
    };
}
