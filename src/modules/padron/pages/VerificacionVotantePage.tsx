import { useState } from 'react';
import { useConsultaPublicaVotante } from '../hooks/useConsultaPublicaVotante';
import { FiSearch, FiUser, FiAlertCircle } from 'react-icons/fi';

export default function VerificacionVotantePage() {
    const [ci, setCi] = useState('');
    const { data, loading, error, consultar } = useConsultaPublicaVotante();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (ci.trim()) consultar(ci.trim());
    };

    const getFotoUrl = (fotoPath?: string) => {
        const baseUrl = import.meta.env.VITE_API_PADRON_URL_IMAGES;
        if (!fotoPath || !baseUrl) return undefined;
        return `${baseUrl.replace(/\/$/, '')}/${fotoPath.replace(/^\//, '')}`;
    };

    return (
        <div className="w-full max-w-lg mx-auto py-10 px-4 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2 mb-2">
            <FiUser className="text-4xl text-button mb-1" />
            <h1 className="font-display text-3xl text-headline font-bold mb-1 text-center">Verificación de Votante</h1>
            <p className="text-paragraph text-center">Consulta el estado de un votante ingresando su número de CI</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-main rounded-xl p-6 shadow-md border border-stroke">
            <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph" />
            <input
                type="text"
                placeholder="Ingrese CI del votante..."
                value={ci}
                onChange={e => setCi(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent transition-colors bg-background text-headline"
                required
            />
            </div>
            <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText font-semibold transition-all duration-200 disabled:opacity-50"
            disabled={loading}
            >
            {loading ? 'Consultando...' : 'Consultar'}
            </button>
        </form>
        {loading && (
            <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-button border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-paragraph text-center">Consultando votante...</p>
            </div>
        )}
        {error && (
            <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center flex flex-col items-center gap-2">
            <FiAlertCircle className="text-tertiary text-2xl" />
            <p className="text-tertiary font-semibold">{error}</p>
            </div>
        )}
        {data && (
            <div className="bg-main rounded-xl p-6 shadow-md border border-stroke flex flex-col items-center gap-4">
            <h2 className="font-semibold text-lg text-button mb-2">Datos del Votante</h2>
            {data.fotoVotante || data.FotoVotante ? (
                <img
                src={getFotoUrl(data.fotoVotante || data.FotoVotante)}
                alt="Foto del votante"
                className="w-32 h-32 object-cover rounded-full border-4 border-secondary shadow-md"
                />
            ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-secondary rounded-full border-2 border-stroke">
                <FiUser className="text-4xl text-stroke" />
                </div>
            )}
            <div className="w-full flex flex-col gap-2 mt-2">
                <div className="flex gap-2 items-center">
                <span className="font-bold text-headline">Nombre:</span>
                <span className="text-paragraph">{data.nombreCompleto || data.NombreCompleto}</span>
                </div>
                <div className="flex gap-2 items-center">
                <span className="font-bold text-headline">Recinto:</span>
                <span className="text-paragraph">{data.recintoNombre || data.RecintoNombre}</span>
                </div>
                <div className="flex gap-2 items-center">
                <span className="font-bold text-headline">ID Recinto:</span>
                <span className="text-paragraph">{data.recintoId || data.RecintoId}</span>
                </div>
            </div>
            </div>
        )}
        </div>
    );
} 