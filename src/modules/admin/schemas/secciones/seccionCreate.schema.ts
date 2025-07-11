import { z } from 'zod';

export const seccionCreateSchema = z.object({
    nombre: z.string().min(2, 'El nombre es obligatorio'),
    descripcion: z.string().optional(),
    estado: z.string().min(1, 'El estado es obligatorio'),
    puntos: z.array(
        z.object({
        latitud: z.string().min(1, 'Latitud obligatoria'),
        longitud: z.string().min(1, 'Longitud obligatoria'),
        orden: z.string().min(1, 'Orden obligatorio')
        })
    ).min(3, 'Debe haber al menos 3 puntos para un polígono')
});

export type SeccionCreateForm = z.infer<typeof seccionCreateSchema>; 