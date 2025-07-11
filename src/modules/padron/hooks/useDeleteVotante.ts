import { useState } from 'react';
import { deleteVotante } from '../../core/api/sistema-padron-electoral/votante.api';

export function useDeleteVotante() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const remove = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
        const res = await deleteVotante(id);
        setData(res.data);
        return res.data;
        } catch (err: any) {
        setError(err.message || 'Error al eliminar votante');
        throw err;
        } finally {
        setLoading(false);
        }
    };

    return { remove, loading, error, data };
} 