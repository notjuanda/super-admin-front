import { useState } from 'react';
import { updateSeccion } from '../../../core/api/sistema-administracion-electoral/seccion.api';
import type { UpdateSeccionDto, Seccion } from '../../../core/types/sistema-administracion-electoral/seccion.types';

export function useUpdateSeccion() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Seccion | null>(null);

    const update = async (id: number, data: UpdateSeccionDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
        const { data: seccion } = await updateSeccion(id, data);
        setSuccess(seccion);
        return seccion;
        } catch (err: any) {
        setError(err?.response?.data?.message || 'Error al editar sección');
        return null;
        } finally {
        setLoading(false);
        }
    };

    return { update, loading, error, success, setSuccess };
} 