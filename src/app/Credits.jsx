import Navbar from "./components/Navbar";   
import "./globals.css";

export default function Credits() {
    return (
        <div className="credits-page">
            <Navbar />
            <div className="credits-content">
                <h1>Credits Page</h1>
                <p>Meet the team behind the game and see special thanks.</p>
            </div>
        </div>
    );
}