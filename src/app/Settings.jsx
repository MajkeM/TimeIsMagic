import Navbar from "./components/Navbar";
import "./globals.css";
import {useState, useRef, useEffect} from "react";
import UserGoldLevelBar from "./components/UserGoldLevelBar";

export default function Settings({toggleCollision, gold, level, exp, resetXp, addLevel}) {
    
    const resetLocalStorage = () => {
        if (window.confirm('Are you sure you want to reset all progress? This will clear all unlocked abilities and characters but keep your gold, level and exp.')) {
            // Keep current progress
            const currentGold = gold;
            const currentLevel = level;
            const currentExp = exp;
            
            // Clear localStorage
            localStorage.clear();
            
            // Restore progress and set new version
            localStorage.setItem('gold', JSON.stringify(currentGold));
            localStorage.setItem('level', JSON.stringify(currentLevel));
            localStorage.setItem('exp', JSON.stringify(currentExp));
            localStorage.setItem('app_version', '"2.0"');
            
            alert('Progress reset! Please refresh the page.');
        }
    };

    const clearAllData = () => {
        if (window.confirm('Are you sure you want to clear ALL data including progress? This cannot be undone!')) {
            localStorage.clear();
            alert('All data cleared! Please refresh the page.');
        }
    };

    return (
        <div className="settings-page">
            
            <Navbar />
            <UserGoldLevelBar gold={gold} level={level} exp={exp} resetXp={resetXp} addLevel={addLevel} />
            <div className="settings-content">
                <h1>Settings Page</h1>
                <p>Adjust your game settings here.</p>

                <h2>Debug Options</h2>
                <input type="checkbox" id="showCollision" name="showCollision" onChange={toggleCollision} />
                <label htmlFor="showCollision"> Show Collision Boxes</label><br />
                
                <h2>Data Management</h2>
                <button 
                    onClick={resetLocalStorage}
                    style={{
                        padding: '10px 20px',
                        margin: '10px',
                        backgroundColor: '#ff9500',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Reset Abilities & Characters (Keep Progress)
                </button>
                <br />
                <button 
                    onClick={clearAllData}
                    style={{
                        padding: '10px 20px',
                        margin: '10px',
                        backgroundColor: '#ff0000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Clear All Data (DANGER!)
                </button>
                
                <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
                    Use these buttons if you encounter localStorage errors or want to reset progress.
                </p>
            </div>
        </div>
    );
}