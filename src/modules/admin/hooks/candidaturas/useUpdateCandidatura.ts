import { useState, useCallback } from 'react';
import { updateCandidatura } from '../../../core/api/sistema-administracion-electoral/candidatura.api';
import type { UpdateCandidaturaDto, Candidatura } from '../../../core/types/sistema-administracion-electoral/candidatura.types';

export function useUpdateCandidatura() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Candidatura | null>(null);

    const update = useCallback(async (id: number, data: UpdateCandidaturaDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await updateCandidatura(id, data);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al actualizar candidatura');
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