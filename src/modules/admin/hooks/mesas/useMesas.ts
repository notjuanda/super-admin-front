import { useState, useEffect, useCallback } from 'react';
import { getMesas } from '../../../core/api/sistema-administracion-electoral/mesa.api';
import type { Mesa } from '../../../core/types/sistema-administracion-electoral/mesa.types';

export function useMesas() {
    const [data, setData] = useState<Mesa[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMesas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMesas();
            setData(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al obtener las mesas');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMesas();
    }, [fetchMesas]);

    return {
        data,
        loading,
        error,
        refetch: fetchMesas,
    };
} 