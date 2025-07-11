import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import type { Recinto } from '../../../core/types/sistema-administracion-electoral/recinto.types';
import { useGoogleMaps } from '../../../core/hooks/useGoogleMaps';
import { FiMapPin, FiInfo, FiEdit2, FiTrash2 } from 'react-icons/fi';

const containerStyle = {
    width: '100%',
    height: '500px',
};

const defaultCenter = { lat: -17.7833, lng: -63.1821 };

interface RecintosMapProps {
    recintos: Recinto[];
    selectedRecintoId?: number | null;
    setSelectedRecintoId?: (id: number | null) => void;
    onEdit?: (recinto: Recinto) => void;
    onDelete?: (recinto: Recinto) => void;
}

export const RecintosMap: React.FC<RecintosMapProps> = ({ 
    recintos, 
    selectedRecintoId, 
    setSelectedRecintoId, 
    onEdit, 
    onDelete 
}) => {
    const { isLoaded } = useGoogleMaps();
    const mapRef = React.useRef<google.maps.Map | null>(null);

    React.useEffect(() => {
        if (!mapRef.current) return;
        if (selectedRecintoId) {
            const recinto = recintos.find(r => r.id === selectedRecintoId);
            if (recinto) {
                const position = { lat: recinto.latitud, lng: recinto.longitud };
                mapRef.current.panTo(position);
                mapRef.current.setZoom(15);
            }
        }
    }, [selectedRecintoId, recintos]);

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

    const recintosToShow = selectedRecintoId
        ? recintos.filter(r => r.id === selectedRecintoId)
        : recintos;

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
                {recintos.length === 0 && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-main/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-stroke">
                        <div className="text-center">
                            <FiMapPin className="text-paragraph text-3xl mx-auto mb-3" />
                            <h3 className="text-headline font-semibold mb-2">No hay recintos registrados</h3>
                            <p className="text-paragraph text-sm">Comienza creando el primer recinto electoral</p>
                        </div>
                    </div>
                )}
                
                {recintosToShow.map((recinto) => (
                    <Marker
                        key={recinto.id}
                        position={{ lat: recinto.latitud, lng: recinto.longitud }}
                        onClick={() => setSelectedRecintoId && setSelectedRecintoId(recinto.id)}
                        options={{
                            icon: {
                                url: selectedRecintoId === recinto.id 
                                    ? 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="16" cy="16" r="16" fill="#6246ea"/>
                                            <circle cx="16" cy="16" r="8" fill="white"/>
                                        </svg>
                                    `)
                                    : 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="12" fill="#7c3aed"/>
                                            <circle cx="12" cy="12" r="6" fill="white"/>
                                        </svg>
                                    `),
                                scaledSize: new window.google.maps.Size(32, 32),
                                anchor: new window.google.maps.Point(16, 16)
                            }
                        }}
                    />
                ))}
            </GoogleMap>

            {selectedRecintoId && (
                <div className="absolute top-4 left-4 bg-main/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-stroke max-w-xs">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <FiInfo className="text-button text-sm" />
                            <h4 className="font-semibold text-headline text-sm">Recinto Seleccionado</h4>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const recinto = recintos.find(r => r.id === selectedRecintoId);
                                    if (recinto && onEdit) onEdit(recinto);
                                }}
                                className="p-1.5 rounded-full bg-white hover:bg-button/10 text-button shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-button"
                                title="Editar recinto"
                            >
                                <FiEdit2 className="text-xs" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const recinto = recintos.find(r => r.id === selectedRecintoId);
                                    if (recinto && onDelete) onDelete(recinto);
                                }}
                                className="p-1.5 rounded-full bg-white hover:bg-tertiary/10 text-tertiary shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tertiary"
                                title="Eliminar recinto"
                            >
                                <FiTrash2 className="text-xs" />
                            </button>
                        </div>
                    </div>
                    {(() => {
                        const recinto = recintos.find(r => r.id === selectedRecintoId);
                        if (!recinto) return null;
                        return (
                            <div className="space-y-1">
                                <p className="text-headline font-medium text-sm">{recinto.nombre}</p>
                                <p className="text-paragraph text-xs">
                                    Coordenadas: {recinto.latitud.toFixed(4)}, {recinto.longitud.toFixed(4)}
                                </p>
                                {recinto.descripcion && (
                                    <p className="text-paragraph text-xs line-clamp-2">{recinto.descripcion}</p>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}

            {recintos.length > 0 && (
                <div className="absolute top-4 right-4 bg-main/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-stroke">
                    <div className="flex items-center gap-2">
                        <FiMapPin className="text-button text-sm" />
                        <span className="text-headline text-sm font-medium">
                            {recintosToShow.length} recinto{recintosToShow.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}; 