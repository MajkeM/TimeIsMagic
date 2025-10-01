
import "./../globals.css";
import { Link } from "react-router-dom";
import playButtonImage from "./../Sprites/play-button-image.png";

export default function Navbar() {

    return (
        <nav className ="nav-bar">
                        <Link to="/"> Home </Link>
                        <Link to="/loadout">Loadout</Link>
                        <button className="play-button">
                            <Link to="/game">
                                <img src={playButtonImage} alt="Play" />
                            </Link>
                        </button>
                        <Link to="/settings">Settings</Link>
                        <Link to="/credits">Credits</Link>
                    </nav>
    )
}