'use client';
import { useGameStore } from '@/store/gameStore';
import { formatMoneyFull, BUSINESSES, getXPForLevel, getXPInCurrentLevel, AUTOMATIONS } from '@/config/gameData';

export default function HUD() {
  const player   = useGameStore(s => s.player);
  const bank     = useGameStore(s => s.bank);
  const business = useGameStore(s => s.business);
  const automations = useGameStore(s => s.automations);
  const setPanel = useGameStore(s => s.setPanel);
  const activePanel = useGameStore(s => s.activePanel);
  const resetGame = useGameStore(s => s.resetGame);

  const xpNeeded = getXPForLevel(player.level);
  const xpIn = getXPInCurrentLevel(player.xp, player.level);
  const xpPct = player.level >= 10 ? 100 : Math.min(100, (xpIn / xpNeeded) * 100);

  const bizName = BUSINESSES.find(b => b.id === business?.id)?.name ?? '';

  const activeAutoCount = automations.filter(a => a.active).length;
  const passivePerMin = automations
    .filter(a => a.active)
    .reduce((sum, a) => {
      const def = AUTOMATIONS.find(d => d.id === a.id);
      return sum + (def?.incomePerMinute ?? 0);
    }, 0);

  return (
    <header
      className="relative z-50 flex flex-col select-none"
      style={{ background: 'linear-gradient(180deg, #1E0A3C 0%, #1a0a30 100%)', borderBottom: '3px solid #7C3AED' }}
      role="banner"
    >
      {/* Top row: money + level */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 gap-2">
        {/* Balance */}
        <div
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 cursor-pointer"
          style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid #10B981' }}
          role="status"
          aria-label={`Balance: ${formatMoneyFull(bank.balance)}`}
        >
          <span className="text-xl">💰</span>
          <div>
            <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider leading-none">Balance</div>
            <div className="text-lg font-black text-emerald-300 leading-tight" style={{ textShadow: '0 0 10px rgba(16,185,129,0.6)' }}>
              {formatMoneyFull(bank.balance)}
            </div>
          </div>
        </div>

        {/* Level + XP */}
        <div className="flex flex-col items-center">
          <div
            className="flex items-center gap-1.5 rounded-xl px-3 py-1"
            style={{ background: 'rgba(139,92,246,0.2)', border: '2px solid #8B5CF6' }}
            role="status"
            aria-label={`Level ${player.level}`}
          >
            <span className="text-base">⭐</span>
            <span className="text-xs font-bold text-violet-300 uppercase tracking-wide">Lv.</span>
            <span className="text-xl font-black text-white">{player.level}</span>
            {player.skillPoints > 0 && (
              <span
                className="ml-1 text-xs font-black px-1.5 py-0.5 rounded-full text-white animate-pulse"
                style={{ background: '#F59E0B' }}
                aria-label={`${player.skillPoints} skill points available`}
              >
                +{player.skillPoints}
              </span>
            )}
          </div>
          {/* XP Bar */}
          <div className="w-full mt-1 px-0.5">
            <div
              className="relative h-2.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', width: 110 }}
              role="progressbar"
              aria-valuenow={xpPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`XP: ${xpIn} / ${xpNeeded}`}
            >
              <div
                className="h-full rounded-full xp-bar-fill transition-all duration-500"
                style={{ width: `${xpPct}%`, background: 'linear-gradient(90deg, #7C3AED, #A78BFA)' }}
              />
            </div>
            <div className="text-[9px] text-violet-400 text-center mt-0.5">
              {player.level < 10 ? `${xpIn} / ${xpNeeded} XP` : 'MAX LEVEL'}
            </div>
          </div>
        </div>

        {/* Business income rate */}
        <div
          className="flex flex-col items-end rounded-xl px-2 py-1.5"
          style={{ background: 'rgba(245,158,11,0.1)', border: '2px solid rgba(245,158,11,0.4)' }}
          role="status"
          aria-label={`Business: ${bizName}`}
        >
          <div className="text-[9px] text-amber-400 font-semibold uppercase tracking-wider">Business</div>
          <div className="text-xs font-bold text-amber-300 leading-tight max-w-[90px] truncate">{bizName}</div>
          {activeAutoCount > 0 && (
            <div className="text-[9px] text-emerald-400 font-bold mt-0.5 auto-active">
              ⚡ ${passivePerMin.toFixed(0)}/min
            </div>
          )}
        </div>
      </div>

      {/* Nav buttons */}
      <nav
        className="flex items-center gap-1 px-2 pb-2 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}
        aria-label="Game navigation"
      >
        {([
          { id: 'work',       label: 'Work',       icon: '💼' },
          { id: 'shop',       label: 'Shop',       icon: '🛒' },
          { id: 'skills',     label: 'Skills',     icon: '🧠' },
          { id: 'automation', label: 'Bots',       icon: '🤖' },
          { id: 'character',  label: 'Look',       icon: '👤' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setPanel(tab.id)}
            className="flex flex-col items-center gap-0.5 rounded-lg px-2.5 py-1 min-w-[52px] transition-all duration-150"
            style={{
              background: activePanel === tab.id
                ? 'linear-gradient(135deg, #7C3AED, #6D28D9)'
                : 'rgba(255,255,255,0.07)',
              border: `2px solid ${activePanel === tab.id ? '#A78BFA' : 'rgba(255,255,255,0.12)'}`,
              transform: activePanel === tab.id ? 'scale(0.97)' : 'scale(1)',
            }}
            aria-pressed={activePanel === tab.id}
            aria-label={tab.label}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span className="text-[9px] font-bold text-white/80 leading-none">{tab.label}</span>
          </button>
        ))}

        <button
          onClick={() => { if (confirm('Reset all progress?')) resetGame(); }}
          className="ml-auto flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 min-w-[40px] opacity-50 hover:opacity-80"
          style={{ background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.3)' }}
          aria-label="Reset game"
        >
          <span className="text-sm">🔄</span>
          <span className="text-[8px] text-red-400">Reset</span>
        </button>
      </nav>
    </header>
  );
}
