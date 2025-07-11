import type { Cargo } from '../../../core/types/sistema-administracion-electoral/cargo.types';
import { FiBriefcase, FiEdit2, FiTrash2, FiCheckCircle } from 'react-icons/fi';

interface CargoCardProps {
    cargo: Cargo;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function CargoCard({ cargo, onClick, onEdit, onDelete }: CargoCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getEstadoColor = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'activo':
                return 'bg-green-100 text-green-700';
            case 'inactivo':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div
            onClick={onClick}
            className="bg-main rounded-xl shadow-md p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 cursor-pointer hover:shadow-lg transition-all duration-200 border border-stroke group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-20 h-20 bg-button/5 rounded-full -translate-y-10 translate-x-10"></div>
            
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onEdit && onEdit(); }}
                    className="p-2 rounded-full bg-white hover:bg-button/10 text-button shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-button"
                    title="Editar cargo"
                >
                    <FiEdit2 className="text-sm" />
                </button>
                <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onDelete && onDelete(); }}
                    className="p-2 rounded-full bg-white hover:bg-tertiary/10 text-tertiary shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tertiary"
                    title="Eliminar cargo"
                >
                    <FiTrash2 className="text-sm" />
                </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 mb-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-button/10 rounded-full flex items-center justify-center relative overflow-hidden flex-shrink-0">
                    <FiBriefcase className="text-button text-lg sm:text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base sm:text-lg text-headline font-bold truncate">
                        {cargo.nombre}
                    </h3>
                    <p className="text-paragraph text-xs sm:text-sm">ID: {cargo.id}</p>
                </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary/30 rounded-lg">
                    <span className="text-paragraph text-xs sm:text-sm font-medium truncate">
                        {cargo.descripcion}
                    </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary/30 rounded-lg">
                    <FiCheckCircle className="text-paragraph text-xs sm:text-sm flex-shrink-0" />
                    <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${getEstadoColor(cargo.estado)}`}>
                        {cargo.estado}
                    </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary/30 rounded-lg">
                    <span className="text-paragraph text-xs">
                        Creado: {formatDate(cargo.createdAt)}
                    </span>
                    <span className="text-paragraph text-xs">
                        Actualizado: {formatDate(cargo.updatedAt)}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stroke">
                <span className="text-xs text-paragraph">
                    Cargo registrado
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
        </div>
    );
} 