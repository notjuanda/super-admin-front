import { useState, useEffect, useCallback } from 'react';
import { getSecciones } from '../../../core/api/sistema-administracion-electoral/seccion.api';
import type { Seccion } from '../../../core/types/sistema-administracion-electoral/seccion.types';

export function useSecciones() {
    const [secciones, setSecciones] = useState<Seccion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSecciones = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
        const { data } = await getSecciones();
        setSecciones(data);
        } catch (err: any) {
        setError('Error al cargar secciones');
        } finally {
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSecciones();
    }, [fetchSecciones]);

    return { secciones, loading, error, refetch: fetchSecciones };
} 