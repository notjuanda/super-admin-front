import { z } from 'zod';

export const partidoPoliticoCreateSchema = z.object({
    nombre: z.string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
    
    sigla: z.string()
        .min(2, 'La sigla debe tener al menos 2 caracteres')
        .max(20, 'La sigla no puede exceder 20 caracteres')
        .regex(/^[A-Z]+$/, 'La sigla debe estar en mayúsculas y solo contener letras'),
    
    color: z.string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'El color debe ser un código hexadecimal válido (ej: #FF0000)'),
    
    descripcion: z.string()
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .optional(),
    
    estado: z.enum(['activo', 'inactivo', 'suspendido'], {
        errorMap: () => ({ message: 'El estado debe ser activo, inactivo o suspendido' })
    }).optional().default('activo')
});

export type PartidoPoliticoCreateForm = z.infer<typeof partidoPoliticoCreateSchema>; 