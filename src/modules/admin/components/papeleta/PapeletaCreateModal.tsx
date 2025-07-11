import { useState, useEffect, useRef } from 'react';
import { useElecciones } from '../../hooks/elecciones/useElecciones';
import { useSecciones } from '../../hooks/seccion/useSecciones';
import { generarPapeletaPorSeccion } from '../../../core/api/sistema-administracion-electoral/papeleta.api';
import { FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface PapeletaCreateModalProps {
    onClose: () => void;
    onCreated: () => void;
}

export const PapeletaCreateModal: React.FC<PapeletaCreateModalProps> = ({ onClose, onCreated }) => {
    const { elecciones, loading: loadingElecciones } = useElecciones();
    const { secciones, loading: loadingSecciones } = useSecciones();
    const [seccionId, setSeccionId] = useState<number | ''>('');
    const [eleccionId, setEleccionId] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Cierre con Esc y click fuera
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        };
        const handleClick = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClick);
        return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousedown', handleClick);
        };
    }, [onClose]);

    const handleGenerar = async () => {
        if (!seccionId || !eleccionId) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
        await generarPapeletaPorSeccion(Number(seccionId), Number(eleccionId));
        setSuccess('¡Papeleta generada correctamente!');
        setTimeout(() => {
            onCreated();
        }, 1000);
        } catch (err: any) {
        setError('Error al generar la papeleta');
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
            <div className="sticky top-0 bg-white rounded-t-2xl pb-2 z-10 flex items-center justify-between border-b border-border mb-4">
            <h2 className="text-xl font-bold text-highlight flex items-center gap-2">
                <FiCheckCircle /> Generar nueva papeleta
            </h2>
            <button
                className="text-2xl text-tertiary hover:text-highlight font-bold p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-highlight"
                onClick={onClose}
                aria-label="Cerrar"
            >
                <FiX />
            </button>
            </div>
            <div className="flex flex-col gap-4 mb-4">
            <div>
                <label className={`block mb-1 font-semibold text-sm ${!seccionId && error ? 'text-red-600' : 'text-tertiary'}`}>Sección</label>
                <select
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${!seccionId && error ? 'border-red-500 focus:ring-red-300' : 'border-border focus:ring-highlight'}`}
                value={seccionId}
                onChange={e => setSeccionId(Number(e.target.value) || '')}
                disabled={loadingSecciones}
                >
                <option value="">Selecciona una sección</option>
                {secciones.map(seccion => (
                    <option key={seccion.id} value={seccion.id}>{seccion.nombre}</option>
                ))}
                </select>
            </div>
            <div>
                <label className={`block mb-1 font-semibold text-sm ${!eleccionId && error ? 'text-red-600' : 'text-tertiary'}`}>Elección</label>
                <select
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${!eleccionId && error ? 'border-red-500 focus:ring-red-300' : 'border-border focus:ring-highlight'}`}
                value={eleccionId}
                onChange={e => setEleccionId(Number(e.target.value) || '')}
                disabled={loadingElecciones}
                >
                <option value="">Selecciona una elección</option>
                {elecciones.map(eleccion => (
                    <option key={eleccion.id} value={eleccion.id}>{eleccion.nombre}</option>
                ))}
                </select>
            </div>
            </div>
            <button
            className="bg-highlight hover:bg-highlight/90 text-white px-6 py-2 rounded-lg font-semibold mt-2 transition disabled:opacity-50 disabled:cursor-not-allowed w-full text-base"
            onClick={handleGenerar}
            disabled={!seccionId || !eleccionId || loading}
            >
            {loading ? <span className="animate-spin mr-2 inline-block align-middle">⏳</span> : null}
            {loading ? 'Generando...' : 'Generar Papeleta'}
            </button>
            {success && (
            <div className="flex items-center gap-2 text-green-700 bg-green-100 rounded px-3 py-2 font-medium mt-4 animate-fade-in">
                <FiCheckCircle /> {success}
            </div>
            )}
            {error && (
            <div className="flex items-center gap-2 text-red-700 bg-red-100 rounded px-3 py-2 font-medium mt-4 animate-fade-in">
                <FiAlertCircle /> {error}
            </div>
            )}
        </div>
        </div>
    );
}; 