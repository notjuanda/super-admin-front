import { z } from 'zod';

export const candidatoUpdateSchema = z.object({
    nombres: z.string().min(2, 'Los nombres deben tener al menos 2 caracteres').max(50, 'Los nombres no pueden exceder 50 caracteres').optional(),
    apellidoPaterno: z.string().min(2, 'El apellido paterno debe tener al menos 2 caracteres').max(50, 'El apellido paterno no puede exceder 50 caracteres').optional(),
    apellidoMaterno: z.string().min(2, 'El apellido materno debe tener al menos 2 caracteres').max(50, 'El apellido materno no puede exceder 50 caracteres').optional(),
    cedula: z.string().min(5, 'La cédula debe tener al menos 5 caracteres').max(15, 'La cédula no puede exceder 15 caracteres').optional(),
    fechaNacimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD').optional(),
    profesion: z.string().optional(),
    biografia: z.string().optional(),
    candidaturaId: z.number().optional(),
});

export type CandidatoUpdateForm = z.infer<typeof candidatoUpdateSchema>; 