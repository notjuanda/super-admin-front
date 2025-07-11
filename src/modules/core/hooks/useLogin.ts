import { useCallback } from 'react';
import { login as loginApi } from '../api/sistema-autenticacion/auth.api';

export function useLogin(setUser: (user: any) => void, setLoading: (loading: boolean) => void, setError: (error: string | null) => void) {
    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
        const res = await loginApi({ email, password });
        setUser(res.user);
        } catch (err: any) {
        setError(err?.response?.data?.message || 'Error de autenticación');
        setUser(null);
        } finally {
        setLoading(false);
        }
    }, [setUser, setLoading, setError]);

    return { login };
} 