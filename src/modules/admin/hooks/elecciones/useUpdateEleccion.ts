import { useState, useCallback } from 'react';
import { updateEleccion } from '../../../core/api/sistema-administracion-electoral/eleccion.api';
import type { UpdateEleccionDto, Eleccion } from '../../../core/types/sistema-administracion-electoral/eleccion.types';

export function useUpdateEleccion() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Eleccion | null>(null);

    const update = useCallback(async (id: number, data: UpdateEleccionDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await updateEleccion(id, data);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al actualizar elección');
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