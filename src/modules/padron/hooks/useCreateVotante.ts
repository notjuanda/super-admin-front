import { useState } from 'react';
import type { CreateVotante, Votante } from '../../core/types/sistema-padron-electoral/votante.types';
import { createVotante } from '../../core/api/sistema-padron-electoral/votante.api';

export function useCreateVotante() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<Votante | null>(null);

    const create = async (input: CreateVotante) => {
        setLoading(true);
        setError(null);
        try {
        const res = await createVotante(input);
        setData(res.data);
        return res.data;
        } catch (err: any) {
        setError(err.message || 'Error al crear votante');
        throw err;
        } finally {
        setLoading(false);
        }
    };

    const reset = () => setData(null);

    return { create, loading, error, data, reset };
} 