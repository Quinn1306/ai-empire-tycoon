'use client';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { BusinessId } from '@/types/game';
import { BUSINESSES } from '@/config/gameData';

export default function BusinessSelect() {
  const player = useGameStore(s => s.player);
  const initNewGame = useGameStore(s => s.initNewGame);
  const setScreen = useGameStore(s => s.setScreen);
  const [selected, setSelected] = useState<BusinessId | null>(null);

  const handleStart = () => {
    if (!selected) return;
    initNewGame(player.name, player.appearance, selected);
  };

  return (
    <div
      className="flex flex-col items-center justify-start h-full overflow-y-auto px-4 pt-8 pb-6 gap-5"
      style={{ background: 'linear-gradient(180deg, #1E0A3C 0%, #0F0A1E 100%)' }}
    >
      <button
        onClick={() => setScreen('character-creation')}
        className="self-start text-violet-400 text-sm font-semibold flex items-center gap-1"
        aria-label="Go back to character creation"
      >
        ← Back
      </button>

      <div className="text-center">
        <p className="text-violet-300 text-sm font-medium mb-1">Welcome, {player.name}!</p>
        <h2 className="text-2xl font-black text-white">Choose Your Business</h2>
        <p className="text-slate-400 text-sm mt-1">
          You have <span className="text-emerald-400 font-bold">$500</span> and a dream.
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        {BUSINESSES.map(biz => (
          <button
            key={biz.id}
            onClick={() => setSelected(biz.id)}
            className="w-full rounded-2xl p-4 text-left transition-all duration-200"
            style={{
              background: selected === biz.id
                ? 'linear-gradient(135deg, rgba(109,40,217,0.5), rgba(91,33,182,0.4))'
                : 'rgba(255,255,255,0.05)',
              border: `3px solid ${selected === biz.id ? '#A78BFA' : 'rgba(255,255,255,0.1)'}`,
              boxShadow: selected === biz.id ? '0 0 20px rgba(124,58,237,0.3)' : 'none',
              transform: selected === biz.id ? 'scale(1.01)' : 'scale(1)',
            }}
            aria-pressed={selected === biz.id}
            aria-label={`Select ${biz.name}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, #7C3AED, #4C1D95)', border: '2px solid rgba(139,92,246,0.4)' }} />
              <div>
                <div className="text-white font-black text-base">{biz.name}</div>
                <div className="text-slate-300 text-sm mt-0.5">{biz.description}</div>
                <div className="text-violet-400 text-xs mt-2 italic">{biz.flavor}</div>
              </div>
            </div>
            {selected === biz.id && (
              <div className="mt-3 flex justify-center">
                <span
                  className="px-3 py-1 rounded-full text-xs font-black text-white"
                  style={{ background: '#7C3AED' }}
                >
                  ✓ Selected
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handleStart}
        disabled={!selected}
        className="w-full max-w-sm py-4 rounded-2xl text-lg font-black text-white transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: selected
            ? 'linear-gradient(135deg, #10B981, #059669)'
            : 'rgba(255,255,255,0.1)',
          border: '3px solid rgba(52,211,153,0.4)',
          boxShadow: selected ? '0 4px 20px rgba(16,185,129,0.5)' : 'none',
        }}
        aria-label="Start game"
      >
        🚀 Start Building Your Empire!
      </button>
    </div>
  );
}
