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
    gold_collector: { 
      title: '💰 Gold Collector', 
      desc: 'Earned 1000 gold total',
      bonus: '+5% EXP Gain'
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
