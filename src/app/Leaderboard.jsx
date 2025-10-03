import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './components/Navbar';
import UserGoldLevelBar from './components/UserGoldLevelBar';
import PageWrapper from './components/PageWrapper';

export default function Leaderboard({ gold, level, exp, resetXp, addLevel }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data.leaderboard || []);
        } else {
          setError('Failed to load leaderboard');
        }
      } catch (err) {
        setError('Error loading leaderboard');
        console.error('Leaderboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLeaderboard();
    }
  }, [token]);

  if (loading) {
    return (
      <PageWrapper loadingType="app">
        <div className="leaderboard-page">
          <Navbar />
          <UserGoldLevelBar gold={gold} level={level} exp={exp} resetXp={resetXp} addLevel={addLevel} />
          <div className="loading">Loading leaderboard...</div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper loadingType="app">
      <div className="leaderboard-page">
        <Navbar />
        <UserGoldLevelBar gold={gold} level={level} exp={exp} resetXp={resetXp} addLevel={addLevel} />
        
        <div className="leaderboard-content">
          <h1>🏆 Leaderboard</h1>
          <p>Top players by best score</p>

          {error && (
            <div className="error-message" style={{ 
              color: '#ff4444', 
              background: '#2a1f1f', 
              padding: '10px', 
              borderRadius: '5px',
              margin: '20px 0'
            }}>
              {error}
            </div>
          )}

          <div className="leaderboard-list">
            {leaderboardData.length === 0 ? (
              <div className="no-data">No leaderboard data available</div>
            ) : (
              leaderboardData.map((player, index) => (
                <div 
                  key={player.user_id} 
                  className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '15px 20px',
                    margin: '10px 0',
                    backgroundColor: index < 3 ? '#2a2a1f' : '#1a1a1a',
                    border: index < 3 ? '2px solid #ffd700' : '1px solid #333',
                    borderRadius: '10px',
                    color: '#fff'
                  }}
                >
                  <div className="rank-and-name" style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="rank" style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold',
                      marginRight: '15px',
                      color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#fff'
                    }}>
                      #{index + 1}
                    </span>
                    <span className="username" style={{ fontSize: '18px' }}>
                      {player.username}
                    </span>
                  </div>
                  
                  <div className="scores" style={{ textAlign: 'right' }}>
                    <div className="best-score" style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold',
                      color: '#ffd700'
                    }}>
                      🏆 {player.best_score}
                    </div>
                    <div className="level" style={{ 
                      fontSize: '14px', 
                      color: '#ccc' 
                    }}>
                      Level {player.level}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="leaderboard-info" style={{
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#1a1a1a',
            borderRadius: '10px',
            textAlign: 'center',
            color: '#ccc'
          }}>
            <h3>How to climb the leaderboard:</h3>
            <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
              <li>Survive as long as possible in the game</li>
              <li>Kill enemies to increase your score</li>
              <li>Your best score is saved automatically</li>
              <li>Level up to unlock new abilities</li>
            </ul>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}