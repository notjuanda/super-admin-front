export interface Candidato {
    id: number;
    nombre: string;
    apellido: string;
    ci: string;
    fotoUrl: string;
    partidoId: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCandidatoDto {
    nombre: string;
    apellido: string;
    ci: string;
    fotoUrl: string;
    partidoId: number;
}

export interface UpdateCandidatoDto {
    nombre?: string;
    apellido?: string;
    ci?: string;
    fotoUrl?: string;
    partidoId?: number;
} 