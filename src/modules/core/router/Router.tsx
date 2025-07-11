import { createBrowserRouter } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";
import { LoginPage } from "../../auth/pages/LoginPage";
import { UsersPage } from "../../admin/pages/users/UsersPage";
import SeccionesPage from "../../admin/pages/seccion/SeccionesPage";
import CandidatosPage from "../../admin/pages/candidatos/CandidatosPage";
import PartidosPoliticosPage from "../../admin/pages/partidos-politicos/PartidosPoliticosPage";
import RecintosPage from "../../admin/pages/recintos/RecintosPage";
import EleccionesPage from "../../admin/pages/elecciones/EleccionesPage";
import CargosPage from "../../admin/pages/cargos/CargosPage";
import CandidaturasPage from "../../admin/pages/candidaturas/CandidaturasPage";

const router = createBrowserRouter([ 
    {
        path: "/",
        element: <PageLayout />,
        children: [
            {
                path: "/",
                element: <LoginPage />
            },
            {
                path: "/admin/dashboard",
                element: <UsersPage />
            },
            {
                path: "/admin/usuarios",
                element: <UsersPage />
            },
            {
                path: "/admin/secciones",
                element: <SeccionesPage />
            },
            {
                path: "/admin/candidatos",
                element: <CandidatosPage />
            },
            {
                path: "/admin/partidos-politicos",
                element: <PartidosPoliticosPage />
            },
            {
                path: "/admin/recintos",
                element: <RecintosPage />
            },
            {
                path: "/admin/elecciones",
                element: <EleccionesPage />
            },
            {
                path: "/admin/cargos",
                element: <CargosPage />
            },
            {
                path: "/admin/candidaturas",
                element: <CandidaturasPage />
            }
        ]
    },
]);

export default router;
