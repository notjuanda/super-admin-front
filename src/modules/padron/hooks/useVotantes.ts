import { useEffect, useState } from 'react';
import type { Votante } from '../../core/types/sistema-padron-electoral/votante.types';
import { getVotantes } from '../../core/api/sistema-padron-electoral/votante.api';

export function useVotantes() {
  const [votantes, setVotantes] = useState<Votante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVotantes = () => {
    setLoading(true);
    getVotantes()
      .then(res => setVotantes(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVotantes();
  }, []);

  return { votantes, loading, error, refetch: fetchVotantes };
} 