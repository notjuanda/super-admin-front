import { useState, useEffect, useCallback } from 'react';
import { getElecciones } from '../../../core/api/sistema-administracion-electoral/eleccion.api';
import type { Eleccion } from '../../../core/types/sistema-administracion-electoral/eleccion.types';

export function useElecciones() {
    const [elecciones, setElecciones] = useState<Eleccion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchElecciones = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getElecciones();
            setElecciones(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al cargar elecciones');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchElecciones();
    }, [fetchElecciones]);

    return {
        elecciones,
        loading,
        error,
        fetchElecciones
    };
} 