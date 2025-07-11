import { useState } from 'react';
import { useDeleteCargo } from '../../hooks/cargos/useDeleteCargo';
import { useCargos } from '../../hooks/cargos/useCargos';
import { CargoCard } from '../../components/cargos/CargoCard';
import { FiPlus, FiBriefcase, FiSearch, FiRefreshCw, FiInfo } from 'react-icons/fi';
import type { Cargo } from '../../../core/types/sistema-administracion-electoral/cargo.types';
import { ConfirmDeleteModal } from '../../../../shared/components/ConfirmDeleteModal';
import { CargoCreateModal } from '../../components/cargos/CargoCreateModal';
import { CargoEditModal } from '../../components/cargos/CargoEditModal';

export default function CargosPage() {
    const { cargos, loading, error, fetchCargos } = useCargos();
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCargo, setSelectedCargo] = useState<Cargo | null>(null);

    const openEditModal = (cargo: Cargo) => {
        setSelectedCargo(cargo);
        setIsEditOpen(true);
    };
    const handleDelete = (cargo: Cargo) => {
        setSelectedCargo(cargo);
        setIsDeleteOpen(true);
    };
    const handleCloseEdit = () => {
        setIsEditOpen(false);
        setSelectedCargo(null);
    };
    const handleCloseDelete = () => {
        setIsDeleteOpen(false);
        setSelectedCargo(null);
    };
    const deleteCargoMutation = useDeleteCargo();
    const onDelete = async () => {
        if (!selectedCargo) return;
        await deleteCargoMutation.remove(selectedCargo.id);
        handleCloseDelete();
        fetchCargos();
    };

    const filteredCargos = cargos.filter(cargo => {
        const matchesSearch = cargo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cargo.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const totalCargos = cargos.length;
    const cargosActivos = cargos.filter(c => c.estado.toLowerCase() === 'activo').length;
    const cargosInactivos = cargos.filter(c => c.estado.toLowerCase() === 'inactivo').length;

    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-display text-2xl sm:text-3xl text-headline font-bold mb-2">Gestión de Cargos</h1>
                    <p className="text-paragraph text-sm sm:text-base">Administra los cargos del sistema electoral</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText shadow-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2 hover:shadow-xl"
                    title="Crear cargo"
                >
                    <FiPlus className="text-lg" />
                    <span className="hidden sm:inline">Crear Cargo</span>
                    <span className="sm:hidden">Crear</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-button/10 rounded-full">
                            <FiBriefcase className="text-button text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Total Cargos</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{totalCargos}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                            <FiBriefcase className="text-green-600 text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Activos</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{cargosActivos}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-4 sm:p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-3 bg-gray-100 rounded-full">
                            <FiBriefcase className="text-gray-600 text-lg sm:text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-xs sm:text-sm">Inactivos</p>
                            <p className="text-headline text-lg sm:text-2xl font-bold">{cargosInactivos}</p>
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
                    <button
                        onClick={() => fetchCargos()}
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
                        <p className="text-paragraph">Cargando cargos...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center">
                    <p className="text-tertiary font-semibold">Error al cargar cargos</p>
                    <p className="text-tertiary text-sm mt-2">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-headline">Lista de Cargos</h2>
                        <div className="flex items-center gap-2 text-sm text-paragraph">
                            <FiInfo className="text-xs" />
                            <span>{filteredCargos.length} cargo{filteredCargos.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    {filteredCargos.length === 0 ? (
                        <div className="text-center py-12">
                            <FiBriefcase className="text-paragraph text-4xl mx-auto mb-4" />
                            <h3 className="text-headline font-semibold mb-2">
                                {searchTerm ? 'No se encontraron cargos' : 'No hay cargos registrados'}
                            </h3>
                            <p className="text-paragraph text-sm">
                                {searchTerm 
                                    ? 'Intenta ajustar los filtros de búsqueda'
                                    : 'Comienza creando el primer cargo del sistema'
                                }
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => setIsCreateOpen(true)}
                                    className="mt-4 px-4 py-2 rounded-lg bg-button hover:bg-highlight text-buttonText transition-all duration-200 text-sm font-semibold"
                                >
                                    Crear Primer Cargo
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {filteredCargos.map(cargo => (
                                <CargoCard
                                    key={cargo.id}
                                    cargo={cargo}
                                    onEdit={() => openEditModal(cargo)}
                                    onDelete={() => handleDelete(cargo)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <CargoCreateModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreated={fetchCargos} />
            <CargoEditModal open={isEditOpen} onClose={handleCloseEdit} cargo={selectedCargo} onUpdated={fetchCargos} />
            <ConfirmDeleteModal open={isDeleteOpen} onCancel={handleCloseDelete} onConfirm={onDelete} title="Eliminar cargo" message="¿Estás seguro de que deseas eliminar este cargo?" />
        </div>
    );
} 