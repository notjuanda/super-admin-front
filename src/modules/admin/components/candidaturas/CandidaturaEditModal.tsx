import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidaturaUpdateSchema, type CandidaturaUpdateForm } from '../../schemas/candidaturas/candidaturaUpdate.schema';
import { useUpdateCandidatura } from '../../hooks/candidaturas/useUpdateCandidatura';
import { FiFlag, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import type { Candidatura } from '../../../core/types/sistema-administracion-electoral/candidatura.types';
import type { Eleccion } from '../../../core/types/sistema-administracion-electoral/eleccion.types';
import type { Cargo } from '../../../core/types/sistema-administracion-electoral/cargo.types';
import type { PartidoPolitico } from '../../../core/types/sistema-administracion-electoral/partido-politico.types';
import { useCandidatos } from '../../hooks/candidatos/useCandidatos';

interface CandidaturaEditModalProps {
    open: boolean;
    onClose: () => void;
    onUpdated?: () => void;
    candidatura: Candidatura | null;
    elecciones: Eleccion[];
    cargos: Cargo[];
    partidos: PartidoPolitico[];
}

export const CandidaturaEditModal: React.FC<CandidaturaEditModalProps> = ({ open, onClose, onUpdated, candidatura, elecciones, cargos, partidos }) => {
    const { update, loading, error, success, clearSuccess } = useUpdateCandidatura();
    const { candidatos, fetchCandidatos } = useCandidatos();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CandidaturaUpdateForm>({
        resolver: zodResolver(candidaturaUpdateSchema),
        defaultValues: {
            nombre: '',
            descripcion: '',
            partidoId: undefined,
            cargoId: undefined,
            eleccionId: undefined,
            candidatoIds: [],
            estado: ''
        }
    });

    React.useEffect(() => {
        if (candidatura && open) {
            reset({
                nombre: candidatura.nombre || '',
                descripcion: candidatura.descripcion || '',
                partidoId: candidatura.partidoId,
                cargoId: candidatura.cargoId,
                eleccionId: candidatura.eleccionId,
                candidatoIds: candidatura.candidatoIds || [],
                estado: candidatura.estado || ''
            });
        }
        if (!open) reset();
    }, [candidatura, open, reset]);

    React.useEffect(() => {
        if (success) {
            onUpdated?.();
            onClose();
            clearSuccess();
        }
    }, [success, onUpdated, onClose, clearSuccess]);

    React.useEffect(() => {
        if (open) fetchCandidatos();
    }, [open, fetchCandidatos]);

    if (!open || !candidatura) return null;

    const handleEdit = (data: CandidaturaUpdateForm) => {
        // Aseguro que candidatoIds sea array de numbers
        const candidatoIds = Array.isArray(data.candidatoIds)
            ? data.candidatoIds.map(id => Number(id))
            : [];
        return update(candidatura.id, { ...data, candidatoIds });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-main rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-button/10 rounded-full">
                            <FiFlag className="text-button text-xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-headline">Editar Candidatura</h3>
                            <p className="text-sm text-paragraph">Modifica los datos de la candidatura</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <FiX className="text-paragraph text-lg" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(handleEdit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-headline mb-2">Nombre</label>
                        <input {...register('nombre')} className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.nombre ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`} placeholder="Ej: Candidatura MAS para Alcalde" />
                        {errors.nombre && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.nombre.message}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-headline mb-2">Descripción</label>
                        <textarea {...register('descripcion')} className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.descripcion ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`} placeholder="Descripción de la candidatura" />
                        {errors.descripcion && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.descripcion.message}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-headline mb-2">Elección</label>
                        <select {...register('eleccionId', { valueAsNumber: true })} className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.eleccionId ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`}>
                            <option value="">Selecciona una elección</option>
                            {elecciones.map(e => (
                                <option key={e.id} value={e.id}>{e.nombre}</option>
                            ))}
                        </select>
                        {errors.eleccionId && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.eleccionId.message}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-headline mb-2">Cargo</label>
                        <select {...register('cargoId', { valueAsNumber: true })} className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.cargoId ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`}>
                            <option value="">Selecciona un cargo</option>
                            {cargos.map(c => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                        {errors.cargoId && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.cargoId.message}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-headline mb-2">Partido Político</label>
                        <select {...register('partidoId', { valueAsNumber: true })} className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.partidoId ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`}>
                            <option value="">Selecciona un partido</option>
                            {partidos.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre} ({p.sigla})</option>
                            ))}
                        </select>
                        {errors.partidoId && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.partidoId.message}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-headline mb-2">Candidatos</label>
                        <select {...register('candidatoIds', { valueAsNumber: false })} multiple className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.candidatoIds ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`} size={Math.min(6, candidatos.length)}>
                            {candidatos.map(c => (
                                <option key={c.id} value={c.id}>{c.nombres} {c.apellidoPaterno} {c.apellidoMaterno} (CI: {c.cedula})</option>
                            ))}
                        </select>
                        {errors.candidatoIds && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.candidatoIds.message}</div>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-headline mb-2">Estado (opcional)</label>
                        <select {...register('estado')} className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.estado ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`} defaultValue="activo">
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                        {errors.estado && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.estado.message}</div>}
                    </div>
                    {error && <div className="flex items-center gap-2 p-3 bg-tertiary/10 border border-tertiary/20 rounded-lg"><FiAlertCircle className="text-tertiary flex-shrink-0" /><span className="text-tertiary text-sm">{error}</span></div>}
                    {success && <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"><FiCheckCircle className="text-green-600 flex-shrink-0" /><span className="text-green-700 text-sm">Candidatura actualizada exitosamente</span></div>}
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg bg-secondary text-headline hover:bg-secondary/80 transition-all duration-200 font-semibold">Cancelar</button>
                        <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg bg-button text-buttonText hover:bg-highlight transition-all duration-200 font-semibold disabled:opacity-50">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};