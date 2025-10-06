import React, { useEffect } from "react";
import "./globals.css";
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




    return (
        <PageWrapper loadingSteps={loadingSteps.loadout}>
            <div className="loadout-page">
                <Navbar />
                <UserGoldLevelBar gold={gold} level={level} exp={exp} resetXp={resetXp} addLevel={addLevel} />
                <div className="loadout-content">
                    <h1>Loadout Page</h1>
                    <p>Choose your loadout here and collect points to unlock new abilities.</p>

                    <h2>Abilities</h2>
                    <p>R abilities</p>
                    <div className = "R abilities">
                        
                        {/* Reload - always available */}
                        <span className="ability-option">
                            <input type="radio" name="R" value="reload" onChange={handleAbilityChange} disabled={!abilityAvailability.R.reload} />
                            <label htmlFor ="R">Reload <img className="ability-icon" src={reloadAbility} alt="Reload Ability" /></label>
                        </span>

                        {/* Splash */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('R', 'splash');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="R" value="splash" onChange={handleAbilityChange} />
                                        <label htmlFor="R">Splash <img className="ability-icon" src={splashAbility} alt="Splash Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Splash <img className="ability-icon grayscale" src={splashAbility} alt="Splash Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("R", "splash")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()}
                        </span>

                        {/* Gravity Well */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('R', 'gravitywell');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="R" value="gravitywell" onChange={handleAbilityChange} />
                                        <label htmlFor="R">Gravity Well <img className="ability-icon" src={gravitywellAbility} alt="Gravity Well Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Gravity Well <img className="ability-icon grayscale" src={gravitywellAbility} alt="Gravity Well Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("R", "gravitywell")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()}
                        </span>

                        {/* Freeze */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('R', 'freeze');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="R" value="freeze" onChange={handleAbilityChange} />
                                        <label htmlFor="R">Freeze <img className="ability-icon" src={freezeAbility} alt="Freeze Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Freeze <img className="ability-icon grayscale" src={freezeAbility} alt="Freeze Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("R", "freeze")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()}
                        </span>

                        {/* Lightning Storm */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('R', 'lightningstorm');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="R" value="lightningstorm" onChange={handleAbilityChange} />
                                        <label htmlFor="R">Lightning Storm <img className="ability-icon" src={lightningStormAbility} alt="Lightning Storm Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Lightning Storm <img className="ability-icon grayscale" src={lightningStormAbility} alt="Lightning Storm Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("R", "lightningstorm")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()}
                        </span>

                        {/* Poison Cloud */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('R', 'poisoncloud');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="R" value="poisoncloud" onChange={handleAbilityChange} />
                                        <label htmlFor="R">Poison Cloud <img className="ability-icon" src={poisonCloudAbility} alt="Poison Cloud Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Poison Cloud <img className="ability-icon grayscale" src={poisonCloudAbility} alt="Poison Cloud Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("R", "poisoncloud")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()}
                        </span>

                        {/* Meteor */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('R', 'meteor');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="R" value="meteor" onChange={handleAbilityChange} />
                                        <label htmlFor="R">Meteor <img className="ability-icon" src={meteorAbility} alt="Meteor Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Meteor <img className="ability-icon grayscale" src={meteorAbility} alt="Meteor Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("R", "meteor")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()}
                        </span>
                    </div>
                    <p>F abilities</p>
                     <div className = "F abilities">
                        
                        {/* Flash - always available */}
                        <span className="ability-option">
                            <input type="radio" name="F" value="flash" onChange={handleAbilityChange} disabled={!abilityAvailability.F.flash} />
                            <label htmlFor ="F">Flash <img className="ability-icon" src={flashAbility} alt="Flash Ability" /></label>
                        </span>

                        {/* Speed */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('F', 'speed');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="F" value="speed" onChange={handleAbilityChange} />
                                        <label htmlFor="F">Speed <img className="ability-icon" src={speedAbility} alt="Speed Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Speed <img className="ability-icon grayscale" src={speedAbility} alt="Speed Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("F", "speed")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()} 
                        </span>

                        {/* Phase Walk */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('F', 'phasewalk');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="F" value="phasewalk" onChange={handleAbilityChange} />
                                        <label htmlFor="F">Phase Walk <img className="ability-icon" src={phaseAbility} alt="Phase Walk Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Phase Walk <img className="ability-icon grayscale" src={phaseAbility} alt="Phase Walk Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("F", "phasewalk")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()} 
                        </span>

                        {/* Shield */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('F', 'shield');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="F" value="shield" onChange={handleAbilityChange} />
                                        <label htmlFor="F">Shield <img className="ability-icon" src={shieldAbility} alt="Shield Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Shield <img className="ability-icon grayscale" src={shieldAbility} alt="Shield Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("F", "shield")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()} 
                        </span>

                        {/* Dash */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('F', 'dash');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="F" value="dash" onChange={handleAbilityChange} />
                                        <label htmlFor="F">Dash <img className="ability-icon" src={dashAbility} alt="Dash Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Dash <img className="ability-icon grayscale" src={dashAbility} alt="Dash Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("F", "dash")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()} 
                        </span>

                        {/* Wall Creation */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('F', 'wallcreation');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="F" value="wallcreation" onChange={handleAbilityChange} />
                                        <label htmlFor="F">Wall Creation <img className="ability-icon" src={wallCreationAbility} alt="Wall Creation Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Wall Creation <img className="ability-icon grayscale" src={wallCreationAbility} alt="Wall Creation Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("F", "wallcreation")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()} 
                        </span>
                       
                    </div>
                    <p>T abilities</p>
                     <div className = "T abilities">
                        
                        {/* Teleport - always available */}
                        <span className="ability-option">
                            <input type="radio" name="T" value="teleport" onChange={handleAbilityChange} disabled={!abilityAvailability.T.teleport} />
                            <label htmlFor ="T">Teleport enemies <img className="ability-icon" src={teleportAbility} alt="Teleport Ability" /></label>
                        </span>

                        {/* Immortality */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('T', 'immortality');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="T" value="immortality" onChange={handleAbilityChange} />
                                        <label htmlFor="T">Immortality <img className="ability-icon" src={immortalityAbility} alt="Immortality Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Immortality <img className="ability-icon grayscale" src={immortalityAbility} alt="Immortality Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("T", "immortality")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()} 
                        </span>

                        {/* Score Boost */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('T', 'scoreboost');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="T" value="scoreboost" onChange={handleAbilityChange} />
                                        <label htmlFor="T">Score Boost <img className="ability-icon" src={scoreAbility} alt="Score Boost Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Score Boost <img className="ability-icon grayscale" src={scoreAbility} alt="Score Boost Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("T", "scoreboost")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()} 
                        </span>

                        {/* Soldier Help */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('T', 'soldierHelp');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="T" value="soldierHelp" onChange={handleAbilityChange} />
                                        <label htmlFor="T">Soldier Help <img className="ability-icon" src={soldierAbility} alt="Soldier Help Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Soldier Help <img className="ability-icon grayscale" src={soldierAbility} alt="Soldier Help Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("T", "soldierHelp")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()} 
                        </span>

                        {/* Magnet */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('T', 'magnet');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="T" value="magnet" onChange={handleAbilityChange} />
                                        <label htmlFor="T">Magnet <img className="ability-icon" src={magnetAbility} alt="Magnet Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Magnet <img className="ability-icon grayscale" src={magnetAbility} alt="Magnet Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("T", "magnet")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()} 
                        </span>

                        {/* Mirror Clone */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('T', 'mirrorclone');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="T" value="mirrorclone" onChange={handleAbilityChange} />
                                        <label htmlFor="T">Mirror Clone <img className="ability-icon" src={mirrorCloneAbility} alt="Mirror Clone Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Mirror Clone <img className="ability-icon grayscale" src={mirrorCloneAbility} alt="Mirror Clone Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("T", "mirrorclone")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()} 
                        </span>

                        {/* Berserker Mode */}
                        <span className="ability-option">
                            {(() => {
                                const status = getAbilityStatus('T', 'berserkermode');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="T" value="berserkermode" onChange={handleAbilityChange} />
                                        <label htmlFor="T">Berserker Mode <img className="ability-icon" src={berserkerModeAbility} alt="Berserker Mode Ability" /></label>
                                    </>
                                ) : (
                                    <div className={`ability-locked ${status.status}`}>
                                        <span>Berserker Mode <img className="ability-icon grayscale" src={berserkerModeAbility} alt="Berserker Mode Ability" /></span>
                                        <span className="ability-status">{status.text}</span>
                                        {status.status === 'can-unlock' && (
                                            <button onClick={() => unlockOrAlert("T", "berserkermode")}>Unlock</button>
                                        )}
                                    </div>
                                );
                            })()} 
                        </span>
                    </div>
                </div>
                <h2>Characters</h2>
                <div className = "character-options">
                    {/* Wizard - always available */}
                    <span className="character-option">
                        <input type="radio" name="character" value="wizard" onChange={handleCharacterChange} disabled={!characterAvailability.wizard} />
                        <label htmlFor ="character">Wizard <img className="character-icon" src={wizardSprite} alt="Wizard Character" /></label>
                    </span>

                        {/* Rapunzel */}
                        <span className="character-option">
                            {(() => {
                                const status = getCharacterStatus('rapunzel');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="character" value="rapunzel" onChange={handleCharacterChange} />
                                        <label htmlFor="character">Lucious <img className="character-icon" src={rapunzelSprite} alt="Rapunzel Character" /></label>
                                    </>
                                ) : (
                                    <div className={`character-locked ${status.status}`}>
                                        <span>Lucious <img className="character-icon grayscale" src={rapunzelSprite} alt="Rapunzel Character" /></span>
                                        <span className="character-status">{status.text}</span>
                                    </div>
                                );
                            })()} 
                        </span>

                        {/* Archer */}
                        <span className="character-option">
                            {(() => {
                                const status = getCharacterStatus('archer');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="character" value="archer" onChange={handleCharacterChange} />
                                        <label htmlFor="character">Archer <img className="character-icon" src={archerSprite} alt="Archer Character" /></label>
                                    </>
                                ) : (
                                    <div className={`character-locked ${status.status}`}>
                                        <span>Archer <img className="character-icon grayscale" src={archerSprite} alt="Archer Character" /></span>
                                        <span className="character-status">{status.text}</span>
                                    </div>
                                );
                            })()} 
                        </span>

                        {/* Mage */}
                        <span className="character-option">
                            {(() => {
                                const status = getCharacterStatus('mage');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="character" value="mage" onChange={handleCharacterChange} />
                                        <label htmlFor="character">Mage <img className="character-icon" src={mageSprite} alt="Mage Character" /></label>
                                    </>
                                ) : (
                                    <div className={`character-locked ${status.status}`}>
                                        <span>Mage <img className="character-icon grayscale" src={mageSprite} alt="Mage Character" /></span>
                                        <span className="character-status">{status.text}</span>
                                    </div>
                                );
                            })()} 
                        </span>

                        {/* King */}
                        <span className="character-option">
                            {(() => {
                                const status = getCharacterStatus('king');
                                return status.status === 'unlocked' ? (
                                    <>
                                        <input type="radio" name="character" value="king" onChange={handleCharacterChange} />
                                        <label htmlFor="character">Danious <img className="character-icon" src={kingSprite} alt="Danious Character" /></label>
                                    </>
                                ) : (
                                    <div className={`character-locked ${status.status}`}>
                                        <span>Danious <img className="character-icon grayscale" src={kingSprite} alt="Danious Character" /></span>
                                        <span className="character-status">{status.text}</span>
                                    </div>
                                );
                            })()} 
                        </span>
                </div>
            </div>
        </PageWrapper>
    )
}