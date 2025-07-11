import { useState, useCallback } from 'react';
import { createCandidato } from '../../../core/api/sistema-administracion-electoral/candidato.api';
import type { CreateCandidatoDto, Candidato } from '../../../core/types/sistema-administracion-electoral/candidato.types';

export function useCreateCandidato() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Candidato | null>(null);

    const create = useCallback(async (data: CreateCandidatoDto, file?: File) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await createCandidato(data, file);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al crear el candidato');
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