import { z } from 'zod';
import { EstadoCargo } from '../../../core/enums/estado-cargo.enum';

export const cargoCreateSchema = z.object({
    nombre: z.string().min(2, 'El nombre es obligatorio'),
    descripcion: z.string().min(1, 'La descripción es obligatoria'),
    estado: z.enum([EstadoCargo.ACTIVO, EstadoCargo.INACTIVO], {
        required_error: 'El estado es obligatorio',
        invalid_type_error: 'Estado no válido'
    }),
    seccionId: z.number({ required_error: 'La sección es obligatoria' }),
});

export type CargoCreateForm = z.infer<typeof cargoCreateSchema>; 