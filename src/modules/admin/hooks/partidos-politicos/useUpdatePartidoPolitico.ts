import { useState, useCallback } from 'react';
import { updatePartidoPolitico } from '../../../core/api/sistema-administracion-electoral/partido-politico.api';
import type { UpdatePartidoPoliticoDto, PartidoPolitico } from '../../../core/types/sistema-administracion-electoral/partido-politico.types';

export function useUpdatePartidoPolitico() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<PartidoPolitico | null>(null);

    const update = useCallback(async (id: number, data: UpdatePartidoPoliticoDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await updatePartidoPolitico(id, data);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al actualizar el partido político');
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