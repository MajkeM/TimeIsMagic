import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UserGoldLevelBar from './components/UserGoldLevelBar';
import PageWrapper from './components/PageWrapper';
import './styles/Achievements.css';
import './medieval-theme.css';

export default function Achievements({ 
  gold, 
  level, 
  exp, 
  resetXp, 
  addLevel,
  achievements,
  stats
}) {
  // Achievement definitions with passive bonuses
  const achievementDefinitions = [
    {
      id: 'first_kill',
      name: 'First Blood',
      description: 'Kill your first enemy',
      icon: '⚔️',
      requirement: stats?.totalKills >= 1,
      bonus: '+5% movement speed',
      unlocked: achievements?.first_kill || false
    },
    {
      id: 'killer_10',
      name: 'Novice Hunter',
      description: 'Kill 10 enemies',
      icon: '🎯',
      requirement: stats?.totalKills >= 10,
      bonus: '+5% bullet speed',
      unlocked: achievements?.killer_10 || false
    },
    {
      id: 'killer_50',
      name: 'Expert Hunter',
      description: 'Kill 50 enemies',
      icon: '🏹',
      requirement: stats?.totalKills >= 50,
      bonus: '+10% fire rate',
      unlocked: achievements?.killer_50 || false
    },
    {
      id: 'killer_100',
      name: 'Master Assassin',
      description: 'Kill 100 enemies',
      icon: '💀',
      requirement: stats?.totalKills >= 100,
      bonus: '+15% bullet penetration',
      unlocked: achievements?.killer_100 || false
    },
    {
      id: 'survivor_5',
      name: 'Survivor',
      description: 'Play 5 games',
      icon: '🛡️',
      requirement: stats?.gamesPlayed >= 5,
      bonus: '+5% invincibility duration',
      unlocked: achievements?.survivor_5 || false
    },
    {
      id: 'survivor_20',
      name: 'Veteran',
      description: 'Play 20 games',
      icon: '🏆',
      requirement: stats?.gamesPlayed >= 20,
      bonus: '+10% dodge chance',
      unlocked: achievements?.survivor_20 || false
    },
    {
      id: 'score_100',
      name: 'Century',
      description: 'Reach score of 100',
      icon: '💯',
      requirement: stats?.bestScore >= 100,
      bonus: '+10% gold gain',
      unlocked: achievements?.score_100 || false
    },
    {
      id: 'score_500',
      name: 'High Scorer',
      description: 'Reach score of 500',
      icon: '🌟',
      requirement: stats?.bestScore >= 500,
      bonus: '+20% gold gain',
      unlocked: achievements?.score_500 || false
    },
    {
      id: 'gold_collector',
      name: 'Gold Collector',
      description: 'Earn 1000 total gold',
      icon: '💰',
      requirement: stats?.totalGoldEarned >= 1000,
      bonus: '+5% exp gain',
      unlocked: achievements?.gold_collector || false
    },
    {
      id: 'level_5',
      name: 'Apprentice',
      description: 'Reach level 5',
      icon: '📚',
      requirement: level >= 5,
      bonus: '+10% ability cooldown reduction',
      unlocked: achievements?.level_5 || false
    },
    {
      id: 'level_10',
      name: 'Journeyman',
      description: 'Reach level 10',
      icon: '🎓',
      requirement: level >= 10,
      bonus: '+15% ability cooldown reduction',
      unlocked: achievements?.level_10 || false
    },
    {
      id: 'ability_master',
      name: 'Ability Master',
      description: 'Unlock all abilities',
      icon: '🔮',
      requirement: stats?.abilitiesUnlocked >= 18,
      bonus: '+25% ability effectiveness',
      unlocked: achievements?.ability_master || false
    }
  ];

  const unlockedCount = achievementDefinitions.filter(a => a.unlocked).length;
  const totalCount = achievementDefinitions.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  return (
    <PageWrapper loadingType="app">
      <div className="achievements-page">
        <Navbar />
        <UserGoldLevelBar 
          gold={gold} 
          level={level} 
          exp={exp} 
          resetXp={resetXp} 
          addLevel={addLevel} 
        />
        
        <div className="achievements-content" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
          <div className="medieval-container">
            <h1 className="medieval-heading">⚔️ Book of Achievements ⚔️</h1>
            <div className="scroll-decoration"></div>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <p style={{ color: 'var(--ink)', fontSize: '1.2rem', marginBottom: '1rem' }}>
                Progress: <span className="gold-text">{unlockedCount} / {totalCount}</span> Unlocked
              </p>
              <div className="fantasy-progress">
                <div 
                  className="fantasy-progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="achievements-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {achievementDefinitions.map((achievement, index) => (
                <div 
                  key={achievement.id}
                  className={`fantasy-card`}
                  style={{
                    opacity: achievement.unlocked ? 1 : 0.6,
                    filter: achievement.unlocked ? 'none' : 'grayscale(50%)',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="gold-text" style={{ fontSize: '1.3rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                      {achievement.name}
                    </h3>
                    <p style={{ color: 'var(--parchment)', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
                      {achievement.description}
                    </p>
                    <div className="stat-display" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--medieval-gold)' }}>⚡ {achievement.bonus}</span>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      {achievement.unlocked ? (
                        <span style={{ 
                          color: '#90EE90', 
                          fontWeight: 'bold',
                          textShadow: '0 0 10px rgba(144, 238, 144, 0.5)'
                        }}>
                          ✅ Unlocked
                        </span>
                      ) : (
                        <span style={{ 
                          color: '#888', 
                          fontWeight: 'bold'
                        }}>
                          🔒 Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="scroll-decoration"></div>

            <div className="fantasy-card" style={{ marginTop: '2rem' }}>
              <h2 className="gold-text" style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1.5rem' }}>
                📊 Your Legacy 📊
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem'
              }}>
                <div className="stat-display" style={{ flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
                  <span className="stat-icon" style={{ fontSize: '2.5rem' }}>⚔️</span>
                  <span style={{ color: 'var(--parchment)' }}>Total Kills</span>
                  <span className="stat-value" style={{ fontSize: '2rem' }}>{stats?.totalKills || 0}</span>
                </div>
                <div className="stat-display" style={{ flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
                  <span className="stat-icon" style={{ fontSize: '2.5rem' }}>🎮</span>
                  <span style={{ color: 'var(--parchment)' }}>Games Played</span>
                  <span className="stat-value" style={{ fontSize: '2rem' }}>{stats?.gamesPlayed || 0}</span>
                </div>
                <div className="stat-display" style={{ flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
                  <span className="stat-icon" style={{ fontSize: '2.5rem' }}>🏆</span>
                  <span style={{ color: 'var(--parchment)' }}>Best Score</span>
                  <span className="stat-value" style={{ fontSize: '2rem' }}>{stats?.bestScore || 0}</span>
                </div>
                <div className="stat-display" style={{ flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
                  <span className="stat-icon" style={{ fontSize: '2.5rem' }}>💰</span>
                  <span style={{ color: 'var(--parchment)' }}>Gold Earned</span>
                  <span className="stat-value" style={{ fontSize: '2rem' }}>{stats?.totalGoldEarned || 0}</span>
                </div>
                <div className="stat-display" style={{ flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
                  <span className="stat-icon" style={{ fontSize: '2.5rem' }}>✨</span>
                  <span style={{ color: 'var(--parchment)' }}>Abilities</span>
                  <span className="stat-value" style={{ fontSize: '2rem' }}>{stats?.abilitiesUnlocked || 3}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
