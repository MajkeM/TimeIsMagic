import { createRoot } from "react-dom/client";
import GameCanvas from "./components/GameCanvas";
import {  BrowserRouter, Routes, Route } from "react-router-dom";
import {useState, useRef, useEffect} from "react";
import Home from "./Home";
import Loadout from "./Loadout";
import Settings from "./Settings";
import Credits from "./Credits";


export default function App() {

  const [showCollision, setShowCollision] = useState(false);

  const toggleCollision = () => {
    setShowCollision((prev) => !prev);
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GameCanvas showCollision={showCollision} />} />
        <Route path="/loadout" element={<Loadout />} />
        <Route path="/settings" element={<Settings toggleCollision={toggleCollision} />} />
        <Route path="/credits" element={<Credits />} />
      </Routes>
    </BrowserRouter>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
