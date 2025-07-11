import { RouterProvider } from "react-router-dom";
import router from "./modules/core/router/Router.tsx";
import { GoogleMapsProvider } from "./modules/core/providers/GoogleMapsProvider.tsx";

function App() {
  return (
    <GoogleMapsProvider>
      <RouterProvider router={router} />
    </GoogleMapsProvider>
  );
}
export default App;