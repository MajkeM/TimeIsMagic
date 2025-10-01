import React, { useEffect } from "react";
import "./globals.css";
import Navbar from "./components/Navbar";

import reloadAbility from "./Sprites/reload-ability.png"; 
import flashAbility from "./Sprites/flash-ability.png";
import teleportAbility from "./Sprites/teleport-ability.png";
import speedAbility from "./Sprites/speed-ability.png";
import splashAbility from "./Sprites/splash-ability.png";
import gravitywellAbility from "./Sprites/gravityWellAbility.png";
import phaseAbility from "./Sprites/phaseAbility.png";
import scoreAbility from "./Sprites/scoreAbility.png";
import immortalityAbility from "./Sprites/immortality-ability.png";
import wizardSprite from "./Sprites/player.png";
import rapunzelSprite from "./Sprites/rapunzelPlayerSprite.png";

import mageSprite from "./Sprites/runeMagePlayer.png";
import archerSprite from "./Sprites/archerPlayer.png";


export default function Loadout({handleAbilityChange, R_ability, F_ability, T_ability, character, handleCharacterChange}) {

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
        <div className="loadout-page">
            <Navbar />
            <div className="loadout-content">
                <h1>Loadout Page</h1>
                <p>Choose your loadout here and collect points to unlock new abilities.</p>

                <div>
                    <h2>Abilities</h2>
                    <div className = "R abilities">
                        <p>R abilities</p>
                        <span className="ability-option">
                            <input type="radio" name="R" value="reload" onChange={handleAbilityChange} />
                            <label htmlFor ="R">Reload <img className="ability-icon" src={reloadAbility} alt="Reload Ability" /></label>
                        </span>
                        <span className="ability-option">
                            <input type="radio" name="R" value="splash"  onChange={handleAbilityChange} />
                            <label htmlFor ="R">Splash <img className="ability-icon" src={splashAbility} alt="Splash Ability" /></label>
                        </span>
                        <span className="ability-option">
                            <input type="radio" name="R" value="gravitywell"  onChange={handleAbilityChange} />
                            <label htmlFor ="R">Gravity Well <img className="ability-icon" src={gravitywellAbility} alt="Gravity Well Ability" /></label>
                        </span>
                    </div>

                     <div className = "F abilities">
                        <p>F abilities</p>
                         <span className="ability-option">
                            <input type="radio" defaultChecked name="F" value="flash" onChange={handleAbilityChange} />
                            <label htmlFor ="F">Flash <img className="ability-icon" src={flashAbility} alt="Flash Ability" /></label>
                        </span>
                        <span className="ability-option">
                            <input type="radio"  name="F" value="speed" onChange={handleAbilityChange} />
                            <label htmlFor ="F">Speed <img className="ability-icon" src={speedAbility} alt="Speed Ability" /></label>
                        </span>
                        <span className="ability-option">
                            <input type="radio"  name="F" value="phasewalk" onChange={handleAbilityChange} />
                            <label htmlFor ="F">Phase Walk <img className="ability-icon" src={phaseAbility} alt="Phase Walk Ability" /></label>
                        </span>
                       
                    </div>
                     <div className = "T abilities">
                        <p>T abilities</p>
                        <span className="ability-option">
                            <input type="radio" defaultChecked name="T" value="teleport" onChange={handleAbilityChange} />
                            <label htmlFor ="T">Teleport enemies <img className="ability-icon" src={teleportAbility} alt="Teleport Ability" /></label>
                        </span>
                        <span className="ability-option">
                            <input type="radio" name="T" value="immortality" onChange={handleAbilityChange} />
                            <label htmlFor ="T">Immortality <img className="ability-icon" src={immortalityAbility} alt="Immortality Ability" /></label>
                        </span>
                        <span className="ability-option">
                            <input type="radio" name="T" value="scoreboost" onChange={handleAbilityChange} />
                            <label htmlFor ="T">Score Boost <img className="ability-icon" src={scoreAbility} alt="Score Boost Ability" /></label>
                        </span>
                    </div>
                </div>
                <h2>Characters</h2>
                <div>
                    <div className = "character-options">
                        <span className="character-option">
                            <input type="radio" name="character" value="wizard" onChange={handleCharacterChange} />
                            <label htmlFor ="character">Wizard <img className="character-icon" src={wizardSprite} alt="Wizard Character" /></label>
                        </span>
                        <span className="character-option">
                            <input type="radio" name="character" value="rapunzel" onChange={handleCharacterChange} />
                            <label htmlFor ="character">Lucious<img className="character-icon" src={rapunzelSprite} alt="Rapunzel Character" /></label>
                        </span>
                        <span className="character-option">
                            <input type="radio" name="character" value="archer" onChange={handleCharacterChange} />
                            <label htmlFor ="character">Archer <img className="character-icon" src={archerSprite} alt="Archer Character" /></label>
                        </span>
                        <span className="character-option">
                            <input type="radio" name="character" value="mage" onChange={handleCharacterChange} />
                            <label htmlFor ="character">Mage <img className="character-icon" src={mageSprite} alt="Mage Character" /></label>
                        </span>
                    
                </div>
            </div>
        </div>
        </div>
    )
}