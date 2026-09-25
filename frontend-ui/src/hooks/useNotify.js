import { useContext } from 'react';
import { NotifyContext } from '../context/contexts';

/** notify('Message', 'success' | 'error' | 'info' | 'warning') : notification Material UI. */
export const useNotify = () => useContext(NotifyContext);
