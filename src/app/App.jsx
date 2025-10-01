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
  const [R_ability, setR_Ability] = useState(null);
  const [F_ability, setF_Ability] = useState(null);
  const [T_ability, setT_Ability] = useState(null);

  const handleAbilityChange = (event) => {
    const { name, value } = event.target;
    if (name === "R") {
      setR_Ability(value);
    } else if (name === "F") {
      setF_Ability(value);
    } else if (name === "T") {
      setT_Ability(value);
    }
  }

  const toggleCollision = () => {
    setShowCollision((prev) => !prev);
  };


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GameCanvas showCollision={showCollision} R_ability={R_ability} F_ability={F_ability} T_ability={T_ability} />} />
        <Route path="/loadout" element={<Loadout handleAbilityChange={handleAbilityChange} />} />
        <Route path="/settings" element={<Settings toggleCollision={toggleCollision} />} />
        <Route path="/credits" element={<Credits />} />
      </Routes>
    </BrowserRouter>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
