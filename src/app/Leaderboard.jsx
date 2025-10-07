import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './components/Navbar';
import UserGoldLevelBar from './components/UserGoldLevelBar';
import PageWrapper from './components/PageWrapper';
import './medieval-theme.css';

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
        
        <div className="leaderboard-content" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
          <div className="medieval-container">
            <h1 className="medieval-heading">🏆 Hall of Champions 🏆</h1>
            <div className="scroll-decoration"></div>
            <p style={{ textAlign: 'center', color: 'var(--ink)', fontSize: '1.1rem', marginBottom: '2rem' }}>
              The mightiest warriors of the realm
            </p>

            {error && (
              <div className="fantasy-card" style={{ 
                background: 'linear-gradient(135deg, #8b0000, #a52a2a)',
                color: '#fff',
                textAlign: 'center'
              }}>
                ⚠️ {error}
              </div>
            )}

            <div className="leaderboard-list">
              {leaderboardData.length === 0 ? (
                <div className="fantasy-card" style={{ textAlign: 'center', color: 'var(--parchment)' }}>
                  <span style={{ fontSize: '3rem' }}>🗡️</span>
                  <p style={{ marginTop: '1rem' }}>No champions yet. Be the first to claim glory!</p>
                </div>
              ) : (
                leaderboardData.map((player, index) => {
                  const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other';
                  const crown = index === 0 ? '👑 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : '';
                  
                  return (
                    <div 
                      key={player.user_id} 
                      className={`fantasy-card leaderboard-entry`}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className={`rank-badge ${rankClass}`}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ 
                            fontSize: '1.3rem', 
                            fontWeight: 'bold',
                            color: 'var(--parchment)',
                            fontFamily: "'Cinzel', serif"
                          }}>
                            {crown}{player.username}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--medieval-silver)' }}>
                            ⚔️ Level {player.level}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <div className="gold-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                          🏆 {player.best_score}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--medieval-silver)' }}>
                          Best Score
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="scroll-decoration"></div>

            <div className="fantasy-card" style={{ marginTop: '2rem', textAlign: 'center' }}>
              <h3 className="gold-text" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
                ⚔️ Path to Glory ⚔️
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem',
                color: 'var(--parchment)'
              }}>
                <div className="stat-display">
                  <span className="stat-icon">🗡️</span>
                  <span>Slay Enemies</span>
                </div>
                <div className="stat-display">
                  <span className="stat-icon">🛡️</span>
                  <span>Survive Longer</span>
                </div>
                <div className="stat-display">
                  <span className="stat-icon">⬆️</span>
                  <span>Level Up</span>
                </div>
                <div className="stat-display">
                  <span className="stat-icon">✨</span>
                  <span>Master Abilities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}