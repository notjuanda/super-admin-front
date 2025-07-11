import { useState } from 'react';
import { consultaPublicaPorCI } from '../../core/api/sistema-padron-electoral/votante.api';

export function useConsultaPublicaVotante() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const consultar = async (ci: string) => {
        setLoading(true);
        setError(null);
        setData(null);
        try {
        const response = await consultaPublicaPorCI(ci);
        setData(response.data);
        } catch (err: any) {
        setError(err?.response?.data?.mensaje || 'Error al consultar el estado del votante');
        } finally {
        setLoading(false);
        }
    };

    return { data, loading, error, consultar };
} 