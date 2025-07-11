import { useState, useCallback } from 'react';
import { getCandidatos } from '../../../core/api/sistema-administracion-electoral/candidato.api';
import type { Candidato } from '../../../core/types/sistema-administracion-electoral/candidato.types';

export function useCandidatos() {
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCandidatos = useCallback(async () => {
        console.log('🔄 useCandidatos - Iniciando fetch de candidatos...');
        setLoading(true);
        setError(null);
        try {
            const response = await getCandidatos();
            console.log('✅ useCandidatos - Candidatos obtenidos exitosamente:', response.data);
            setCandidatos(response.data);
        } catch (err: any) {
            console.error('❌ useCandidatos - Error obteniendo candidatos:', err);
            setError(err?.response?.data?.message || 'Error al obtener candidatos');
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        candidatos,
        loading,
        error,
        fetchCandidatos,
        clearError
    };
} 