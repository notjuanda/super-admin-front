import { z } from 'zod';
import { UserRole } from '../../../core/types/sistema-autenticacion/user.types';

export const userCreateSchema = z.object({
    nombre: z.string().min(2, 'El nombre es obligatorio'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    rol: z.nativeEnum(UserRole),
});

export type UserCreateForm = z.infer<typeof userCreateSchema>; 