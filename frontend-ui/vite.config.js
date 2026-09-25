import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Front React (SPA) : les données viennent de l'API Laravel (VITE_API_URL, voir .env.example).
export default defineConfig({
    plugins: [react(), tailwindcss()],
    // Empêche Vite de remonter au postcss.config.js d'un dossier parent (projet GesEcole, Tailwind v3).
    css: {
        postcss: { plugins: [] },
    },
    server: {
        port: 5174,
        strictPort: true, // le port doit correspondre à FRONTEND_URL côté Laravel (CORS)
    },
    preview: {
        port: 5174,
        strictPort: true,
    },
    build: {
        rollupOptions: {
            output: {
                // Bibliothèques dans des fichiers séparés, mis en cache indépendamment du code du site.
                manualChunks(id) {
                    if (!id.includes('node_modules')) return undefined;
                    if (id.includes('@mui') || id.includes('@emotion')) return 'mui';
                    if (id.includes('motion')) return 'motion';
                    if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'react';
                    return 'vendor';
                },
            },
        },
    },
});
