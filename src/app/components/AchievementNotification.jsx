import { useEffect, useState } from 'react';
import '../medieval-theme.css';

export default function AchievementNotification({ achievement, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 500); // Wait for fade out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const achievementData = {
    first_kill: { 
      title: '🗡️ First Blood!', 
      desc: 'Defeated your first enemy',
      bonus: '+5% Movement Speed'
    },
    killer_10: { 
      title: '⚔️ Slayer', 
      desc: 'Defeated 10 enemies',
      bonus: '+5% Bullet Speed'
    },
    killer_50: { 
      title: '💀 Executioner', 
      desc: 'Defeated 50 enemies',
      bonus: '+10% Fire Rate'
    },
    killer_100: { 
      title: '👑 Legend', 
      desc: 'Defeated 100 enemies',
      bonus: '+1 Bullet Penetration'
    },
    // NEW: Extreme kill achievements
    killer_250: {
      title: '💀 Reaper',
      desc: 'Defeated 250 enemies',
      bonus: '+15% Bullet Speed'
    },
    mass_destroyer: {
      title: '☠️ Mass Destroyer',
      desc: 'Defeated 500 enemies',
      bonus: '+20% Bullet Speed'
    },
    genocide: {
      title: '🔥 Apocalypse',
      desc: 'Defeated 1000 enemies',
      bonus: '+25% Bullet Speed & +10% Movement Speed'
    },
    survivor_5: { 
      title: '🛡️ Survivor', 
      desc: 'Played 5 games',
      bonus: '+5% Invincibility Duration'
    },
    survivor_20: { 
      title: '⚡ Veteran', 
      desc: 'Played 20 games',
      bonus: '+10% Dodge Chance'
    },
    // NEW: Extreme survival achievements
    survivor_50: {
      title: '🏰 Battle Hardened',
      desc: 'Played 50 games',
      bonus: '+10% Movement Speed'
    },
    centurion: {
      title: '⚔️ Centurion',
      desc: 'Played 100 games',
      bonus: '+15% Movement Speed'
    },
    eternal_warrior: {
      title: '👹 Eternal Warrior',
      desc: 'Played 250 games',
      bonus: '+20% Movement Speed & +10% Fire Rate'
    },
    score_100: { 
      title: '🏆 High Scorer', 
      desc: 'Reached score of 100',
      bonus: '+10% Gold Gain'
    },
    score_500: { 
      title: '👑 Master Scorer', 
      desc: 'Reached score of 500',
      bonus: '+20% Gold Gain'
    },
    // NEW: Extreme score achievements
    score_1000: {
      title: '💎 Score Champion',
      desc: 'Reached score of 1000',
      bonus: '+30% Gold Gain'
    },
    score_master: {
      title: '🌟 Grandmaster',
      desc: 'Reached score of 2500',
      bonus: '+40% Gold Gain & +15% EXP Gain'
    },
    score_legend: {
      title: '⭐ Living Legend',
      desc: 'Reached score of 5000',
      bonus: '+50% Gold Gain & +25% EXP Gain'
    },
    gold_collector: { 
      title: '💰 Gold Collector', 
      desc: 'Earned 1000 gold total',
      bonus: '+5% EXP Gain'
    },
    // NEW: Extreme gold achievements
    gold_hoarder: {
      title: '💎 Gold Hoarder',
      desc: 'Earned 5000 gold total',
      bonus: '+10% EXP Gain'
    },
    gold_tycoon: {
      title: '👑 Gold Tycoon',
      desc: 'Earned 10000 gold total',
      bonus: '+15% EXP Gain & +10% Gold Gain'
    },
    gold_emperor: {
      title: '🏆 Gold Emperor',
      desc: 'Earned 25000 gold total',
      bonus: '+25% EXP Gain & +20% Gold Gain'
    },
    level_5: { 
      title: '⬆️ Level Up!', 
      desc: 'Reached level 5',
      bonus: '-10% Ability Cooldown'
    },
    level_10: { 
      title: '🌟 Experienced', 
      desc: 'Reached level 10',
      bonus: '-15% Ability Cooldown'
    },
    // NEW: Extreme level achievements
    level_20: {
      title: '💫 Elite',
      desc: 'Reached level 20',
      bonus: '+10% Movement Speed & +5% Bullet Speed'
    },
    level_30: {
      title: '✨ Master',
      desc: 'Reached level 30',
      bonus: '+15% Movement Speed & +10% Bullet Speed'
    },
    level_50: {
      title: '🔮 Transcendent',
      desc: 'Reached level 50',
      bonus: '+25% All Stats'
    },
    ability_master: { 
      title: '✨ Ability Master', 
      desc: 'Unlocked all abilities',
      bonus: '-25% Ability Cooldown'
    }
  };

  const data = achievementData[achievement] || { 
    title: '🎉 Achievement Unlocked!', 
    desc: achievement,
    bonus: 'Bonus Unlocked'
  };

  return (
    <div className="achievement-notification">
      <div className="achievement-notification-title">
        {data.title}
      </div>
      <div className="achievement-notification-desc">
        {data.desc}
      </div>
      <div className="stat-display" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
        <span className="gold-text">⚡ {data.bonus}</span>
      </div>
    </div>
  );
}
