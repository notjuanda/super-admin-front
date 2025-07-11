import { createBrowserRouter } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";
import { LoginPage } from "../../auth/pages/LoginPage";
import { UsersPage } from "../../admin/pages/users/UsersPage";
import SeccionesPage from "../../admin/pages/seccion/SeccionesPage";

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
            }
        ]
    },
]);

export default router;
