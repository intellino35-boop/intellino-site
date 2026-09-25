import { createTheme } from '@mui/material/styles';

// Thème Material UI aligné sur la charte IntellIno (fond noir, orange primaire, police Outfit).
// Tailwind reste utilisé pour la mise en page ; MUI sert aux composants d'interface (dialogues, notifications, chargement).
export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#f97316', contrastText: '#000000' },
        background: { default: '#080808', paper: '#111111' },
    },
    typography: {
        fontFamily: "'Outfit', ui-sans-serif, system-ui, sans-serif",
        button: { textTransform: 'none', fontWeight: 700 },
    },
    shape: { borderRadius: 12 },
});
