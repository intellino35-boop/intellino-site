import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { asFunction } from '../lib/safe';

/** Boîte de confirmation (Material UI) pour les actions irréversibles de l'admin (suppression…). */
export default function ConfirmDialog({ open, title = 'Confirmer', message, confirmLabel = 'Supprimer', onConfirm, onClose, busy = false }) {
    const close = asFunction(onClose);

    return (
        <Dialog open={Boolean(open)} onClose={busy ? undefined : close} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={close} disabled={busy} color="inherit">
                    Annuler
                </Button>
                <Button onClick={() => asFunction(onConfirm)()} disabled={busy} color="error" variant="contained">
                    {busy ? 'Suppression…' : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
