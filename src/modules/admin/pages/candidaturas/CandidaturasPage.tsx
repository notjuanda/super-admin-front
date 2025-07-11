import { useState, useEffect } from 'react';
import { useCandidaturas } from '../../hooks/candidaturas/useCandidaturas';
import { useElecciones } from '../../hooks/elecciones/useElecciones';
import { useCargos } from '../../hooks/cargos/useCargos';
import { usePartidosPoliticos } from '../../hooks/partidos-politicos/usePartidosPoliticos';
import { CandidaturaCard } from '../../components/candidaturas/CandidaturaCard';
import { CandidaturaCreateModal } from '../../components/candidaturas/CandidaturaCreateModal';
import { CandidaturaEditModal } from '../../components/candidaturas/CandidaturaEditModal';
import { ConfirmDeleteModal } from '../../../../shared/components/ConfirmDeleteModal';
import { useDeleteCandidatura } from '../../hooks/candidaturas/useDeleteCandidatura';
import { FiPlus, FiFlag, FiSearch, FiFilter, FiRefreshCw, FiInfo } from 'react-icons/fi';
import type { Candidatura } from '../../../core/types/sistema-administracion-electoral/candidatura.types';

export default function CandidaturasPage() {
    const { candidaturas, loading, error, fetchCandidaturas } = useCandidaturas();
    const { elecciones } = useElecciones();
    const { cargos } = useCargos();
    const { partidosPoliticos } = usePartidosPoliticos();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEleccion, setFilterEleccion] = useState('');
    const [filterCargo, setFilterCargo] = useState('');
    const [filterPartido, setFilterPartido] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCandidatura, setSelectedCandidatura] = useState<Candidatura | null>(null);
    const { remove: deleteCandidatura, error: deleteError, success: deleteSuccess, clearError: clearDeleteError, clearSuccess: clearDeleteSuccess } = useDeleteCandidatura();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [candidaturaToDelete, setCandidaturaToDelete] = useState<Candidatura | null>(null);

    useEffect(() => {
        fetchCandidaturas();
    }, [fetchCandidaturas]);

    useEffect(() => {
        if (deleteSuccess) {
            fetchCandidaturas();
            setShowDeleteModal(false);
            setCandidaturaToDelete(null);
            clearDeleteSuccess();
        }
    }, [deleteSuccess, fetchCandidaturas, clearDeleteSuccess]);

    const handleCreateSuccess = () => {
        fetchCandidaturas();
        setShowCreateModal(false);
    };

    const handleEditSuccess = () => {
        fetchCandidaturas();
        setShowEditModal(false);
        setSelectedCandidatura(null);
    };

    const handleEdit = (candidatura: Candidatura) => {
        setSelectedCandidatura(candidatura);
        setShowEditModal(true);
    };

    const handleDelete = (candidatura: Candidatura) => {
        setCandidaturaToDelete(candidatura);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (candidaturaToDelete) {
            try {
                await deleteCandidatura(candidaturaToDelete.id);
            } catch (error) {}
        }
    };

    const filteredCandidaturas = candidaturas.filter(candidatura => {
        const matchesSearch =
            candidatura.id.toString().includes(searchTerm.toLowerCase()) ||
            candidatura.eleccionId.toString().includes(searchTerm.toLowerCase()) ||
            candidatura.cargoId.toString().includes(searchTerm.toLowerCase()) ||
            candidatura.partidoId.toString().includes(searchTerm.toLowerCase());
        const matchesEleccion = filterEleccion ? candidatura.eleccionId === Number(filterEleccion) : true;
        const matchesCargo = filterCargo ? candidatura.cargoId === Number(filterCargo) : true;
        const matchesPartido = filterPartido ? candidatura.partidoId === Number(filterPartido) : true;
        return matchesSearch && matchesEleccion && matchesCargo && matchesPartido;
    });

    const totalCandidaturas = candidaturas.length;
    const totalPorEleccion = elecciones.map(e => ({ eleccion: e, count: candidaturas.filter(c => c.eleccionId === e.id).length }));
    const totalPorCargo = cargos.map(ca => ({ cargo: ca, count: candidaturas.filter(c => c.cargoId === ca.id).length }));
    const totalPorPartido = partidosPoliticos.map(p => ({ partido: p, count: candidaturas.filter(c => c.partidoId === p.id).length }));

    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-2 sm:px-4 flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display text-2xl sm:text-3xl text-headline font-bold mb-2">Gestión de Candidaturas</h1>
                    <p className="text-paragraph text-sm sm:text-base">Administra las candidaturas del sistema electoral</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2 hover:shadow-xl"
                    title="Crear candidatura"
                >
                    <FiPlus className="text-lg" />
                    <span className="hidden sm:inline">Crear Candidatura</span>
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
                            <p className="text-paragraph text-xs sm:text-sm">Total Candidaturas</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{totalCandidaturas}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                            <FiFlag className="text-green-600 text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Por Elección</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{totalPorEleccion.map(e => `${e.eleccion.nombre}: ${e.count}`).join(', ')}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                            <FiFlag className="text-blue-600 text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Por Cargo</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{totalPorCargo.map(ca => `${ca.cargo.nombre}: ${ca.count}`).join(', ')}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-orange-100 rounded-full">
                            <FiFlag className="text-orange-600 text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Por Partido</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{totalPorPartido.map(p => `${p.partido.nombre}: ${p.count}`).join(', ')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph" />
                        <input
                            type="text"
                            placeholder="Buscar por ID, elección, cargo o partido..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent transition-colors"
                        />
                    </div>
                    <div className="relative w-full md:w-auto">
                        <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph" />
                        <select
                            value={filterEleccion}
                            onChange={(e) => setFilterEleccion(e.target.value)}
                            className="w-full md:w-auto pl-10 pr-8 py-3 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent transition-colors appearance-none bg-white"
                        >
                            <option value="">Todas las elecciones</option>
                            {elecciones.map(eleccion => (
                                <option key={eleccion.id} value={eleccion.id.toString()}>
                                    {eleccion.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph" />
                        <select
                            value={filterCargo}
                            onChange={(e) => setFilterCargo(e.target.value)}
                            className="w-full md:w-auto pl-10 pr-8 py-3 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent transition-colors appearance-none bg-white"
                        >
                            <option value="">Todos los cargos</option>
                            {cargos.map(cargo => (
                                <option key={cargo.id} value={cargo.id.toString()}>
                                    {cargo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph" />
                        <select
                            value={filterPartido}
                            onChange={(e) => setFilterPartido(e.target.value)}
                            className="w-full md:w-auto pl-10 pr-8 py-3 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent transition-colors appearance-none bg-white"
                        >
                            <option value="">Todos los partidos</option>
                            {partidosPoliticos.map(partido => (
                                <option key={partido.id} value={partido.id.toString()}>
                                    {partido.nombre} ({partido.sigla})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => fetchCandidaturas()}
                        disabled={loading}
                        className="w-full md:w-auto px-6 py-3 rounded-lg bg-secondary text-headline hover:bg-secondary/80 transition-all duration-200 font-semibold flex items-center gap-2 disabled:opacity-50"
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
                        <p className="text-paragraph">Cargando candidaturas...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center">
                    <p className="text-tertiary font-semibold">Error al cargar candidaturas</p>
                    <p className="text-tertiary text-sm mt-2">{error}</p>
                </div>
            )}

            {deleteError && (
                <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center mb-6">
                    <p className="text-tertiary font-semibold">Error al eliminar candidatura</p>
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
                        <h2 className="text-xl font-bold text-headline">Lista de Candidaturas</h2>
                        <div className="flex items-center gap-2 text-sm text-paragraph">
                            <FiInfo className="text-xs" />
                            <span>{filteredCandidaturas.length} candidatura{filteredCandidaturas.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {filteredCandidaturas.length === 0 ? (
                        <div className="text-center py-12">
                            <FiFlag className="text-paragraph text-4xl mx-auto mb-4" />
                            <h3 className="text-headline font-semibold mb-2">
                                {searchTerm || filterEleccion || filterCargo || filterPartido ? 'No se encontraron candidaturas' : 'No hay candidaturas registradas'}
                            </h3>
                            <p className="text-paragraph text-sm mb-4">
                                {searchTerm || filterEleccion || filterCargo || filterPartido
                                    ? 'Intenta ajustar los filtros de búsqueda'
                                    : 'Comienza creando la primera candidatura del sistema'
                                }
                            </p>
                            {!searchTerm && !filterEleccion && !filterCargo && !filterPartido && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText transition-all duration-200 font-semibold"
                                >
                                    Registrar Primera Candidatura
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {filteredCandidaturas.map(candidatura => (
                                <CandidaturaCard
                                    key={candidatura.id}
                                    candidatura={candidatura}
                                    onEdit={() => handleEdit(candidatura)}
                                    onDelete={() => handleDelete(candidatura)}
                                    elecciones={elecciones}
                                    cargos={cargos}
                                    partidos={partidosPoliticos}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <CandidaturaCreateModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onCreated={handleCreateSuccess} elecciones={elecciones} cargos={cargos} partidos={partidosPoliticos} />
            <CandidaturaEditModal open={showEditModal} onClose={() => { setShowEditModal(false); setSelectedCandidatura(null); }} onUpdated={handleEditSuccess} candidatura={selectedCandidatura} elecciones={elecciones} cargos={cargos} partidos={partidosPoliticos} />
            <ConfirmDeleteModal open={showDeleteModal} onCancel={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} title="Eliminar candidatura" message="¿Estás seguro de que deseas eliminar esta candidatura?" />
        </div>
    );
} 