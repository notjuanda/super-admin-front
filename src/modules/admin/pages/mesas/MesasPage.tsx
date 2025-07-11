import { useState } from 'react';
import { useMesas } from '../../hooks/mesas/useMesas';
import { MesaCard } from '../../components/mesas/MesaCard';
import { FiPlus, FiSearch, FiRefreshCw, FiUsers, FiMapPin, FiAlertTriangle } from 'react-icons/fi';
import { ConfirmDeleteModal } from '../../../../shared/components/ConfirmDeleteModal';
import { useDeleteMesa } from '../../hooks/mesas/useDeleteMesa';
import type { Mesa } from '../../../core/types/sistema-administracion-electoral/mesa.types';
import { MesaCreateModal } from '../../components/mesas/MesaCreateModal';
import { MesaEditModal } from '../../components/mesas/MesaEditModal';

export function MesasPage() {
    const { data: mesas, loading, error, refetch } = useMesas();
    const [deleteMesaObj, setDeleteMesaObj] = useState<Mesa | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { remove } = useDeleteMesa();
    const [showCreate, setShowCreate] = useState(false);
    const [editMesa, setEditMesa] = useState<Mesa | null>(null);

    const handleDeleteMesa = (mesa: Mesa) => setDeleteMesaObj(mesa);

    const handleDeleteConfirm = async () => {
        if (deleteMesaObj) {
        await remove(deleteMesaObj.id);
        setDeleteMesaObj(null);
        refetch();
        }
    };

    const handleCreated = () => {
        setShowCreate(false);
        refetch();
    };

    const handleUpdated = () => {
        setEditMesa(null);
        refetch();
    };

    const filteredMesas = (mesas ?? []).filter((mesa: Mesa) => {
        return (
        mesa.numero.toString().includes(searchTerm) ||
        (mesa.recinto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
        );
    });

    const totalMesas = (mesas ?? []).length;
    const recintosUnicos = new Set((mesas ?? []).map(m => m.recintoId)).size;
    const mesasSinRecinto = (mesas ?? []).filter(m => !m.recinto).length;

    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
            <h1 className="font-display text-3xl text-headline font-bold mb-2">Gestión de Mesas</h1>
            <p className="text-paragraph">Administra las mesas del sistema electoral</p>
            </div>
            <button
            className="px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText shadow-lg transition-all duration-200 font-semibold flex items-center gap-2 hover:shadow-xl"
            title="Crear mesa"
            onClick={() => setShowCreate(true)}
            >
            <FiPlus className="text-lg" />
            Crear Mesa
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-button/10 rounded-full">
              <FiUsers className="text-button text-xl" />
            </div>
            <div>
              <p className="text-paragraph text-sm">Total Mesas</p>
              <p className="text-headline text-2xl font-bold">{totalMesas}</p>
            </div>
          </div>
        </div>
        <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <FiMapPin className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-paragraph text-sm">Recintos Distintos</p>
              <p className="text-headline text-2xl font-bold">{recintosUnicos}</p>
            </div>
          </div>
        </div>
        <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiAlertTriangle className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-paragraph text-sm">Mesas sin Recinto</p>
              <p className="text-headline text-2xl font-bold">{mesasSinRecinto}</p>
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
                placeholder="Buscar por número o recinto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <p className="text-paragraph">Cargando mesas...</p>
            </div>
            </div>
        )}

        {error && (
            <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center">
            <p className="text-tertiary font-semibold">Error al cargar mesas</p>
            <p className="text-tertiary text-sm mt-2">{error}</p>
            </div>
        )}

        {!loading && !error && (
            <>
            {filteredMesas.length === 0 ? (
                <div className="text-center py-12">
                <h3 className="text-headline text-xl font-semibold mb-2">
                    {searchTerm ? 'No se encontraron mesas' : 'No hay mesas registradas'}
                </h3>
                <p className="text-paragraph">
                    {searchTerm 
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Comienza creando la primera mesa del sistema'
                    }
                </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMesas.map((mesa: Mesa) => (
                    <MesaCard
                    key={mesa.id}
                    mesa={mesa}
                    onEdit={() => setEditMesa(mesa)}
                    onDelete={() => handleDeleteMesa(mesa)}
                    />
                ))}
                </div>
            )}
            </>
        )}

        <ConfirmDeleteModal
            open={!!deleteMesaObj}
            title="Eliminar Mesa"
            message={`¿Estás seguro que deseas eliminar la mesa #${deleteMesaObj?.numero}? Esta acción no se puede deshacer.`}
            onCancel={() => setDeleteMesaObj(null)}
            onConfirm={handleDeleteConfirm}
        />
        <MesaCreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={handleCreated} />
        <MesaEditModal open={!!editMesa} mesa={editMesa} onClose={() => setEditMesa(null)} onUpdated={handleUpdated} />
        </div>
    );
} 