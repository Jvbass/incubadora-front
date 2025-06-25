import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-2xl text-gray-600">Página No Encontrada</p>
      <Link to="/" className="px-6 py-3 mt-8 text-lg text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFound;