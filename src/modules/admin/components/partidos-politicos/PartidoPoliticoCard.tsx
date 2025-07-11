import type { PartidoPolitico } from '../../../core/types/sistema-administracion-electoral/partido-politico.types';
import { FiEdit2, FiTrash2, FiFlag, FiUsers, FiCalendar } from 'react-icons/fi';

interface PartidoPoliticoCardProps {
    partido: PartidoPolitico;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function PartidoPoliticoCard({ partido, onClick, onEdit, onDelete }: PartidoPoliticoCardProps) {
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
                return 'bg-green-500';
            case 'inactivo':
                return 'bg-gray-500';
            case 'suspendido':
                return 'bg-orange-500';
            default:
                return 'bg-blue-500';
        }
    };

    const getEstadoText = (estado: string) => {
        switch (estado.toLowerCase()) {
            case 'activo':
                return 'Activo';
            case 'inactivo':
                return 'Inactivo';
            case 'suspendido':
                return 'Suspendido';
            default:
                return estado;
        }
    };

    return (
        <div
            onClick={onClick}
            className="bg-main rounded-xl shadow-md p-6 flex flex-col gap-4 cursor-pointer hover:shadow-lg transition-all duration-200 border border-stroke group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-20 h-20 bg-button/5 rounded-full -translate-y-10 translate-x-10"></div>
            
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onEdit && onEdit(); }}
                    className="p-2 rounded-full bg-white hover:bg-button/10 text-button shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-button"
                    title="Editar partido"
                >
                    <FiEdit2 className="text-sm" />
                </button>
                <button
                    type="button"
                    onClick={e => { e.stopPropagation(); onDelete && onDelete(); }}
                    className="p-2 rounded-full bg-white hover:bg-tertiary/10 text-tertiary shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tertiary"
                    title="Eliminar partido"
                >
                    <FiTrash2 className="text-sm" />
                </button>
            </div>

            <div className="flex items-center gap-4 mb-2">
                <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: partido.color }}
                >
                    <FiFlag className="text-white text-xl" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg text-headline font-bold truncate">
                        {partido.nombre}
                    </h3>
                    <p className="text-paragraph text-sm">ID: {partido.id}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <FiFlag className="text-paragraph text-sm flex-shrink-0" />
                    <span className="text-paragraph text-sm font-medium">{partido.sigla}</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-button/10 rounded-lg border border-button/20">
                    <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: partido.color }}
                    ></div>
                    <span className="text-headline text-sm font-medium">
                        {partido.color}
                    </span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${getEstadoColor(partido.estado)}`}></div>
                    <span className="text-paragraph text-sm font-medium">
                        {getEstadoText(partido.estado)}
                    </span>
                </div>

                {partido.descripcion && (
                    <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                        <FiUsers className="text-paragraph text-sm flex-shrink-0 mt-0.5" />
                        <span className="text-paragraph text-sm">
                            {partido.descripcion}
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                    <FiCalendar className="text-paragraph text-sm flex-shrink-0" />
                    <div className="text-paragraph text-xs">
                        <div>Creado: {formatDate(partido.createdAt)}</div>
                        <div>Actualizado: {formatDate(partido.updatedAt)}</div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stroke">
                <span className="text-xs text-paragraph">
                    Partido político registrado
                </span>
                <div className={`w-2 h-2 rounded-full ${getEstadoColor(partido.estado)}`}></div>
            </div>
        </div>
    );
} 