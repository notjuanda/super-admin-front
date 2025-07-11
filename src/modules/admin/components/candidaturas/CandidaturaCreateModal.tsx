import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidaturaCreateSchema, type CandidaturaCreateForm } from '../../schemas/candidaturas/candidaturaCreate.schema';
import { useCreateCandidatura } from '../../hooks/candidaturas/useCreateCandidatura';
import { useCandidatos } from '../../hooks/candidatos/useCandidatos';
import { FiFlag, FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import type { Eleccion } from '../../../core/types/sistema-administracion-electoral/eleccion.types';
import type { Cargo } from '../../../core/types/sistema-administracion-electoral/cargo.types';
import type { PartidoPolitico } from '../../../core/types/sistema-administracion-electoral/partido-politico.types';
import { useState } from 'react';

interface CandidaturaCreateModalProps {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
    elecciones: Eleccion[];
    cargos: Cargo[];
    partidos: PartidoPolitico[];
}

export const CandidaturaCreateModal: React.FC<CandidaturaCreateModalProps> = ({ open, onClose, onCreated, elecciones, cargos, partidos }) => {
    const { create, loading, error, success, clearSuccess } = useCreateCandidatura();
    const { candidatos, fetchCandidatos } = useCandidatos();
    const [search, setSearch] = useState('');
    const filteredCandidatos = candidatos.filter(c =>
        `${c.nombres} ${c.apellidoPaterno} ${c.apellidoMaterno} ${c.cedula} ${c.profesion || ''}`.toLowerCase().includes(search.toLowerCase())
    );
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CandidaturaCreateForm>({
        resolver: zodResolver(candidaturaCreateSchema),
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
        if (success) {
            onCreated?.();
            reset();
            onClose();
            clearSuccess();
        }
    }, [success, onCreated, onClose, reset, clearSuccess]);

    React.useEffect(() => {
        if (open) fetchCandidatos();
    }, [open, fetchCandidatos]);

    if (!open) return null;

    const handleCreate = (data: CandidaturaCreateForm) => {
        // Transformar candidatoIds a number[]
        const candidatoIds = Array.isArray(data.candidatoIds)
            ? data.candidatoIds.map(id => Number(id)).filter(id => !isNaN(id))
            : [];
        // Transformar los selects a number (0 si no hay selección)
        const partidoId = (typeof data.partidoId === 'string' && (data.partidoId === '' || data.partidoId === undefined)) ? 0 : Number(data.partidoId);
        const cargoId = (typeof data.cargoId === 'string' && (data.cargoId === '' || data.cargoId === undefined)) ? 0 : Number(data.cargoId);
        const eleccionId = (typeof data.eleccionId === 'string' && (data.eleccionId === '' || data.eleccionId === undefined)) ? 0 : Number(data.eleccionId);
        return create({
            ...data,
            candidatoIds,
            partidoId,
            cargoId,
            eleccionId,
        });
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
                            <h3 className="text-xl font-bold text-headline">Crear Candidatura</h3>
                            <p className="text-sm text-paragraph">Registra una nueva candidatura en el sistema</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <FiX className="text-paragraph text-lg" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(handleCreate)} className="space-y-8">
                    {/* Sección: Datos básicos */}
                    <div>
                        <h4 className="font-semibold text-headline mb-2 text-lg">Datos básicos</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-headline mb-2">Nombre</label>
                                <input {...register('nombre')} className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.nombre ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`} placeholder="Ej: Candidatura MAS para Alcalde" />
                                {errors.nombre && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.nombre.message}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-headline mb-2">Estado</label>
                                <select {...register('estado')} className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.estado ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`} defaultValue="activo">
                                    <option value="activo">🟢 Activo</option>
                                    <option value="inactivo">⚪ Inactivo</option>
                                </select>
                                {errors.estado && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.estado.message}</div>}
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-headline mb-2">Descripción</label>
                            <textarea {...register('descripcion')} className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.descripcion ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`} placeholder="Descripción de la candidatura" />
                            {errors.descripcion && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.descripcion.message}</div>}
                        </div>
                    </div>
                    {/* Sección: Relación */}
                    <div>
                        <h4 className="font-semibold text-headline mb-2 text-lg">Relaciones</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        </div>
                    </div>
                    {/* Sección: Candidatos */}
                    <div>
                        <h4 className="font-semibold text-headline mb-2 text-lg">Candidatos</h4>
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar candidato por nombre, CI o profesión..."
                            className="w-full mb-2 px-4 py-2 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent"
                        />
                        <select {...register('candidatoIds', { valueAsNumber: false })} multiple className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.candidatoIds ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`} size={Math.min(6, filteredCandidatos.length || 1)}>
                            {filteredCandidatos.length === 0 && <option disabled value="">No hay candidatos disponibles</option>}
                            {filteredCandidatos.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.nombres} {c.apellidoPaterno} {c.apellidoMaterno} | CI: {c.cedula} {c.profesion ? `| ${c.profesion}` : ''}
                                </option>
                            ))}
                        </select>
                        {errors.candidatoIds && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.candidatoIds.message}</div>}
                    </div>
                    {/* Feedback y acciones */}
                    {error && <div className="flex items-center gap-2 p-3 bg-tertiary/10 border border-tertiary/20 rounded-lg"><FiAlertCircle className="text-tertiary flex-shrink-0" /><span className="text-tertiary text-sm">{error}</span></div>}
                    {success && <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"><FiCheckCircle className="text-green-600 flex-shrink-0" /><span className="text-green-700 text-sm">Candidatura creada exitosamente</span></div>}
                    <div className="flex justify-end gap-2 pt-2 border-t border-stroke mt-6">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg bg-secondary text-headline hover:bg-secondary/80 transition-all duration-200 font-semibold">Cancelar</button>
                        <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg bg-button text-buttonText hover:bg-highlight transition-all duration-200 font-semibold disabled:opacity-50 flex items-center gap-2">
                            {loading ? <span className="w-4 h-4 border-2 border-buttonText border-t-transparent rounded-full animate-spin" /> : <FiFlag className="text-sm" />}
                            {loading ? 'Creando...' : 'Crear Candidatura'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 