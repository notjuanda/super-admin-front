import { z } from 'zod';

export const eleccionUpdateSchema = z.object({
    nombre: z.string().min(2, 'El nombre es obligatorio').optional(),
    descripcion: z.string().optional(),
    tipo: z.enum(['presidencial', 'municipal', 'departamental', 'nacional', 'referendum']).optional(),
    estado: z.enum(['planificada', 'en_curso', 'finalizada', 'cancelada']).optional(),
    fecha: z.string().optional(),
    seccionIds: z.array(z.number()).optional(),
    cargoIds: z.array(z.number()).optional()
});

export type EleccionUpdateForm = z.infer<typeof eleccionUpdateSchema>; 