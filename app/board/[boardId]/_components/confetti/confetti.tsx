'use client';

import { useEffect, useState } from 'react';

type ConfettiParticle = {
  id: number;
  x: number;
  y: number;
  angle: number;
  velocity: number;
  emoji: string;
};

type ConfettiProps = {
  x: number;
  y: number;
  emoji: string;
  onComplete?: () => void;
};

const CONFETTI_EMOJIS = ['🎉', '✨', '🌟', '💫', '⭐', '🎊', '🎈', '🎁'];
const PARTICLE_COUNT = 12;
const DURATION = 2000;

const Confetti = ({ x, y, emoji, onComplete }: ConfettiProps) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    const newParticles: ConfettiParticle[] = Array.from(
      { length: PARTICLE_COUNT },
      (_, i) => {
        const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.5;
        const velocity = 2 + Math.random() * 3;
        return {
          id: i,
          x: 0,
          y: 0,
          angle,
          velocity,
          emoji:
            CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
        };
      },
    );

    queueMicrotask(() => {
      setParticles(newParticles);
    });

    const timer = setTimeout(() => {
      onComplete?.();
    }, DURATION);

    return () => clearTimeout(timer);
  }, [emoji, onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-[60] select-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {particles.map((particle) => {
        const distance = particle.velocity * (DURATION / 1000) * 80;
        const finalX = Math.cos(particle.angle) * distance;
        const finalY = Math.sin(particle.angle) * distance;
        const rotation = particle.angle * (180 / Math.PI);

        return (
          <div
            key={particle.id}
            className="absolute text-2xl"
            style={{
              animation: `confettiParticle ${DURATION}ms ease-out forwards`,
              transform: `translate(${finalX}px, ${finalY}px) rotate(${rotation}deg)`,
              willChange: 'transform, opacity',
            }}
          >
            {particle.emoji}
          </div>
        );
      })}
      <div
        className="absolute text-5xl"
        style={{
          transform: 'translate(-50%, -50%)',
          animation: `confettiExplode ${DURATION}ms ease-out forwards`,
          willChange: 'transform, opacity',
        }}
      >
        {emoji}
      </div>
    </div>
  );
};

export default Confetti;
