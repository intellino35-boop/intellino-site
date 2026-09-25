import { Component } from 'react';

/**
 * Filet de sécurité : une erreur de rendu React affiche un message au lieu d'une page blanche.
 * `resetKey` (ex. l'adresse de la page) réinitialise l'erreur quand on change de page.
 */
export default class ErrorBoundary extends Component {
    state = { error: null, resetKey: this.props.resetKey };

    static getDerivedStateFromError(error) {
        return { error };
    }

    static getDerivedStateFromProps(props, state) {
        return props.resetKey !== state.resetKey ? { error: null, resetKey: props.resetKey } : null;
    }

    componentDidCatch(error, info) {
        // Visible dans la console du navigateur pour le diagnostic (cause réelle, pile des composants).
        console.error('Erreur d’affichage IntellIno :', error, info?.componentStack);
    }

    render() {
        if (!this.state.error) {
            return this.props.children;
        }

        return (
            <div role="alert" className="flex min-h-screen items-center justify-center bg-[#080808] px-4 text-center">
                <div className="max-w-md">
                    <div className="mb-4 text-5xl">⚠️</div>
                    <h1 className="mb-3 text-2xl font-black text-white">Un problème d'affichage est survenu</h1>
                    <p className="mb-6 text-muted-foreground">Rechargez la page. Si le problème persiste, contactez-nous.</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-black hover:bg-primary/90"
                    >
                        Recharger la page
                    </button>
                </div>
            </div>
        );
    }
}
