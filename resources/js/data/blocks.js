import { usePage } from '@inertiajs/react';

// Blocs de textes gérés dans l'admin (« Blocs des pages »), partagés par le serveur.
// Chaque élément : { icon, title, text, link }.
export function useBlocks(collection) {
    const { blocks } = usePage().props;
    return blocks?.[collection] ?? [];
}

// Blocs sous forme de tableaux, ex. useBlockTuples('valeurs', 'icon', 'title', 'text') → [[icon, title, text], …].
export function useBlockTuples(collection, ...keys) {
    return useBlocks(collection).map((block) => keys.map((key) => block[key]));
}
