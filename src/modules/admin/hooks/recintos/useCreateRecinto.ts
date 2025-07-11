import { useState, useCallback } from 'react';
import { createRecinto } from '../../../core/api/sistema-administracion-electoral/recinto.api';
import type { CreateRecintoDto, Recinto } from '../../../core/types/sistema-administracion-electoral/recinto.types';

export function useCreateRecinto() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Recinto | null>(null);

    const create = useCallback(async (data: CreateRecintoDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await createRecinto(data);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al crear el recinto');
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