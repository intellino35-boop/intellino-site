import api, { unwrap } from '../lib/axios';

// Formulaire de contact : POST /contact (erreurs 422 → error.errors par champ).
export const contactService = {
    async send(form) {
        const { message } = unwrap(await api.post('/contact', form));
        return message;
    },
};
