import { useState, useCallback } from 'react';
import { getPartidoPolitico } from '../../../core/api/sistema-administracion-electoral/partido-politico.api';
import type { PartidoPolitico } from '../../../core/types/sistema-administracion-electoral/partido-politico.types';

export function usePartidoPolitico() {
    const [partidoPolitico, setPartidoPolitico] = useState<PartidoPolitico | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPartidoPolitico = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPartidoPolitico(id);
            setPartidoPolitico(response.data);
            return response.data;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al cargar el partido político');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        partidoPolitico,
        loading,
        error,
        fetchPartidoPolitico,
        clearError
    };
} 