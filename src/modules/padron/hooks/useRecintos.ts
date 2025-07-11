import { useEffect, useState } from 'react';
import { getRecintos } from '../../core/api/sistema-administracion-electoral/recinto.api';
import type { Recinto } from '../../core/types/sistema-administracion-electoral/recinto.types';

export function useRecintos() {
    const [recintos, setRecintos] = useState<Recinto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        getRecintos()
        .then(res => setRecintos(res.data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }, []);

    return { recintos, loading, error };
} 