import { useState, useEffect } from 'react';
import { useElecciones } from '../../hooks/elecciones/useElecciones';
import { useDeleteEleccion } from '../../hooks/elecciones/useDeleteEleccion';
import { EleccionCard } from '../../components/elecciones/EleccionCard';
import { EleccionCreateModal } from '../../components/elecciones/EleccionCreateModal';
import { EleccionEditModal } from '../../components/elecciones/EleccionEditModal';
import { FiPlus, FiFlag, FiSearch, FiFilter, FiRefreshCw, FiInfo, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi';
import type { Eleccion } from '../../../core/types/sistema-administracion-electoral/eleccion.types';
import { ConfirmDeleteModal } from '../../../../shared/components/ConfirmDeleteModal';

export default function EleccionesPage() {
    const { elecciones, loading, error, fetchElecciones } = useElecciones();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [filterTipo, setFilterTipo] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEleccion, setSelectedEleccion] = useState<Eleccion | null>(null);
    const { remove: deleteEleccion, error: deleteError, success: deleteSuccess, clearError: clearDeleteError, clearSuccess: clearDeleteSuccess } = useDeleteEleccion();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eleccionToDelete, setEleccionToDelete] = useState<Eleccion | null>(null);

    useEffect(() => {
        fetchElecciones();
    }, [fetchElecciones]);

    useEffect(() => {
        if (deleteSuccess) {
            fetchElecciones();
            setShowDeleteModal(false);
            setEleccionToDelete(null);
            clearDeleteSuccess();
        }
    }, [deleteSuccess, fetchElecciones, clearDeleteSuccess]);

    const handleCreateSuccess = () => {
        fetchElecciones();
        setShowCreateModal(false);
    };

    const handleEditSuccess = () => {
        fetchElecciones();
        setShowEditModal(false);
        setSelectedEleccion(null);
    };

    const handleEdit = (eleccion: Eleccion) => {
        setSelectedEleccion(eleccion);
        setShowEditModal(true);
    };

    const handleDelete = (eleccion: Eleccion) => {
        setEleccionToDelete(eleccion);
        setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setEleccionToDelete(null);
        clearDeleteError();
        clearDeleteSuccess();
    };

    const handleConfirmDelete = async () => {
        if (eleccionToDelete) {
            await deleteEleccion(eleccionToDelete.id);
            setShowDeleteModal(false);
            setEleccionToDelete(null);
            fetchElecciones();
            clearDeleteError();
            clearDeleteSuccess();
        }
    };

    const filteredElecciones = elecciones.filter(eleccion => {
        const matchesSearch = 
            eleccion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            eleccion.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEstado = filterEstado === '' || eleccion.estado.toLowerCase() === filterEstado.toLowerCase();
        const matchesTipo = filterTipo === '' || eleccion.tipo.toLowerCase() === filterTipo.toLowerCase();
        return matchesSearch && matchesEstado && matchesTipo;
    });

    const totalElecciones = elecciones.length;
    const eleccionesActivas = elecciones.filter(e => e.estado.toLowerCase() === 'activa').length;
    const eleccionesInactivas = elecciones.filter(e => e.estado.toLowerCase() === 'inactiva').length;
    const eleccionesFinalizadas = elecciones.filter(e => e.estado.toLowerCase() === 'finalizada').length;

    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display text-2xl sm:text-3xl text-headline font-bold mb-2">Gestión de Elecciones</h1>
                    <p className="text-paragraph text-sm sm:text-base">Administra las elecciones del sistema electoral</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2 hover:shadow-xl"
                    title="Crear elección"
                >
                    <FiPlus className="text-lg" />
                    <span className="hidden sm:inline">Crear Elección</span>
                    <span className="sm:hidden">Crear</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-button/10 rounded-full">
                            <FiFlag className="text-button text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Total Elecciones</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{totalElecciones}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                            <FiCheckCircle className="text-green-600 text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Activas</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{eleccionesActivas}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-gray-100 rounded-full">
                            <FiClock className="text-gray-600 text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Inactivas</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{eleccionesInactivas}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                            <FiCalendar className="text-blue-600 text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Finalizadas</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{eleccionesFinalizadas}</p>
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
                            <option value="pendiente">Pendiente</option>
                            <option value="finalizada">Finalizada</option>
                        </select>
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph" />
                        <select
                            value={filterTipo}
                            onChange={(e) => setFilterTipo(e.target.value)}
                            className="pl-10 pr-8 py-3 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent transition-colors appearance-none bg-white"
                        >
                            <option value="">Todos los tipos</option>
                            <option value="presidencial">Presidencial</option>
                            <option value="municipal">Municipal</option>
                            <option value="departamental">Departamental</option>
                            <option value="nacional">Nacional</option>
                            <option value="referendum">Referéndum</option>
                        </select>
                    </div>
                    <button
                        onClick={() => fetchElecciones()}
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
                        <p className="text-paragraph">Cargando elecciones...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center">
                    <p className="text-tertiary font-semibold">Error al cargar elecciones</p>
                    <p className="text-tertiary text-sm mt-2">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-headline">Lista de Elecciones</h2>
                        <div className="flex items-center gap-2 text-sm text-paragraph">
                            <FiInfo className="text-xs" />
                            <span>{filteredElecciones.length} elección{filteredElecciones.length !== 1 ? 'es' : ''}</span>
                        </div>
                    </div>

                    {filteredElecciones.length === 0 ? (
                        <div className="text-center py-12">
                            <FiFlag className="text-paragraph text-4xl mx-auto mb-4" />
                            <h3 className="text-headline font-semibold mb-2">
                                {searchTerm || filterEstado || filterTipo ? 'No se encontraron elecciones' : 'No hay elecciones registradas'}
                            </h3>
                            <p className="text-paragraph text-sm">
                                {searchTerm || filterEstado || filterTipo 
                                    ? 'Intenta ajustar los filtros de búsqueda'
                                    : 'Comienza creando la primera elección del sistema'
                                }
                            </p>
                            {!searchTerm && !filterEstado && !filterTipo && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="mt-4 px-4 py-2 rounded-lg bg-button hover:bg-highlight text-buttonText transition-all duration-200 text-sm font-semibold"
                                >
                                    Crear Primera Elección
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {filteredElecciones.map(eleccion => (
                                <EleccionCard
                                    key={eleccion.id}
                                    eleccion={eleccion}
                                    onEdit={() => handleEdit(eleccion)}
                                    onDelete={() => handleDelete(eleccion)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TODO: Agregar modales cuando estén creados */}
            <EleccionCreateModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={handleCreateSuccess}
            />

            <EleccionEditModal
                open={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedEleccion(null);
                }}
                onUpdated={handleEditSuccess}
                eleccion={selectedEleccion}
            />

            <ConfirmDeleteModal
                open={showDeleteModal}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Eliminar Elección"
                message={`¿Estás seguro de que quieres eliminar la elección "${eleccionToDelete?.nombre}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
} 