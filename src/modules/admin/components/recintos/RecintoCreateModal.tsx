import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateRecinto } from '../../hooks/recintos/useCreateRecinto';
import { recintoCreateSchema } from '../../schemas/recintos/recintoCreate.schema';
import type { RecintoCreateForm } from '../../schemas/recintos/recintoCreate.schema';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from '../../../core/hooks/useGoogleMaps';
import { FiMapPin, FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface RecintoCreateModalProps {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

export const RecintoCreateModal: React.FC<RecintoCreateModalProps> = ({ open, onClose, onCreated }) => {
    const { create, loading, error, success, clearSuccess } = useCreateRecinto();
    const { register, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<RecintoCreateForm>({
        resolver: zodResolver(recintoCreateSchema),
        defaultValues: {
            nombre: '',
            descripcion: '',
            latitud: -17.7833,
            longitud: -63.1821
        }
    });
    
    const { isLoaded } = useGoogleMaps();
    const watchedLatitud = watch('latitud');
    const watchedLongitud = watch('longitud');
    const [selectedPosition, setSelectedPosition] = React.useState<{ lat: number; lng: number } | null>(null);

    React.useEffect(() => {
        if (success) {
            onCreated?.();
            reset();
            onClose();
            clearSuccess();
        }
    }, [success, onCreated, onClose, reset, clearSuccess]);

    React.useEffect(() => {
        if (watchedLatitud && watchedLongitud) {
            setSelectedPosition({ lat: watchedLatitud, lng: watchedLongitud });
        }
    }, [watchedLatitud, watchedLongitud]);

    if (!open) return null;

    const handleCreate = (data: RecintoCreateForm) => {
        return create(data);
    };

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setValue('latitud', lat);
        setValue('longitud', lng);
        setSelectedPosition({ lat, lng });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-main rounded-2xl shadow-2xl p-8 w-full max-w-4xl mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-button/10 rounded-full">
                            <FiMapPin className="text-button text-xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-headline">Crear Nuevo Recinto</h3>
                            <p className="text-sm text-paragraph">Define la ubicación del recinto electoral</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                        <FiX className="text-paragraph text-lg" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleCreate)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-headline mb-2">
                                Nombre del recinto
                            </label>
                            <input 
                                {...register('nombre')} 
                                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                    errors.nombre ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                                }`} 
                                placeholder="Ej: Universidad Nur"
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
                                Descripción (opcional)
                            </label>
                            <input 
                                {...register('descripcion')} 
                                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                    errors.descripcion ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                                }`} 
                                placeholder="Ej: Recinto universitario principal"
                            />
                            {errors.descripcion && (
                                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                    <FiAlertCircle className="text-xs" />
                                    {errors.descripcion.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-headline mb-2">
                                Latitud
                            </label>
                            <input 
                                type="number"
                                step="any"
                                {...register('latitud', { valueAsNumber: true })} 
                                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                    errors.latitud ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                                }`} 
                                placeholder="-17.7833"
                            />
                            {errors.latitud && (
                                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                    <FiAlertCircle className="text-xs" />
                                    {errors.latitud.message}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-headline mb-2">
                                Longitud
                            </label>
                            <input 
                                type="number"
                                step="any"
                                {...register('longitud', { valueAsNumber: true })} 
                                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                                    errors.longitud ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                                }`} 
                                placeholder="-63.1821"
                            />
                            {errors.longitud && (
                                <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                                    <FiAlertCircle className="text-xs" />
                                    {errors.longitud.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="text-lg font-semibold text-headline mb-1">Selecciona la ubicación en el mapa</h4>
                                <p className="text-sm text-paragraph">Haz clic en el mapa para establecer la ubicación del recinto</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-paragraph">
                                <FiInfo className="text-xs" />
                                <span>Haz clic para seleccionar</span>
                            </div>
                        </div>

                        <div className="w-full h-80 rounded-xl overflow-hidden border-2 border-stroke shadow-lg">
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '100%' }}
                                    center={{ lat: watchedLatitud || -17.7833, lng: watchedLongitud || -63.1821 }}
                                    zoom={selectedPosition ? 15 : 12}
                                    onClick={handleMapClick}
                                    options={{
                                        disableDefaultUI: true,
                                        zoomControl: true,
                                        streetViewControl: false,
                                        mapTypeControl: false,
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
                                    {selectedPosition && (
                                        <Marker
                                            position={selectedPosition}
                                            options={{
                                                icon: {
                                                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="16" cy="16" r="16" fill="#6246ea"/>
                                                            <circle cx="16" cy="16" r="8" fill="white"/>
                                                        </svg>
                                                    `),
                                                    scaledSize: new window.google.maps.Size(32, 32),
                                                    anchor: new window.google.maps.Point(16, 16)
                                                }
                                            }}
                                        />
                                    )}
                                </GoogleMap>
                            ) : (
                                <div className="w-full h-full bg-secondary rounded-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-8 h-8 border-2 border-button border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-paragraph">Cargando mapa...</p>
                                    </div>
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
                            <span className="text-green-700 text-sm">Recinto creado exitosamente</span>
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
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <FiMapPin className="text-sm" />
                                    Crear Recinto
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 