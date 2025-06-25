import AppRouter from "./router";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Aquí podrías añadir un layout general, como un Navbar o Footer si fuera necesario */}
      <main>
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
