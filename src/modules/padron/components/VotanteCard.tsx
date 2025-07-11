import type { Votante } from '../../core/types/sistema-padron-electoral/votante.types';
import { FiUser, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface VotanteCardProps {
    votante: Votante;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function VotanteCard({ votante, onEdit, onDelete }: VotanteCardProps) {
    const getFotoUrl = (fotoPath?: string) => {
        const baseUrl = import.meta.env.VITE_API_PADRON_URL_IMAGES;
        if (!fotoPath || !baseUrl) return undefined;
        return `${baseUrl.replace(/\/$/, '')}/${fotoPath.replace(/^\//, '')}`;
    };

    return (
        <div className="bg-main rounded-xl shadow-md p-6 flex flex-col gap-4 hover:shadow-lg transition-all duration-200 border border-stroke group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-button/5 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
            {onEdit && (
                <button
                type="button"
                onClick={e => { e.stopPropagation(); onEdit(); }}
                className="p-2 rounded-full bg-white hover:bg-button/10 text-button shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-button"
                title="Editar votante"
                >
                <FiEdit2 className="text-sm" />
                </button>
            )}
            {onDelete && (
                <button
                type="button"
                onClick={e => { e.stopPropagation(); onDelete(); }}
                className="p-2 rounded-full bg-white hover:bg-tertiary/10 text-tertiary shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tertiary"
                title="Eliminar votante"
                >
                <FiTrash2 className="text-sm" />
                </button>
            )}
        </div>
        <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-button/10 rounded-full flex items-center justify-center">
            {votante.fotoVotante ? (
                <img
                src={getFotoUrl(votante.fotoVotante || votante.fotoVotante)}
                alt={`Foto de ${votante.nombreCompleto}`}
                className="w-12 h-12 object-cover rounded-full border-2 border-secondary"
                />
            ) : (
                <FiUser className="text-button text-xl" />
            )}
            </div>
            <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg text-headline font-bold truncate">{votante.nombreCompleto}</h3>
            <p className="text-paragraph text-sm">CI: {votante.ci}</p>
            </div>
        </div>
        {votante.recintoNombre && (
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
            <span className="text-paragraph text-sm truncate">Recinto: {votante.recintoNombre}</span>
            </div>
        )}
        </div>
    );
} 