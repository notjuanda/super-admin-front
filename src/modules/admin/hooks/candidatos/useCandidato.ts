import { useState, useCallback } from 'react';
import { getCandidato } from '../../../core/api/sistema-administracion-electoral/candidato.api';
import type { Candidato } from '../../../core/types/sistema-administracion-electoral/candidato.types';

export function useCandidato() {
    const [candidato, setCandidato] = useState<Candidato | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCandidato = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCandidato(id);
            setCandidato(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al obtener el candidato');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearCandidato = useCallback(() => {
        setCandidato(null);
    }, []);

    return {
        candidato,
        loading,
        error,
        fetchCandidato,
        clearError,
        clearCandidato
    };
} 