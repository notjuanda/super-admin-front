export interface Votante {
    id: string;
    ci: string;
    nombreCompleto: string;
    direccion: string;
    fotoCarnetAnverso?: string;
    fotoCarnetReverso?: string;
    fotoVotante?: string;
    recintoId: number;
    recintoNombre?: string;
}

export interface CreateVotante {
    ci: string;
    nombreCompleto: string;
    direccion: string;
    fotoCarnetAnverso?: File | null;
    fotoCarnetReverso?: File | null;
    fotoVotante?: File | null;
    recintoId: number;
    recintoNombre?: string;
}

export interface UpdateVotante {
    id: string;
    ci?: string;
    nombreCompleto?: string;
    direccion?: string;
    fotoCarnetAnverso?: File | null;
    fotoCarnetReverso?: File | null;
    fotoVotante?: File | null;
    recintoId?: number;
    recintoNombre?: string;
} 