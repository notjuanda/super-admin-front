import { useState, useCallback } from 'react';
import { createMesa } from '../../../core/api/sistema-administracion-electoral/mesa.api';
import type { CreateMesaDto, Mesa } from '../../../core/types/sistema-administracion-electoral/mesa.types';

export function useCreateMesa() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Mesa | null>(null);

    const create = useCallback(async (data: CreateMesaDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await createMesa(data);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al crear la mesa');
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