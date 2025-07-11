import type { User } from '../../../core/types/sistema-autenticacion/user.types';
import { FiUser, FiMail, FiKey, FiEdit2, FiTrash2, FiCheckCircle } from 'react-icons/fi';

interface UserCardProps {
  user: User;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function UserCard({ user, onClick, onEdit, onDelete }: UserCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'admin_elecciones':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'jurado_electoral':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'admin_padron':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin_elecciones':
        return 'Admin Elecciones';
      case 'jurado_electoral':
        return 'Jurado Electoral';
      case 'admin_padron':
        return 'Admin Padrón';
      default:
        return role.replace('_', ' ').toUpperCase();
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
          title="Editar usuario"
        >
          <FiEdit2 className="text-sm" />
        </button>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onDelete && onDelete(); }}
          className="p-2 rounded-full bg-white hover:bg-tertiary/10 text-tertiary shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tertiary"
          title="Eliminar usuario"
        >
          <FiTrash2 className="text-sm" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 bg-button/10 rounded-full flex items-center justify-center">
          <FiUser className="text-button text-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg text-headline font-bold truncate">{user.nombre}</h3>
          <p className="text-paragraph text-sm">ID: {user.id}</p>
        </div>
        <div className="flex items-center gap-1">
          <FiCheckCircle className="text-green-500 text-sm" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
          <FiMail className="text-paragraph text-sm flex-shrink-0" />
          <span className="text-paragraph text-sm truncate">{user.email}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <FiKey className="text-paragraph text-sm flex-shrink-0" />
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.rol)}`}>
            {getRoleLabel(user.rol)}
          </span>
        </div>
      </div>
    </div>
  );
} 