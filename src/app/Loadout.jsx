import React from "react";
import "./globals.css";
import Navbar from "./components/Navbar";
export default function Loadout() {
    return (
        <div className="loadout-page">
            <Navbar />
            <div className="loadout-content">
                <h1>Loadout Page</h1>
                <p>Choose your loadout here and collect points to unlock new abilities.</p>
            </div>
        </div>
    );
}