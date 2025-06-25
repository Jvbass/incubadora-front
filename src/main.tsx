import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from './App.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Envolvemos la app con el Router para habilitar el enrutamiento */}
    <BrowserRouter>
      {/* Envolvemos con el AuthProvider para que toda la app tenga acceso al contexto */}
      <AuthProvider>
        <App />
        {/* El componente Toaster renderizará las notificaciones */}
        <Toaster position="top-right" reverseOrder={false} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
