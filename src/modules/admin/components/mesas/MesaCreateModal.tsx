import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { mesaCreateSchema } from '../../schemas/mesas/mesaCreate.schema';
import type { MesaCreateForm } from '../../schemas/mesas/mesaCreate.schema';
import { useCreateMesa } from '../../hooks/mesas/useCreateMesa';
import { FiPlusSquare, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useRecintos } from '../../hooks/recintos/useRecintos';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '../../../core/hooks/useGoogleMaps';

interface MesaCreateModalProps {
    open: boolean;
    onClose: () => void;
    onCreated?: (mesa: any) => void;
}

export const MesaCreateModal: React.FC<MesaCreateModalProps> = ({ open, onClose, onCreated }) => {
    const { create, loading, error, success, clearSuccess } = useCreateMesa();
    const { recintos } = useRecintos();
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<MesaCreateForm>({
        resolver: zodResolver(mesaCreateSchema),
    });

    const [selectedRecintoId, setSelectedRecintoId] = React.useState<number | null>(null);

    // Limpiar estado al cerrar o crear
    const handleClose = () => {
        setSelectedRecintoId(null);
        reset();
        onClose();
    };

    React.useEffect(() => {
        if (success) {
            onCreated?.(success);
            handleClose();
            clearSuccess();
        }
    }, [success, onCreated, clearSuccess]);

    React.useEffect(() => {
        const sub = watch((value) => {
            if (value.recintoId) setSelectedRecintoId(value.recintoId);
        });
        return () => sub.unsubscribe();
    }, [watch]);

    const { isLoaded } = useGoogleMaps();
    const recintoSeleccionado = recintos.find(r => r.id === selectedRecintoId);

    const mapContainerStyle = { width: '100%', height: '220px' };
    const defaultCenter = { lat: -17.7833, lng: -63.1821 };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-main rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-button/10 rounded-full">
                <FiPlusSquare className="text-button text-xl" />
                </div>
                <h3 className="text-xl font-bold text-headline">Crear Mesa</h3>
            </div>
            <button
                onClick={onClose}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
                <FiX className="text-paragraph text-lg" />
            </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(data => create(data))} className="space-y-4">
            {/* Número de mesa */}
            <div>
                <label className="block text-sm font-medium text-headline mb-2">
                Número de mesa
                </label>
                <input
                {...register('numero', { valueAsNumber: true })}
                type="number"
                min={1}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                    errors.numero ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                }`}
                placeholder="Ej: 101"
                />
                {errors.numero && (
                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                    <FiAlertCircle className="text-xs" />
                    {errors.numero.message}
                </div>
                )}
            </div>

            {/* Recinto */}
            <div>
                <label className="block text-sm font-medium text-headline mb-2">
                Recinto
                </label>
                <select
                {...register('recintoId', { valueAsNumber: true })}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                    errors.recintoId ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                }`}
                defaultValue=""
                onChange={e => {
                    const value = e.target.value ? Number(e.target.value) : null;
                    setSelectedRecintoId(value);
                    // También actualizar el valor en el formulario
                    register('recintoId').onChange(e);
                }}
                >
                <option value="" disabled>Selecciona un recinto</option>
                {(recintos ?? []).map((recinto) => (
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

            {/* Mapa del recinto seleccionado */}
            <div className="mb-4">
                {isLoaded ? (
                <div className="rounded-lg overflow-hidden border border-stroke shadow-sm">
                    <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={recintoSeleccionado ? { lat: recintoSeleccionado.latitud, lng: recintoSeleccionado.longitud } : defaultCenter}
                    zoom={recintoSeleccionado ? 16 : 12}
                    options={{
                        disableDefaultUI: true,
                        zoomControl: true,
                        draggable: true,
                        styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }]
                        }
                        ]
                    }}
                    >
                    {recintoSeleccionado && (
                        <Marker position={{ lat: recintoSeleccionado.latitud, lng: recintoSeleccionado.longitud }} />
                    )}
                    </GoogleMap>
                </div>
                ) : (
                <div className="w-full h-56 flex items-center justify-center bg-secondary/30 rounded-lg">
                    <span className="text-paragraph text-sm">Selecciona un recinto para ver su ubicación</span>
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
                <span className="text-green-700 text-sm">Mesa creada exitosamente</span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4">
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
                    Creando...
                    </>
                ) : (
                    <>
                    <FiPlusSquare className="text-sm" />
                    Crear Mesa
                    </>
                )}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}; 