import { createRoot } from "react-dom/client";
import GameCanvas from "./components/GameCanvas";
import {  BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {useState, useRef, useEffect, useCallback} from "react";
import Home from "./Home";
import Loadout from "./Loadout";
import Settings from "./Settings";
import Credits from "./Credits";
import Leaderboard from "./Leaderboard";
import Achievements from "./Achievements";
import LoadingScreen from "./components/LoadingScreen";
import { useLoading, loadingSteps } from "./hooks/useLoading";
import { AuthProvider, useAuth } from "../contexts/AuthContext.jsx";
import Auth from "./components/Auth";
import AchievementNotification from "./components/AchievementNotification";

// Create wrapper component for authenticated content
function AuthenticatedApp() {
  const { isAuthenticated, loading: authLoading, user, token, logout, saveProgress, loadProgress } = useAuth();

  // Show auth screen if not authenticated
  if (authLoading) {
    return <LoadingScreen progress={50} message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Auth />;
  }

  // Initialize loading for the entire app
  const { isLoading, progress, message } = useLoading(loadingSteps.app);

  // Helper function to convert abilityAvailability to simple list
  const getUnlockedAbilitiesList = (unlockedAbilities) => {
    if (!unlockedAbilities) return [];
    const unlocked = [];
    Object.keys(unlockedAbilities).forEach(type => {
      Object.keys(unlockedAbilities[type]).forEach(ability => {
        if (unlockedAbilities[type][ability] === true) {
          unlocked.push(`${type}.${ability}`);
        }
      });
    });
    return unlocked;
  };

  // Helper function to convert simple list back to abilityAvailability format
  const buildAbilityAvailabilityFromList = (unlockedList) => {
    const baseAvailability = {
      R: {
        reload: true, // Always available
        splash: false,
        gravitywell: false,
        freeze: false,
        lightningstorm: false,
        poisoncloud: false,
        meteor: false
      },
      F: {
        flash: true, // Always available
        speed: false,
        phasewalk: false,
        shield: false,
        dash: false,
        wallcreation: false
      },
      T: {
        teleport: true, // Always available
        immortality: false,
        scoreboost: false,
        soldierHelp: false,
        magnet: false,
        mirrorclone: false,
        berserkermode: false
      }
    };

    // Mark unlocked abilities as available
    if (unlockedList && Array.isArray(unlockedList)) {
      unlockedList.forEach(item => {
        const [type, ability] = item.split('.');
        if (baseAvailability[type] && baseAvailability[type].hasOwnProperty(ability)) {
          baseAvailability[type][ability] = true;
        }
      });
    }

    return baseAvailability;
  };

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
    unlockedAbilities: {}, // Track purchased abilities
    settings: {},
    achievements: {}, // Achievement unlocks
    stats: { // Player statistics
      totalKills: 0,
      gamesPlayed: 0,
      totalGoldEarned: 0,
      abilitiesUnlocked: 3 // Default 3 free abilities
    }
  });

  // Achievement notifications
  const [activeNotifications, setActiveNotifications] = useState([]);

  // Ref to keep current gameData (always up-to-date, no closure issues)
  const gameDataRef = useRef(gameData);
  useEffect(() => {
    gameDataRef.current = gameData;
  }, [gameData]);

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
      const abilitiesData = JSON.parse(data.abilities || '{}');
      const unlockedAbilitiesList = abilitiesData.unlocked || [];
      console.log('📦 Raw achievements string from DB:', data.achievements);
      const achievementsData = JSON.parse(data.achievements || '{}');
      console.log('📦 Parsed achievements:', achievementsData);
      const settingsData = JSON.parse(data.settings || '{}');
      console.log('📦 Parsed settings:', settingsData);
      const statsData = settingsData.stats || {
        totalKills: 0,
        gamesPlayed: 0,
        totalGoldEarned: 0,
        abilitiesUnlocked: 3
      };
      console.log('📦 Stats data:', statsData);
      
      const parsedData = {
        gold: data.gold !== undefined ? data.gold : (data.score || 0), // Použij gold pokud existuje, jinak score pro kompatibilitu
        level: data.level || 1,
        exp: data.exp || 0, // přidáme exp z databáze
        bestScore: data.best_score || 0, // přidáme best score
        characters: abilitiesData.characters || { selected: 'wizard' },
        abilities: {
          R: abilitiesData.R || 'reload',
          F: abilitiesData.F || 'flash',
          T: abilitiesData.T || 'teleport'
        },
        unlockedAbilities: buildAbilityAvailabilityFromList(unlockedAbilitiesList),
        settings: settingsData,
        achievements: achievementsData,
        stats: statsData
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
      console.log('🔄 === DATA RELOAD START ===');
      console.log('🔄 Reloading game data from database...');
      const data = await loadFromDatabase({
        gold: 0,
        level: 1,
        exp: 0,
        characters: { selected: 'wizard' },
        abilities: {},
        settings: {}
      });
      
      console.log('🔄 Raw reloaded data:', data);
      
      const abilitiesReloadData = JSON.parse(data.abilities || '{}');
      const unlockedAbilitiesReloadList = abilitiesReloadData.unlocked || [];
      console.log('🔄 Unlocked abilities from DB:', unlockedAbilitiesReloadList);
      
      const achievementsReloadData = JSON.parse(data.achievements || '{}');
      const settingsReloadData = JSON.parse(data.settings || '{}');
      const statsReloadData = settingsReloadData.stats || gameData.stats;
      
      const parsedData = {
        gold: data.gold !== undefined ? data.gold : (data.score || 0), // Použij gold pokud existuje, jinak score pro kompatibilitu
        level: data.level || 1,
        exp: data.exp || 0,
        bestScore: data.best_score || 0,
        characters: abilitiesReloadData.characters || { selected: 'wizard' },
        abilities: {
          R: abilitiesReloadData.R || 'reload',
          F: abilitiesReloadData.F || 'flash',
          T: abilitiesReloadData.T || 'teleport'
        },
        unlockedAbilities: buildAbilityAvailabilityFromList(unlockedAbilitiesReloadList),
        settings: settingsReloadData,
        achievements: achievementsReloadData,
        stats: statsReloadData
      };
      
      console.log('🔄 Parsed reloaded data:', parsedData);
      console.log('🔄 Setting new gameData...');
      setGameData(parsedData);
      console.log('🔄 === DATA RELOAD SUCCESS ===');
    } catch (error) {
      console.error('🔄 === DATA RELOAD ERROR ===');
      console.error('🔄 Error reloading game data:', error);
    }
  };

  // Funkce pro uložení dat do databáze
  const saveGameData = async (newData) => {
    try {
      console.log('💾 === DATABASE SAVE START ===');
      console.log('💾 saveGameData called with:', newData);
      
      // Use ref to get latest state (no closure issues)
      console.log('💾 Current gameData before merge:', gameDataRef.current);
      const updatedData = { ...gameDataRef.current, ...newData };
      console.log('💾 Updated data will be:', updatedData);
      
      console.log('💾 Preparing database payload...');
      
      // Create clean, minimal payload to avoid 413 errors
      const cleanSettings = {
        stats: updatedData.stats || gameDataRef.current.stats
      };
      const cleanCharacters = { selected: updatedData.characters?.selected || 'wizard' };
      const cleanAbilities = {
        characters: cleanCharacters,
        R: updatedData.abilities?.R || 'reload',
        F: updatedData.abilities?.F || 'flash', 
        T: updatedData.abilities?.T || 'teleport'
      };
      
      const dbPayload = {
        level: updatedData.level || 1,
        gold: updatedData.gold || 0, // Gold má vlastní kolonu
        score: updatedData.score || 0, // Score je samostatný (herní skóre)
        best_score: newData.bestScore, // Pošle se pouze pokud je v newData, jinak undefined
        exp: updatedData.exp || 0,
        abilities: JSON.stringify({
          characters: cleanCharacters,
          R: updatedData.abilities?.R || 'reload',
          F: updatedData.abilities?.F || 'flash', 
          T: updatedData.abilities?.T || 'teleport',
          // FIXED: Priority for updatedData.unlockedAbilities when saving purchased abilities
          unlocked: getUnlockedAbilitiesList(
            updatedData.unlockedAbilities ? updatedData.unlockedAbilities : abilityAvailability
          )
        }),
        achievements: JSON.stringify(updatedData.achievements || {}),
        settings: JSON.stringify(cleanSettings)
      };
      console.log('💾 Database payload:', dbPayload);
      console.log('💾 Database payload size (bytes):', JSON.stringify(dbPayload).length);
      console.log('💾 best_score being sent:', dbPayload.best_score);
      console.log('💾 gold being sent:', dbPayload.gold);
      console.log('💾 score being sent:', dbPayload.score);
      console.log('💾 abilities.unlocked being sent:', JSON.parse(dbPayload.abilities).unlocked);
      console.log('💾 achievements being sent:', JSON.parse(dbPayload.achievements));
      console.log('💾 settings (with stats) being sent:', JSON.parse(dbPayload.settings));
      
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
    // WARNING: This function only changes gold, not abilities!
    // For ability purchases, use checkEnoghGoldandUnlock instead
    console.log('⚠️  handleGoldChange called - this should only be used for simple gold operations');
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
    // Use unlockedAbilities from gameData, fallback to default
    return gameData.unlockedAbilities || {
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
  
  // Update abilityAvailability when gameData.unlockedAbilities changes
  useEffect(() => {
    if (gameData.unlockedAbilities) {
      setAbilityAvailability(gameData.unlockedAbilities);
    }
  }, [gameData.unlockedAbilities]);
  
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
        // Don't save characterAvailability to database - it's calculated locally based on level
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
      // Don't save characterAvailability to database - it's calculated locally
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
    // Don't save abilityAvailability to database - it's managed locally
  };


  // function that will unlock ability if player has enough gold
  const checkEnoghGoldandUnlock = async (abilityType, abilityName) => {
    const cost = abilityCosts[abilityType][abilityName];
    if (gold >= cost) {
      console.log('🛒 === ABILITY PURCHASE START ===');
      console.log('🛒 Purchasing:', abilityType, abilityName, 'for', cost, 'gold');
      console.log('🛒 Current gold:', gold);
      console.log('🛒 Current unlocked abilities:', abilityAvailability);
      
      const newGold = gold - cost;
      const newAvailability = {
        ...abilityAvailability,
        [abilityType]: {
          ...abilityAvailability[abilityType],
          [abilityName]: true
        }
      };
      
      console.log('🛒 New gold will be:', newGold);
      console.log('🛒 New availability state:', newAvailability);
      
      try {
        // Count total unlocked abilities
        const totalUnlocked = Object.values(newAvailability).reduce((sum, typeAbilities) => {
          return sum + Object.values(typeAbilities).filter(unlocked => unlocked).length;
        }, 0);
        
        // Update stats with new ability count
        const newStats = {
          ...gameData.stats,
          abilitiesUnlocked: totalUnlocked
        };
        
        // Save both gold, abilities, and stats in ONE operation to prevent race condition
        console.log('🛒 Saving gold, abilities, and stats together...');
        await saveGameData({ 
          gold: newGold,
          unlockedAbilities: newAvailability,
          stats: newStats
        });

        // Update local state after successful save
        setAbilityAvailability(newAvailability);
        
        console.log('🛒 === ABILITY PURCHASE SUCCESS ===');
        console.log('🛒 New gold:', newGold);
        console.log('🛒 Ability unlocked:', abilityType, abilityName);
        console.log('🛒 Total abilities unlocked:', totalUnlocked);
      } catch (error) {
        console.error('🛒 === ABILITY PURCHASE ERROR ===');
        console.error('🛒 Failed to save purchase:', error);
        alert('Failed to purchase ability. Please try again.');
        throw error;
      }
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

  // Combined function to add both gold and exp in one database operation
  const addGoldAndExp = async (goldAmount, expAmount, currentScore = 0, killCount = 0) => {
    console.log('🎁 === COMBINED GOLD+EXP OPERATION START ===');
    console.log('🎁 Adding gold:', goldAmount, 'exp:', expAmount, 'current score:', currentScore, 'kills:', killCount);
    console.log('🎁 Current gold:', gold, 'exp:', exp, 'best score:', gameData.bestScore);
    console.log('🎁 Current stats BEFORE:', gameData.stats);
    
    try {
      const newGold = gold + goldAmount;
      const newExp = exp + expAmount;
      console.log('🎁 New gold will be:', newGold, 'new exp:', newExp);
      
      // Check if player should level up (every 100 exp points)
      const newLevel = Math.floor(newExp / 100) + 1;
      const dataToSave = { gold: newGold, exp: newExp };
      
      // Update stats
      const previousKills = gameData.stats?.totalKills || 0;
      const newTotalKills = previousKills + killCount;
      console.log('🎁 Previous total kills:', previousKills);
      console.log('🎁 Kills this game:', killCount);
      console.log('🎁 New total kills will be:', newTotalKills);
      
      const newStats = {
        ...gameData.stats,
        totalKills: newTotalKills,
        gamesPlayed: (gameData.stats?.gamesPlayed || 0) + 1,
        totalGoldEarned: (gameData.stats?.totalGoldEarned || 0) + goldAmount,
        abilitiesUnlocked: gameData.stats?.abilitiesUnlocked || 3
      };
      console.log('🎁 New stats object:', newStats);
      dataToSave.stats = newStats;
      
      // Check achievements
      console.log('🏆 Current achievements before check:', gameData.achievements);
      console.log('🏆 Stats for achievement check:', newStats);
      const newAchievements = checkAndUnlockAchievements(newStats, newLevel, currentScore);
      console.log('🏆 checkAndUnlockAchievements returned:', newAchievements);
      if (Object.keys(newAchievements).length > 0) {
        dataToSave.achievements = { ...gameData.achievements, ...newAchievements };
        console.log('🏆 New achievements unlocked:', Object.keys(newAchievements));
        console.log('🏆 Combined achievements to save:', dataToSave.achievements);
      }
      
      // Check if current score is a new best score
      if (currentScore > (gameData.bestScore || 0)) {
        console.log('🏆 New best score!', currentScore, '(previous:', gameData.bestScore, ')');
        dataToSave.bestScore = currentScore;
        newStats.bestScore = currentScore;
      } else {
        console.log('🎁 No new best score. Current:', currentScore, 'Best:', gameData.bestScore);
      }
      
      if (newLevel > level) {
        console.log('🎁 Level up detected! New level:', newLevel);
        dataToSave.level = newLevel;
        await saveGameData(dataToSave);
        console.log('🎁 Updating character availability for new level...');
        updateAvailabilityBasedOnLevel(newLevel);
      } else {
        console.log('🎁 No level up, saving gold, exp, stats, and best score...');
        await saveGameData(dataToSave);
      }
      
      console.log('🎁 === COMBINED GOLD+EXP OPERATION SUCCESS ===');
    } catch (error) {
      console.error('🎁 === COMBINED GOLD+EXP OPERATION ERROR ===');
      console.error('🎁 Failed to save gold and exp:', error);
      throw error;
    }
  };

  // Check and unlock achievements based on stats
  const checkAndUnlockAchievements = (stats, currentLevel, bestScore) => {
    console.log('🏆 === CHECKING ACHIEVEMENTS ===');
    console.log('🏆 Stats:', stats);
    console.log('🏆 Current Level:', currentLevel);
    console.log('🏆 Best Score:', bestScore);
    console.log('🏆 Current gameData.achievements:', gameData.achievements);
    
    const newAchievements = {};
    
    // Kill achievements
    console.log('🏆 Checking kill achievements - totalKills:', stats.totalKills);
    if (stats.totalKills >= 1 && !gameData.achievements?.first_kill) {
      console.log('🏆 UNLOCKING: first_kill');
      newAchievements.first_kill = true;
    }
    if (stats.totalKills >= 10 && !gameData.achievements?.killer_10) {
      console.log('🏆 UNLOCKING: killer_10');
      newAchievements.killer_10 = true;
    }
    if (stats.totalKills >= 50 && !gameData.achievements?.killer_50) {
      console.log('🏆 UNLOCKING: killer_50');
      newAchievements.killer_50 = true;
    }
    if (stats.totalKills >= 100 && !gameData.achievements?.killer_100) {
      console.log('🏆 UNLOCKING: killer_100');
      newAchievements.killer_100 = true;
    }
    
    // Games played achievements
    if (stats.gamesPlayed >= 5 && !gameData.achievements?.survivor_5) {
      newAchievements.survivor_5 = true;
    }
    if (stats.gamesPlayed >= 20 && !gameData.achievements?.survivor_20) {
      newAchievements.survivor_20 = true;
    }
    
    // Score achievements
    if (bestScore >= 100 && !gameData.achievements?.score_100) {
      newAchievements.score_100 = true;
    }
    if (bestScore >= 500 && !gameData.achievements?.score_500) {
      newAchievements.score_500 = true;
    }
    
    // Gold achievement
    if (stats.totalGoldEarned >= 1000 && !gameData.achievements?.gold_collector) {
      newAchievements.gold_collector = true;
    }
    
    // Level achievements
    if (currentLevel >= 5 && !gameData.achievements?.level_5) {
      newAchievements.level_5 = true;
    }
    if (currentLevel >= 10 && !gameData.achievements?.level_10) {
      newAchievements.level_10 = true;
    }
    
    // Ability master achievement
    if (stats.abilitiesUnlocked >= 18 && !gameData.achievements?.ability_master) {
      newAchievements.ability_master = true;
    }
    
    // Show notifications for new achievements
    console.log('🏆 newAchievements to show notifications for:', Object.keys(newAchievements));
    Object.keys(newAchievements).forEach(achievementId => {
      console.log('🏆 Adding notification for:', achievementId);
      setActiveNotifications(prev => {
        const updated = [...prev, { id: achievementId, timestamp: Date.now() }];
        console.log('🏆 Active notifications updated:', updated);
        return updated;
      });
    });
    
    console.log('🏆 === ACHIEVEMENTS CHECK COMPLETE ===');
    return newAchievements;
  };

  const addGold = async (amount) => {
    console.log('🪙 === GOLD OPERATION START ===');
    console.log('🪙 addGold called with amount:', amount);
    console.log('🪙 Current gold before operation:', gold);
    
    try {
      const newGold = gold + amount;
      console.log('🪙 New gold will be:', newGold);
      
      // Use saveGameData to keep consistent with addExp
      console.log('🪙 Using saveGameData...');
      await saveGameData({ gold: newGold });
      
      console.log('🪙 === GOLD OPERATION SUCCESS ===');
      console.log('🪙 New gold value:', newGold);
    } catch (error) {
      console.error('🪙 === GOLD OPERATION ERROR ===');
      console.error('🪙 Failed to save gold:', error);
      throw error;
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
      {/* Achievement Notifications */}
      {activeNotifications.map(notification => (
        <AchievementNotification
          key={notification.timestamp}
          achievement={notification.id}
          onClose={() => setActiveNotifications(prev => prev.filter(n => n.timestamp !== notification.timestamp))}
        />
      ))}
      
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
          addGoldAndExp={addGoldAndExp} 
          gold={gold || 0} 
          level={level || 1} 
          exp={exp || 0} 
          bestScore={gameData.bestScore || 0}
          resetXp={resetXp} 
          addLevel={addLevel} 
          reloadGameData={reloadGameData}
          achievements={gameData.achievements || {}}
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

        <Route 
        path="/achievements" 
        element={<Achievements 
          gold={gold || 0} 
          level={level || 1} 
          exp={exp || 0} 
          resetXp={resetXp} 
          addLevel={addLevel}
          achievements={gameData.achievements || {}}
          stats={{...gameData.stats, bestScore: gameData.bestScore}}
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
