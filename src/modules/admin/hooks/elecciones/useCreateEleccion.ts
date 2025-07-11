import { useState, useCallback } from 'react';
import { createEleccion } from '../../../core/api/sistema-administracion-electoral/eleccion.api';
import type { CreateEleccionDto, Eleccion } from '../../../core/types/sistema-administracion-electoral/eleccion.types';

export function useCreateEleccion() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Eleccion | null>(null);

    const create = useCallback(async (data: CreateEleccionDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await createEleccion(data);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al crear elección');
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
        create,
        loading,
        error,
        success,
        clearError,
        clearSuccess
    };
} 