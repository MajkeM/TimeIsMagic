import React from 'react';

const LoadingScreen = ({ progress = 0, message = "Loading...", isComplete = false }) => {
    return (
        <div className="loading-screen">
            <div className="loading-content">
                <div className="loading-logo">
                    <h1>⚡ Time Is Magic ⚡</h1>
                </div>
                
                <div className="loading-progress">
                    <div className="progress-bar-container">
                        <div 
                            className="progress-bar" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="progress-text">
                        {Math.round(progress)}%
                    </div>
                </div>
                
                <div className="loading-message">
                    {message}
                </div>
                
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
                
                {isComplete && (
                    <div className="loading-complete">
                        ✓ Ready to play!
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoadingScreen;