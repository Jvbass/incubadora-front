import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App.tsx";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthProvider } from "./components/providers/AuthProvider.tsx";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // default global staleTime de 15 minutos
      staleTime: 1000 * 60 * 15,
      refetchOnWindowFocus: false,
    },
  },
});

// Renderiza la aplicación React en el elemento con id "root"
const container = document.getElementById("root");

if (!container) {
  throw new Error("Failed to find the root element");
}

const root = ReactDOM.createRoot(container);

root.render(
  // Proveedor de react-query para manejo de datos remotos y caché
  <QueryClientProvider client={queryClient}>
    {/* Proveedor de autenticación e inicialización para manejar el estado de autorizacion del usuario */}
    <AuthProvider>
      {/* Permite navegación entre rutas sin recargar la página */}
      <BrowserRouter>
        <App />
        {/* Notificaciones tipo toast en la esquina inferior derecha */}
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{ duration: 4000 }}
        />
      </BrowserRouter>
    </AuthProvider>
    {/* Herramienta de desarrollo para depurar react-query */}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
