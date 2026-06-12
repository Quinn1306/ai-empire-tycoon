'use client';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { LEVEL_UNLOCKS } from '@/config/gameData';

const CONFETTI_COLORS = ['#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#3B82F6', '#EC4899'];

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

export default function LevelUpModal() {
  const pendingLevelUp = useGameStore(s => s.pendingLevelUp);
  const player = useGameStore(s => s.player);
  const dismissLevelUp = useGameStore(s => s.dismissLevelUp);

  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pendingLevelUp) {
      setVisible(true);
      setConfetti(
        Array.from({ length: 30 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          size: 6 + Math.random() * 8,
          delay: Math.random() * 0.8,
          duration: 1.5 + Math.random() * 1.5,
        }))
      );
    } else {
      setVisible(false);
    }
  }, [pendingLevelUp]);

  if (!pendingLevelUp) return null;

  const unlocks = LEVEL_UNLOCKS[pendingLevelUp] ?? [];
  const skillPointsEarned = 1;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', zIndex: 150, backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-label={`Level up! You reached level ${pendingLevelUp}`}
      onClick={dismissLevelUp}
    >
      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map(piece => (
          <div
            key={piece.id}
            className="absolute confetti-piece rounded-sm"
            style={{
              left: `${piece.x}%`,
              top: 0,
              width: piece.size,
              height: piece.size,
              background: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Modal */}
      <div
        className="level-up-anim relative rounded-3xl p-6 mx-4 flex flex-col items-center gap-3 max-w-sm w-full"
        style={{
          background: 'linear-gradient(135deg, #2D1B69, #1E0A3C)',
          border: '3px solid #7C3AED',
          boxShadow: '0 0 60px rgba(124,58,237,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Stars */}
        <div className="text-5xl" aria-hidden="true">🌟</div>

        <div className="text-center">
          <div
            className="text-4xl font-black text-white"
            style={{ textShadow: '0 0 20px rgba(245,158,11,0.8)' }}
          >
            LEVEL {pendingLevelUp}!
          </div>
          <div className="text-violet-300 text-sm font-medium mt-1">
            {player.name} leveled up!
          </div>
        </div>

        {/* Skill point */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
          style={{ background: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.4)' }}
        >
          <span className="text-2xl">⭐</span>
          <span className="text-amber-300 font-black">+{skillPointsEarned} Skill Point!</span>
        </div>

        {/* Unlocks */}
        {unlocks.length > 0 && (
          <div className="w-full flex flex-col gap-1.5">
            <p className="text-violet-400 text-xs font-bold text-center uppercase tracking-wider">Unlocked</p>
            {unlocks.map((unlock, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                <span className="text-emerald-400 text-sm">✓</span>
                <span className="text-emerald-300 text-sm font-medium">{unlock}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={dismissLevelUp}
          className="w-full py-3 rounded-2xl text-base font-black text-white transition-all duration-150"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
            border: '3px solid rgba(167,139,250,0.5)',
            boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
          }}
          autoFocus
        >
          Let&apos;s Go! 🚀
        </button>

        <p className="text-slate-500 text-xs">Tap anywhere to close</p>
      </div>
    </div>
  );
}
