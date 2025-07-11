import instance from './instance.api';
import type { Votante, CreateVotante, UpdateVotante } from '../../types/sistema-padron-electoral/votante.types';

export const getVotantes = () => instance.get<Votante[]>('/Votantes1');

export const getVotanteById = (id: string) => instance.get<Votante>(`/Votantes1/${id}`);

export const createVotante = (data: CreateVotante) => {
    const formData = new FormData();
    formData.append('CI', data.ci);
    formData.append('NombreCompleto', data.nombreCompleto);
    formData.append('Direccion', data.direccion);
    formData.append('RecintoId', data.recintoId.toString());
    if (data.recintoNombre) formData.append('RecintoNombre', data.recintoNombre);
    if (data.fotoCarnetAnverso instanceof File) formData.append('fotoAnverso', data.fotoCarnetAnverso);
    if (data.fotoCarnetReverso instanceof File) formData.append('fotoReverso', data.fotoCarnetReverso);
    if (data.fotoVotante instanceof File) formData.append('fotoVotante', data.fotoVotante);
    return instance.post<Votante>('/Votantes1', formData);
};

export const updateVotante = (id: string, data: UpdateVotante & { fotoCarnetAnversoOriginal?: string; fotoCarnetReversoOriginal?: string; fotoVotanteOriginal?: string; }) => {
    const formData = new FormData();
    if (data.ci) formData.append('CI', data.ci);
    if (data.nombreCompleto) formData.append('NombreCompleto', data.nombreCompleto);
    if (data.direccion) formData.append('Direccion', data.direccion);
    if (data.recintoId) formData.append('RecintoId', data.recintoId.toString());
    if (data.recintoNombre) formData.append('RecintoNombre', data.recintoNombre);
    if (data.fotoCarnetAnverso instanceof File) {
        formData.append('fotoAnverso', data.fotoCarnetAnverso);
    } else if (data.fotoCarnetAnversoOriginal) {
        formData.append('fotoAnverso', data.fotoCarnetAnversoOriginal);
    }
    if (data.fotoCarnetReverso instanceof File) {
        formData.append('fotoReverso', data.fotoCarnetReverso);
    } else if (data.fotoCarnetReversoOriginal) {
        formData.append('fotoReverso', data.fotoCarnetReversoOriginal);
    }
    if (data.fotoVotante instanceof File) {
        formData.append('fotoVotante', data.fotoVotante);
    } else if (data.fotoVotanteOriginal) {
        formData.append('fotoVotante', data.fotoVotanteOriginal);
    }
    return instance.put(`/Votantes1/${id}`, formData);
};

export const deleteVotante = (id: string) => instance.delete(`/Votantes1/${id}`);

export const consultaPublicaPorCI = (ci: string) => instance.get(`/Votantes1/consulta-publica/${ci}`);

export const getVotantesPorRecinto = (recintoId: number) => instance.get(`/Votantes1/por-recinto/${recintoId}`); 