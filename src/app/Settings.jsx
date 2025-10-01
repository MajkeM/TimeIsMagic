import Navbar from "./components/Navbar";
import "./globals.css";
import {useState, useRef, useEffect} from "react";

export default function Settings({toggleCollision}) {
    return (
        <div className="settings-page">
            
            <Navbar />
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