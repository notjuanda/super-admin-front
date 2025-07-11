import { useState } from 'react';
import { createSeccion } from '../../../core/api/sistema-administracion-electoral/seccion.api';
import type { CreateSeccionDto, Seccion } from '../../../core/types/sistema-administracion-electoral/seccion.types';

export function useCreateSeccion() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Seccion | null>(null);

    const create = async (data: CreateSeccionDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
        const { data: seccion } = await createSeccion(data);
        setSuccess(seccion);
        return seccion;
        } catch (err: any) {
        setError(err?.response?.data?.message || 'Error al crear sección');
        return null;
        } finally {
        setLoading(false);
        }
    };

    return { create, loading, error, success, setSuccess };
} 