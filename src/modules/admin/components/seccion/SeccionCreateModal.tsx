import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateSeccion } from '../../hooks/seccion/useCreateSeccion';
import { seccionCreateSchema } from '../../schemas/secciones/seccionCreate.schema';
import type { SeccionCreateForm } from '../../schemas/secciones/seccionCreate.schema';
import { GoogleMap, Polygon } from '@react-google-maps/api';
import { useGoogleMaps } from '../../../core/hooks/useGoogleMaps';
import { FiMap, FiX, FiPlus, FiTrash2, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface SeccionCreateModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export const SeccionCreateModal: React.FC<SeccionCreateModalProps> = ({ open, onClose, onCreated }) => {
  const { create, loading, error, success, setSuccess } = useCreateSeccion();
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<SeccionCreateForm>({
    resolver: zodResolver(seccionCreateSchema),
    defaultValues: { puntos: [] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'puntos' });
  const { isLoaded } = useGoogleMaps();
  const initialCenter = { lat: -17.783327, lng: -63.18213 };
  const [mapCenter] = React.useState(initialCenter);

  React.useEffect(() => {
    if (success) {
      onCreated?.();
      reset();
      onClose();
      setSuccess(null);
    }
  }, [success, onCreated, onClose, reset, setSuccess]);

  React.useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  if (!open) return null;

  const handleCreate = (data: SeccionCreateForm) => {
    const dto = {
      ...data,
      descripcion: data.descripcion ?? '',
      puntos: data.puntos.map((p, idx) => ({
        latitud: String(p.latitud),
        longitud: String(p.longitud),
        orden: String(p.orden),
      })),
    };
    return create(dto as any);
  };

  const polygonPath = fields
    .filter((p) => 'latitud' in p && 'longitud' in p && !isNaN(Number((p as any).latitud)) && !isNaN(Number((p as any).longitud)))
    .map((p) => ({
      lat: Number((p as any).latitud),
      lng: Number((p as any).longitud),
    }));

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    append({
      latitud: String(e.latLng.lat()),
      longitud: String(e.latLng.lng()),
      orden: String(fields.length + 1),
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-main rounded-2xl shadow-2xl p-8 w-full max-w-4xl mx-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-button/10 rounded-full">
              <FiMap className="text-button text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-headline">Crear Nueva Sección</h3>
              <p className="text-sm text-paragraph">Define el área geográfica de la sección electoral</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <FiX className="text-paragraph text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-headline mb-2">
                Nombre de la sección
              </label>
              <input 
                {...register('nombre')} 
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                  errors.nombre ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                }`} 
                placeholder="Ej: Sección Centro"
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
                Estado
              </label>
              <select 
                {...register('estado')} 
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                  errors.estado ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
                }`}
              >
                <option value="">Selecciona estado</option>
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
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
              Descripción (opcional)
            </label>
            <textarea 
              {...register('descripcion')} 
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-button focus:border-transparent ${
                errors.descripcion ? 'border-tertiary bg-tertiary/10' : 'border-stroke hover:border-paragraph'
              }`} 
              placeholder="Describe la ubicación o características de la sección"
            />
            {errors.descripcion && (
              <div className="flex items-center gap-1 mt-1 text-tertiary text-sm">
                <FiAlertCircle className="text-xs" />
                {errors.descripcion.message}
              </div>
            )}
          </div>

          {/* Map Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-headline mb-1">Dibuja la sección en el mapa</h4>
                <p className="text-sm text-paragraph">Haz clic en el mapa para agregar puntos del polígono</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-paragraph">
                <FiInfo className="text-xs" />
                <span>Mínimo 3 puntos</span>
              </div>
            </div>

            <div className="w-full h-80 rounded-xl overflow-hidden border-2 border-stroke shadow-lg">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={mapCenter}
                  zoom={polygonPath.length ? 15 : 12}
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
                  {polygonPath.length > 0 && (
                    <Polygon
                      path={polygonPath}
                      options={{
                        fillColor: '#6246ea',
                        fillOpacity: 0.3,
                        strokeColor: '#6246ea',
                        strokeOpacity: 0.8,
                        strokeWeight: 3,
                        clickable: false,
                        zIndex: 1,
                      }}
                    />
                  )}
                </GoogleMap>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-button border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-paragraph">Cargando mapa...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Points List */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-headline">Puntos agregados ({fields.length})</h5>
                {fields.length > 0 && (
                  <button
                    type="button"
                    onClick={() => fields.forEach((_, index) => remove(index))}
                    className="text-tertiary hover:text-tertiary/80 text-sm font-medium flex items-center gap-1"
                  >
                    <FiTrash2 className="text-xs" />
                    Limpiar todos
                  </button>
                )}
              </div>

              {fields.length === 0 ? (
                <div className="text-center py-6 bg-secondary rounded-lg border-2 border-dashed border-stroke">
                  <FiMap className="text-paragraph text-2xl mx-auto mb-2" />
                  <p className="text-paragraph text-sm">No hay puntos agregados</p>
                  <p className="text-paragraph/60 text-xs">Haz clic en el mapa para agregar puntos</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {fields.map((field, idx) => (
                    <div key={field.id} className="flex items-center justify-between p-3 bg-button/10 rounded-lg border border-button/20">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-button text-buttonText rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Lat:</span> {(field as any).latitud}
                          <span className="mx-2">•</span>
                          <span className="font-medium">Lng:</span> {(field as any).longitud}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="p-1 text-tertiary hover:text-tertiary/80 hover:bg-tertiary/10 rounded transition-colors"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {fields.length > 0 && fields.length < 3 && (
                <div className="flex items-center gap-2 mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <FiAlertCircle className="text-yellow-600 flex-shrink-0" />
                  <span className="text-yellow-700 text-sm">
                    Necesitas agregar al menos 3 puntos para crear una sección válida
                  </span>
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
              <span className="text-green-700 text-sm">Sección creada exitosamente</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-stroke">
            <button 
              type="button" 
              onClick={handleClose} 
              className="px-6 py-3 rounded-lg bg-secondary text-headline hover:bg-secondary/80 transition-all duration-200 font-semibold min-w-[100px]"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || fields.length < 3} 
              className="px-6 py-3 rounded-lg bg-button text-buttonText hover:bg-highlight transition-all duration-200 font-semibold min-w-[100px] shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-buttonText border-t-transparent rounded-full animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <FiMap className="text-sm" />
                  Crear Sección
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 