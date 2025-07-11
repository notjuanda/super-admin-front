import { useState, useCallback } from 'react';
import { createCandidatura } from '../../../core/api/sistema-administracion-electoral/candidatura.api';
import type { CreateCandidaturaDto, Candidatura } from '../../../core/types/sistema-administracion-electoral/candidatura.types';

export function useCreateCandidatura() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Candidatura | null>(null);

    const create = useCallback(async (data: CreateCandidaturaDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await createCandidatura(data);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al crear candidatura');
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