import { useState } from 'react';
import type { UpdateUserDto, User } from '../../../core/types/sistema-autenticacion/user.types';
import { updateUser } from '../../../core/api/sistema-autenticacion/users.api';

export function useUpdateUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<User | null>(null);

    const update = async (id: number, data: UpdateUserDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
        const user = await updateUser(id, data);
        setSuccess(user);
        return user;
        } catch (err: any) {
        setError(err?.response?.data?.message || 'Error al editar usuario');
        return null;
        } finally {
        setLoading(false);
        }
    };

    return { update, loading, error, success, setSuccess };
} 