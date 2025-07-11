import { useState, useCallback } from 'react';
import { createCargo } from '../../../core/api/sistema-administracion-electoral/cargo.api';
import type { CreateCargoDto, Cargo } from '../../../core/types/sistema-administracion-electoral/cargo.types';

export function useCreateCargo() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<Cargo | null>(null);

    const create = useCallback(async (data: CreateCargoDto) => {
        console.log('🟦 [useCreateCargo] Payload enviado a la API:', data);
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await createCargo(data);
            console.log('🟩 [useCreateCargo] Respuesta de la API:', response.data);
            setSuccess(response.data);
            return response.data;
        } catch (err: any) {
            console.error('🟥 [useCreateCargo] Error al crear cargo:', err?.response?.data || err);
            setError(err?.response?.data?.message || 'Error al crear cargo');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const clearSuccess = useCallback(() => {
        setSuccess(null);
    }, []);

    return {
        create,
        loading,
        error,
        success,
        clearError,
        clearSuccess
    };
} 