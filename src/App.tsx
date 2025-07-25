import { ThemeApplier } from "./components/layout/ThemeApplier";
import AppRouter from "./router";

function App() {
  return (
    <div className="min-h-screen bg-ui-off-white dark:bg-brand-primary text-ui-text-secondary dark:text-ui-gray-medium transition-colors duration-300">
      <ThemeApplier /> {/* <-- 2. Añadir el componente aquí */}
      {/* Aquí podrías añadir un layout general, como un Navbar o Footer si fuera necesario */}
      <main>
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
