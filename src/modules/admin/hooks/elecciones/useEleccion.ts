import { useState, useEffect, useCallback } from 'react';
import { getEleccion } from '../../../core/api/sistema-administracion-electoral/eleccion.api';
import type { Eleccion } from '../../../core/types/sistema-administracion-electoral/eleccion.types';

export function useEleccion(id: number | null) {
    const [eleccion, setEleccion] = useState<Eleccion | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEleccion = useCallback(async () => {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await getEleccion(id);
            setEleccion(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al cargar elección');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchEleccion();
    }, [fetchEleccion]);

    return {
        eleccion,
        loading,
        error,
        fetchEleccion
    };
} 