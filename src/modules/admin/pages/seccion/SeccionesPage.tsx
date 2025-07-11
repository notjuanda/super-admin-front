import { useState } from 'react';
import { useSecciones } from '../../hooks/seccion/useSecciones';
import { useDeleteSeccion } from '../../hooks/seccion/useDeleteSeccion';
import { SeccionesMap } from '../../components/seccion/SeccionesMap';
import { FiPlus, FiMap, FiSearch, FiFilter, FiRefreshCw, FiInfo, FiX } from 'react-icons/fi';
import { SeccionCreateModal } from '../../components/seccion/SeccionCreateModal';
import { SeccionEditModal } from '../../components/seccion/SeccionEditModal';

import type { Seccion } from '../../../core/types/sistema-administracion-electoral/seccion.types';

const ConfirmDeleteModal: React.FC<{
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
}> = ({ open, onConfirm, onCancel, title = '¿Estás seguro?', message = 'Esta acción no se puede deshacer.' }) => {
    if (!open) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-main rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-tertiary/10 rounded-full">
                            <FiInfo className="text-tertiary text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-headline">{title}</h3>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                    >
                        <FiX className="text-paragraph text-lg" />
                    </button>
                </div>
                
                <div className="text-paragraph mb-8 leading-relaxed">
                    {message}
                </div>
                
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-6 py-3 rounded-lg bg-secondary text-headline hover:bg-secondary/80 transition-all duration-200 font-semibold min-w-[100px]"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-3 rounded-lg bg-tertiary text-buttonText hover:bg-tertiary/90 transition-all duration-200 font-semibold min-w-[100px] shadow-sm hover:shadow-md"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function SeccionesPage() {
    const { secciones, loading, error, refetch } = useSecciones();
    const { remove: deleteSeccion } = useDeleteSeccion();
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedSeccion, setSelectedSeccion] = useState<Seccion | null>(null);
    const [selectedSeccionId, setSelectedSeccionId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('');

    const handleCreated = () => {
        setShowCreate(false);
        refetch();
    };

    const handleEdit = (seccion: Seccion) => {
        setSelectedSeccion(seccion);
        setShowEdit(true);
    };

    const handleDelete = (seccion: Seccion) => {
        setSelectedSeccion(seccion);
        setShowDelete(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedSeccion) return;
        
        const success = await deleteSeccion(selectedSeccion.id);
        if (success) {
            setShowDelete(false);
            setSelectedSeccion(null);
            setSelectedSeccionId(null);
            refetch();
        }
    };

    const handleUpdated = () => {
        setShowEdit(false);
        setSelectedSeccion(null);
        refetch();
    };

    const filteredSecciones = secciones.filter(seccion => {
        const matchesSearch = seccion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (seccion.descripcion && seccion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesEstado = filterEstado === '' || seccion.estado === filterEstado;
        return matchesSearch && matchesEstado;
    });

    const totalSecciones = secciones.length;
    const seccionesActivas = secciones.filter(s => s.estado === 'activa').length;
    const seccionesInactivas = secciones.filter(s => s.estado === 'inactiva').length;
    const seccionesConPuntos = secciones.filter(s => s.puntos && s.puntos.length > 0).length;

    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl text-headline font-bold mb-2">Gestión de Secciones</h1>
                    <p className="text-paragraph">Administra las secciones electorales del sistema</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText shadow-lg transition-all duration-200 font-semibold flex items-center gap-2 hover:shadow-xl"
                    title="Crear sección"
                >
                    <FiPlus className="text-lg" />
                    Crear Sección
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-button/10 rounded-full">
                            <FiMap className="text-button text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-sm">Total Secciones</p>
                            <p className="text-headline text-2xl font-bold">{totalSecciones}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-full">
                            <FiMap className="text-green-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-sm">Secciones Activas</p>
                            <p className="text-headline text-2xl font-bold">{seccionesActivas}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-full">
                            <FiMap className="text-orange-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-sm">Secciones Inactivas</p>
                            <p className="text-headline text-2xl font-bold">{seccionesInactivas}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <FiMap className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-sm">Con Puntos</p>
                            <p className="text-headline text-2xl font-bold">{seccionesConPuntos}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-main rounded-xl p-6 shadow-md border border-stroke mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph" />
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="pl-10 pr-8 py-3 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent transition-colors appearance-none bg-white"
                        >
                            <option value="">Todos los estados</option>
                            <option value="activa">Activa</option>
                            <option value="inactiva">Inactiva</option>
                        </select>
                    </div>
                    <button
                        onClick={() => refetch()}
                        disabled={loading}
                        className="px-6 py-3 rounded-lg bg-secondary text-headline hover:bg-secondary/80 transition-all duration-200 font-semibold flex items-center gap-2 disabled:opacity-50"
                    >
                        <FiRefreshCw className={`text-lg ${loading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-button border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-paragraph">Cargando secciones...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center">
                    <p className="text-tertiary font-semibold">Error al cargar secciones</p>
                    <p className="text-tertiary text-sm mt-2">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Mapa */}
                    <div className="lg:col-span-2">
                        <div className="bg-main rounded-xl shadow-md border border-stroke overflow-hidden">
                            <div className="p-6 border-b border-stroke">
                                <h2 className="text-xl font-bold text-headline mb-2">Visualización de Secciones</h2>
                                <p className="text-paragraph text-sm">Haz clic en una sección para ver sus detalles</p>
                            </div>
                            <div className="relative">
                                <SeccionesMap 
                                    secciones={filteredSecciones} 
                                    selectedSeccionId={selectedSeccionId} 
                                    setSelectedSeccionId={setSelectedSeccionId}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-main rounded-xl shadow-md border border-stroke p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-headline">Lista de Secciones</h3>
                            <div className="flex items-center gap-2 text-sm text-paragraph">
                                <FiInfo className="text-xs" />
                                <span>{filteredSecciones.length} secciones</span>
                            </div>
                        </div>

                        {filteredSecciones.length === 0 ? (
                            <div className="text-center py-8">
                                <FiMap className="text-paragraph text-3xl mx-auto mb-3" />
                                <h4 className="text-headline font-semibold mb-2">
                                    {searchTerm || filterEstado ? 'No se encontraron secciones' : 'No hay secciones registradas'}
                                </h4>
                                <p className="text-paragraph text-sm">
                                    {searchTerm || filterEstado 
                                        ? 'Intenta ajustar los filtros de búsqueda'
                                        : 'Comienza creando la primera sección del sistema'
                                    }
                                </p>
                                {!searchTerm && !filterEstado && (
                                    <button
                                        onClick={() => setShowCreate(true)}
                                        className="mt-4 px-4 py-2 rounded-lg bg-button hover:bg-highlight text-buttonText transition-all duration-200 text-sm font-semibold"
                                    >
                                        Crear Primera Sección
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {filteredSecciones.map(seccion => (
                                    <button
                                        key={seccion.id}
                                        onClick={() => setSelectedSeccionId(selectedSeccionId === seccion.id ? null : seccion.id)}
                                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 border ${
                                            selectedSeccionId === seccion.id 
                                                ? 'bg-button/10 border-button shadow-md' 
                                                : 'bg-secondary/30 border-stroke hover:bg-secondary/50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-headline truncate">{seccion.nombre}</h4>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                seccion.estado === 'activa' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-orange-100 text-orange-700'
                                            }`}>
                                                {seccion.estado}
                                            </span>
                                        </div>
                                        {seccion.descripcion && (
                                            <p className="text-paragraph text-sm mb-2 line-clamp-2">{seccion.descripcion}</p>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-paragraph">
                                            <span>ID: {seccion.id}</span>
                                            <span>•</span>
                                            <span>{seccion.puntos?.length || 0} puntos</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <SeccionCreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={handleCreated} />
            
            <SeccionEditModal 
                open={showEdit} 
                onClose={() => setShowEdit(false)} 
                onUpdated={handleUpdated}
                seccion={selectedSeccion}
            />
            
            <ConfirmDeleteModal
                open={showDelete}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDelete(false)}
                title="¿Eliminar sección?"
                message={`¿Estás seguro de que deseas eliminar la sección "${selectedSeccion?.nombre}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
} 