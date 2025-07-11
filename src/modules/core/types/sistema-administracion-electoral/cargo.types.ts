import type { EstadoCargoType } from '../../../core/enums/estado-cargo.enum';
import type { Seccion } from './seccion.types';

export interface Cargo {
    id: number;
    nombre: string;
    descripcion?: string;
    estado?: string;
    seccionId: number;
    seccion?: Seccion; 
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateCargoDto {
    nombre: string;
    descripcion?: string;
    estado?: EstadoCargoType;
    seccionId?: number;
}

export interface UpdateCargoDto {
    nombre?: string;
    descripcion?: string;
    estado?: string;
    seccionId?: number;
} 