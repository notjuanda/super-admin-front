import { useEffect, useState } from 'react';
import { getUser } from '../../../core/api/sistema-autenticacion/users.api';
import type { User } from '../../../core/types/sistema-autenticacion/user.types';

export function useUser(id?: number) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getUser(id)
        .then(setUser)
        .catch(() => setError('Error al cargar usuario'))
        .finally(() => setLoading(false));
    }, [id]);

    return { user, loading, error };
} 