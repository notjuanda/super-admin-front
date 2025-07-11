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
import { MesasPage } from "../../admin/pages/mesas/MesasPage";
import { RoleGuard } from "../components/RoleGuard";
import { PapeletaListPage } from "../../admin/pages/papeleta/PapeletaListPage";

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
                element: <RoleGuard><UsersPage /></RoleGuard>
            },
            {
                path: "/admin/usuarios",
                element: <RoleGuard><UsersPage /></RoleGuard>
            },
            {
                path: "/admin/secciones",
                element: <RoleGuard><SeccionesPage /></RoleGuard>
            },
            {
                path: "/admin/candidatos",
                element: <RoleGuard><CandidatosPage /></RoleGuard>
            },
            {
                path: "/admin/partidos-politicos",
                element: <RoleGuard><PartidosPoliticosPage /></RoleGuard>
            },
            {
                path: "/admin/recintos",
                element: <RoleGuard><RecintosPage /></RoleGuard>
            },
            {
                path: "/admin/elecciones",
                element: <RoleGuard><EleccionesPage /></RoleGuard>
            },
            {
                path: "/admin/cargos",
                element: <RoleGuard><CargosPage /></RoleGuard>
            },
            {
                path: "/admin/candidaturas",
                element: <RoleGuard><CandidaturasPage /></RoleGuard>
            },
            {
                path: "/admin/mesas",
                element: <RoleGuard><MesasPage /></RoleGuard>
            },
            {
                path: "/admin/papeletas",
                element: <RoleGuard><PapeletaListPage /></RoleGuard>
            },
            {
                path: "/admin/papeletas/listado",
                element: <RoleGuard><PapeletaListPage /></RoleGuard>
            }
        ]
    },
]);

export default router;
