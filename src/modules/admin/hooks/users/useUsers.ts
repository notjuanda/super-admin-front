import { useState, useEffect } from 'react';
import { getUsers } from '../../../core/api/sistema-autenticacion/users.api';
import type { User } from '../../../core/types/sistema-autenticacion/user.types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Solo se ejecuta una vez al montar

  return { users, loading, error, refetch: fetchUsers };
} 