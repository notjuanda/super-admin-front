import { useState, useCallback } from 'react';
import { deleteCargo } from '../../../core/api/sistema-administracion-electoral/cargo.api';

export function useDeleteCargo() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const remove = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await deleteCargo(id);
            setSuccess(true);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al eliminar cargo');
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
        remove,
        loading,
        error,
        success,
        clearError,
        clearSuccess
    };
} 