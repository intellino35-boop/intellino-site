// Police Outfit servie par le site lui-même (aucun appel à un service externe).
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/800.css';
import '@fontsource/outfit/900.css';
import './index.css';

import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { NotifyProvider } from './context/NotifyContext';
import { SiteProvider } from './context/SiteContext';
import { theme } from './theme';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        {/* enableCssLayer : styles MUI dans la couche CSS « mui » pour cohabiter avec Tailwind */}
        <StyledEngineProvider enableCssLayer>
            <ThemeProvider theme={theme}>
                <HelmetProvider>
                    <BrowserRouter>
                        <NotifyProvider>
                            <SiteProvider>
                                <AuthProvider>
                                    <App />
                                </AuthProvider>
                            </SiteProvider>
                        </NotifyProvider>
                    </BrowserRouter>
                </HelmetProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    </StrictMode>,
);
