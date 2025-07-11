import { useState, useEffect, useCallback } from 'react';
import { getMesa } from '../../../core/api/sistema-administracion-electoral/mesa.api';
import type { Mesa } from '../../../core/types/sistema-administracion-electoral/mesa.types';

export function useMesa(id: number | null) {
    const [data, setData] = useState<Mesa | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMesa = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const response = await getMesa(id);
            setData(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al obtener la mesa');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchMesa();
    }, [fetchMesa]);

    return {
        data,
        loading,
        error,
        refetch: fetchMesa,
    };
} 