import instance from './instance.api';
import type { Jurado } from '../../types/sistema-administracion-electoral/jurado.types';

export const getJurados = () => instance.get<Jurado[]>('/jurados');
export const getJurado = (id: number) => instance.get<Jurado>(`/jurados/${id}`);
export const createJurado = (data: Partial<Jurado>) => instance.post<Jurado>('/jurados', data);
export const updateJurado = (id: number, data: Partial<Jurado>) => instance.put<Jurado>(`/jurados/${id}`, data);
export const deleteJurado = (id: number) => instance.delete(`/jurados/${id}`); 