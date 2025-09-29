import { createRoot } from "react-dom/client";
import GameCanvas from "./components/GameCanvas";

export default function App() {
  return (
    <div>
      <GameCanvas />
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
