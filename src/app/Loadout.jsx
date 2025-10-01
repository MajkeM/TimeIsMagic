import React from "react";
import "./globals.css";
import Navbar from "./components/Navbar";

import reloadAbility from "./Sprites/reload-ability.png"; 
import flashAbility from "./Sprites/flash-ability.png";
import teleportAbility from "./Sprites/teleport-ability.png";
import speedAbility from "./Sprites/speed-ability.png";
import splashAbility from "./Sprites/splash-ability.png";

export default function Loadout({handleAbilityChange}) {
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
                            <input type="radio" defaultChecked name="R" value="reload" onChange={handleAbilityChange} />
                            <label htmlFor ="R">Reload <img className="ability-icon" src={reloadAbility} alt="Reload Ability" /></label>
                        </span>
                        <span className="ability-option">
                            <input type="radio" name="R" value="splash"  onChange={handleAbilityChange} />
                            <label htmlFor ="R">Splash <img className="ability-icon" src={splashAbility} alt="Splash Ability" /></label>
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
                       
                    </div>
                     <div className = "T abilities">
                        <p>T abilities</p>
                        <span className="ability-option">
                            <input type="radio" defaultChecked name="T" value="teleport" onChange={handleAbilityChange} />
                            <label htmlFor ="T">Teleport enemies <img className="ability-icon" src={teleportAbility} alt="Teleport Ability" /></label>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}