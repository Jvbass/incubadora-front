import { ThemeApplier } from "./components/layout/ThemeApplier";
import { BackgroundEffects } from "./components/layout/BackgroundEffects";
import AppRouter from "./router";

function App() {
  return (
    <div>
      <ThemeApplier />
      <BackgroundEffects />
      <main className="min-h-screen">
        <AppRouter />
      </main>
    </div>
  );
}

export default App;
