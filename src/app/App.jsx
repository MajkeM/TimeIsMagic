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
  const { isAuthenticated, loading: authLoading, user, logout } = useAuth();

  // Show auth screen if not authenticated
  if (authLoading) {
    return <LoadingScreen progress={50} message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  // Initialize loading for the entire app
  const { isLoading, progress, message } = useLoading(loadingSteps.app);

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
      // Clear corrupted localStorage item
      localStorage.removeItem(key);
      return defaultValue;
    }
  };

  // Version check and migration system
  const APP_VERSION = "2.0"; // Increase when data structure changes
  const checkAndMigrateStorage = () => {
    const storedVersion = localStorage.getItem('app_version');
    
    if (storedVersion !== APP_VERSION) {
      console.log('Migrating localStorage to new version:', APP_VERSION);
      
      // Clear old incompatible data
      const keysToKeep = ['gold', 'level', 'exp']; // Keep basic progress
      const currentGold = loadFromStorage('gold', 0);
      const currentLevel = loadFromStorage('level', 1);
      const currentExp = loadFromStorage('exp', 0);
      
      // Clear all localStorage
      localStorage.clear();
      
      // Restore basic progress
      saveToStorage('gold', currentGold);
      saveToStorage('level', currentLevel);
      saveToStorage('exp', currentExp);
      saveToStorage('app_version', APP_VERSION);
      
      console.log('Migration completed, kept progress:', { gold: currentGold, level: currentLevel, exp: currentExp });
    }
  };

  // Run migration check on app start
  useEffect(() => {
    checkAndMigrateStorage();
  }, []);

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
        saveToStorage('characterAvailability', newCharacterAvailability);
        return newCharacterAvailability;
      }
      
      return prev;
    });
  }, [level]);

  // Update character availability when level changes (for external calls)
  const updateAvailabilityBasedOnLevel = useCallback((newLevel) => {
    setCharacterAvailability(prev => {
      const newCharacterAvailability = {};
      Object.keys(levelRequirements.characters).forEach(char => {
        newCharacterAvailability[char] = 
          prev[char] || newLevel >= levelRequirements.characters[char];
      });
      saveToStorage('characterAvailability', newCharacterAvailability);
      return newCharacterAvailability;
    });
  }, []);

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
    setLevel((prevLevel) => {
      const newLevel = prevLevel + 1;
      saveToStorage('level', newLevel);
      updateAvailabilityBasedOnLevel(newLevel);
      return newLevel;
    });
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
