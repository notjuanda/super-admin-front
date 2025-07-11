import { useState, useCallback } from 'react';
import { updateCargo } from '../../../core/api/sistema-administracion-electoral/cargo.api';
import type { UpdateCargoDto, Cargo } from '../../../core/types/sistema-administracion-electoral/cargo.types';

export function useUpdateCargo() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Cargo | null>(null);

    const update = useCallback(async (id: number, data: UpdateCargoDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await updateCargo(id, data);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al actualizar cargo');
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