import { z } from 'zod';

export const mesaEditSchema = z.object({
    numero: z.number({ required_error: 'El número de mesa es obligatorio' })
        .int('Debe ser un número entero')
        .min(1, 'El número de mesa debe ser mayor a 0'),
    recintoId: z.number({ required_error: 'El recinto es obligatorio' })
        .int('Debe seleccionar un recinto'),
});

export type MesaEditForm = z.infer<typeof mesaEditSchema>; 