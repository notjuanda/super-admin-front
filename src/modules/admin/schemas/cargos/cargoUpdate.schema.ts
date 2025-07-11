import { z } from 'zod';
import { EstadoCargo } from '../../../core/enums/estado-cargo.enum';

export const cargoUpdateSchema = z.object({
    nombre: z.string().min(2, 'El nombre es obligatorio').optional(),
    descripcion: z.string().optional(),
    estado: z.enum([EstadoCargo.ACTIVO, EstadoCargo.INACTIVO], {
        required_error: 'El estado es obligatorio',
        invalid_type_error: 'Estado no válido'
    }).optional(),
    seccionId: z.number().optional()
});

export type CargoUpdateForm = z.infer<typeof cargoUpdateSchema>; 