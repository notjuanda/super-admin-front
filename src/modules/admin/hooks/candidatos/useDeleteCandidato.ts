import { useState, useCallback } from 'react';
import { deleteCandidato } from '../../../core/api/sistema-administracion-electoral/candidato.api';

export function useDeleteCandidato() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const remove = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await deleteCandidato(id);
            setSuccess(true);
            return true;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al eliminar el candidato');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearSuccess = useCallback(() => {
        setSuccess(false);
    }, []);

    return {
        remove,
        loading,
        error,
        success,
        clearError,
        clearSuccess
    };
} 