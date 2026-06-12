'use client';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { formatMoney, BUSINESSES } from '@/config/gameData';
import CharacterSprite from './CharacterSprite';

const CONFETTI_COLORS = ['#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#3B82F6', '#EC4899', '#FCD34D'];

export default function EndScreen() {
  const player      = useGameStore(s => s.player);
  const bank        = useGameStore(s => s.bank);
  const business    = useGameStore(s => s.business);
  const equipment   = useGameStore(s => s.equipment);
  const office      = useGameStore(s => s.office);
  const automations = useGameStore(s => s.automations);
  const resetGame   = useGameStore(s => s.resetGame);

  const [confetti] = useState(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 10,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }))
  );

  const bizName = BUSINESSES.find(b => b.id === business?.id)?.name ?? '';
  const activeAutos = automations.filter(a => a.active).length;

  return (
    <div
      className="relative flex flex-col items-center justify-start h-full overflow-y-auto px-4 pt-8 pb-8 gap-5"
      style={{ background: 'linear-gradient(180deg, #1E0A3C 0%, #0F0A1E 100%)' }}
      role="main"
      aria-label="Victory screen"
    >
      {/* Confetti */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {confetti.map(piece => (
          <div
            key={piece.id}
            className="absolute confetti-piece rounded-sm"
            style={{
              left: `${piece.x}%`,
              top: -20,
              width: piece.size,
              height: piece.size,
              background: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              zIndex: 0,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center gap-5 w-full max-w-sm" style={{ zIndex: 1 }}>
        {/* Trophy */}
        <div className="text-6xl" style={{ filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.8))' }}>
          🏆
        </div>

        {/* Headline */}
        <div className="text-center">
          <h1
            className="text-3xl font-black text-white"
            style={{ textShadow: '0 0 30px rgba(245,158,11,0.8)' }}
          >
            EMPIRE BUILT!
          </h1>
          <p className="text-amber-300 text-base font-bold mt-1">
            {player.name} reached Level 10! 🎉
          </p>
          <p className="text-slate-400 text-sm mt-2">
            You&apos;ve built your first empire. More content coming soon!
          </p>
        </div>

        {/* Character */}
        <div
          className="flex items-center justify-center rounded-3xl p-4"
          style={{
            background: 'rgba(245,158,11,0.1)',
            border: '3px solid rgba(245,158,11,0.4)',
            boxShadow: '0 0 30px rgba(245,158,11,0.2)',
          }}
        >
          <CharacterSprite appearance={player.appearance} size={100} idle />
        </div>

        {/* Stats */}
        <div className="w-full rounded-3xl overflow-hidden" style={{ border: '2px solid rgba(139,92,246,0.3)' }}>
          <div
            className="px-4 py-2.5 text-sm font-black text-white uppercase tracking-wide"
            style={{ background: 'rgba(124,58,237,0.3)' }}
          >
            Your Empire Stats
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.03)' }}>
            {[
              { label: 'Final Level', value: '10 ⭐', color: '#F59E0B' },
              { label: 'Total Earned', value: formatMoney(bank.lifetimeEarned), color: '#10B981' },
              { label: 'Cash on Hand', value: formatMoney(bank.balance), color: '#10B981' },
              { label: 'Business', value: bizName, color: '#A78BFA' },
              { label: 'PC Tier', value: `Tier ${equipment.pcTier}/6`, color: '#3B82F6' },
              { label: 'Office Items', value: `${office.floorItems.length + office.wallItems.length} placed`, color: '#EC4899' },
              { label: 'Active Bots', value: `${activeAutos} running`, color: '#10B981' },
              { label: 'Skills Unlocked', value: `${player.unlockedSkills.length}`, color: '#A78BFA' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-slate-400 text-sm">{stat.label}</span>
                <span className="font-bold text-sm" style={{ color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coming soon */}
        <div
          className="w-full rounded-2xl px-4 py-3 text-center"
          style={{ background: 'rgba(139,92,246,0.1)', border: '2px solid rgba(139,92,246,0.25)' }}
        >
          <p className="text-violet-300 text-sm font-bold">🚀 What&apos;s Coming Next</p>
          <p className="text-slate-400 text-xs mt-1">
            New businesses, Level 10–20, employee hiring,<br />
            global leaderboards, and more automation tiers.
          </p>
        </div>

        {/* Buttons */}
        <button
          onClick={() => { if (confirm('Start a new game? Your current save will be reset.')) resetGame(); }}
          className="w-full py-4 rounded-2xl text-base font-black text-white"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
            border: '3px solid rgba(167,139,250,0.5)',
            boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
          }}
          aria-label="Start a new game"
        >
          🔄 Start New Empire
        </button>
      </div>
    </div>
  );
}
