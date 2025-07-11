import { useState } from 'react';
import type { UpdateVotante, Votante } from '../../core/types/sistema-padron-electoral/votante.types';
import { updateVotante } from '../../core/api/sistema-padron-electoral/votante.api';

export function useUpdateVotante() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<Votante | null>(null);

    const update = async (id: string, input: UpdateVotante) => {
        setLoading(true);
        setError(null);
        try {
        const res = await updateVotante(id, input);
        setData(res.data);
        return res.data;
        } catch (err: any) {
        setError(err.message || 'Error al actualizar votante');
        throw err;
        } finally {
        setLoading(false);
        }
    };

    return { update, loading, error, data };
} 