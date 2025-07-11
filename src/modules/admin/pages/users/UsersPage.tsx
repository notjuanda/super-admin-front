import { useState } from 'react';
import { useUsers } from '../../hooks/users/useUsers';
import { UserCard } from '../../components/users/UserCard';
import { FiPlus, FiUsers, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { UserCreateModal } from '../../components/users/UserCreateModal';
import { UserEditModal } from '../../components/users/UserEditModal';
import { ConfirmDeleteModal } from '../../../../shared/components/ConfirmDeleteModal';
import { useDeleteUser } from '../../hooks/users/useDeleteUser';
import type { User } from '../../../core/types/sistema-autenticacion/user.types';

export function UsersPage() {
  const { users, loading, error, refetch } = useUsers();
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUserObj, setDeleteUserObj] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const { remove } = useDeleteUser();

  const handleCreateUser = () => setShowCreate(true);
  const handleEditUser = (user: User) => setEditUser(user);
  const handleDeleteUser = (user: User) => setDeleteUserObj(user);

  const handleCreated = () => {
    setShowCreate(false);
    refetch();
  };
  const handleUpdated = () => {
    setEditUser(null);
    refetch();
  };
  const handleDeleteConfirm = async () => {
    if (deleteUserObj) {
      await remove(deleteUserObj.id);
      setDeleteUserObj(null);
      refetch();
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === '' || user.rol === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const activeUsers = users.length;
  const superAdmins = users.filter(u => u.rol === 'super_admin').length;
  const adminElecciones = users.filter(u => u.rol === 'admin_elecciones').length;

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-headline font-bold mb-2">Gestión de Usuarios</h1>
          <p className="text-paragraph">Administra los usuarios del sistema electoral</p>
        </div>
        <button
          onClick={handleCreateUser}
          className="px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText shadow-lg transition-all duration-200 font-semibold flex items-center gap-2 hover:shadow-xl"
          title="Crear usuario"
        >
          <FiPlus className="text-lg" />
          Crear Usuario
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-button/10 rounded-full">
              <FiUsers className="text-button text-xl" />
            </div>
            <div>
              <p className="text-paragraph text-sm">Total Usuarios</p>
              <p className="text-headline text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-full">
              <FiUsers className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-paragraph text-sm">Usuarios Activos</p>
              <p className="text-headline text-2xl font-bold">{activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <FiUsers className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-paragraph text-sm">Super Admins</p>
              <p className="text-headline text-2xl font-bold">{superAdmins}</p>
            </div>
          </div>
        </div>
        <div className="bg-main rounded-xl p-6 shadow-md border border-stroke">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-paragraph text-sm">Admin Elecciones</p>
              <p className="text-headline text-2xl font-bold">{adminElecciones}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-main rounded-xl p-6 shadow-md border border-stroke mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent transition-colors"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-10 pr-8 py-3 rounded-lg border border-stroke focus:ring-2 focus:ring-button focus:border-transparent transition-colors appearance-none bg-white"
            >
              <option value="">Todos los roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin_elecciones">Admin Elecciones</option>
              <option value="jurado_electoral">Jurado Electoral</option>
              <option value="admin_padron">Admin Padrón</option>
            </select>
          </div>
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-secondary text-headline hover:bg-secondary/80 transition-all duration-200 font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <FiRefreshCw className={`text-lg ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-button border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-paragraph">Cargando usuarios...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-tertiary/10 border border-tertiary/20 rounded-xl p-6 text-center">
          <p className="text-tertiary font-semibold">Error al cargar usuarios</p>
          <p className="text-tertiary text-sm mt-2">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers className="text-paragraph text-4xl mx-auto mb-4" />
              <h3 className="text-headline text-xl font-semibold mb-2">
                {searchTerm || filterRole ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
              </h3>
              <p className="text-paragraph">
                {searchTerm || filterRole 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza creando el primer usuario del sistema'
                }
              </p>
              {!searchTerm && !filterRole && (
                <button
                  onClick={handleCreateUser}
                  className="mt-4 px-6 py-3 rounded-lg bg-button hover:bg-highlight text-buttonText transition-all duration-200 font-semibold"
                >
                  Crear Primer Usuario
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={() => handleEditUser(user)}
                  onDelete={() => handleDeleteUser(user)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <UserCreateModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={handleCreated} />
      <UserEditModal open={!!editUser} user={editUser} onClose={() => setEditUser(null)} onUpdated={handleUpdated} />
      <ConfirmDeleteModal
        open={!!deleteUserObj}
        onCancel={() => setDeleteUserObj(null)}
        onConfirm={handleDeleteConfirm}
        message={deleteUserObj ? `¿Seguro que deseas eliminar a ${deleteUserObj.nombre}?` : ''}
      />
    </div>
  );
} 