import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-2xl text-gray-600 mt-4">Página No Encontrada</p>
        <Link to="/" className="inline-block px-6 py-3 mt-8 text-lg text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;