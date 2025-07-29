import { ThemeApplier } from "./components/layout/ThemeApplier";
import AppRouter from "./router";

function App() {
  return (
    <div>
      <ThemeApplier />
      {/* Aquí podrías añadir un layout general, como un Navbar o Footer si fuera necesario */}
      <main className="min-h-screen bg-bg-soft dark:bg-bg-darker">
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
