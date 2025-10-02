import Navbar from "./components/Navbar";   
import UserGoldLevelBar from "./components/UserGoldLevelBar";
import "./globals.css";

export default function Credits({gold, level, exp}) {
    return (
        <div className="credits-page">
            <Navbar />
            <UserGoldLevelBar gold={gold} level={level} exp={exp} />
            <div className="credits-content">
                <h1>Credits Page</h1>
                <p>Meet the team behind the game and see special thanks.</p>
            </div>
        </div>
    );
}