import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdatePartidoPolitico } from '../../hooks/partidos-politicos/useUpdatePartidoPolitico';
import { partidoPoliticoUpdateSchema } from '../../schemas/partidos-politicos/partidoPoliticoUpdate.schema';
import type { PartidoPoliticoUpdateForm } from '../../schemas/partidos-politicos/partidoPoliticoUpdate.schema';
import type { PartidoPolitico } from '../../../core/types/sistema-administracion-electoral/partido-politico.types';
import { FiFlag, FiX, FiCheckCircle, FiAlertCircle, FiDroplet, FiType, FiHash, FiFileText, FiCheckSquare } from 'react-icons/fi';

interface PartidoPoliticoEditModalProps {
    open: boolean;
    onClose: () => void;
    onUpdated?: () => void;
    partido: PartidoPolitico | null;
}

export const PartidoPoliticoEditModal: React.FC<PartidoPoliticoEditModalProps> = ({ 
    open, 
    onClose, 
    onUpdated, 
    partido 
}) => {
    const { update, loading, error, success, clearSuccess } = useUpdatePartidoPolitico();
    const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<PartidoPoliticoUpdateForm>({
        resolver: zodResolver(partidoPoliticoUpdateSchema),
        defaultValues: {
            nombre: '',
            sigla: '',
            color: '',
            descripcion: '',
            estado: 'activo'
        }
    });
    
    const watchedColor = watch('color');

    React.useEffect(() => {
        if (partido && open) {
            reset({
                nombre: partido.nombre,
                sigla: partido.sigla,
                color: partido.color,
                descripcion: partido.descripcion || '',
                estado: partido.estado.toLowerCase() as any
            });
        }
    }, [partido, open, reset]);

    React.useEffect(() => {
        if (success) {
            onUpdated?.();
            onClose();
            clearSuccess();
        }
    }, [success, onUpdated, onClose, clearSuccess]);

    if (!open || !partido) return null;

    const handleUpdate = (data: PartidoPoliticoUpdateForm) => {
        return update(partido.id, data);
    };

    const handleSiglaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.toUpperCase();
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
                            <h3 className="text-xl font-bold text-headline">Editar Partido Político</h3>
                            <p className="text-sm text-paragraph">Modifica la información del partido político</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                        <FiX className="text-paragraph text-lg" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-headline mb-2">
                                <FiType className="inline mr-2" />
                                Nombre del Partido
                            </label>
                            <input 
                                {...register('nombre')} 
                                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                    errors.nombre ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                                }`} 
                                placeholder="Ej: Movimiento al Socialismo"
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
                                <FiHash className="inline mr-2" />
                                Sigla
                            </label>
                            <input 
                                {...register('sigla')} 
                                onChange={handleSiglaChange}
                                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                    errors.sigla ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                                }`} 
                                placeholder="Ej: MAS"
                            />
                            {errors.sigla && (
                                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                    <FiAlertCircle className="text-xs" />
                                    {errors.sigla.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-headline mb-2">
                                <FiDroplet className="inline mr-2" />
                                Color del Partido
                            </label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color"
                                    {...register('color')} 
                                    className="w-12 h-12 rounded-lg border border-stroke cursor-pointer"
                                />
                                <input 
                                    {...register('color')} 
                                    className={`flex-1 px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                        errors.color ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                                    }`} 
                                    placeholder="#FF0000"
                                />
                            </div>
                            {errors.color && (
                                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                    <FiAlertCircle className="text-xs" />
                                    {errors.color.message}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-headline mb-2">
                                <FiCheckSquare className="inline mr-2" />
                                Estado
                            </label>
                            <select 
                                {...register('estado')} 
                                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                    errors.estado ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                                }`}
                            >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                                <option value="suspendido">Suspendido</option>
                            </select>
                            {errors.estado && (
                                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                    <FiAlertCircle className="text-xs" />
                                    {errors.estado.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-headline mb-2">
                            <FiFileText className="inline mr-2" />
                            Descripción
                        </label>
                        <textarea 
                            {...register('descripcion')} 
                            rows={3}
                            className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent resize-none ${
                                errors.descripcion ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                            }`} 
                            placeholder="Describe brevemente el partido político..."
                        />
                        {errors.descripcion && (
                            <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                <FiAlertCircle className="text-xs" />
                                {errors.descripcion.message}
                            </div>
                        )}
                    </div>

                    <div className="p-4 rounded-lg border border-stroke bg-secondary/20">
                        <h4 className="text-sm font-medium text-headline mb-3">Vista Previa del Color</h4>
                        <div className="flex items-center gap-4">
                            <div 
                                className="w-12 h-12 rounded-lg border-2 border-stroke"
                                style={{ backgroundColor: watchedColor }}
                            ></div>
                            <div>
                                <p className="text-sm text-paragraph">Color seleccionado: <span className="font-mono">{watchedColor}</span></p>
                                <p className="text-xs text-paragraph">Este color se usará para identificar al partido en el sistema</p>
                            </div>
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
                            <span className="text-green-700 text-sm">Partido político actualizado exitosamente</span>
                        </div>
                    )}

                    <div className="flex gap-3 justify-end pt-4 border-t border-stroke">
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
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    <FiFlag className="text-sm" />
                                    Actualizar Partido
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 