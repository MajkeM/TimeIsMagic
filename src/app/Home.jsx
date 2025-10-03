
import React from "react";
import {  BrowserRouter, Routes, Route, Link } from "react-router-dom";
import playButtonImage from "./Sprites/play-button-image.png"; // Import the image
import Navbar from "./components/Navbar";
import UserGoldLevelBar from "./components/UserGoldLevelBar";
import "./globals.css";

export default function Home({gold, level, exp, resetXp, addLevel}) {
    return (
        <div className = "home-page">
            {/* link to game */}
            <Navbar />
            <UserGoldLevelBar gold={gold} level={level} exp={exp} resetXp={resetXp} addLevel={addLevel} />
            <div className="home-content">
                <h1>Welcome to Time Is Magic!</h1>
                <p>Your adventure begins here. Click the play button to start your journey.</p> 


                <h3>Choose your loadout here and collect points to unlock new abilities</h3>
                <Link to="/loadout">Go to Loadout</Link>

                <p className="version">BETA VERSION IS HERE !!!</p>
                <p>NEW ABILITIES, NEW CHARACTERS, LEVELING SYSTEM, UNLOCKING SYSTEM, LOCAL STORAGE,</p>
                <p>ACCOUNTS SYSTEM COMING SOON</p>
            </div>
        </div>
    )
}