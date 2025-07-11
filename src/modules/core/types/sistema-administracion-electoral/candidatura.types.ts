export interface Candidatura {
    id: number;
    nombre: string;
    descripcion?: string;
    eleccionId: number;
    cargoId: number;
    partidoId: number;
    candidatoIds: number[];
    estado?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCandidaturaDto {
    nombre: string;
    descripcion?: string;
    eleccionId: number;
    cargoId: number;
    partidoId: number;
    candidatoIds: number[];
    estado?: string;
}

export interface UpdateCandidaturaDto {
    nombre?: string;
    descripcion?: string;
    eleccionId?: number;
    cargoId?: number;
    partidoId?: number;
    candidatoIds?: number[];
    estado?: string;
} 