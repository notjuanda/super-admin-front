import { useState, useEffect } from 'react';
import { usePartidosPoliticos } from '../../hooks/partidos-politicos/usePartidosPoliticos';
import { PartidoPoliticoCard } from '../../components/partidos-politicos/PartidoPoliticoCard';
import { PartidoPoliticoCreateModal } from '../../components/partidos-politicos/PartidoPoliticoCreateModal';
import { PartidoPoliticoEditModal } from '../../components/partidos-politicos/PartidoPoliticoEditModal';
import { ConfirmDeleteModal } from '../../../../shared/components/ConfirmDeleteModal';
import { useDeletePartidoPolitico } from '../../hooks/partidos-politicos/useDeletePartidoPolitico';
import { FiPlus, FiFlag, FiSearch, FiFilter, FiRefreshCw, FiInfo, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import type { PartidoPolitico } from '../../../core/types/sistema-administracion-electoral/partido-politico.types';

export default function PartidosPoliticosPage() {
    const { partidosPoliticos, loading, error, fetchPartidosPoliticos } = usePartidosPoliticos();
    const { deletePartido, error: deleteError, success: deleteSuccess, clearError: clearDeleteError, clearSuccess: clearDeleteSuccess } = useDeletePartidoPolitico();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPartido, setSelectedPartido] = useState<PartidoPolitico | null>(null);
    const [partidoToDelete, setPartidoToDelete] = useState<PartidoPolitico | null>(null);

    useEffect(() => {
        fetchPartidosPoliticos();
    }, [fetchPartidosPoliticos]);

    useEffect(() => {
        if (deleteSuccess) {
            fetchPartidosPoliticos();
            setShowDeleteModal(false);
            setPartidoToDelete(null);
            clearDeleteSuccess();
        }
    }, [deleteSuccess, fetchPartidosPoliticos, clearDeleteSuccess]);

    const handleCreateSuccess = () => {
        fetchPartidosPoliticos();
        setShowCreateModal(false);
    };

    const handleEditSuccess = () => {
        fetchPartidosPoliticos();
        setShowEditModal(false);
        setSelectedPartido(null);
    };

    const handleEdit = (partido: PartidoPolitico) => {
        setSelectedPartido(partido);
        setShowEditModal(true);
    };

    const handleDelete = (partido: PartidoPolitico) => {
        setPartidoToDelete(partido);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (partidoToDelete) {
            try {
                await deletePartido(partidoToDelete.id);
            } catch (error) {
                
            }
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPartidoToDelete(null);
        clearDeleteError();
        clearDeleteSuccess();
    };

    const filteredPartidos = partidosPoliticos.filter(partido => {
        const matchesSearch = 
            partido.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partido.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partido.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEstado = filterEstado === '' || partido.estado.toLowerCase() === filterEstado.toLowerCase();
        return matchesSearch && matchesEstado;
    });

    const totalPartidos = partidosPoliticos.length;
    const partidosActivos = partidosPoliticos.filter(p => p.estado.toLowerCase() === 'activo').length;
    const partidosInactivos = partidosPoliticos.filter(p => p.estado.toLowerCase() === 'inactivo').length;
    const partidosSuspendidos = partidosPoliticos.filter(p => p.estado.toLowerCase() === 'suspendido').length;

    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl text-headline font-bold mb-2">Gestión de Partidos Políticos</h1>
                    <p className="text-paragraph">Administra los partidos políticos del sistema electoral</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText shadow-lg transition-all duration-200 font-semibold flex items-center gap-2 hover:shadow-xl"
                    title="Crear partido político"
                >
                    <FiPlus className="text-lg" />
                    Crear Partido
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-button/10 rounded-full">
                            <FiFlag className="text-button text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-sm">Total Partidos</p>
                            <p className="text-headline text-2xl font-bold">{totalPartidos}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-full">
                            <FiCheckCircle className="text-green-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-sm">Activos</p>
                            <p className="text-headline text-2xl font-bold">{partidosActivos}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gray-100 rounded-full">
                            <FiXCircle className="text-gray-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-sm">Inactivos</p>
                            <p className="text-headline text-2xl font-bold">{partidosInactivos}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-full">
                            <FiClock className="text-orange-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-sm">Suspendidos</p>
                            <p className="text-headline text-2xl font-bold">{partidosSuspendidos}</p>
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
                            placeholder="Buscar por nombre, sigla o descripción..."
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
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                            <option value="suspendido">Suspendido</option>
                        </select>
                    </div>
                    <button
                        onClick={() => fetchPartidosPoliticos()}
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
                        <p className="text-paragraph">Cargando partidos políticos...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center">
                    <p className="text-tertiary font-semibold">Error al cargar partidos políticos</p>
                    <p className="text-tertiary text-sm mt-2">{error}</p>
                </div>
            )}

            {deleteError && (
                <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center mb-6">
                    <p className="text-tertiary font-semibold">Error al eliminar partido político</p>
                    <p className="text-tertiary text-sm mt-2">{deleteError}</p>
                    <button
                        onClick={clearDeleteError}
                        className="mt-3 px-4 py-2 rounded-lg bg-tertiary text-white hover:bg-tertiary/90 transition-colors text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="bg-main rounded-xl shadow-md border border-stroke p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-headline">Lista de Partidos Políticos</h2>
                        <div className="flex items-center gap-2 text-sm text-paragraph">
                            <FiInfo className="text-xs" />
                            <span>{filteredPartidos.length} partido{filteredPartidos.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {filteredPartidos.length === 0 ? (
                        <div className="text-center py-12">
                            <FiFlag className="text-paragraph text-4xl mx-auto mb-4" />
                            <h3 className="text-headline font-semibold mb-2">
                                {searchTerm || filterEstado ? 'No se encontraron partidos políticos' : 'No hay partidos políticos registrados'}
                            </h3>
                            <p className="text-paragraph text-sm mb-4">
                                {searchTerm || filterEstado 
                                    ? 'Intenta ajustar los filtros de búsqueda'
                                    : 'Comienza registrando el primer partido político del sistema'
                                }
                            </p>
                            {!searchTerm && !filterEstado && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText transition-all duration-200 font-semibold"
                                >
                                    Registrar Primer Partido
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredPartidos.map(partido => (
                                <PartidoPoliticoCard
                                    key={partido.id}
                                    partido={partido}
                                    onEdit={() => handleEdit(partido)}
                                    onDelete={() => handleDelete(partido)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <PartidoPoliticoCreateModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={handleCreateSuccess}
            />

            <PartidoPoliticoEditModal
                open={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedPartido(null);
                }}
                onUpdated={handleEditSuccess}
                partido={selectedPartido}
            />

            <ConfirmDeleteModal
                open={showDeleteModal}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
                title="Eliminar Partido Político"
                message={`¿Estás seguro de que quieres eliminar el partido político "${partidoToDelete?.nombre}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
} 