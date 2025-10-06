import { createRoot } from "react-dom/client";
import GameCanvas from "./components/GameCanvas";
import {  BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {useState, useRef, useEffect, useCallback} from "react";
import Home from "./Home";
import Loadout from "./Loadout";
import Settings from "./Settings";
import Credits from "./Credits";
import Leaderboard from "./Leaderboard";
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
      console.log('💾 saveToDatabase called with:', data);
      const result = await saveProgress(data);
      console.log('💾 saveProgress returned:', result);
      return result; // Return the result from saveProgress
    } catch (error) {
      console.error('💾 saveToDatabase error:', error);
      return { success: false, error: error.message };
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
    bestScore: 0,
    characters: { selected: 'wizard' },
    abilities: {},
    settings: {}
  });

  // Načtení dat z databáze při startu
  useEffect(() => {
    const loadGameData = async () => {
      console.log('Loading game data from database for user:', user);
      const data = await loadFromDatabase({
        gold: 0,
        level: 1,
        exp: 0,
        characters: { selected: 'wizard' },
        abilities: {},
        settings: {}
      });
      
      console.log('Raw data from database:', data);
      
      // Parsujeme JSON stringy z databáze
      const parsedData = {
        gold: data.score || 0, // score v databázi = gold v aplikaci
        level: data.level || 1,
        exp: data.exp || 0, // přidáme exp z databáze
        bestScore: data.best_score || 0, // přidáme best score
        characters: JSON.parse(data.abilities || '{}').characters || { selected: 'wizard' },
        abilities: JSON.parse(data.abilities || '{}').abilities || {},
        settings: JSON.parse(data.settings || '{}')
      };
      
      console.log('Parsed game data:', parsedData);
      setGameData(parsedData);
    };
    
    if (user) {
      loadGameData();
    }
  }, [user]);

  // Funkce pro reload dat z databáze (pro použití po hře)
  const reloadGameData = async () => {
    try {
      console.log('Reloading game data from database...');
      const data = await loadFromDatabase({
        gold: 0,
        level: 1,
        exp: 0,
        characters: { selected: 'wizard' },
        abilities: {},
        settings: {}
      });
      
      const parsedData = {
        gold: data.score || 0,
        level: data.level || 1,
        exp: data.exp || 0,
        bestScore: data.best_score || 0,
        characters: JSON.parse(data.abilities || '{}').characters || { selected: 'wizard' },
        abilities: JSON.parse(data.abilities || '{}').abilities || {},
        settings: JSON.parse(data.settings || '{}')
      };
      
      console.log('Reloaded data:', parsedData);
      setGameData(parsedData);
    } catch (error) {
      console.error('Error reloading game data:', error);
    }
  };

  // Funkce pro uložení dat do databáze
  const saveGameData = async (newData) => {
    try {
      console.log('💾 === DATABASE SAVE START ===');
      console.log('💾 saveGameData called with:', newData);
      console.log('💾 Current gameData before merge:', gameData);
      const updatedData = { ...gameData, ...newData };
      console.log('💾 Updated data will be:', updatedData);
      
      console.log('💾 Preparing database payload...');
      const dbPayload = {
        level: updatedData.level,
        score: updatedData.gold, // gold = score v databázi
        best_score: Math.max(updatedData.bestScore || 0, updatedData.gold || 0), // Update best score if current gold is higher
        exp: updatedData.exp,
        abilities: JSON.stringify({
          characters: updatedData.characters,
          abilities: updatedData.abilities
        }),
        achievements: JSON.stringify([]),
        settings: JSON.stringify(updatedData.settings)
      };
      console.log('💾 Database payload:', dbPayload);
      
      // Uložíme do databáze ve správném formátu
      const saveResult = await saveToDatabase(dbPayload);
      console.log('💾 Database save result:', saveResult);
      
      // Check if save was successful - handle undefined result
      if (saveResult && saveResult.success !== false) {
        console.log('💾 Database save successful, updating React state...');
        setGameData(updatedData);
        console.log('💾 React state updated successfully');
      } else {
        console.error('💾 Database save failed, keeping old state');
        const errorMsg = saveResult?.error || 'Unknown database error';
        throw new Error(`Database save failed: ${errorMsg}`);
      }
      
      console.log('💾 === DATABASE SAVE SUCCESS ===');
    } catch (error) {
      console.error('💾 === DATABASE SAVE ERROR ===');
      console.error('💾 Error saving to database:', error);
      // Show user-friendly error message
      alert('Nepodařilo se uložit data do databáze. Zkuste to prosím znovu.');
      throw error; // Re-throw so calling functions know about the failure
    }
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
      rapunzel: 2,
      archer: 3,
      mage: 4,
      king: 5
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

  // Debug re-rendering
  useEffect(() => {
    console.log('🔄 COMPONENT RE-RENDER: Gold changed to:', gold);
  }, [gold]);

  useEffect(() => {
    console.log('🔄 COMPONENT RE-RENDER: Level changed to:', level);
  }, [level]);

  useEffect(() => {
    console.log('🔄 COMPONENT RE-RENDER: Exp changed to:', exp);
  }, [exp]);

  useEffect(() => {
    console.log('🔄 COMPONENT RE-RENDER: GameData changed:', gameData);
  }, [gameData]);

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
    console.log('🪙 === GOLD OPERATION START ===');
    console.log('🪙 addGold called with amount:', amount);
    console.log('🪙 Current gold before operation:', gold);
    console.log('🪙 Current gameData.gold:', gameData.gold);
    const newGold = gold + amount;
    console.log('🪙 New gold will be:', newGold);
    
    try {
      console.log('🪙 Saving to database...');
      await saveGameData({ gold: newGold });
      console.log('🪙 === GOLD OPERATION SUCCESS ===');
    } catch (error) {
      console.error('🪙 === GOLD OPERATION ERROR ===');
      console.error('🪙 Failed to save gold:', error);
      throw error; // Re-throw so calling functions know about the failure
    }
  };

  const addExp = async (amount) => {
    console.log('⭐ === EXP OPERATION START ===');
    console.log('⭐ addExp called with amount:', amount);
    console.log('⭐ Current exp before operation:', exp);
    console.log('⭐ Current gameData.exp:', gameData.exp);
    const newExp = exp + amount;
    console.log('⭐ New exp will be:', newExp);
    
    try {
      // Check if player should level up (every 100 exp points)
      const newLevel = Math.floor(newExp / 100) + 1;
      if (newLevel > level) {
        console.log('⭐ Level up detected! New level:', newLevel);
        console.log('⭐ Saving both exp and level to database...');
        await saveGameData({ exp: newExp, level: newLevel });
        console.log('⭐ Updating character availability for new level...');
        updateAvailabilityBasedOnLevel(newLevel);
      } else {
        console.log('⭐ No level up, saving only exp to database...');
        await saveGameData({ exp: newExp });
      }
      console.log('⭐ === EXP OPERATION SUCCESS ===');
    } catch (error) {
      console.error('⭐ === EXP OPERATION ERROR ===');
      console.error('⭐ Failed to save exp:', error);
      throw error; // Re-throw so calling functions know about the failure
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
          bestScore={gameData.bestScore || 0}
          resetXp={resetXp} 
          addLevel={addLevel} 
          reloadGameData={reloadGameData}
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

        <Route 
        path="/leaderboard" 
        element={<Leaderboard 
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
