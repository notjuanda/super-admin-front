import { useState } from 'react';
import { deleteSeccion } from '../../../core/api/sistema-administracion-electoral/seccion.api';

export function useDeleteSeccion() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const remove = async (id: number) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
        await deleteSeccion(id);
        setSuccess(true);
        return true;
        } catch (err: any) {
        setError(err?.response?.data?.message || 'Error al eliminar sección');
        return false;
        } finally {
        setLoading(false);
        }
    };

    return { remove, loading, error, success, setSuccess };
} 