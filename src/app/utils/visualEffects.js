// Particle system for visual effects
export const createParticles = (x, y, color = "#d4af37", count = 10) => {
  const particles = [];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const velocity = 2 + Math.random() * 3;
    const tx = Math.cos(angle) * velocity * 50;
    const ty = Math.sin(angle) * velocity * 50;

    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      width: 8px;
      height: 8px;
      background: ${color};
      border-radius: 50%;
      box-shadow: 0 0 10px ${color};
      --tx: ${tx}px;
      --ty: ${ty}px;
    `;

    document.body.appendChild(particle);
    particles.push(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  }

  return particles;
};

// Flash effect on screen
export const createFlashEffect = (color = "rgba(255, 215, 0, 0.3)") => {
  const flash = document.createElement("div");
  flash.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${color};
    pointer-events: none;
    z-index: 9999;
    animation: flashFade 0.3s ease-out;
  `;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes flashFade {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(flash);

  setTimeout(() => {
    flash.remove();
    style.remove();
  }, 300);
};

// Score popup effect
export const createScorePopup = (x, y, score, color = "#d4af37") => {
  const popup = document.createElement("div");
  popup.textContent = `+${score}`;
  popup.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    color: ${color};
    font-size: 24px;
    font-weight: bold;
    font-family: 'Cinzel', serif;
    text-shadow: 
      0 0 10px ${color},
      2px 2px 4px rgba(0, 0, 0, 0.8);
    pointer-events: none;
    z-index: 10000;
    animation: scorePopup 1s ease-out forwards;
  `;

  const style = document.createElement("style");
  if (!document.getElementById("score-popup-style")) {
    style.id = "score-popup-style";
    style.textContent = `
      @keyframes scorePopup {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        50% {
          transform: translateY(-30px) scale(1.2);
        }
        100% {
          transform: translateY(-60px) scale(0.8);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1000);
};

// Level up effect
export const createLevelUpEffect = () => {
  const effect = document.createElement("div");
  effect.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 72px;
    font-weight: bold;
    font-family: 'Cinzel', serif;
    color: #d4af37;
    text-shadow: 
      0 0 20px rgba(212, 175, 55, 0.8),
      0 0 40px rgba(212, 175, 55, 0.6),
      4px 4px 8px rgba(0, 0, 0, 0.8);
    pointer-events: none;
    z-index: 10000;
    animation: levelUpAnim 2s ease-out forwards;
  `;
  effect.textContent = "⬆️ LEVEL UP! ⬆️";

  const style = document.createElement("style");
  if (!document.getElementById("levelup-style")) {
    style.id = "levelup-style";
    style.textContent = `
      @keyframes levelUpAnim {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
        }
        10% {
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 1;
        }
        90% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(effect);
  createFlashEffect("rgba(212, 175, 55, 0.4)");

  setTimeout(() => {
    effect.remove();
  }, 2000);
};
