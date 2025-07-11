import { z } from 'zod';

export const votanteUpdateSchema = z.object({
    id: z.string().min(1, 'ID requerido'),
    ci: z.string().min(5, 'El CI es obligatorio').max(20, 'El CI es muy largo').optional(),
    nombreCompleto: z.string().min(3, 'El nombre es obligatorio').optional(),
    direccion: z.string().min(3, 'La dirección es obligatoria').optional(),
    recintoId: z.coerce.number({ invalid_type_error: 'Selecciona un recinto' }).int().positive('Selecciona un recinto').optional(),
    recintoNombre: z.string().optional(),
    fotoCarnetAnverso: z.any().optional().nullable(),
    fotoCarnetReverso: z.any().optional().nullable(),
    fotoVotante: z.any().optional().nullable(),
});

export type VotanteUpdateForm = z.infer<typeof votanteUpdateSchema>; 