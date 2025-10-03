import { createRoot } from "react-dom/client";
import GameCanvas from "./components/GameCanvas";
import {  BrowserRouter, Routes, Route } from "react-router-dom";
import {useState, useRef, useEffect, useCallback} from "react";
import Home from "./Home";
import Loadout from "./Loadout";
import Settings from "./Settings";
import Credits from "./Credits";
import LoadingScreen from "./components/LoadingScreen";
import { useLoading, loadingSteps } from "./hooks/useLoading";
import { AuthProvider, useAuth } from "../contexts/AuthContext.jsx";
import Auth from "./components/Auth";

// Create wrapper component for authenticated content
function AuthenticatedApp() {
  const { isAuthenticated, loading: authLoading, user, logout, saveProgress, loadProgress } = useAuth();

  // Show auth screen if not authenticated
  if (authLoading) {
    return <LoadingScreen progress={50} message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  // Initialize loading for the entire app
  const { isLoading, progress, message } = useLoading(loadingSteps.app);

  // Database helper functions - replaces localStorage
  const saveToDatabase = async (data) => {
    try {
      await saveProgress(data);
    } catch (error) {
      console.error('Failed to save to database:', error);
    }
  };

  const loadFromDatabase = async (defaultValue = {}) => {
    try {
      const progressData = await loadProgress();
      return progressData || defaultValue;
    } catch (error) {
      console.error('Failed to load from database:', error);
      return defaultValue;
    }
  };

  // State pro herní data - načte se z databáze
  const [gameData, setGameData] = useState({
    gold: 0,
    level: 1,
    exp: 0,
    characters: { selected: 'wizard' },
    abilities: {},
    settings: {}
  });

  // Načtení dat z databáze při startu
  useEffect(() => {
    const loadGameData = async () => {
      const data = await loadFromDatabase({
        gold: 0,
        level: 1,
        exp: 0,
        characters: { selected: 'wizard' },
        abilities: {},
        settings: {}
      });
      
      // Parsujeme JSON stringy z databáze
      const parsedData = {
        gold: data.score || 0, // score v databázi = gold v aplikaci
        level: data.level || 1,
        exp: 0, // můžeme později přidat do databáze
        characters: JSON.parse(data.abilities || '{}').characters || { selected: 'wizard' },
        abilities: JSON.parse(data.abilities || '{}').abilities || {},
        settings: JSON.parse(data.settings || '{}')
      };
      
      setGameData(parsedData);
    };
    
    loadGameData();
  }, [user]);

  // Funkce pro uložení dat do databáze
  const saveGameData = async (newData) => {
    console.log('saveGameData called with:', newData);
    console.log('Current gameData:', gameData);
    const updatedData = { ...gameData, ...newData };
    console.log('Updated data will be:', updatedData);
    setGameData(updatedData);
    
    // Uložíme do databáze ve správném formátu
    await saveToDatabase({
      level: updatedData.level,
      score: updatedData.gold, // gold = score v databázi
      abilities: JSON.stringify({
        characters: updatedData.characters,
        abilities: updatedData.abilities
      }),
      achievements: JSON.stringify([]), // zatím prázdné
      settings: JSON.stringify(updatedData.settings)
    });
    console.log('Data saved to database successfully');
  };

  // Sync character state when gameData changes
  useEffect(() => {
    if (gameData.characters?.selected) {
      setCharacter(gameData.characters.selected);
    }
  }, [gameData.characters]);

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
  // Game state derived from database data
  const [R_ability, setR_Ability] = useState('reload');
  const [F_ability, setF_Ability] = useState('flash'); 
  const [T_ability, setT_Ability] = useState('teleport');

  // Update local state when gameData changes
  useEffect(() => {
    setR_Ability(gameData.abilities?.R || 'reload');
    setF_Ability(gameData.abilities?.F || 'flash');
    setT_Ability(gameData.abilities?.T || 'teleport');
  }, [gameData]);

  const gold = gameData.gold;
  const level = gameData.level;
  const exp = gameData.exp;

  const [character, setCharacter] = useState(gameData.characters?.selected || 'wizard');

  const handleGoldChange = async (cost) => {
    const newGold = gold - cost;
    await saveGameData({ gold: newGold });
  };

  const handleCharacterChange = async (event) => {
    const newCharacter = event.target.value;
    if (characterAvailability[newCharacter]) {
      setCharacter(newCharacter);
      await saveGameData({ 
        characters: { ...gameData.characters, selected: newCharacter }
      });
    } else {
      alert(`Character ${newCharacter} requires level ${levelRequirements.characters[newCharacter]}!`);
    }
  }

  // Initialize ability availability from gameData or default (only free abilities)
  const initializeAbilityAvailability = () => {
    return gameData.abilities?.abilityAvailability || {
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
    };
  };

  const [abilityAvailability, setAbilityAvailability] = useState(initializeAbilityAvailability());
  
  // Character availability based on level
  const [characterAvailability, setCharacterAvailability] = useState(
    gameData.abilities?.characterAvailability || {
      wizard: true,
      rapunzel: false,
      archer: false,
      mage: false,
      king: false
    }
  );

  // Initialize availability on first load and level changes
  useEffect(() => {
    // Update character availability directly in useEffect to avoid circular dependencies
    setCharacterAvailability(prev => {
      const newCharacterAvailability = {};
      Object.keys(levelRequirements.characters).forEach(char => {
        newCharacterAvailability[char] = 
          prev[char] || level >= levelRequirements.characters[char];
      });
      
      // Only update if there's a change
      const hasChanges = Object.keys(newCharacterAvailability).some(
        char => newCharacterAvailability[char] !== prev[char]
      );
      
      if (hasChanges) {
        saveGameData({ 
          abilities: { ...gameData.abilities, characterAvailability: newCharacterAvailability }
        });
        return newCharacterAvailability;
      }
      
      return prev;
    });
  }, [level]);

  // Update character availability when level changes (for external calls)
  const updateAvailabilityBasedOnLevel = useCallback(async (newLevel) => {
    setCharacterAvailability(prev => {
      const newCharacterAvailability = {};
      Object.keys(levelRequirements.characters).forEach(char => {
        newCharacterAvailability[char] = 
          prev[char] || newLevel >= levelRequirements.characters[char];
      });
      saveGameData({ 
        abilities: { ...gameData.abilities, characterAvailability: newCharacterAvailability }
      });
      return newCharacterAvailability;
    });
  }, [gameData.abilities]);

  // change ability avaibility state for ability that was unlocked
  const handleAbilityChangeAvailability = async (abilityType, abilityName) => {
    const newAvailability = {
      ...abilityAvailability,
      [abilityType]: {
        ...abilityAvailability[abilityType],
        [abilityName]: true
      }
    };
    setAbilityAvailability(newAvailability);
    await saveGameData({ 
      abilities: { ...gameData.abilities, abilityAvailability: newAvailability }
    });
  };


  // function that will unlock ability if player has enough gold
  const checkEnoghGoldandUnlock = async (abilityType, abilityName) => {
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
      const newGold = gold - cost;
      await saveGameData({ 
        gold: newGold,
        abilities: { ...gameData.abilities, abilityAvailability: newAvailability }
      });
    } else {
      alert("Not enough gold to unlock this ability!");
    }
  }

  const handleAbilityChange = async (event) => {
    const { name, value } = event.target;
    
    // Check if ability is available (purchased)
    if (!abilityAvailability[name][value]) {
      alert(`You need to purchase ${value} ability first!`);
      return;
    }
    
    if (name === "R") {
      setR_Ability(value);
      await saveGameData({ 
        abilities: { ...gameData.abilities, R: value }
      });
    } else if (name === "F") {
      setF_Ability(value);
      await saveGameData({ 
        abilities: { ...gameData.abilities, F: value }
      });
    } else if (name === "T") {
      setT_Ability(value);
      await saveGameData({ 
        abilities: { ...gameData.abilities, T: value }
      });
    }
  }

  const toggleCollision = () => {
    setShowCollision((prev) => !prev);
  };

  const addGold = async (amount) => {
    console.log('addGold called with amount:', amount);
    console.log('Current gold:', gold);
    const newGold = gold + amount;
    console.log('New gold will be:', newGold);
    await saveGameData({ gold: newGold });
    console.log('Gold saved to database');
  };

  const addExp = async (amount) => {
    const newExp = exp + amount;
    
    // Check if player should level up (every 100 exp points)
    const newLevel = Math.floor(newExp / 100) + 1;
    if (newLevel > level) {
      await saveGameData({ exp: newExp, level: newLevel });
      updateAvailabilityBasedOnLevel(newLevel);
    } else {
      await saveGameData({ exp: newExp });
    }
  };

  const resetXp = async () => {
    await saveGameData({ exp: 0 });
  }

  const addLevel = async () => {
    const newLevel = level + 1;
    await saveGameData({ level: newLevel });
    updateAvailabilityBasedOnLevel(newLevel);
  }

  // Add error boundary for safer navigation
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error('App error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Something went wrong!</h2>
        <button onClick={() => {
          setHasError(false);
          window.location.reload();
        }}>
          Reload App
        </button>
      </div>
    );
  }

  // Show loading screen while app is initializing
  if (isLoading) {
    return <LoadingScreen progress={progress} message={message} />;
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route 
        path="/" 
        element={<Home gold={gold || 0} level={level || 1} exp={exp || 0} />} 
        />

        <Route 
        path="/game" 
        element={<GameCanvas 
          showCollision={showCollision} 
          R_ability={R_ability || 'reload'} 
          F_ability={F_ability || 'flash'} 
          T_ability={T_ability || 'teleport'} 
          character={character || 'wizard'} 
          addGold={addGold} 
          addExp={addExp} 
          gold={gold || 0} 
          level={level || 1} 
          exp={exp || 0} 
          resetXp={resetXp} 
          addLevel={addLevel} 
        />}
        />

        <Route 
        path="/loadout" 
        element={<Loadout 
          handleAbilityChange={handleAbilityChange} 
          R_ability={R_ability || 'reload'} 
          F_ability={F_ability || 'flash'} 
          T_ability={T_ability || 'teleport'} 
          character={character || 'wizard'} 
          handleCharacterChange={handleCharacterChange} 
          gold={gold || 0} 
          level={level || 1} 
          exp={exp || 0} 
          resetXp={resetXp} 
          addLevel={addLevel} 
          handleGoldChange={handleGoldChange} 
          checkEnoghGoldandUnlock={checkEnoghGoldandUnlock} 
          abilityAvailability={abilityAvailability || {}} 
          handleAbilityChangeAvailability={handleAbilityChangeAvailability} 
          characterAvailability={characterAvailability || {}} 
          levelRequirements={levelRequirements || {}} 
          abilityCosts={abilityCosts || {}} 
        />} 
        />

        <Route 
        path="/settings" 
        element={<Settings 
          toggleCollision={toggleCollision} 
          gold={gold || 0} 
          level={level || 1} 
          exp={exp || 0} 
          resetXp={resetXp} 
          addLevel={addLevel} 
        />}
        />

        <Route 
        path="/credits" 
        element={<Credits 
          gold={gold || 0} 
          level={level || 1} 
          exp={exp || 0} 
          resetXp={resetXp} 
          addLevel={addLevel} 
        />} 
        />

      </Routes>
      
      {/* User info in top right corner */}
      {user && (
        <div className="user-info">
          Welcome, {user.username}!
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </BrowserRouter>
  );
}

// Main App component with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
