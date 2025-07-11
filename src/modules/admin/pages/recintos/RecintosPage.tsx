import { useState } from 'react';
import { useRecintos } from '../../hooks/recintos/useRecintos';
import { useDeleteRecinto } from '../../hooks/recintos/useDeleteRecinto';
import { RecintosMap } from '../../components/recintos/RecintosMap';
import { RecintoCreateModal } from '../../components/recintos/RecintoCreateModal';
import { RecintoEditModal } from '../../components/recintos/RecintoEditModal';
import { ConfirmDeleteModal } from '../../../../shared/components/ConfirmDeleteModal';
import { FiPlus, FiMapPin, FiSearch, FiRefreshCw, FiInfo } from 'react-icons/fi';
import type { Recinto } from '../../../core/types/sistema-administracion-electoral/recinto.types';

export default function RecintosPage() {
    const { recintos, loading, error, fetchRecintos } = useRecintos();
    const { remove: deleteRecinto } = useDeleteRecinto();
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selectedRecinto, setSelectedRecinto] = useState<Recinto | null>(null);
    const [selectedRecintoId, setSelectedRecintoId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleCreated = () => {
        setShowCreate(false);
        fetchRecintos();
    };

    const handleEdit = (recinto: Recinto) => {
        setSelectedRecinto(recinto);
        setShowEdit(true);
    };

    const handleDelete = (recinto: Recinto) => {
        setSelectedRecinto(recinto);
        setShowDelete(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedRecinto) return;
        
        try {
            await deleteRecinto(selectedRecinto.id);
            setShowDelete(false);
            setSelectedRecinto(null);
            setSelectedRecintoId(null);
            fetchRecintos();
        } catch (error) {
            console.error('Error al eliminar recinto:', error);
        }
    };

    const handleUpdated = () => {
        setShowEdit(false);
        setSelectedRecinto(null);
        fetchRecintos();
    };

    const filteredRecintos = recintos.filter(recinto => {
        const matchesSearch = recinto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (recinto.descripcion && recinto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    const totalRecintos = recintos.length;
    const recintosConDescripcion = recintos.filter(r => r.descripcion && r.descripcion.trim() !== '').length;
    const recintosSinDescripcion = recintos.filter(r => !r.descripcion || r.descripcion.trim() === '').length;

    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl text-headline font-bold mb-2">Gestión de Recintos</h1>
                    <p className="text-paragraph">Administra los recintos electorales del sistema</p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText shadow-lg transition-all duration-200 font-semibold flex items-center gap-2 hover:shadow-xl"
                    title="Crear recinto"
                >
                    <FiPlus className="text-lg" />
                    Crear Recinto
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-button/10 rounded-full">
                            <FiMapPin className="text-button text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-sm">Total Recintos</p>
                            <p className="text-headline text-2xl font-bold">{totalRecintos}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-full">
                            <FiMapPin className="text-green-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-sm">Con Descripción</p>
                            <p className="text-headline text-2xl font-bold">{recintosConDescripcion}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-orange-100 rounded-full">
                            <FiMapPin className="text-orange-600 text-xl" />
                        </div>
                        <div>
                            <p className="text-paragraph text-sm">Sin Descripción</p>
                            <p className="text-headline text-2xl font-bold">{recintosSinDescripcion}</p>
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
                        onClick={() => fetchRecintos()}
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
                        <p className="text-paragraph">Cargando recintos...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center">
                    <p className="text-tertiary font-semibold">Error al cargar recintos</p>
                    <p className="text-tertiary text-sm mt-2">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Mapa */}
                    <div className="lg:col-span-2">
                        <div className="bg-main rounded-xl shadow-md border border-stroke overflow-hidden">
                            <div className="p-6 border-b border-stroke">
                                <h2 className="text-xl font-bold text-headline mb-2">Visualización de Recintos</h2>
                                <p className="text-paragraph text-sm">Haz clic en un recinto para ver sus detalles</p>
                            </div>
                            <div className="relative">
                                <RecintosMap 
                                    recintos={filteredRecintos} 
                                    selectedRecintoId={selectedRecintoId} 
                                    setSelectedRecintoId={setSelectedRecintoId}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-main rounded-xl shadow-md border border-stroke p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-headline">Lista de Recintos</h3>
                            <div className="flex items-center gap-2 text-sm text-paragraph">
                                <FiInfo className="text-xs" />
                                <span>{filteredRecintos.length} recintos</span>
                            </div>
                        </div>

                        {filteredRecintos.length === 0 ? (
                            <div className="text-center py-8">
                                <FiMapPin className="text-paragraph text-3xl mx-auto mb-3" />
                                <h4 className="text-headline font-semibold mb-2">
                                    {searchTerm ? 'No se encontraron recintos' : 'No hay recintos registrados'}
                                </h4>
                                <p className="text-paragraph text-sm">
                                    {searchTerm 
                                        ? 'Intenta ajustar los filtros de búsqueda'
                                        : 'Comienza creando el primer recinto del sistema'
                                    }
                                </p>
                                {!searchTerm && (
                                    <button
                                        onClick={() => setShowCreate(true)}
                                        className="mt-4 px-4 py-2 rounded-lg bg-button hover:bg-highlight text-buttonText transition-all duration-200 text-sm font-semibold"
                                    >
                                        Crear Primer Recinto
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {filteredRecintos.map(recinto => (
                                    <button
                                        key={recinto.id}
                                        onClick={() => setSelectedRecintoId(selectedRecintoId === recinto.id ? null : recinto.id)}
                                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 border ${
                                            selectedRecintoId === recinto.id 
                                                ? 'bg-button/10 border-button shadow-md' 
                                                : 'bg-secondary/30 border-stroke hover:bg-secondary/50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-headline truncate">{recinto.nombre}</h4>
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                ID: {recinto.id}
                                            </span>
                                        </div>
                                        {recinto.descripcion && (
                                            <p className="text-paragraph text-sm mb-2 line-clamp-2">{recinto.descripcion}</p>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-paragraph">
                                            <span>Lat: {recinto.latitud.toFixed(4)}</span>
                                            <span>•</span>
                                            <span>Lng: {recinto.longitud.toFixed(4)}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <RecintoCreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={handleCreated} />
            
            <RecintoEditModal 
                open={showEdit} 
                onClose={() => setShowEdit(false)} 
                onUpdated={handleUpdated}
                recinto={selectedRecinto}
            />
            
            <ConfirmDeleteModal
                open={showDelete}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDelete(false)}
                title="¿Eliminar recinto?"
                message={`¿Estás seguro de que deseas eliminar el recinto "${selectedRecinto?.nombre}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
} 