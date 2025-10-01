
import React from "react";
import {  BrowserRouter, Routes, Route, Link } from "react-router-dom";
import playButtonImage from "./Sprites/play-button-image.png"; // Import the image
import Navbar from "./components/Navbar";
import "./globals.css";

export default function Home() {
    return (
        <div className = "home-page">
            {/* link to game */}
            <Navbar />
            <div className="home-content">
                <h1>Welcome to Time Is Magic!</h1>
                <p>Your adventure begins here. Click the play button to start your journey.</p> 


                <h3>Choose your loadout here and collect points to unlock new abilities</h3>
                <Link to="/loadout">Go to Loadout</Link>

                <p className="version">Current verison of the game: 0.2</p>
            </div>
        </div>
    )
}