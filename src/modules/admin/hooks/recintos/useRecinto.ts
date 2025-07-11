import { useState, useCallback, useEffect } from 'react';
import { getRecinto } from '../../../core/api/sistema-administracion-electoral/recinto.api';
import type { Recinto } from '../../../core/types/sistema-administracion-electoral/recinto.types';

export function useRecinto(id: number | null) {
    const [recinto, setRecinto] = useState<Recinto | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRecinto = useCallback(async () => {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await getRecinto(id);
            setRecinto(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al cargar el recinto');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchRecinto();
    }, [fetchRecinto]);

    return {
        recinto,
        loading,
        error,
        fetchRecinto
    };
} 