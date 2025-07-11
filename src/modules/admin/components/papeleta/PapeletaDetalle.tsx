import React from 'react';
import type { PapeletaEntity } from '../../../core/types/sistema-administracion-electoral/papeleta.types';
import { FiX, FiFileText } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_ADMINISTRACION_URL;

interface PapeletaDetalleProps {
    papeleta: PapeletaEntity;
    onClose: () => void;
}

export const PapeletaDetalle: React.FC<PapeletaDetalleProps> = ({ papeleta, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-3xl w-full relative animate-fade-in flex flex-col max-h-[95vh] border border-stroke overflow-hidden">
                {/* Encabezado sticky */}
                <div className="sticky top-0 bg-gradient-to-r from-highlight/10 to-white rounded-t-2xl px-8 pt-6 pb-2 z-10 flex items-center justify-between border-b border-border shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="w-10 h-10 bg-highlight/10 rounded-full flex items-center justify-center">
                            <FiFileText className="text-highlight text-2xl" />
                        </span>
                        <div>
                            <h2 className="text-2xl font-bold text-headline leading-tight">Detalle de Papeleta</h2>
                            <div className="flex gap-3 mt-1 text-xs">
                                <span className="bg-muted px-2 py-0.5 rounded font-semibold text-paragraph">ID: {papeleta.id}</span>
                                <span className={`px-2 py-0.5 rounded font-semibold border ${papeleta.estado === 'activa' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{papeleta.estado}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        className="text-2xl text-tertiary hover:text-highlight font-bold p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-highlight"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        <FiX />
                    </button>
                </div>
                {/* Banner info */}
                <div className="bg-highlight/10 px-8 py-3 flex flex-wrap gap-6 items-center text-sm border-b border-border">
                    <span><span className="font-semibold">Sección:</span> {papeleta.estructura.seccionNombre}</span>
                    <span><span className="font-semibold">Elección:</span> {papeleta.eleccionId}</span>
                    <span><span className="font-semibold">Estado:</span> {papeleta.estado}</span>
                </div>
                {/* Contenido principal */}
                <div className="overflow-y-auto px-8 py-6 flex-1">
                    {papeleta.estructura.cargos.map(cargo => (
                        <div key={cargo.cargoId} className="mb-10">
                            <div className="font-semibold text-tertiary mb-3 text-lg border-b border-border pb-1 flex items-center gap-2">
                                <span className="bg-highlight/10 text-highlight px-3 py-1 rounded-full text-sm font-bold">{cargo.cargoNombre}</span>
                                <span className="text-xs text-paragraph">{cargo.candidaturas.length} partidos</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {cargo.candidaturas.map(cand => (
                                    <div key={cand.partidoId} className="rounded-xl border border-border p-4 flex flex-col gap-3 bg-muted/60 shadow-sm relative" style={{ borderColor: cand.partidoColor }}>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="inline-block rounded px-3 py-1 font-bold text-lg text-white shadow" style={{ background: cand.partidoColor }}>{cand.partidoSigla}</span>
                                            <span className="font-semibold text-paragraph text-base">{cand.partidoNombre}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3 justify-center">
                                            {cand.candidatos.map(candidato => (
                                                <div key={candidato.id} className="bg-white border border-border rounded-lg px-3 py-2 text-xs flex flex-col items-center min-w-[110px] shadow-sm hover:shadow-md transition">
                                                    {candidato.fotoUrl && (
                                                        <img
                                                            src={
                                                                candidato.fotoUrl.startsWith('http')
                                                                    ? candidato.fotoUrl
                                                                    : `${API_URL}${candidato.fotoUrl.replace(/\\/g, '/')}`
                                                            }
                                                            alt={candidato.nombres}
                                                            className="w-14 h-14 rounded-full object-cover mb-1 border-2 border-highlight"
                                                        />
                                                    )}
                                                    <span className="font-medium text-tertiary text-xs text-center">{candidato.nombres}</span>
                                                    <span className="text-[11px] text-paragraph text-center">{candidato.apellidoPaterno} {candidato.apellidoMaterno}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 