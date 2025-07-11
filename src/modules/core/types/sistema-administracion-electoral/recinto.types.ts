export interface Recinto {
    id: number;
    nombre: string;
    descripcion?: string;
    latitud: number;
    longitud: number;
    seccionId: number;
}

export interface CreateRecintoDto {
    nombre: string;
    descripcion?: string;
    latitud: number;
    longitud: number;
    seccionId: number;
}

export interface UpdateRecintoDto {
    nombre?: string;
    descripcion?: string;
    latitud?: number;
    longitud?: number;
    seccionId?: number;
} 