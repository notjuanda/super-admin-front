import { useState } from 'react';
import type { CreateUserDto, User } from '../../../core/types/sistema-autenticacion/user.types';
import { createUser } from '../../../core/api/sistema-autenticacion/users.api';

export function useCreateUser() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<User | null>(null);

    const create = async (data: CreateUserDto) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const user = await createUser(data);
            setSuccess(user);
            return user;
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Error al crear usuario');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading, error, success, setSuccess };
} 