import { useState } from 'react';
import { useVotantes } from '../hooks/useVotantes';
import { VotanteCard } from '../components/VotanteCard';
import { VotanteCreateModal } from '../components/VotanteCreateModal';
import { VotanteEditModal } from '../components/VotanteEditModal';
import { FiPlus, FiUsers, FiSearch, FiRefreshCw } from 'react-icons/fi';
import type { Votante } from '../../core/types/sistema-padron-electoral/votante.types';

export default function VotantesPage() {
    const { votantes, loading, error, refetch } = useVotantes();
    const [showCreate, setShowCreate] = useState(false);
    const [editVotante, setEditVotante] = useState<Votante | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleCreated = () => {
        setShowCreate(false);
        refetch();
    };
    const handleUpdated = () => {
        setEditVotante(null);
        refetch();
    };

    const filteredVotantes = votantes.filter(votante =>
        votante.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        votante.ci.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalVotantes = votantes.length;

    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
            <h1 className="font-display text-3xl text-headline font-bold mb-2">Gestión de Votantes</h1>
            <p className="text-paragraph">Administra los votantes del sistema electoral</p>
            </div>
            <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText shadow-lg transition-all duration-200 font-semibold flex items-center gap-2 hover:shadow-xl"
            title="Crear votante"
            >
            <FiPlus className="text-lg" />
            Crear Votante
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-button/10 rounded-full">
                <FiUsers className="text-button text-xl" />
                </div>
                <div>
                <p className="text-paragraph text-sm">Total Votantes</p>
                <p className="text-headline text-2xl font-bold">{totalVotantes}</p>
                </div>
            </div>
            </div>
            {/* Puedes agregar más cards de estadísticas aquí */}
        </div>

        <div className="bg-main rounded-xl p-6 shadow-md border border-stroke mb-8">
            <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph" />
                <input
                type="text"
                placeholder="Buscar por nombre o CI..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent transition-colors"
                />
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
                <p className="text-paragraph">Cargando votantes...</p>
            </div>
            </div>
        )}

        {error && (
            <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center">
            <p className="text-tertiary font-semibold">Error al cargar votantes</p>
            <p className="text-tertiary text-sm mt-2">{error}</p>
            </div>
        )}

        {!loading && !error && (
            <>
            {filteredVotantes.length === 0 ? (
                <div className="text-center py-12">
                <FiUsers className="text-paragraph text-4xl mx-auto mb-4" />
                <h3 className="text-headline text-xl font-semibold mb-2">
                    {searchTerm ? 'No se encontraron votantes' : 'No hay votantes registrados'}
                </h3>
                <p className="text-paragraph">
                    {searchTerm
                    ? 'Intenta ajustar el término de búsqueda'
                    : 'Comienza creando el primer votante del sistema'}
                </p>
                {!searchTerm && (
                    <button
                    onClick={() => setShowCreate(true)}
                    className="mt-4 px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText transition-all duration-200 font-semibold"
                    >
                    Crear Primer Votante
                    </button>
                )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVotantes.map(votante => (
                    <VotanteCard
                    key={votante.id}
                    votante={votante}
                    onEdit={() => setEditVotante(votante)}
                    />
                ))}
                </div>
            )}
            </>
        )}

        <VotanteCreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={handleCreated} />
        <VotanteEditModal open={!!editVotante} votante={editVotante} onClose={() => setEditVotante(null)} onUpdated={handleUpdated} />
        </div>
    );
} 