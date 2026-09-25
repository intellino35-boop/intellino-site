/** Date d'article en français : « 1 mars 2025 », ou l'année seule (« 2025 ») pour les cartes de l'accueil. */
export function formatPostDate(date, withDay = true) {
    const value = date ? new Date(date) : null;
    if (!value || Number.isNaN(value.getTime())) return '';
    return value.toLocaleDateString('fr-FR', withDay ? { day: 'numeric', month: 'long', year: 'numeric' } : { year: 'numeric' });
}
