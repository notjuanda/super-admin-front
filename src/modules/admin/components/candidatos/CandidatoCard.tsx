import type { Candidato } from '../../../core/types/sistema-administracion-electoral/candidato.types';
import type { PartidoPolitico } from '../../../core/types/sistema-administracion-electoral/partido-politico.types';
import { FiUser, FiEdit2, FiTrash2, FiCreditCard, FiImage, FiCalendar } from 'react-icons/fi';
import { buildImageUrl } from '../../../../shared/utils/image.utils';

interface CandidatoCardProps {
    candidato: Candidato;
    partidosPoliticos?: PartidoPolitico[];
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function CandidatoCard({ candidato, partidosPoliticos = [], onClick, onEdit, onDelete }: CandidatoCardProps) {
    console.log('🎯 CandidatoCard - Datos del candidato:', candidato);
    console.log('🖼️ CandidatoCard - fotoUrl:', candidato.fotoUrl);
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
        });
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
            title="Editar candidato"
            >
            <FiEdit2 className="text-sm" />
            </button>
            <button
            type="button"
            onClick={e => { e.stopPropagation(); onDelete && onDelete(); }}
            className="p-2 rounded-full bg-white hover:bg-tertiary/10 text-tertiary shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tertiary"
            title="Eliminar candidato"
            >
            <FiTrash2 className="text-sm" />
            </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-button/10 rounded-full flex items-center justify-center relative overflow-hidden flex-shrink-0">
            {candidato.fotoUrl ? (
                <img 
                src={buildImageUrl(candidato.fotoUrl)} 
                alt={`Foto de ${candidato.nombres} ${candidato.apellidoPaterno}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                }}
                />
            ) : null}
            <FiUser className={`text-button text-lg sm:text-xl ${candidato.fotoUrl ? 'hidden' : ''}`} />
            </div>
            <div className="flex-1 min-w-0">
            <h3 className="font-display text-base sm:text-lg text-headline font-bold truncate">
                {candidato.nombres} {candidato.apellidoPaterno} {candidato.apellidoMaterno}
            </h3>
            <p className="text-paragraph text-xs sm:text-sm">ID: {candidato.id}</p>
            </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary/30 rounded-lg">
            <FiCreditCard className="text-paragraph text-xs sm:text-sm flex-shrink-0" />
            <span className="text-paragraph text-xs sm:text-sm font-medium truncate">{candidato.cedula}</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary/30 rounded-lg">
            <FiCalendar className="text-paragraph text-xs sm:text-sm flex-shrink-0" />
            <span className="text-paragraph text-xs sm:text-sm font-medium">
                {new Date(candidato.fechaNacimiento).toLocaleDateString('es-ES')}
            </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary/30 rounded-lg">
            <FiImage className="text-paragraph text-xs sm:text-sm flex-shrink-0" />
            <span className="text-paragraph text-xs sm:text-sm">
                {candidato.fotoUrl ? 'Foto disponible' : 'Sin foto'}
            </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary/30 rounded-lg">
                <span className="text-paragraph text-xs sm:text-sm font-medium">
                    Candidatura: {candidato.candidaturaId ? `#${candidato.candidaturaId}` : 'Sin asignar'}
                </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary/30 rounded-lg">
            <FiCalendar className="text-paragraph text-xs sm:text-sm flex-shrink-0" />
            <div className="text-paragraph text-xs">
                <div>Creado: {formatDate(candidato.createdAt)}</div>
                <div>Actualizado: {formatDate(candidato.updatedAt)}</div>
            </div>
            </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stroke">
            <span className="text-xs text-paragraph">
            Candidato registrado
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        </div>
    );
} 