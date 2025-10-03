import "./../globals.css";
import { useEffect, useState } from "react";


export default function UserGoldLevelBar({gold, level, exp, resetXp, addLevel}) {
    // Calculate the percentage of the level bar to fill based on exp
    // Exp is cumulative, so we need to calculate progress within current level
    const expInCurrentLevel = exp % 100; // Remaining exp in current level (0-99)
    const LevelPercentage = Math.min((expInCurrentLevel / 100) * 100, 100);

    // Calculate the remaining exp needed for the next level  
    const remainingExp = 100 - expInCurrentLevel; // Exp needed for next level

    // Just log the current exp, don't modify it
    useEffect(() => {
        console.log(`UserGoldLevelBar - Current EXP: ${exp}, Remaining for next level: ${remainingExp}`);
    }, [exp, remainingExp]);

    return (
        <div className="user-gold-level-bar">
            <div className="level-bar">
                <div className="level-bar-fill" style={{ width: `${LevelPercentage}%` }}></div>
            </div>

            <div>
                <p className="gold-text" >Gold: {gold}</p>
                <p className="level-text">Level: {level}</p>   
            </div>
        </div>
    );
}   