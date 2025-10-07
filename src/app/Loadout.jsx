import React, { useEffect } from "react";
import "./globals.css";
import "./medieval-theme.css";
import Navbar from "./components/Navbar";
import UserGoldLevelBar from "./components/UserGoldLevelBar";
import PageWrapper from "./components/PageWrapper";
import { loadingSteps } from "./hooks/useLoading";

import reloadAbility from "./Sprites/reload-ability.png"; 
import flashAbility from "./Sprites/flash-ability.png";
import teleportAbility from "./Sprites/teleport-ability.png";
import speedAbility from "./Sprites/speed-ability.png";
import splashAbility from "./Sprites/splash-ability.png";
import gravitywellAbility from "./Sprites/gravityWellAbility.png";
import phaseAbility from "./Sprites/phaseAbility.png";
import scoreAbility from "./Sprites/scoreAbility.png";
import immortalityAbility from "./Sprites/immortality-ability.png";
import soldierAbility from "./Sprites/soldier-ability.png";

// New abilities (using existing sprites as placeholders)














// New abilities (using existing sprites as placeholders)
import freezeAbility from "./Sprites/freeze-ability.png";
import lightningStormAbility from "./Sprites/lightning-ability.png"; // Lightning resembles flash
import poisonCloudAbility from "./Sprites/poison-ability.png"; // Cloud/splash effect
import meteorAbility from "./Sprites/meteor-ability.png"; // Rock represents meteor
import shieldAbility from "./Sprites/shield-ability.png"; // Shield-like protection
import dashAbility from "./Sprites/dash-ability.png"; // Fast movement like flash
import wallCreationAbility from "./Sprites/wallCreation-ability.png"; // Stone wall creation
import magnetAbility from "./Sprites/magnet-ability.png"; // Pulling effect like gravity
import mirrorCloneAbility from "./Sprites/mirrorClone-ability.png"; // Clone of player
import berserkerModeAbility from "./Sprites/berserker-ability.png"; // Enhanced speed/power



import wizardSprite from "./Sprites/player.png";
import rapunzelSprite from "./Sprites/rapunzelPlayerSprite.png";
import mageSprite from "./Sprites/runeMagePlayer.png";
import archerSprite from "./Sprites/archerPlayer.png";
import kingSprite from "./Sprites/kingPlayerSprite.png";


export default function Loadout({handleAbilityChange, R_ability, F_ability, T_ability, character, handleCharacterChange, gold, level, exp , resetXp, addLevel, handleGoldChange, abilityAvailability, checkEnoghGoldandUnlock, handleAbilityChangeAvailability, characterAvailability, levelRequirements, abilityCosts}) {

    useEffect(() => {
        // Set the radio buttons based on the current abilities
        document.querySelectorAll('input[name="R"]').forEach((input) => {
            input.checked = input.value === R_ability;
        });
        document.querySelectorAll('input[name="F"]').forEach((input) => {
            input.checked = input.value === F_ability;
        });
        document.querySelectorAll('input[name="T"]').forEach((input) => {
            input.checked = input.value === T_ability;
        });
    }, [R_ability, F_ability, T_ability]);

    useEffect(() => {
        // Set the radio buttons based on the current character
        document.querySelectorAll('input[name="character"]').forEach((input) => {
            input.checked = input.value === character;
        });
    }, [character]);

    // function that checks unough gold to unlock ability. if enough gold, unlock ability and remove gold if not enough gold, alert user


    // Helper functions for unlock status
    const getAbilityStatus = (abilityType, abilityName) => {
        const isAvailable = abilityAvailability[abilityType][abilityName];
        const cost = abilityCosts[abilityType][abilityName];
        
        if (isAvailable) return { status: 'unlocked', text: 'Unlocked' };
        if (gold < cost) return { status: 'gold-locked', text: `Need ${cost} gold` };
        return { status: 'can-unlock', text: `Unlock for ${cost} gold` };
    };

    const getCharacterStatus = (characterName) => {
        const isAvailable = characterAvailability[characterName];
        const requiredLevel = levelRequirements.characters[characterName];
        
        if (isAvailable) return { status: 'unlocked', text: 'Unlocked' };
        return { status: 'level-locked', text: `Requires Level ${requiredLevel}` };
    };

    // unlock ability for gold
   const unlockOrAlert = (abilityType, abilityName) => {
       // Use the proper function that saves to database
       checkEnoghGoldandUnlock(abilityType, abilityName);
   };

    useEffect(() => {
        // Set the radio buttons based on the current abilities
        document.querySelectorAll('input[name="R"]').forEach((input) => {
            input.checked = input.value === R_ability;
        });
        document.querySelectorAll('input[name="F"]').forEach((input) => {
            input.checked = input.value === F_ability;
        });
        document.querySelectorAll('input[name="T"]').forEach((input) => {
            input.checked = input.value === T_ability;
        });
    }, [R_ability, F_ability, T_ability]);

    useEffect(() => {
        // Set the radio buttons based on the current character
        document.querySelectorAll('input[name="character"]').forEach((input) => {
            input.checked = input.value === character;
        });
    }, [character]);

    // Helper function to render ability card
    const renderAbilityCard = (abilityType, abilityName, abilityImage, activeAbility) => {
        const status = getAbilityStatus(abilityType, abilityName);
        const isActive = activeAbility === abilityName;
        
        if (status.status === 'unlocked') {
            return (
                <label 
                    key={abilityName} 
                    className="fantasy-card" 
                    style={{ 
                        cursor: 'pointer', 
                        padding: '1rem', 
                        transition: 'all 0.3s ease',
                        border: isActive ? '3px solid var(--medieval-gold)' : '2px solid var(--medieval-gold)',
                        boxShadow: isActive ? '0 0 20px rgba(212, 175, 55, 0.5)' : undefined
                    }}
                >
                    <input 
                        type="radio" 
                        name={abilityType} 
                        value={abilityName} 
                        onChange={handleAbilityChange}
                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                    />
                    <div style={{ textAlign: 'center', userSelect: 'none' }}>
                        <img src={abilityImage} alt={`${abilityName} Ability`} style={{ width: '80px', height: '80px', marginBottom: '0.5rem', pointerEvents: 'none' }} />
                        <div className="gold-text" style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{abilityName}</div>
                        <div style={{ color: 'var(--parchment)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            {isActive && <span style={{ color: 'var(--medieval-gold)' }}>✓ Active</span>}
                        </div>
                    </div>
                </label>
            );
        } else {
            return (
                <div key={abilityName} className="fantasy-card" style={{ opacity: 0.6, padding: '1rem', textAlign: 'center', userSelect: 'none' }}>
                    <img src={abilityImage} alt={`${abilityName} Ability`} style={{ width: '80px', height: '80px', marginBottom: '0.5rem', filter: 'grayscale(100%)', pointerEvents: 'none' }} />
                    <div style={{ color: 'var(--medieval-silver)', fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{abilityName}</div>
                    <div style={{ color: 'var(--parchment)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        {status.status === 'can-unlock' ? (
                            <>
                                <div style={{ marginBottom: '0.5rem' }}>💰 {abilityCosts[abilityType][abilityName]} gold</div>
                                <button 
                                    className="medieval-button" 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        unlockOrAlert(abilityType, abilityName);
                                    }}
                                    style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                                >
                                    🔓 Unlock
                                </button>
                            </>
                        ) : (
                            <div style={{ color: '#888' }}>🔒 {status.text}</div>
                        )}
                    </div>
                </div>
            );
        }
    };

    // Helper function to render character card
    const renderCharacterCard = (characterName, characterImage) => {
        const status = getCharacterStatus(characterName);
        const isActive = character === characterName;
        const displayName = characterName === 'king' ? 'Danious' : characterName.charAt(0).toUpperCase() + characterName.slice(1);
        
        if (status.status === 'unlocked') {
            return (
                <label 
                    key={characterName} 
                    className="fantasy-card" 
                    style={{ 
                        cursor: 'pointer', 
                        padding: '1rem', 
                        transition: 'all 0.3s ease',
                        border: isActive ? '3px solid var(--medieval-gold)' : '2px solid var(--medieval-gold)',
                        boxShadow: isActive ? '0 0 20px rgba(212, 175, 55, 0.5)' : undefined
                    }}
                >
                    <input 
                        type="radio" 
                        name="character" 
                        value={characterName} 
                        onChange={handleCharacterChange}
                        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                    />
                    <div style={{ textAlign: 'center', userSelect: 'none' }}>
                        <img src={characterImage} alt={`${displayName} Character`} style={{ width: '80px', height: '80px', marginBottom: '0.5rem', pointerEvents: 'none' }} />
                        <div className="gold-text" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{displayName}</div>
                        <div style={{ color: 'var(--parchment)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            {isActive && <span style={{ color: 'var(--medieval-gold)' }}>✓ Active</span>}
                        </div>
                    </div>
                </label>
            );
        } else {
            return (
                <div key={characterName} className="fantasy-card" style={{ opacity: 0.6, padding: '1rem', textAlign: 'center', userSelect: 'none' }}>
                    <img src={characterImage} alt={`${displayName} Character`} style={{ width: '80px', height: '80px', marginBottom: '0.5rem', filter: 'grayscale(100%)', pointerEvents: 'none' }} />
                    <div style={{ color: 'var(--medieval-silver)', fontSize: '1.2rem', fontWeight: 'bold' }}>{displayName}</div>
                    <div style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        🔒 {status.text}
                    </div>
                </div>
            );
        }
    };

    return (
        <PageWrapper loadingSteps={loadingSteps.loadout}>
            <div className="loadout-page">
                <Navbar />
                <UserGoldLevelBar gold={gold} level={level} exp={exp} resetXp={resetXp} addLevel={addLevel} />
                <div className="loadout-content" style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 1rem' }}>
                    <div className="medieval-container">
                        <h1 className="medieval-heading">⚔️ Armory & Arsenal ⚔️</h1>
                        <div className="scroll-decoration"></div>
                        <p style={{ textAlign: 'center', color: 'var(--ink)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                            Choose your champion and master the ancient arts of combat
                        </p>

                        <h2 className="gold-text" style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                            ⚡ R Abilities - Reload Arts ⚡
                        </h2>
                        <div className = "R abilities" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        
                        {renderAbilityCard('R', 'reload', reloadAbility, R_ability)}

                        {renderAbilityCard('R', 'splash', splashAbility, R_ability)}

                        {renderAbilityCard('R', 'gravitywell', gravitywellAbility, R_ability)}

                        {renderAbilityCard('R', 'freeze', freezeAbility, R_ability)}
                        {renderAbilityCard('R', 'lightningstorm', lightningStormAbility, R_ability)}
                        {renderAbilityCard('R', 'poisoncloud', poisonCloudAbility, R_ability)}
                        {renderAbilityCard('R', 'meteor', meteorAbility, R_ability)}
                    </div>

                    <div className="scroll-decoration"></div>

                    <h2 className="gold-text" style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', marginTop: '2rem' }}>
                        💨 F Abilities - Flash Arts 💨
                    </h2>
                     <div className = "F abilities" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        
                        {renderAbilityCard('F', 'flash', flashAbility, F_ability)}
                        {renderAbilityCard('F', 'speed', speedAbility, F_ability)}
                        {renderAbilityCard('F', 'phasewalk', phaseAbility, F_ability)}
                        {renderAbilityCard('F', 'shield', shieldAbility, F_ability)}
                        {renderAbilityCard('F', 'dash', dashAbility, F_ability)}
                        {renderAbilityCard('F', 'wallcreation', wallCreationAbility, F_ability)}
                       
                    </div>

                    <div className="scroll-decoration"></div>

                    <h2 className="gold-text" style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', marginTop: '2rem' }}>
                        🌀 T Abilities - Teleport Arts 🌀
                    </h2>
                     <div className = "T abilities" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        
                        {renderAbilityCard('T', 'teleport', teleportAbility, T_ability)}
                        {renderAbilityCard('T', 'immortality', immortalityAbility, T_ability)}
                        {renderAbilityCard('T', 'scoreboost', scoreAbility, T_ability)}
                        {renderAbilityCard('T', 'soldierHelp', soldierAbility, T_ability)}
                        {renderAbilityCard('T', 'magnet', magnetAbility, T_ability)}
                        {renderAbilityCard('T', 'mirrorclone', mirrorCloneAbility, T_ability)}
                        {renderAbilityCard('T', 'berserkermode', berserkerModeAbility, T_ability)}
                    </div>

                    <div className="scroll-decoration"></div>

                    <h2 className="gold-text" style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center', marginTop: '2rem' }}>
                        👤 Champions of the Realm 👤
                    </h2>
                    <div className = "character-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {renderCharacterCard('wizard', wizardSprite)}
                        {renderCharacterCard('rapunzel', rapunzelSprite)}
                        {renderCharacterCard('archer', archerSprite)}
                        {renderCharacterCard('mage', mageSprite)}
                        {renderCharacterCard('king', kingSprite)}
                    </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}