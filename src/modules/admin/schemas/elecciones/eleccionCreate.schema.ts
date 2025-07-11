import { z } from 'zod';

export const eleccionCreateSchema = z.object({
    nombre: z.string().min(2, 'El nombre es obligatorio'),
    descripcion: z.string().optional(),
    tipo: z.enum(['presidencial', 'municipal', 'departamental', 'nacional', 'referendum'], {
        required_error: 'El tipo es obligatorio',
        invalid_type_error: 'Tipo de elección no válido'
    }),
    estado: z.enum(['planificada', 'en_curso', 'finalizada', 'cancelada'], {
        required_error: 'El estado es obligatorio',
        invalid_type_error: 'Estado no válido'
    }),
    fecha: z.string().min(1, 'La fecha es obligatoria'),
    seccionIds: z.array(z.number()).optional(),
    cargoIds: z.array(z.number()).optional()
});

export type EleccionCreateForm = z.infer<typeof eleccionCreateSchema>; 