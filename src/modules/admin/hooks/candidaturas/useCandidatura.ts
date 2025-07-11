import { useState, useCallback } from 'react';
import { getCandidatura } from '../../../core/api/sistema-administracion-electoral/candidatura.api';
import type { Candidatura } from '../../../core/types/sistema-administracion-electoral/candidatura.types';

export function useCandidatura() {
    const [candidatura, setCandidatura] = useState<Candidatura | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCandidatura = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCandidatura(id);
            setCandidatura(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al cargar candidatura');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        candidatura,
        loading,
        error,
        fetchCandidatura
    };
} 