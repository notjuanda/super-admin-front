import { z } from 'zod';

export const candidaturaCreateSchema = z.object({
    nombre: z.string({ required_error: 'El nombre es obligatorio' }).min(2, 'El nombre debe tener al menos 2 caracteres'),
    descripcion: z.string().optional(),
    partidoId: z.number({ required_error: 'El partido político es obligatorio' }),
    cargoId: z.number({ required_error: 'El cargo es obligatorio' }),
    eleccionId: z.number({ required_error: 'La elección es obligatoria' }),
    candidatoIds: z
        .array(z.string())
        .transform(arr => arr.map(Number))
        .refine(arr => arr.length > 0 && arr.every(id => !isNaN(id)), {
            message: 'Debe seleccionar al menos un candidato válido'
        }),
    estado: z.string().optional()
});

export type CandidaturaCreateForm = z.infer<typeof candidaturaCreateSchema>; 