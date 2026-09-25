import { useContext } from 'react';
import { SiteContext } from '../context/contexts';
import { asArray, asObject } from '../lib/safe';

/** Coordonnées, informations légales et blocs du site (chargés par SiteProvider). */
export const useSite = () => useContext(SiteContext);

/** Blocs de textes gérés dans l'admin (« Blocs des pages ») : [{ icon, title, text, link }]. */
export function useBlocks(collection) {
    const { blocks } = useSite();
    return asArray(blocks?.[collection]);
}

/** Blocs sous forme de tableaux, ex. useBlockTuples('valeurs', 'icon', 'title', 'text') → [[icon, title, text], …]. */
export function useBlockTuples(collection, ...keys) {
    return useBlocks(collection).map((block) => keys.map((key) => asObject(block)[key]));
}
