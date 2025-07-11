import instance from './instance.api';

export const generarPapeletaPorSeccion = (seccionId: number, eleccionId: number) =>
    instance.get(`/papeletas/generar-por-seccion/${seccionId}/${eleccionId}`);

export const getPapeletas = () =>
    instance.get('/papeletas');

export const getPapeletaPorSeccionEleccion = (seccionId: number, eleccionId: number) =>
    instance.get(`/papeletas/por-seccion-eleccion/${seccionId}/${eleccionId}`); 