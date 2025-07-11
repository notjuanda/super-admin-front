import React from 'react';
import { GoogleMap, Polygon } from '@react-google-maps/api';
import type { Seccion } from '../../../core/types/sistema-administracion-electoral/seccion.types';
import { useGoogleMaps } from '../../../core/hooks/useGoogleMaps';
import { FiMap, FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi';

const containerStyle = {
    width: '100%',
    height: '500px',
};

const defaultCenter = { lat: -17.7833, lng: -63.1821 };

interface SeccionesMapProps {
    secciones: Seccion[];
    selectedSeccionId?: number | null;
    setSelectedSeccionId?: (id: number | null) => void;
    onEdit?: (seccion: Seccion) => void;
    onDelete?: (seccion: Seccion) => void;
}

export const SeccionesMap: React.FC<SeccionesMapProps> = ({ 
    secciones, 
    selectedSeccionId, 
    setSelectedSeccionId, 
    onEdit, 
    onDelete 
}) => {
    const { isLoaded } = useGoogleMaps();
    const mapRef = React.useRef<google.maps.Map | null>(null);

    React.useEffect(() => {
        if (!mapRef.current) return;
        if (selectedSeccionId) {
            const seccion = secciones.find(s => s.id === selectedSeccionId);
            if (seccion && seccion.puntos.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            seccion.puntos.forEach(p =>
                bounds.extend({
                lat: Number(p.latitud),
                lng: Number(p.longitud),
                })
            );
            mapRef.current.fitBounds(bounds);
            }
        }
    }, [selectedSeccionId, secciones]);

    if (!isLoaded) {
        return (
            <div className="w-full h-96 bg-secondary rounded-xl flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-button border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-paragraph">Cargando mapa...</p>
                </div>
            </div>
        );
    }

    const seccionesToShow = selectedSeccionId
        ? secciones.filter(s => s.id === selectedSeccionId)
        : secciones;

    return (
        <div className="w-full h-96 rounded-xl overflow-hidden shadow-md bg-main relative">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={12}
                onLoad={map => { mapRef.current = map; }}
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
                {secciones.length === 0 && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-main/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-stroke">
                        <div className="text-center">
                            <FiMap className="text-paragraph text-3xl mx-auto mb-3" />
                            <h3 className="text-headline font-semibold mb-2">No hay secciones registradas</h3>
                            <p className="text-paragraph text-sm">Comienza creando la primera sección electoral</p>
                        </div>
                    </div>
                )}
                
                {seccionesToShow.map((seccion, idx) => (
                    seccion.puntos.length > 0 && (
                        <Polygon
                            key={seccion.id}
                            path={seccion.puntos
                                .sort((a, b) => Number(a.orden) - Number(b.orden))
                                .map(p => ({ lat: Number(p.latitud), lng: Number(p.longitud) }))}
                            options={{
                                fillColor: selectedSeccionId === seccion.id ? '#6246ea' : '#a855f7',
                                fillOpacity: selectedSeccionId === seccion.id ? 0.4 : 0.2,
                                strokeColor: selectedSeccionId === seccion.id ? '#6246ea' : '#7c3aed',
                                strokeOpacity: 0.9,
                                strokeWeight: selectedSeccionId === seccion.id ? 4 : 2,
                                clickable: !!setSelectedSeccionId,
                                zIndex: 10 + idx,
                            }}
                            onClick={() => setSelectedSeccionId && setSelectedSeccionId(seccion.id)}
                        />
                    )
                ))}
            </GoogleMap>

            {selectedSeccionId && (
                <div className="absolute top-4 left-4 bg-main/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-stroke max-w-xs">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <FiInfo className="text-button text-sm" />
                            <h4 className="font-semibold text-headline text-sm">Sección Seleccionada</h4>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const seccion = secciones.find(s => s.id === selectedSeccionId);
                                    if (seccion && onEdit) onEdit(seccion);
                                }}
                                className="p-1.5 rounded-full bg-white hover:bg-button/10 text-button shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-button"
                                title="Editar sección"
                            >
                                <FiEdit2 className="text-xs" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const seccion = secciones.find(s => s.id === selectedSeccionId);
                                    if (seccion && onDelete) onDelete(seccion);
                                }}
                                className="p-1.5 rounded-full bg-white hover:bg-tertiary/10 text-tertiary shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tertiary"
                                title="Eliminar sección"
                            >
                                <FiTrash2 className="text-xs" />
                            </button>
                        </div>
                    </div>
                    {(() => {
                        const seccion = secciones.find(s => s.id === selectedSeccionId);
                        if (!seccion) return null;
                        return (
                            <div className="space-y-1">
                                <p className="text-headline font-medium text-sm">{seccion.nombre}</p>
                                <p className="text-paragraph text-xs">Estado: {seccion.estado}</p>
                                <p className="text-paragraph text-xs">Puntos: {seccion.puntos?.length || 0}</p>
                                {seccion.descripcion && (
                                    <p className="text-paragraph text-xs line-clamp-2">{seccion.descripcion}</p>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}

            {secciones.length > 0 && (
                <div className="absolute top-4 right-4 bg-main/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-stroke">
                    <div className="flex items-center gap-2">
                        <FiMap className="text-button text-sm" />
                        <span className="text-headline text-sm font-medium">
                            {seccionesToShow.length} sección{seccionesToShow.length !== 1 ? 'es' : ''}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}; 