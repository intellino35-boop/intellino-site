import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
            fonts: [
                bunny('Outfit', {
                    weights: [400, 500, 600, 700, 800, 900],
                }),
            ],
        }),
        react(),
        tailwindcss(),
    ],
    // Empêche Vite de remonter au postcss.config.js du projet parent (Tailwind v3).
    css: {
        postcss: { plugins: [] },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
