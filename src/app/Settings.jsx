import Navbar from "./components/Navbar";
import "./globals.css";
import {useState, useRef, useEffect} from "react";
import UserGoldLevelBar from "./components/UserGoldLevelBar";

export default function Settings({toggleCollision, gold, level, exp}) {
    return (
        <div className="settings-page">
            
            <Navbar />
            <UserGoldLevelBar gold={gold} level={level} exp={exp} />
            <div className="settings-content">
                <h1>Settings Page</h1>
                <p>Adjust your game settings here.</p>

                <h2>Debug Options</h2>
                <input type="checkbox" id="showCollision" name="showCollision" onChange={toggleCollision} />
                <label htmlFor="showCollision"> Show Collision Boxes</label><br />
            </div>
        </div>
    );
}