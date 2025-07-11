import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cargoUpdateSchema, type CargoUpdateForm } from '../../schemas/cargos/cargoUpdate.schema';
import { useUpdateCargo } from '../../hooks/cargos/useUpdateCargo';
import { EstadoCargo } from '../../../core/enums/estado-cargo.enum';
import { FiBriefcase, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import type { Cargo } from '../../../core/types/sistema-administracion-electoral/cargo.types';
import { useSecciones } from '../../hooks/seccion/useSecciones';
import { GoogleMap, Polygon } from '@react-google-maps/api';

interface CargoEditModalProps {
    open: boolean;
    onClose: () => void;
    cargo: Cargo | null;
    onUpdated?: () => void;
}

export const CargoEditModal: React.FC<CargoEditModalProps> = ({ open, onClose, cargo, onUpdated }) => {
    const { update, loading, error, success, clearSuccess } = useUpdateCargo();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CargoUpdateForm>({
        resolver: zodResolver(cargoUpdateSchema),
        defaultValues: {
        nombre: '',
        descripcion: '',
        estado: EstadoCargo.ACTIVO
        }
    });
    const { secciones, loading: loadingSecciones } = useSecciones();
    const [selectedSeccionId, setSelectedSeccionId] = React.useState<number | null>(null);

    React.useEffect(() => {
        console.log('🟠 [EFFECT] CARGO Y OPEN:', { cargo, open });
        if (cargo && open) {
            setValue('nombre', cargo.nombre);
            setValue('descripcion', cargo.descripcion);
            setValue('estado', cargo.estado === 'activo' ? EstadoCargo.ACTIVO : EstadoCargo.INACTIVO);
            if (cargo.seccionId) {
                setSelectedSeccionId(cargo.seccionId);
            } else if (cargo.seccion && cargo.seccion.id) {
                setSelectedSeccionId(cargo.seccion.id);
            }
        }
        if (!open) reset();
    }, [cargo, open, setValue, reset]);
    // Sincronizar select y mapa
    React.useEffect(() => {
        console.log('🟡 [EFFECT] selectedSeccionId:', selectedSeccionId);
        if (selectedSeccionId !== null) {
            setValue('seccionId', selectedSeccionId);
        }
    }, [selectedSeccionId, setValue]);

    React.useEffect(() => {
        if (success) {
        onUpdated?.();
        onClose();
        clearSuccess();
        }
    }, [success, onUpdated, onClose, clearSuccess]);

    if (!open || !cargo) return null;

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleEdit = (data: CargoUpdateForm) => {
        if (selectedSeccionId === null) {
            console.error('No se ha seleccionado una sección');
            return;
        }
        const payload = { ...data, seccionId: selectedSeccionId };
        console.log('📦 handleEdit - payload enviado a update:', payload);
        return update(cargo.id, payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-main rounded-2xl shadow-2xl p-8 w-full max-w-4xl mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-button/10 rounded-full">
                            <FiBriefcase className="text-button text-xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-headline">Editar Cargo</h3>
                            <p className="text-sm text-paragraph">Modifica los datos del cargo</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <FiX className="text-paragraph text-lg" />
                    </button>
                </div>
                <form onSubmit={handleSubmit(
                    (data) => {
                        console.log('✅ handleSubmit - datos validados:', data);
                        handleEdit(data);
                    },
                    (errors) => {
                        console.error('❌ handleSubmit - errores de validación:', errors);
                    }
                )} className="flex flex-col md:flex-row gap-8">
                    {/* Columna izquierda: Sección y mapa */}
                    <div className="md:w-1/2 flex flex-col gap-4">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-headline">Sección a la que afecta</label>
                                {selectedSeccionId && (
                                    <span className="text-xs text-button font-semibold bg-button/10 px-2 py-1 rounded-lg">
                                        {secciones.find(s => s.id === selectedSeccionId)?.nombre}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-paragraph mb-2">Selecciona una sección del listado o haz clic en el mapa para asociar el cargo a una sola sección. Un cargo solo puede afectar una sección.</p>
                            <select
                                value={selectedSeccionId ?? ''}
                                onChange={e => setSelectedSeccionId(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent bg-white font-semibold text-headline shadow-sm hover:border-button"
                                disabled={loadingSecciones}
                            >
                                <option value="">Selecciona una sección</option>
                                {secciones.map(seccion => (
                                    <option key={seccion.id} value={seccion.id}>{seccion.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full h-64 rounded-xl overflow-hidden border-2 border-stroke shadow-lg mt-2 relative">
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={secciones.length && selectedSeccionId ?
                                    (() => {
                                        const s = secciones.find(sec => sec.id === selectedSeccionId);
                                        if (s && s.puntos.length) {
                                            const p = s.puntos[0];
                                            return { lat: Number(p.latitud), lng: Number(p.longitud) };
                                        }
                                        return { lat: -17.7833, lng: -63.1821 };
                                    })() : { lat: -17.7833, lng: -63.1821 }}
                                zoom={15}
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
                                {secciones.map((seccion, idx) => (
                                    seccion.puntos.length > 0 && (
                                        <Polygon
                                            key={seccion.id}
                                            path={seccion.puntos
                                                .sort((a, b) => Number(a.orden) - Number(b.orden))
                                                .map(p => ({ lat: Number(p.latitud), lng: Number(p.longitud) }))}
                                            options={{
                                                fillColor: selectedSeccionId === seccion.id ? '#6246ea' : '#a855f7',
                                                fillOpacity: selectedSeccionId === seccion.id ? 0.5 : 0.15,
                                                strokeColor: selectedSeccionId === seccion.id ? '#ffb300' : '#7c3aed',
                                                strokeOpacity: 1,
                                                strokeWeight: selectedSeccionId === seccion.id ? 6 : 2,
                                                clickable: true,
                                                zIndex: 10 + idx,
                                            }}
                                            onClick={() => setSelectedSeccionId(seccion.id)}
                                        />
                                    )
                                ))}
                            </GoogleMap>
                            <div className="absolute top-2 right-2 bg-white/80 rounded-lg px-3 py-1 text-xs text-paragraph shadow-md pointer-events-none">
                                Haz clic en una sección del mapa para seleccionarla
                            </div>
                        </div>
                    </div>
                    {/* Columna derecha: Datos del cargo */}
                    <div className="md:w-1/2 flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-headline mb-2">Nombre del cargo</label>
                            <input {...register('nombre')} className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.nombre ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`} placeholder="Ej: Presidente" />
                            {errors.nombre && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.nombre.message}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-headline mb-2">Descripción <span className="text-paragraph text-xs">(opcional)</span></label>
                            <input {...register('descripcion')} className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.descripcion ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`} placeholder="Describe el cargo..." />
                            {errors.descripcion && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.descripcion.message}</div>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-headline mb-2">Estado <span className="text-paragraph text-xs">(opcional)</span></label>
                            <select {...register('estado')} className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${errors.estado ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'}`}>
                                <option value={EstadoCargo.ACTIVO}>Activo</option>
                                <option value={EstadoCargo.INACTIVO}>Inactivo</option>
                            </select>
                            {errors.estado && <div className="flex items-center gap-1 mt-1 text-tertiary text-sm"><FiAlertCircle className="text-xs" />{errors.estado.message}</div>}
                        </div>
                        {error && <div className="flex items-center gap-2 p-3 bg-tertiary/10 border border-tertiary/20 rounded-lg"><FiAlertCircle className="text-tertiary flex-shrink-0" /><span className="text-tertiary text-sm">{error}</span></div>}
                        {success && <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"><FiCheckCircle className="text-green-600 flex-shrink-0" /><span className="text-green-700 text-sm">Cargo actualizado exitosamente</span></div>}
                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={handleClose} className="px-6 py-3 rounded-lg bg-secondary text-headline hover:bg-secondary/80 transition-all duration-200 font-semibold">Cancelar</button>
                            <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg bg-button text-buttonText hover:bg-highlight transition-all duration-200 font-semibold disabled:opacity-50">Guardar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}; 