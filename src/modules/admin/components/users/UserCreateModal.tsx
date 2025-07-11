import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userCreateSchema } from '../../schemas/users/userCreate.schema';
import type { UserCreateForm } from '../../schemas/users/userCreate.schema';
import { UserRole } from '../../../core/types/sistema-autenticacion/user.types';
import { useCreateUser } from '../../hooks/users/useCreateUser';
import { FiUserPlus, FiX, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface UserCreateModalProps {
    open: boolean;
    onClose: () => void;
    onCreated?: (user: any) => void;
}

export const UserCreateModal: React.FC<UserCreateModalProps> = ({ open, onClose, onCreated }) => {
    const { create, loading, error, success, setSuccess } = useCreateUser();
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<UserCreateForm>({
        resolver: zodResolver(userCreateSchema),
    });
    const [showPassword, setShowPassword] = React.useState(false);
    const watchedPassword = watch('password');

    React.useEffect(() => {
        if (success) {
            onCreated?.(success);
            reset();
            onClose();
            setSuccess(null);
        }
    }, [success, onCreated, onClose, reset, setSuccess]);

    if (!open) return null;

    const getPasswordStrength = (password: string) => {
        if (!password) return { strength: 0, color: 'bg-secondary', text: '' };
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const length = password.length >= 8;
        
        const strength = [hasLower, hasUpper, hasNumber, hasSpecial, length].filter(Boolean).length;
        
        if (strength <= 2) return { strength, color: 'bg-tertiary', text: 'Débil' };
        if (strength <= 3) return { strength, color: 'bg-yellow-500', text: 'Media' };
        if (strength <= 4) return { strength, color: 'bg-blue-500', text: 'Buena' };
        return { strength, color: 'bg-green-500', text: 'Fuerte' };
    };

    const passwordStrength = getPasswordStrength(watchedPassword || '');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-main rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-button/10 rounded-full">
                            <FiUserPlus className="text-button text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-headline">Crear Usuario</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                        <FiX className="text-paragraph text-lg" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(data => create(data))} className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-headline mb-2">
                            Nombre completo
                        </label>
                        <input 
                            {...register('nombre')} 
                            className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                errors.nombre ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                            }`} 
                            placeholder="Ingresa el nombre completo"
                        />
                        {errors.nombre && (
                            <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                <FiAlertCircle className="text-xs" />
                                {errors.nombre.message}
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-headline mb-2">
                            Correo electrónico
                        </label>
                        <input 
                            {...register('email')} 
                            type="email"
                            className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                errors.email ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                            }`} 
                            placeholder="usuario@ejemplo.com"
                        />
                        {errors.email && (
                            <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                <FiAlertCircle className="text-xs" />
                                {errors.email.message}
                            </div>
                        )}
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-headline mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input 
                                {...register('password')} 
                                type={showPassword ? 'text' : 'password'}
                                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                    errors.password ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                                }`} 
                                placeholder="Ingresa una contraseña segura"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-paragraph hover:text-headline"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        
                        {/* Password strength indicator */}
                        {watchedPassword && (
                            <div className="mt-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 w-8 rounded-full transition-colors ${
                                                    level <= passwordStrength.strength ? passwordStrength.color : 'bg-secondary'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-paragraph">{passwordStrength.text}</span>
                                </div>
                            </div>
                        )}
                        
                        {errors.password && (
                            <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                <FiAlertCircle className="text-xs" />
                                {errors.password.message}
                            </div>
                        )}
                    </div>

                    {/* Rol */}
                    <div>
                        <label className="block text-sm font-medium text-headline mb-2">
                            Rol del usuario
                        </label>
                        <select 
                            {...register('rol')} 
                            className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                errors.rol ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                            }`}
                        >
                            <option value="">Selecciona un rol</option>
                            {Object.values(UserRole).map(rol => (
                                <option key={rol} value={rol}>
                                    {rol.replace('_', ' ').toUpperCase()}
                                </option>
                            ))}
                        </select>
                        {errors.rol && (
                            <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                <FiAlertCircle className="text-xs" />
                                {errors.rol.message}
                            </div>
                        )}
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-tertiary/10 border border-tertiary/20 rounded-lg">
                            <FiAlertCircle className="text-tertiary flex-shrink-0" />
                            <span className="text-tertiary text-sm">{error}</span>
                        </div>
                    )}

                    {/* Success message */}
                    {success && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <FiCheckCircle className="text-green-600 flex-shrink-0" />
                            <span className="text-green-700 text-sm">Usuario creado exitosamente</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-6 py-3 rounded-lg bg-secondary text-headline hover:bg-secondary/80 transition-all duration-200 font-semibold min-w-[100px]"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="px-6 py-3 rounded-lg bg-button text-buttonText hover:bg-highlight transition-all duration-200 font-semibold min-w-[100px] shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-buttonText border-t-transparent rounded-full animate-spin" />
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <FiUserPlus className="text-sm" />
                                    Crear Usuario
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 