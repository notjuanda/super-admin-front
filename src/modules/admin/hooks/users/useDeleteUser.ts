import { useState } from 'react';
import { deleteUser } from '../../../core/api/sistema-autenticacion/users.api';

export function useDeleteUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const remove = async (id: number) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
        await deleteUser(id);
        setSuccess(true);
        return true;
        } catch (err: any) {
        setError(err?.response?.data?.message || 'Error al eliminar usuario');
        return false;
        } finally {
        setLoading(false);
        }
    };

    return { remove, loading, error, success };
} 