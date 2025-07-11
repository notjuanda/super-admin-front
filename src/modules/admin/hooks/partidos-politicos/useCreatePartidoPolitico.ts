import { useState, useCallback } from 'react';
import { createPartidoPolitico } from '../../../core/api/sistema-administracion-electoral/partido-politico.api';
import type { CreatePartidoPoliticoDto, PartidoPolitico } from '../../../core/types/sistema-administracion-electoral/partido-politico.types';

export function useCreatePartidoPolitico() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<PartidoPolitico | null>(null);

    const create = useCallback(async (data: CreatePartidoPoliticoDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await createPartidoPolitico(data);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al crear el partido político');
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