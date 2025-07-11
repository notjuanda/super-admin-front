import { z } from 'zod';

export const votanteCreateSchema = z.object({
    ci: z.string().min(5, 'El CI es obligatorio').max(20, 'El CI es muy largo'),
    nombreCompleto: z.string().min(3, 'El nombre es obligatorio'),
    direccion: z.string().min(3, 'La dirección es obligatoria'),
    recintoId: z.coerce.number({ invalid_type_error: 'Selecciona un recinto' }).int().positive('Selecciona un recinto'),
    recintoNombre: z.string().optional(),
    fotoCarnetAnverso: z.any().optional().nullable(),
    fotoCarnetReverso: z.any().optional().nullable(),
    fotoVotante: z.any().optional().nullable(),
});

export type VotanteCreateForm = z.infer<typeof votanteCreateSchema>; 