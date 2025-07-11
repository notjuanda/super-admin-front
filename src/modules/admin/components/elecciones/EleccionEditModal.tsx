import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateEleccion } from '../../hooks/elecciones/useUpdateEleccion';
import { eleccionUpdateSchema } from '../../schemas/elecciones/eleccionUpdate.schema';
import type { EleccionUpdateForm } from '../../schemas/elecciones/eleccionUpdate.schema';
import { FiFlag, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import type { Eleccion } from '../../../core/types/sistema-administracion-electoral/eleccion.types';

interface EleccionEditModalProps {
    open: boolean;
    onClose: () => void;
    onUpdated?: () => void;
    eleccion: Eleccion | null;
}

export const EleccionEditModal: React.FC<EleccionEditModalProps> = ({ 
    open, 
    onClose, 
    onUpdated, 
    eleccion 
}) => {
    const { update, loading, error, success, clearSuccess } = useUpdateEleccion();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<EleccionUpdateForm>({
        resolver: zodResolver(eleccionUpdateSchema),
        defaultValues: {
            nombre: '',
            descripcion: '',
            tipo: 'presidencial',
            estado: 'planificada',
            fecha: ''
        }
    });

    React.useEffect(() => {
        if (eleccion && open) {
            // Asegurar que tipo y estado sean literales válidos
            const tiposValidos = ['presidencial', 'municipal', 'departamental', 'nacional', 'referendum'] as const;
            const estadosValidos = ['planificada', 'en_curso', 'finalizada', 'cancelada'] as const;
            const tipo = tiposValidos.includes(eleccion.tipo as any) ? eleccion.tipo : 'presidencial';
            const estado = estadosValidos.includes(eleccion.estado as any) ? eleccion.estado : 'planificada';
            reset({
                nombre: eleccion.nombre,
                descripcion: eleccion.descripcion,
                tipo: tipo as EleccionUpdateForm['tipo'],
                estado: estado as EleccionUpdateForm['estado'],
                fecha: eleccion.fecha?.slice(0, 10) || ''
            });
        }
    }, [eleccion, open, reset]);

    React.useEffect(() => {
        if (success) {
            onUpdated?.();
            onClose();
            clearSuccess();
        }
    }, [success, onUpdated, onClose, clearSuccess]);

    React.useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    if (!open || !eleccion) return null;

    const handleUpdate = (data: EleccionUpdateForm) => {
        return update(eleccion.id, data);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-main rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-button/10 rounded-full">
                            <FiFlag className="text-button text-xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-headline">Editar Elección</h3>
                            <p className="text-sm text-paragraph">Modifica la información de la elección</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                        <FiX className="text-paragraph text-lg" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-headline mb-2">
                                Nombre de la elección
                            </label>
                            <input 
                                {...register('nombre')} 
                                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                    errors.nombre ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                                }`} 
                                placeholder="Ej: Elecciones Presidenciales 2025"
                            />
                            {errors.nombre && (
                                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                    <FiAlertCircle className="text-xs" />
                                    {errors.nombre.message}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-headline mb-2">
                                Tipo de elección
                            </label>
                            <select 
                                {...register('tipo')} 
                                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                    errors.tipo ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                                }`}
                            >
                                <option value="presidencial">Presidencial</option>
                                <option value="municipal">Municipal</option>
                                <option value="departamental">Departamental</option>
                                <option value="nacional">Nacional</option>
                                <option value="referendum">Referéndum</option>
                            </select>
                            {errors.tipo && (
                                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                    <FiAlertCircle className="text-xs" />
                                    {errors.tipo.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-headline mb-2">
                            Descripción (opcional)
                        </label>
                        <textarea 
                            {...register('descripcion')} 
                            rows={3}
                            className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                errors.descripcion ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                            }`} 
                            placeholder="Describe los detalles de la elección..."
                        />
                        {errors.descripcion && (
                            <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                <FiAlertCircle className="text-xs" />
                                {errors.descripcion.message}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-headline mb-2">
                                Estado
                            </label>
                            <select 
                                {...register('estado')} 
                                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                    errors.estado ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                                }`}
                            >
                                <option value="planificada">Planificada</option>
                                <option value="en_curso">En Curso</option>
                                <option value="finalizada">Finalizada</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                            {errors.estado && (
                                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                    <FiAlertCircle className="text-xs" />
                                    {errors.estado.message}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-headline mb-2">
                                Fecha de la elección
                            </label>
                            <input 
                                type="date"
                                {...register('fecha')} 
                                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                    errors.fecha ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                                }`} 
                            />
                            {errors.fecha && (
                                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                    <FiAlertCircle className="text-xs" />
                                    {errors.fecha.message}
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-tertiary/10 border border-tertiary/20 rounded-lg">
                            <FiAlertCircle className="text-tertiary flex-shrink-0" />
                            <span className="text-tertiary text-sm">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <FiCheckCircle className="text-green-600 flex-shrink-0" />
                            <span className="text-green-700 text-sm">Elección actualizada exitosamente</span>
                        </div>
                    )}

                    <div className="flex gap-3 justify-end pt-4 border-t border-stroke">
                        <button 
                            type="button" 
                            onClick={handleClose} 
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
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <FiFlag className="text-sm" />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 