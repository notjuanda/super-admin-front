export interface Eleccion {
    id: number;
    nombre: string;
    descripcion: string;
    tipo: string;
    estado: string;
    fecha: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEleccionDto {
    nombre: string;
    descripcion?: string;
    tipo: string;
    estado: string;
    fecha: string;
    seccionIds?: number[];
    cargoIds?: number[];
}

export interface UpdateEleccionDto {
    nombre?: string;
    descripcion?: string;
    tipo?: string;
    estado?: string;
    fecha?: string;
    seccionIds?: number[];
    cargoIds?: number[];
} 