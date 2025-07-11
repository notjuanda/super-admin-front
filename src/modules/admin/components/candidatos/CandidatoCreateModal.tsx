import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCandidato } from '../../hooks/candidatos/useCreateCandidato';
import { candidatoCreateSchema } from '../../schemas/candidatos/candidatoCreate.schema';
import type { CandidatoCreateForm } from '../../schemas/candidatos/candidatoCreate.schema';
import { FiUser, FiX, FiUpload, FiCheckCircle, FiAlertCircle, FiCamera, FiTrash2, FiBriefcase, FiFileText } from 'react-icons/fi';
import { buildImageUrl } from '../../../../shared/utils/image.utils';

interface CandidatoCreateModalProps {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

export const CandidatoCreateModal: React.FC<CandidatoCreateModalProps> = ({ open, onClose, onCreated }) => {
    const { create, loading, error, success, clearSuccess } = useCreateCandidato();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CandidatoCreateForm>({
        resolver: zodResolver(candidatoCreateSchema),
        defaultValues: {
            nombres: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            cedula: '',
            fechaNacimiento: '',
            profesion: '',
            biografia: ''
        }
    });
    
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (success) {
        onCreated?.();
        reset();
        setSelectedFile(null);
        setPreviewUrl(null);
        onClose();
        clearSuccess();
        }
    }, [success, onCreated, onClose, reset, clearSuccess]);

    if (!open) return null;

    const handleCreate = (data: CandidatoCreateForm) => {
        const dto = {
            nombres: data.nombres,
            apellidoPaterno: data.apellidoPaterno,
            apellidoMaterno: data.apellidoMaterno,
            cedula: data.cedula,
            fechaNacimiento: data.fechaNacimiento,
            profesion: data.profesion,
            biografia: data.biografia
        };
        return create(dto, selectedFile || undefined);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-main rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 w-full max-w-2xl mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-button/10 rounded-full">
                <FiUser className="text-button text-xl" />
                </div>
                <div>
                <h3 className="text-xl font-bold text-headline">Crear Nuevo Candidato</h3>
                <p className="text-sm text-paragraph">Registra la información del candidato electoral</p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
                <FiX className="text-paragraph text-lg" />
            </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleCreate)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                <label className="block text-sm font-medium text-headline mb-2">
                    Nombres
                </label>
                <input 
                    {...register('nombres')} 
                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                    errors.nombres ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                    }`} 
                    placeholder="Ej: Juan Carlos"
                />
                {errors.nombres && (
                    <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                    <FiAlertCircle className="text-xs" />
                    {errors.nombres.message}
                    </div>
                )}
                </div>

                <div>
                <label className="block text-sm font-medium text-headline mb-2">
                    Apellido Paterno
                </label>
                <input 
                    {...register('apellidoPaterno')} 
                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                    errors.apellidoPaterno ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                    }`} 
                    placeholder="Ej: García"
                />
                {errors.apellidoPaterno && (
                    <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                    <FiAlertCircle className="text-xs" />
                    {errors.apellidoPaterno.message}
                    </div>
                )}
                </div>

                <div>
                <label className="block text-sm font-medium text-headline mb-2">
                    Apellido Materno
                </label>
                <input 
                    {...register('apellidoMaterno')} 
                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                    errors.apellidoMaterno ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                    }`} 
                    placeholder="Ej: López"
                />
                {errors.apellidoMaterno && (
                    <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                    <FiAlertCircle className="text-xs" />
                    {errors.apellidoMaterno.message}
                    </div>
                )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-headline mb-2">
                    Cédula de Identidad
                </label>
                <input 
                    {...register('cedula')} 
                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                    errors.cedula ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                    }`} 
                    placeholder="Ej: 12345678"
                />
                {errors.cedula && (
                    <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                    <FiAlertCircle className="text-xs" />
                    {errors.cedula.message}
                    </div>
                )}
                </div>

                <div>
                <label className="block text-sm font-medium text-headline mb-2">
                    Fecha de Nacimiento
                </label>
                <input 
                    type="date"
                    {...register('fechaNacimiento')} 
                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                    errors.fechaNacimiento ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                    }`} 
                />
                {errors.fechaNacimiento && (
                    <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                    <FiAlertCircle className="text-xs" />
                    {errors.fechaNacimiento.message}
                    </div>
                )}
                </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-headline mb-2">
                    <FiBriefcase className="inline mr-2" />
                    Profesión
                </label>
                <input 
                    {...register('profesion')} 
                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                    errors.profesion ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                    }`} 
                    placeholder="Ej: Ingeniero Civil"
                />
                {errors.profesion && (
                    <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                    <FiAlertCircle className="text-xs" />
                    {errors.profesion.message}
                    </div>
                )}
                </div>

                <div>
                <label className="block text-sm font-medium text-headline mb-2">
                    <FiFileText className="inline mr-2" />
                    Biografía
                </label>
                <textarea 
                    {...register('biografia')} 
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent resize-none ${
                    errors.biografia ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                    }`} 
                    placeholder="Describe brevemente la experiencia del candidato..."
                />
                {errors.biografia && (
                    <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                    <FiAlertCircle className="text-xs" />
                    {errors.biografia.message}
                    </div>
                )}
                </div>
            </div>

            {/* Photo Upload */}
            <div>
                <label className="block text-sm font-medium text-headline mb-2">
                Foto del Candidato
                </label>
                <div className="space-y-4">
                {/* File Input */}
                <div className="relative">
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                    />
                    <label
                    htmlFor="photo-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border-2 border-dashed border-stroke hover:border-button transition-colors cursor-pointer bg-secondary/20 hover:bg-secondary/30"
                    >
                    <FiUpload className="text-paragraph text-lg" />
                    <span className="text-paragraph font-medium">
                        {selectedFile ? selectedFile.name : 'Seleccionar foto'}
                    </span>
                    </label>
                </div>

                {/* Preview */}
                {previewUrl && (
                    <div className="relative">
                    <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-stroke">
                        <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="absolute -top-2 -right-2 p-1 bg-tertiary text-white rounded-full hover:bg-tertiary/90 transition-colors"
                    >
                        <FiTrash2 className="text-xs" />
                    </button>
                    </div>
                )}

                {/* Placeholder when no photo */}
                {!previewUrl && (
                    <div className="w-32 h-32 rounded-lg border-2 border-dashed border-stroke bg-secondary/20 flex items-center justify-center">
                    <FiCamera className="text-paragraph text-2xl" />
                    </div>
                )}
                </div>
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
                <span className="text-green-700 text-sm">Candidato creado exitosamente</span>
                </div>
            )}

            {/* Actions */}
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
                    Creando...
                    </>
                ) : (
                    <>
                    <FiUser className="text-sm" />
                    Crear Candidato
                    </>
                )}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}; 