import { createBrowserRouter } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";
import { LoginPage } from "../../auth/pages/LoginPage";
import { UsersPage } from "../../admin/pages/users/UsersPage";
import SeccionesPage from "../../admin/pages/seccion/SeccionesPage";
import CandidatosPage from "../../admin/pages/candidatos/CandidatosPage";
import PartidosPoliticosPage from "../../admin/pages/partidos-politicos/PartidosPoliticosPage";

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
            }
        ]
    },
]);

export default router;
