import { useState, useCallback } from 'react';
import { deletePartidoPolitico } from '../../../core/api/sistema-administracion-electoral/partido-politico.api';

export function useDeletePartidoPolitico() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const deletePartido = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await deletePartidoPolitico(id);
            setSuccess(true);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al eliminar el partido político');
            throw err;
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
        deletePartido,
        loading,
        error,
        success,
        clearError,
        clearSuccess
    };
} 