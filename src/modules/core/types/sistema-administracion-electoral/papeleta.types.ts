export interface CandidatoPapeleta {
    id: number;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fotoUrl?: string;
}

export interface CandidaturaPapeleta {
    partidoId: number;
    partidoNombre: string;
    partidoColor: string;
    partidoSigla: string;
    candidatos: CandidatoPapeleta[];
}

export interface CargoPapeleta {
    cargoId: number;
    cargoNombre: string;
    candidaturas: CandidaturaPapeleta[];
}

export interface Papeleta {
    seccionId: number;
    seccionNombre: string;
    cargos: CargoPapeleta[];
}

export interface PapeletaEntity {
    id: number;
    seccionId: number;
    eleccionId: number;
    estructura: Papeleta;
    createdAt: string;
    estado: string;
} 