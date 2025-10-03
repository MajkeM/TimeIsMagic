import { createRoot } from "react-dom/client";
import GameCanvas from "./components/GameCanvas";
import {  BrowserRouter, Routes, Route } from "react-router-dom";
import {useState, useRef, useEffect} from "react";
import Home from "./Home";
import Loadout from "./Loadout";
import Settings from "./Settings";
import Credits from "./Credits";


export default function App() {

  // localStorage helper functions - easily removable for database transition
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };

  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  };

  // Level requirements only for characters
  const levelRequirements = {
    characters: {
      wizard: 1,
      rapunzel: 3,
      archer: 7,
      mage: 12,
      king: 18
    }
  };

  // Gold costs for abilities
  const abilityCosts = {
    R: {
      reload: 0,
      splash: 50,
      gravitywell: 100,
      freeze: 150,
      lightningstorm: 200,
      poisoncloud: 250,
      meteor: 300
    },
    F: {
      flash: 0,
      speed: 50,
      phasewalk: 100,
      shield: 150,
      dash: 200,
      wallcreation: 250
    },
    T: {
      teleport: 0,
      immortality: 50,
      scoreboost: 100,
      soldierHelp: 150,
      magnet: 200,
      mirrorclone: 250,
      berserkermode: 300
    }
  };

  const [showCollision, setShowCollision] = useState(false);
  const [R_ability, setR_Ability] = useState(loadFromStorage('R_ability', 'reload'));
  const [F_ability, setF_Ability] = useState(loadFromStorage('F_ability', 'flash'));
  const [T_ability, setT_Ability] = useState(loadFromStorage('T_ability', 'teleport'));

  const [gold, setGold] = useState(loadFromStorage('gold', 0));
  const [level, setLevel] = useState(loadFromStorage('level', 1));
  const [exp, setExp] = useState(loadFromStorage('exp', 0));

  const [character, setCharacter] = useState(loadFromStorage('character', 'wizard'));

  const handleGoldChange = (cost) => {
    setGold((prevGold) => {
      const newGold = prevGold - cost;
      saveToStorage('gold', newGold);
      return newGold;
    });
  };

  const handleCharacterChange = (event) => {
    const newCharacter = event.target.value;
    if (characterAvailability[newCharacter]) {
      setCharacter(newCharacter);
      saveToStorage('character', newCharacter);
    } else {
      alert(`Character ${newCharacter} requires level ${levelRequirements.characters[newCharacter]}!`);
    }
  }

  // Initialize ability availability from localStorage or default (only free abilities)
  const initializeAbilityAvailability = () => {
    return loadFromStorage('abilityAvailability', {
      R: {
        reload: true,
        splash: false,
        gravitywell: false,
        freeze: false,
        lightningstorm: false,
        poisoncloud: false,
        meteor: false
      },
      F: {
        flash: true,
        speed: false,
        phasewalk: false,
        shield: false,
        dash: false,
        wallcreation: false
      },
      T: {
        teleport: true,
        immortality: false,
        scoreboost: false,
        soldierHelp: false,
        magnet: false,
        mirrorclone: false,
        berserkermode: false
      }
    });
  };

  const [abilityAvailability, setAbilityAvailability] = useState(initializeAbilityAvailability());
  
  // Character availability based on level
  const [characterAvailability, setCharacterAvailability] = useState(
    loadFromStorage('characterAvailability', {
      wizard: true,
      rapunzel: false,
      archer: false,
      mage: false,
      king: false
    })
  );

  // Initialize availability on first load and level changes
  useEffect(() => {
    updateAvailabilityBasedOnLevel(level);
  }, [level]);

  // Update character availability when level changes
  const updateAvailabilityBasedOnLevel = (newLevel) => {
    // Update character availability
    const newCharacterAvailability = {};
    Object.keys(levelRequirements.characters).forEach(char => {
      newCharacterAvailability[char] = 
        characterAvailability[char] || newLevel >= levelRequirements.characters[char];
    });
    setCharacterAvailability(newCharacterAvailability);
    saveToStorage('characterAvailability', newCharacterAvailability);
  };

  // change ability avaibility state for ability that was unlocked
  const handleAbilityChangeAvailability = (abilityType, abilityName) => {
    const newAvailability = {
      ...abilityAvailability,
      [abilityType]: {
        ...abilityAvailability[abilityType],
        [abilityName]: true
      }
    };
    setAbilityAvailability(newAvailability);
    saveToStorage('abilityAvailability', newAvailability);
  };


  // function that will unlock ability if player has enough gold
  const checkEnoghGoldandUnlock = (abilityType, abilityName) => {
    const cost = abilityCosts[abilityType][abilityName];
    if (gold >= cost) {
      const newAvailability = {
        ...abilityAvailability,
        [abilityType]: {
          ...abilityAvailability[abilityType],
          [abilityName]: true
        }
      };
      setAbilityAvailability(newAvailability);
      saveToStorage('abilityAvailability', newAvailability);
      handleGoldChange(cost);
    } else {
      alert("Not enough gold to unlock this ability!");
    }
  }

  const handleAbilityChange = (event) => {
    const { name, value } = event.target;
    
    // Check if ability is available (purchased)
    if (!abilityAvailability[name][value]) {
      alert(`You need to purchase ${value} ability first!`);
      return;
    }
    
    if (name === "R") {
      setR_Ability(value);
      saveToStorage('R_ability', value);
    } else if (name === "F") {
      setF_Ability(value);
      saveToStorage('F_ability', value);
    } else if (name === "T") {
      setT_Ability(value);
      saveToStorage('T_ability', value);
    }
  }

  const toggleCollision = () => {
    setShowCollision((prev) => !prev);
  };

  const addGold = (amount) => {
    setGold((prevGold) => {
      const newGold = prevGold + amount;
      saveToStorage('gold', newGold);
      return newGold;
    });
  };

  const addExp = (amount) => {
    setExp((prevExp) => {
      const newExp = prevExp + amount;
      saveToStorage('exp', newExp);
      
      // Check if player should level up (every 100 exp points)
      const newLevel = Math.floor(newExp / 100) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        saveToStorage('level', newLevel);
        updateAvailabilityBasedOnLevel(newLevel);
      }
      
      return newExp;
    });
  };

  const resetXp = () => {
    setExp(0);
  }

  const addLevel = () => {
    setLevel((prevLevel) => prevLevel + 1);
  }

  

  return (
    <BrowserRouter>
      <Routes>

        <Route 
        path="/" 
        element={<Home gold={gold} level={level} exp={exp} />} 
        />

        <Route 
        path="/game" 
        element={<GameCanvas showCollision={showCollision} R_ability={R_ability} F_ability={F_ability} T_ability={T_ability} character={character} addGold={addGold} addExp={addExp} gold={gold} level={level} exp={exp} resetXp={resetXp} addLevel={addLevel} />}
        />

        <Route 
        path="/loadout" 
        element={<Loadout handleAbilityChange={handleAbilityChange} R_ability={R_ability} F_ability={F_ability} T_ability={T_ability} character={character} handleCharacterChange={handleCharacterChange} gold={gold} level={level} exp={exp} resetXp={resetXp} addLevel={addLevel} handleGoldChange={handleGoldChange} checkEnoghGoldandUnlock={checkEnoghGoldandUnlock} abilityAvailability={abilityAvailability} handleAbilityChangeAvailability={handleAbilityChangeAvailability} characterAvailability={characterAvailability} levelRequirements={levelRequirements} abilityCosts={abilityCosts} />} 
        />

        <Route 
        path="/settings" 
        element={<Settings toggleCollision={toggleCollision} gold={gold} level={level} exp={exp} resetXp={resetXp} addLevel={addLevel} />}
        />

        <Route 
        path="/credits" 
        element={<Credits gold={gold} level={level} exp={exp} resetXp={resetXp} addLevel={addLevel} />} 
        />

      </Routes>
    </BrowserRouter>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
