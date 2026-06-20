import React, { useEffect, useState } from 'react';

export default function Confetti({ active }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      // 파티클 생성
      const newParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // 0~100vw
        y: Math.random() * 100, // 0~100vh
        size: Math.random() * 1.5 + 0.5,
        color: ['#F59E0B', '#FCD34D', '#3B82F6', '#10B981', '#EC4899'][Math.floor(Math.random() * 5)],
        animationDuration: Math.random() * 1 + 1, // 1~2s
        delay: Math.random() * 0.2,
      }));
      setParticles(newParticles);

      // 3초 후 초기화
      const timer = setTimeout(() => {
        setParticles([]);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div style={styles.container}>
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            ...styles.particle,
            left: `${p.x}%`,
            top: `-${p.y}px`,
            width: `${p.size}rem`,
            height: `${p.size}rem`,
            backgroundColor: p.color,
            animationDuration: `${p.animationDuration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti-particle {
          animation: confettiFall forwards linear;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 9999,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
  }
};
