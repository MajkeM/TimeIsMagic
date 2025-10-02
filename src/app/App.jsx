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
  const [R_ability, setR_Ability] = useState("reload");
  const [F_ability, setF_Ability] = useState("flash");
  const [T_ability, setT_Ability] = useState("teleport");

  const [gold, setGold] = useState(0);
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(10);


  const[character, setCharacter] = useState("wizard");
  

  const handleCharacterChange = (event) => {
    setCharacter(event.target.value);
  }
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
        <Route path="/" element={<Home gold={gold} level={level} exp={exp} />} />
        <Route path="/game" element={<GameCanvas showCollision={showCollision} R_ability={R_ability} F_ability={F_ability} T_ability={T_ability} character={character} />} />
        <Route path="/loadout" element={<Loadout handleAbilityChange={handleAbilityChange} R_ability={R_ability} F_ability={F_ability} T_ability={T_ability} character={character} handleCharacterChange={handleCharacterChange} gold={gold} level={level} exp={exp} />} />
        <Route path="/settings" element={<Settings toggleCollision={toggleCollision} gold={gold} level={level} exp={exp} />} />
        <Route path="/credits" element={<Credits gold={gold} level={level} exp={exp} />} />
      </Routes>
    </BrowserRouter>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
