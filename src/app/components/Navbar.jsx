
import "./../globals.css";
import { Link } from "react-router-dom";
import playButtonImage from "./../Sprites/play-button-image.png";

export default function Navbar() {

    return (
        <nav className ="nav-bar">
                        <Link className="side-link" to="/"> Home </Link>
                        <Link className="side-link" to="/loadout">Loadout</Link>
                        <Link className="side-link" to="/achievements">🏆 Achievements</Link>
                        <button className="play-button">
                            <Link to="/game">
                                <img src={playButtonImage} alt="Play" />
                            </Link>
                        </button>
                        
                        <Link className="side-link" to="/leaderboard">📊 Leaderboard</Link>
                        <Link className="side-link" to="/settings">Settings</Link>
                        <Link className="side-link" to="/credits">Credits</Link>
                    </nav>
    )
}