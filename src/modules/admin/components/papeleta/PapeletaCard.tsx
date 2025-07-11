import React from 'react';
import type { PapeletaEntity } from '../../../core/types/sistema-administracion-electoral/papeleta.types';
import { FiFileText, FiEye } from 'react-icons/fi';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

interface PapeletaCardProps {
    papeleta: PapeletaEntity;
    onClick?: () => void;
}

export const PapeletaCard: React.FC<PapeletaCardProps> = ({ papeleta, onClick }) => {
    const cargos = papeleta.estructura.cargos;
    const cargosPreview = cargos.slice(0, 3);
    const cargosRestantes = cargos.length - cargosPreview.length;
    return (
        <div
        onClick={onClick}
        className="bg-main rounded-xl shadow-md p-6 flex flex-col gap-4 cursor-pointer hover:shadow-lg transition-all duration-200 border border-stroke group relative overflow-hidden min-h-[180px]"
        tabIndex={0}
        role="button"
        aria-label={`Ver papeleta sección ${papeleta.estructura.seccionNombre}`}
        >
        <div className="absolute top-0 right-0 w-20 h-20 bg-highlight/10 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
            <span className="p-2 rounded-full bg-highlight text-white shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-highlight">
            <FiEye className="text-lg" />
            </span>
        </div>
        <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-highlight/10 rounded-full flex items-center justify-center">
            <FiFileText className="text-highlight text-2xl" />
            </div>
            <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg text-headline font-bold truncate">Papeleta</h3>
            <p className="text-paragraph text-xs">ID: {papeleta.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${papeleta.estado === 'activa' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
            {papeleta.estado}
            </span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-paragraph mb-1">
            <span><span className="font-semibold">Sección:</span> {papeleta.estructura.seccionNombre}</span>
            <span><span className="font-semibold">Elección:</span> {papeleta.eleccionId}</span>
        </div>
        <div className="text-xs text-paragraph mb-1">
            <span className="font-semibold">Creada:</span> {dayjs(papeleta.createdAt).format('DD MMM YYYY HH:mm')}
        </div>
        <div className="flex flex-wrap gap-2 mt-1">
            {cargosPreview.map(cargo => (
            <span key={cargo.cargoId} className="bg-muted text-xs rounded px-2 py-0.5 font-medium border border-border">
                {cargo.cargoNombre}
            </span>
            ))}
            {cargosRestantes > 0 && (
            <span className="bg-highlight/20 text-highlight text-xs rounded px-2 py-0.5 font-semibold border border-highlight/30">+{cargosRestantes} más</span>
            )}
        </div>
        </div>
    );
}; 