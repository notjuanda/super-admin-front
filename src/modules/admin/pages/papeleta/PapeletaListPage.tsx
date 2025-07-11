import { useEffect, useState } from 'react';
import { getPapeletas } from '../../../core/api/sistema-administracion-electoral/papeleta.api';
import type { PapeletaEntity } from '../../../core/types/sistema-administracion-electoral/papeleta.types';
import { PapeletaCard } from '../../components/papeleta/PapeletaCard';
import { PapeletaDetalle } from '../../components/papeleta/PapeletaDetalle';
import { FiFileText, FiPlus } from 'react-icons/fi';
import { PapeletaCreateModal } from '../../components/papeleta/PapeletaCreateModal';

export function PapeletaListPage() {
    const [papeletas, setPapeletas] = useState<PapeletaEntity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<PapeletaEntity | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    const fetchPapeletas = () => {
        setLoading(true);
        getPapeletas()
        .then(res => setPapeletas(res.data))
        .catch(() => setError('Error al cargar las papeletas'))
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchPapeletas();
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-background z-10 py-4">
                <h1 className="text-3xl font-bold text-highlight flex items-center gap-2">
                    <FiFileText className="text-2xl" /> Papeletas Generadas
                </h1>
                <button
                    className="flex items-center gap-2 bg-highlight hover:bg-highlight/90 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
                    onClick={() => setShowCreate(true)}
                >
                    <FiPlus /> Nueva Papeleta
                </button>
            </div>
            {loading && <div className="text-paragraph">Cargando...</div>}
            {error && <div className="text-red-600 font-medium mb-4">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {papeletas.map(papeleta => (
                    <PapeletaCard key={papeleta.id} papeleta={papeleta} onClick={() => setSelected(papeleta)} />
                ))}
            </div>
            {selected && (
                <PapeletaDetalle papeleta={selected} onClose={() => setSelected(null)} />
            )}
            {showCreate && (
                <PapeletaCreateModal
                    onClose={() => setShowCreate(false)}
                    onCreated={() => {
                        setShowCreate(false);
                        fetchPapeletas();
                    }}
                />
            )}
        </div>
    );
} 