import { z } from 'zod';

export const candidaturaUpdateSchema = z.object({
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    descripcion: z.string().optional(),
    partidoId: z.number().optional(),
    cargoId: z.number().optional(),
    eleccionId: z.number().optional(),
    candidatoIds: z.array(z.number()).optional(),
    estado: z.string().optional()
});

export type CandidaturaUpdateForm = z.infer<typeof candidaturaUpdateSchema>; 