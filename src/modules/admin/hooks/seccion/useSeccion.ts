import React, { useState } from 'react';
import { getSeccion } from '../../../core/api/sistema-administracion-electoral/seccion.api';
import type { Seccion } from '../../../core/types/sistema-administracion-electoral/seccion.types';

export function useSeccion(id?: number) {
    const [seccion, setSeccion] = useState<Seccion | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSeccion = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
        const { data } = await getSeccion(id);
        setSeccion(data);
        } catch (err: any) {
        setError('Error al cargar sección');
        } finally {
        setLoading(false);
        }
    };

    React.useEffect(() => {
        if (id) fetchSeccion();
    }, [id]);

    return { seccion, loading, error, refetch: fetchSeccion };
} 