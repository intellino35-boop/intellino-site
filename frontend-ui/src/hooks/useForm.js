import { useCallback, useRef, useState } from 'react';
import { asFunction, asObject } from '../lib/safe';

/**
 * État de formulaire (remplace useForm d'Inertia) :
 * data, setData(champ, valeur) | setData(objet | fonction), errors, processing, reset(...champs),
 * submit(action, { onSuccess, onError }) où `action` appelle un service et peut lever une ApiError (422 → errors).
 */
export function useForm(initial) {
    const initialRef = useRef(initial);
    const [data, setDataState] = useState(initial);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const setData = useCallback((keyOrValue, value) => {
        setDataState((current) => {
            if (typeof keyOrValue === 'function') return keyOrValue(current);
            if (typeof keyOrValue === 'object' && keyOrValue !== null) return { ...current, ...keyOrValue };
            return { ...current, [keyOrValue]: value };
        });
    }, []);

    const reset = useCallback((...fields) => {
        setDataState((current) =>
            fields.length === 0
                ? initialRef.current
                : { ...current, ...Object.fromEntries(fields.map((f) => [f, initialRef.current[f]])) },
        );
    }, []);

    const submit = useCallback(async (action, { onSuccess, onError } = {}) => {
        setProcessing(true);
        setErrors({});
        try {
            const result = await asFunction(action)();
            asFunction(onSuccess)(result);
            return result;
        } catch (error) {
            // 422 : erreurs par champ ; autres erreurs : message général sous la clé « form ».
            setErrors(error?.status === 422 ? asObject(error.errors) : { form: error?.message ?? 'Une erreur est survenue.' });
            asFunction(onError)(error);
            return undefined;
        } finally {
            setProcessing(false);
        }
    }, []);

    return { data, setData, errors, setErrors, processing, reset, submit };
}
