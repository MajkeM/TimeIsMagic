import "./../globals.css";
import { useEffect, useState } from "react";


export default function UserGoldLevelBar({gold, level, exp, resetXp, addLevel}) {
    // Calculate the percentage of the level bar to fill based on exp
    const LevelPercentage = Math.min((exp / 100) * 100, 100); // Assuming 100 exp is needed 
    const [xpNeeded, setXpNeeded] = useState(100);

    // Calculate the remaining exp needed for the next level
    const remainingExp = xpNeeded - exp;

    useEffect(() => {
        // when exp changes, log remaining exp needed for next level 
        // if exp >= xpNeeded, log "Level Up!"
        if (exp >= xpNeeded) {
            console.log("Level Up!");
            resetXp();
            setXpNeeded((prev) => prev + 20);
            addLevel();
        } else {
            console.log(`Remaining EXP for next level: ${remainingExp}`);

        }

        

    }, [exp]);

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