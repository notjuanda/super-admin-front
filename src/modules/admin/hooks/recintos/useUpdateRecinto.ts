import { useState, useCallback } from 'react';
import { updateRecinto } from '../../../core/api/sistema-administracion-electoral/recinto.api';
import type { UpdateRecintoDto, Recinto } from '../../../core/types/sistema-administracion-electoral/recinto.types';

export function useUpdateRecinto() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Recinto | null>(null);

    const update = useCallback(async (id: number, data: UpdateRecintoDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await updateRecinto(id, data);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al actualizar el recinto');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearSuccess = useCallback(() => {
        setSuccess(null);
    }, []);

    return {
        update,
        loading,
        error,
        success,
        clearError,
        clearSuccess
    };
} 