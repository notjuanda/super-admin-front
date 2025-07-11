import instance from './instance.api';

export const distribuirVotantesAutomaticamente = (recintoId: number, votantes: Array<{ id: string; nombreCompleto: string; ci: string }>) =>
    instance.post('/asignacion-votante-mesa/distribuir-automaticamente', { recintoId, votantes }); 