import { z } from 'zod';

export const recintoCreateSchema = z.object({
    nombre: z.string().min(2, 'El nombre es obligatorio'),
    descripcion: z.string().optional(),
    latitud: z.number().min(-90, 'Latitud debe estar entre -90 y 90').max(90, 'Latitud debe estar entre -90 y 90'),
    longitud: z.number().min(-180, 'Longitud debe estar entre -180 y 180').max(180, 'Longitud debe estar entre -180 y 180')
});

export type RecintoCreateForm = z.infer<typeof recintoCreateSchema>; 