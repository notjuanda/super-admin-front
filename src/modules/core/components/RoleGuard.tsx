import React from 'react';
import { useAuth } from '../context/GlobalContext';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../types/sistema-autenticacion/user.types';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles = [UserRole.SUPER_ADMIN] }) => {
    const { user, loading } = useAuth();

    console.log('[RoleGuard] loading:', loading, '| user:', user, '| allowedRoles:', allowedRoles);

    if (loading) {
        return <div className="w-full flex justify-center items-center py-20 text-paragraph">Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.rol)) {
        return (
        <div className="w-full flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-bold text-tertiary mb-4">Acceso denegado</h2>
            <p className="text-paragraph">No tienes permisos para acceder a esta sección.</p>
        </div>
        );
    }

    return <>{children}</>;
}; 