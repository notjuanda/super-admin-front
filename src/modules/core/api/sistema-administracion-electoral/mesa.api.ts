import instance from './instance.api';
import type { Mesa, CreateMesaDto, UpdateMesaDto } from '../../types/sistema-administracion-electoral/mesa.types';

export const getMesas = () => instance.get<Mesa[]>('/mesas');
export const getMesa = (id: number) => instance.get<Mesa>(`/mesas/${id}`);
export const createMesa = (data: CreateMesaDto) => instance.post<Mesa>('/mesas', data);
export const updateMesa = (id: number, data: UpdateMesaDto) => instance.put<Mesa>(`/mesas/${id}`, data);
export const deleteMesa = (id: number) => instance.delete(`/mesas/${id}`); 