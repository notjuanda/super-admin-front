import type { Candidatura } from '../../../core/types/sistema-administracion-electoral/candidatura.types';
import type { Eleccion } from '../../../core/types/sistema-administracion-electoral/eleccion.types';
import type { Cargo } from '../../../core/types/sistema-administracion-electoral/cargo.types';
import type { PartidoPolitico } from '../../../core/types/sistema-administracion-electoral/partido-politico.types';
import { FiFlag, FiEdit2, FiTrash2, FiCalendar } from 'react-icons/fi';

interface CandidaturaCardProps {
    candidatura: Candidatura;
    elecciones: Eleccion[];
    cargos: Cargo[];
    partidos: PartidoPolitico[];
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function CandidaturaCard({ candidatura, elecciones, cargos, partidos, onClick, onEdit, onDelete }: CandidaturaCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const eleccion = elecciones.find(e => e.id === candidatura.eleccionId);
    const cargo = cargos.find(c => c.id === candidatura.cargoId);
    const partido = partidos.find(p => p.id === candidatura.partidoId);

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
                    title="Editar candidatura"
                >
                    <FiEdit2 className="text-sm" />
                </button>
                <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onDelete && onDelete(); }}
                    className="p-2 rounded-full bg-white hover:bg-tertiary/10 text-tertiary shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tertiary"
                    title="Eliminar candidatura"
                >
                    <FiTrash2 className="text-sm" />
                </button>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 mb-2">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-button/10 rounded-full flex items-center justify-center relative overflow-hidden flex-shrink-0">
                    <FiFlag className="text-button text-lg sm:text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base sm:text-lg text-headline font-bold truncate">
                        {partido ? partido.nombre : 'Partido'} - {cargo ? cargo.nombre : 'Cargo'}
                    </h3>
                    <p className="text-paragraph text-xs sm:text-sm">Elección: {eleccion ? eleccion.nombre : candidatura.eleccionId}</p>
                    <p className="text-paragraph text-xs sm:text-sm">Partido: {partido ? partido.nombre : candidatura.partidoId}</p>
                    <p className="text-paragraph text-xs sm:text-sm">Cargo: {cargo ? cargo.nombre : candidatura.cargoId}</p>
                </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary/30 rounded-lg">
                    <FiCalendar className="text-paragraph text-xs sm:text-sm flex-shrink-0" />
                    <span className="text-paragraph text-xs sm:text-sm font-medium">
                        Creado: {formatDate(candidatura.createdAt)}
                    </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary/30 rounded-lg">
                    <FiCalendar className="text-paragraph text-xs sm:text-sm flex-shrink-0" />
                    <span className="text-paragraph text-xs sm:text-sm font-medium">
                        Actualizado: {formatDate(candidatura.updatedAt)}
                    </span>
                </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-stroke">
                <span className="text-xs text-paragraph">
                    Candidatura registrada
                </span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
        </div>
    );
} 