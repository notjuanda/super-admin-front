import { useState, useEffect } from 'react';
import { useCandidatos } from '../../hooks/candidatos/useCandidatos';
import { usePartidosPoliticos } from '../../hooks/partidos-politicos/usePartidosPoliticos';
import { CandidatoCard } from '../../components/candidatos/CandidatoCard';
import { CandidatoCreateModal } from '../../components/candidatos/CandidatoCreateModal';
import { CandidatoEditModal } from '../../components/candidatos/CandidatoEditModal';
import { FiPlus, FiUser, FiSearch, FiFilter, FiRefreshCw, FiInfo, FiUsers, FiImage, FiCreditCard } from 'react-icons/fi';
import type { Candidato } from '../../../core/types/sistema-administracion-electoral/candidato.types';
import { ConfirmDeleteModal } from '../../../../shared/components/ConfirmDeleteModal';
import { useDeleteCandidato } from '../../hooks/candidatos/useDeleteCandidato';

export default function CandidatosPage() {
    const { candidatos, loading, error, fetchCandidatos } = useCandidatos();
    const { partidosPoliticos } = usePartidosPoliticos();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPartido, setFilterPartido] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null);
    const { remove: deleteCandidato, error: deleteError, success: deleteSuccess, clearError: clearDeleteError, clearSuccess: clearDeleteSuccess } = useDeleteCandidato();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [candidatoToDelete, setCandidatoToDelete] = useState<Candidato | null>(null);

    useEffect(() => {
        fetchCandidatos();
    }, [fetchCandidatos]);

    useEffect(() => {
        if (deleteSuccess) {
            fetchCandidatos();
            setShowDeleteModal(false);
            setCandidatoToDelete(null);
            clearDeleteSuccess();
        }
    }, [deleteSuccess, fetchCandidatos, clearDeleteSuccess]);

    const handleCreateSuccess = () => {
        fetchCandidatos();
        setShowCreateModal(false);
    };

    const handleEditSuccess = () => {
        fetchCandidatos();
        setShowEditModal(false);
        setSelectedCandidato(null);
    };

    const handleEdit = (candidato: Candidato) => {
        setSelectedCandidato(candidato);
        setShowEditModal(true);
    };

    const handleDelete = (candidato: Candidato) => {
        setCandidatoToDelete(candidato);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (candidatoToDelete) {
            try {
                await deleteCandidato(candidatoToDelete.id);
            } catch (error) {
                
            }
        }
    };

    const filteredCandidatos = candidatos.filter(candidato => {
        const matchesSearch = 
            candidato.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidato.apellidoPaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidato.apellidoMaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidato.cedula.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const totalCandidatos = candidatos.length;
    const candidatosConFoto = candidatos.filter(c => c.fotoUrl).length;
    const candidatosSinFoto = candidatos.filter(c => !c.fotoUrl).length;
    const partidosUnicos = 0;

    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display text-2xl sm:text-3xl text-headline font-bold mb-2">Gestión de Candidatos</h1>
                    <p className="text-paragraph text-sm sm:text-base">Administra los candidatos del sistema electoral</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2 hover:shadow-xl"
                    title="Crear candidato"
                >
                    <FiPlus className="text-lg" />
                    <span className="hidden sm:inline">Crear Candidato</span>
                    <span className="sm:hidden">Crear</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-button/10 rounded-full">
                            <FiUsers className="text-button text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Total Candidatos</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{totalCandidatos}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                            <FiImage className="text-green-600 text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Con Foto</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{candidatosConFoto}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-orange-100 rounded-full">
                            <FiUser className="text-orange-600 text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Sin Foto</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{candidatosSinFoto}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                            <FiCreditCard className="text-blue-600 text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Partidos</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{partidosUnicos}</p>
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
                            placeholder="Buscar por nombre, apellido o CI..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph" />
                        <select
                            value={filterPartido}
                            onChange={(e) => setFilterPartido(e.target.value)}
                            className="pl-10 pr-8 py-3 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent transition-colors appearance-none bg-white"
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
                        onClick={() => fetchCandidatos()}
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
                        <p className="text-paragraph">Cargando candidatos...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center">
                    <p className="text-tertiary font-semibold">Error al cargar candidatos</p>
                    <p className="text-tertiary text-sm mt-2">{error}</p>
                </div>
            )}

            {deleteError && (
                <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center mb-6">
                    <p className="text-tertiary font-semibold">Error al eliminar candidato</p>
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
                        <h2 className="text-xl font-bold text-headline">Lista de Candidatos</h2>
                        <div className="flex items-center gap-2 text-sm text-paragraph">
                            <FiInfo className="text-xs" />
                            <span>{filteredCandidatos.length} candidato{filteredCandidatos.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {filteredCandidatos.length === 0 ? (
                        <div className="text-center py-12">
                            <FiUsers className="text-paragraph text-4xl mx-auto mb-4" />
                            <h3 className="text-headline font-semibold mb-2">
                                {searchTerm || filterPartido ? 'No se encontraron candidatos' : 'No hay candidatos registrados'}
                            </h3>
                            <p className="text-paragraph text-sm mb-4">
                                {searchTerm || filterPartido 
                                    ? 'Intenta ajustar los filtros de búsqueda'
                                    : 'Comienza registrando el primer candidato del sistema'
                                }
                            </p>
                            {!searchTerm && !filterPartido && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText transition-all duration-200 font-semibold"
                                >
                                    Registrar Primer Candidato
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {filteredCandidatos.map(candidato => (
                                <CandidatoCard
                                    key={candidato.id}
                                    candidato={candidato}
                                    partidosPoliticos={partidosPoliticos}
                                    onEdit={() => handleEdit(candidato)}
                                    onDelete={() => handleDelete(candidato)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <CandidatoCreateModal
                open={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={handleCreateSuccess}
            />

            <CandidatoEditModal
                open={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedCandidato(null);
                }}
                onUpdated={handleEditSuccess}
                candidato={selectedCandidato}
            />

            <ConfirmDeleteModal
                open={showDeleteModal}
                onCancel={() => { 
                    setShowDeleteModal(false); 
                    setCandidatoToDelete(null); 
                    clearDeleteError(); 
                    clearDeleteSuccess(); 
                }}
                onConfirm={handleConfirmDelete}
                title="Eliminar Candidato"
                message={`¿Estás seguro de que quieres eliminar al candidato "${candidatoToDelete?.nombres ?? ''} ${candidatoToDelete?.apellidoPaterno ?? ''}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
} 