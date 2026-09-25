// Garde-fous contre les données inattendues (null, undefined, mauvais type) venant de l'API ou des props.

/** Toujours un tableau : évite « .map / .filter is not a function ». */
export const asArray = (value) => (Array.isArray(value) ? value : []);

/** Toujours un objet simple. */
export const asObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

/** Toujours une fonction appelable : évite « n is not a function ». */
export const asFunction = (value) => (typeof value === 'function' ? value : () => {});

/** Texte affichable (chaîne vide si absent). */
export const asText = (value, fallback = '') => (value === null || value === undefined ? fallback : String(value));
