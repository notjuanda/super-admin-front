import { useState, useCallback } from 'react';
import { updateMesa } from '../../../core/api/sistema-administracion-electoral/mesa.api';
import type { UpdateMesaDto, Mesa } from '../../../core/types/sistema-administracion-electoral/mesa.types';

export function useUpdateMesa() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Mesa | null>(null);

    const update = useCallback(async (id: number, data: UpdateMesaDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await updateMesa(id, data);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al actualizar la mesa');
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