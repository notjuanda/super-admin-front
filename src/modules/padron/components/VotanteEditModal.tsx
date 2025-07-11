import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { votanteUpdateSchema } from '../schemas/votanteUpdate.schema';
import type { VotanteUpdateForm } from '../schemas/votanteUpdate.schema';
import { useUpdateVotante } from '../hooks/useUpdateVotante';
import { useRecintos } from '../../admin/hooks/recintos/useRecintos';
import { FiEdit2, FiX, FiCheckCircle, FiAlertCircle, FiUser, FiCamera } from 'react-icons/fi';
import type { Votante } from '../../core/types/sistema-padron-electoral/votante.types';

interface VotanteEditModalProps {
    open: boolean;
    onClose: () => void;
    votante: Votante | null;
    onUpdated?: (votante: any) => void;
}

export const VotanteEditModal: React.FC<VotanteEditModalProps> = ({ open, onClose, votante, onUpdated }) => {
    const { update, loading, error, data } = useUpdateVotante();
    const { recintos, loading: loadingRecintos } = useRecintos();
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<VotanteUpdateForm>({
        resolver: zodResolver(votanteUpdateSchema),
        defaultValues: votante ? {
        id: votante.id,
        ci: votante.ci,
        nombreCompleto: votante.nombreCompleto,
        direccion: votante.direccion,
        recintoId: votante.recintoId,
        recintoNombre: votante.recintoNombre,
        fotoCarnetAnverso: null,
        fotoCarnetReverso: null,
        fotoVotante: null,
        } : undefined
    });

    const fotoVotanteFile = watch('fotoVotante');
    const fotoCarnetAnversoFile = watch('fotoCarnetAnverso');
    const fotoCarnetReversoFile = watch('fotoCarnetReverso');
    const [previewVotante, setPreviewVotante] = React.useState<string | null>(null);
    const [previewAnverso, setPreviewAnverso] = React.useState<string | null>(null);
    const [previewReverso, setPreviewReverso] = React.useState<string | null>(null);
    const baseUrl = import.meta.env.VITE_API_PADRON_URL_IMAGES;

    React.useEffect(() => {
        if (fotoVotanteFile && fotoVotanteFile instanceof File) {
        const url = URL.createObjectURL(fotoVotanteFile);
        setPreviewVotante(url);
        return () => URL.revokeObjectURL(url);
        } else if (votante?.fotoVotante && baseUrl) {
        setPreviewVotante(`${baseUrl.replace(/\/$/, '')}/${votante.fotoVotante.replace(/^\//, '')}`);
        } else {
        setPreviewVotante(null);
        }
    }, [fotoVotanteFile, votante, baseUrl]);
    React.useEffect(() => {
        if (fotoCarnetAnversoFile && fotoCarnetAnversoFile instanceof File) {
        const url = URL.createObjectURL(fotoCarnetAnversoFile);
        setPreviewAnverso(url);
        return () => URL.revokeObjectURL(url);
        } else if (votante?.fotoCarnetAnverso && baseUrl) {
        setPreviewAnverso(`${baseUrl.replace(/\/$/, '')}/${votante.fotoCarnetAnverso.replace(/^\//, '')}`);
        } else {
        setPreviewAnverso(null);
        }
    }, [fotoCarnetAnversoFile, votante, baseUrl]);
    React.useEffect(() => {
        if (fotoCarnetReversoFile && fotoCarnetReversoFile instanceof File) {
        const url = URL.createObjectURL(fotoCarnetReversoFile);
        setPreviewReverso(url);
        return () => URL.revokeObjectURL(url);
        } else if (votante?.fotoCarnetReverso && baseUrl) {
        setPreviewReverso(`${baseUrl.replace(/\/$/, '')}/${votante.fotoCarnetReverso.replace(/^\//, '')}`);
        } else {
        setPreviewReverso(null);
        }
    }, [fotoCarnetReversoFile, votante, baseUrl]);

    React.useEffect(() => {
        if (data) {
        onUpdated?.(data);
        reset();
        onClose();
        }
    }, [data, onUpdated, onClose, reset]);

    React.useEffect(() => {
        if (votante) {
        reset({
            id: votante.id,
            ci: votante.ci,
            nombreCompleto: votante.nombreCompleto,
            direccion: votante.direccion,
            recintoId: votante.recintoId,
            recintoNombre: votante.recintoNombre,
            fotoCarnetAnverso: null,
            fotoCarnetReverso: null,
            fotoVotante: null,
        });
        }
    }, [votante, reset]);

    if (!open || !votante) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-main rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-button/10 rounded-full">
                <FiEdit2 className="text-button text-xl" />
                </div>
                <h3 className="text-xl font-bold text-headline">Editar Votante</h3>
            </div>
            <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
                <FiX className="text-paragraph text-lg" />
            </button>
            </div>

            {/* Fotos */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-4">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 rounded-full border-4 border-secondary bg-button/10 flex items-center justify-center overflow-hidden shadow">
                {previewVotante ? (
                    <img src={previewVotante} alt="Foto del votante" className="w-full h-full object-cover" />
                ) : (
                    <FiUser className="text-4xl text-stroke" />
                )}
                <label className="absolute bottom-0 right-0 bg-button text-buttonText p-2 rounded-full cursor-pointer shadow-lg hover:bg-highlight transition-colors">
                    <FiCamera />
                    <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => setValue('fotoVotante', e.target.files?.[0] || null)}
                    />
                </label>
                </div>
                <span className="text-xs text-paragraph">Foto de perfil</span>
            </div>
            {/* Carnet Anverso */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 rounded-xl border-4 border-secondary bg-button/10 flex items-center justify-center overflow-hidden shadow">
                {previewAnverso ? (
                    <img src={previewAnverso} alt="Carnet anverso" className="w-full h-full object-cover" />
                ) : (
                    <FiUser className="text-4xl text-stroke" />
                )}
                <label className="absolute bottom-0 right-0 bg-button text-buttonText p-2 rounded-full cursor-pointer shadow-lg hover:bg-highlight transition-colors">
                    <FiCamera />
                    <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => setValue('fotoCarnetAnverso', e.target.files?.[0] || null)}
                    />
                </label>
                </div>
                <span className="text-xs text-paragraph">Carnet anverso</span>
            </div>
            {/* Carnet Reverso */}
            <div className="flex flex-col items-center gap-2">
                <div className="relative w-24 h-24 rounded-xl border-4 border-secondary bg-button/10 flex items-center justify-center overflow-hidden shadow">
                {previewReverso ? (
                    <img src={previewReverso} alt="Carnet reverso" className="w-full h-full object-cover" />
                ) : (
                    <FiUser className="text-4xl text-stroke" />
                )}
                <label className="absolute bottom-0 right-0 bg-button text-buttonText p-2 rounded-full cursor-pointer shadow-lg hover:bg-highlight transition-colors">
                    <FiCamera />
                    <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => setValue('fotoCarnetReverso', e.target.files?.[0] || null)}
                    />
                </label>
                </div>
                <span className="text-xs text-paragraph">Carnet reverso</span>
            </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(formData => {
                // Enviar la ruta original si no se selecciona nueva foto
                const payload: any = { ...formData };
                if (!formData.fotoCarnetAnverso && votante?.fotoCarnetAnverso) {
                    payload.fotoCarnetAnversoOriginal = votante.fotoCarnetAnverso;
                }
                if (!formData.fotoCarnetReverso && votante?.fotoCarnetReverso) {
                    payload.fotoCarnetReversoOriginal = votante.fotoCarnetReverso;
                }
                if (!formData.fotoVotante && votante?.fotoVotante) {
                    payload.fotoVotanteOriginal = votante.fotoVotante;
                }
                update(votante.id, payload);
            })} className="space-y-4">
            {/* CI */}
            <div>
                <label className="block text-sm font-medium text-headline mb-2">CI</label>
                <input
                {...register('ci')}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.ci ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`}
                placeholder="Ingresa el CI"
                />
                {errors.ci && (
                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                    <FiAlertCircle className="text-xs" />
                    {errors.ci.message}
                </div>
                )}
            </div>

            {/* Nombre completo */}
            <div>
                <label className="block text-sm font-medium text-headline mb-2">Nombre completo</label>
                <input
                {...register('nombreCompleto')}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.nombreCompleto ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`}
                placeholder="Ingresa el nombre completo"
                />
                {errors.nombreCompleto && (
                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                    <FiAlertCircle className="text-xs" />
                    {errors.nombreCompleto.message}
                </div>
                )}
            </div>

            {/* Dirección */}
            <div>
                <label className="block text-sm font-medium text-headline mb-2">Dirección</label>
                <input
                {...register('direccion')}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.direccion ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`}
                placeholder="Ingresa la dirección"
                />
                {errors.direccion && (
                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                    <FiAlertCircle className="text-xs" />
                    {errors.direccion.message}
                </div>
                )}
            </div>

            {/* Recinto */}
            <div>
                <label className="block text-sm font-medium text-headline mb-2">Recinto</label>
                <select
                {...register('recintoId', { valueAsNumber: true })}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.recintoId ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`}
                disabled={loadingRecintos}
                >
                <option value="">Selecciona un recinto</option>
                {recintos.map(recinto => (
                    <option key={recinto.id} value={recinto.id}>{recinto.nombre}</option>
                ))}
                </select>
                {errors.recintoId && (
                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                    <FiAlertCircle className="text-xs" />
                    {errors.recintoId.message}
                </div>
                )}
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-tertiary/10 border border-tertiary/20 rounded-lg">
                <FiAlertCircle className="text-tertiary flex-shrink-0" />
                <span className="text-tertiary text-sm">{error}</span>
                </div>
            )}

            {/* Mensaje de éxito */}
            {data && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FiCheckCircle className="text-green-600 flex-shrink-0" />
                <span className="text-green-700 text-sm">Votante actualizado exitosamente</span>
                </div>
            )}

            {/* Acciones */}
            <div className="flex gap-3 justify-end pt-4">
                <button
                type="button"
                onClick={() => { reset(); onClose(); }}
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
                    <FiEdit2 className="text-sm" />
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