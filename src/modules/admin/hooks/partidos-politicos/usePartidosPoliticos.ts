import { useState, useCallback, useEffect } from 'react';
import { getPartidosPoliticos } from '../../../core/api/sistema-administracion-electoral/partido-politico.api';
import type { PartidoPolitico } from '../../../core/types/sistema-administracion-electoral/partido-politico.types';

export function usePartidosPoliticos() {
    const [partidosPoliticos, setPartidosPoliticos] = useState<PartidoPolitico[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPartidosPoliticos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPartidosPoliticos();
            setPartidosPoliticos(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al cargar los partidos políticos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPartidosPoliticos();
    }, [fetchPartidosPoliticos]);

    return {
        partidosPoliticos,
        loading,
        error,
        fetchPartidosPoliticos
    };
} 