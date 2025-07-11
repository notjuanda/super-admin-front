import { useState, useEffect, useCallback } from 'react';
import { getCargos } from '../../../core/api/sistema-administracion-electoral/cargo.api';
import type { Cargo } from '../../../core/types/sistema-administracion-electoral/cargo.types';

export function useCargos() {
    const [cargos, setCargos] = useState<Cargo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCargos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getCargos();
            setCargos(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al cargar cargos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCargos();
    }, [fetchCargos]);

    return {
        cargos,
        loading,
        error,
        fetchCargos
    };
} 