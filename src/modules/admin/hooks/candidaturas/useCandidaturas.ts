import { useState, useEffect, useCallback } from 'react';
import { getCandidaturas } from '../../../core/api/sistema-administracion-electoral/candidatura.api';
import type { Candidatura } from '../../../core/types/sistema-administracion-electoral/candidatura.types';

export function useCandidaturas() {
    const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCandidaturas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCandidaturas();
            setCandidaturas(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al cargar candidaturas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCandidaturas();
    }, [fetchCandidaturas]);

    return {
        candidaturas,
        loading,
        error,
        fetchCandidaturas
    };
} 