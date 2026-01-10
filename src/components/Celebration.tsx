import React, { useEffect, useState } from 'react';

interface CelebrationProps {
  isVisible: boolean;
  message?: string;
}

export const Celebration: React.FC<CelebrationProps> = ({ isVisible, message = "Great job!" }) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; rotation: number; color: string }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti particles
      const newConfetti = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        rotation: Math.random() * 360,
        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][Math.floor(Math.random() * 5)]
      }));

      setConfetti(newConfetti);

      // Clean up after animation
      const timer = setTimeout(() => {
        setConfetti([]);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="celebration-overlay">
      <div className="celebration-message">
        <div className="celebration-emoji">🎉</div>
        <h3>{message}</h3>
        <p>You're making progress!</p>
      </div>

      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg)`,
            background: particle.color
          }}
        />
      ))}

      <style>{`
        .celebration-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .celebration-message {
          text-align: center;
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          border: 2px solid #22c55e;
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          backdrop-filter: blur(4px);
        }

        @keyframes popIn {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }

        .celebration-emoji {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: bounceIn 0.6s ease-out;
        }

        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .celebration-message h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          color: #1f2937;
          font-weight: 700;
        }

        .celebration-message p {
          margin: 0;
          color: #6b7280;
          font-size: 1rem;
        }

        .confetti-particle {
          position: absolute;
          width: 8px;
          height: 20px;
          border-radius: 2px;
          animation: fall 2s linear forwards;
          opacity: 0.8;
        }

        @keyframes fall {
          0% {
            transform: translateY(-50px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};