import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import UserGoldLevelBar from './components/UserGoldLevelBar';
import PageWrapper from './components/PageWrapper';
import './styles/Achievements.css';

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
      bonus: '+10% reload speed',
      unlocked: achievements?.killer_10 || false
    },
    {
      id: 'killer_50',
      name: 'Expert Hunter',
      description: 'Kill 50 enemies',
      icon: '🏹',
      requirement: stats?.totalKills >= 50,
      bonus: '+15% bullet damage',
      unlocked: achievements?.killer_50 || false
    },
    {
      id: 'killer_100',
      name: 'Master Assassin',
      description: 'Kill 100 enemies',
      icon: '💀',
      requirement: stats?.totalKills >= 100,
      bonus: '+20% critical hit chance',
      unlocked: achievements?.killer_100 || false
    },
    {
      id: 'survivor_5',
      name: 'Survivor',
      description: 'Play 5 games',
      icon: '🛡️',
      requirement: stats?.gamesPlayed >= 5,
      bonus: '+10% max health',
      unlocked: achievements?.survivor_5 || false
    },
    {
      id: 'survivor_20',
      name: 'Veteran',
      description: 'Play 20 games',
      icon: '🏆',
      requirement: stats?.gamesPlayed >= 20,
      bonus: '+15% max health',
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
        
        <div className="achievements-content">
          <div className="achievements-header">
            <h1>🏆 Achievements</h1>
            <div className="progress-info">
              <p>{unlockedCount} / {totalCount} Unlocked</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="achievements-grid">
            {achievementDefinitions.map((achievement) => (
              <div 
                key={achievement.id}
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-details">
                  <h3>{achievement.name}</h3>
                  <p className="achievement-description">
                    {achievement.description}
                  </p>
                  <div className="achievement-bonus">
                    <span className="bonus-label">Bonus:</span>
                    <span className="bonus-value">{achievement.bonus}</span>
                  </div>
                  {!achievement.unlocked && (
                    <div className="achievement-locked">
                      <span>🔒 Locked</span>
                    </div>
                  )}
                  {achievement.unlocked && (
                    <div className="achievement-unlocked">
                      <span>✅ Unlocked</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="stats-panel">
            <h2>📊 Your Stats</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total Kills:</span>
                <span className="stat-value">{stats?.totalKills || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Games Played:</span>
                <span className="stat-value">{stats?.gamesPlayed || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Best Score:</span>
                <span className="stat-value">{stats?.bestScore || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Gold Earned:</span>
                <span className="stat-value">{stats?.totalGoldEarned || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Abilities Unlocked:</span>
                <span className="stat-value">{stats?.abilitiesUnlocked || 3}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
