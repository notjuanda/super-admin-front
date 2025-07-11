import { useState, useCallback } from 'react';
import { updateCandidato } from '../../../core/api/sistema-administracion-electoral/candidato.api';
import type { UpdateCandidatoDto, Candidato } from '../../../core/types/sistema-administracion-electoral/candidato.types';

export function useUpdateCandidato() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Candidato | null>(null);

    const update = useCallback(async (id: number, data: UpdateCandidatoDto, file?: File) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await updateCandidato(id, data, file);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al actualizar el candidato');
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