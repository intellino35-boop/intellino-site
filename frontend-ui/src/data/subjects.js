export const subjects = [
    ['solutions', 'Solutions digitales'],
    ['securite', 'Sécurité & Cybersécurité'],
    ['cloud', 'Cloud & Infrastructure'],
    ['ia', 'Intelligence Artificielle'],
    ['iot', 'IoT & Systèmes intelligents'],
    ['produit', 'Produits IntellIno'],
    ['partenariat', 'Partenariat'],
    ['autre', 'Autre'],
];

export const subjectLabel = (value) => subjects.find(([v]) => v === value)?.[1] ?? value;

export const formatDate = (iso) =>
    new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
