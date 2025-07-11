import { useState, useCallback, useEffect } from 'react';
import { getRecintos } from '../../../core/api/sistema-administracion-electoral/recinto.api';
import type { Recinto } from '../../../core/types/sistema-administracion-electoral/recinto.types';

export function useRecintos() {
    const [recintos, setRecintos] = useState<Recinto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecintos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getRecintos();
            setRecintos(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al cargar los recintos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecintos();
    }, [fetchRecintos]);

    return {
        recintos,
        loading,
        error,
        fetchRecintos
    };
} 