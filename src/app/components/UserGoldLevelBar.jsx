import "./../globals.css";

export default function UserGoldLevelBar({gold, level, exp}) {
    // Calculate the percentage of the level bar to fill based on exp
    const LevelPercentage = Math.min((exp / 100) * 100, 100); // Assuming 100 exp is needed to level up


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