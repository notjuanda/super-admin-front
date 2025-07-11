import { z } from 'zod';
import { UserRole } from '../../../core/types/sistema-autenticacion/user.types';

export const userEditSchema = z.object({
    nombre: z.string().min(2, 'El nombre es obligatorio').optional(),
    email: z.string().email('Email inválido').optional(),
    password: z.string().min(0).optional(),
    rol: z.nativeEnum(UserRole).optional(),
});

export type UserEditForm = z.infer<typeof userEditSchema>; 