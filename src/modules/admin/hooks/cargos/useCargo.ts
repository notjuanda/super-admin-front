import { useState, useEffect, useCallback } from 'react';
import { getCargo } from '../../../core/api/sistema-administracion-electoral/cargo.api';
import type { Cargo } from '../../../core/types/sistema-administracion-electoral/cargo.types';

export function useCargo(id: number | null) {
    const [cargo, setCargo] = useState<Cargo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCargo = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const response = await getCargo(id);
            setCargo(response.data);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al cargar cargo');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCargo();
    }, [fetchCargo]);

    return {
        cargo,
        loading,
        error,
        fetchCargo
    };
} 