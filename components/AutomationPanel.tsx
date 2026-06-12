'use client';
import { useGameStore } from '@/store/gameStore';
import { AUTOMATIONS, PC_TIERS, BUSINESSES, formatMoney } from '@/config/gameData';

export default function AutomationPanel() {
  const player      = useGameStore(s => s.player);
  const bank        = useGameStore(s => s.bank);
  const equipment   = useGameStore(s => s.equipment);
  const business    = useGameStore(s => s.business);
  const automations = useGameStore(s => s.automations);
  const toggle      = useGameStore(s => s.toggleAutomation);
  const setPanel    = useGameStore(s => s.setPanel);
  const addFloat    = useGameStore(s => s.addFloatingText);

  const businessDef = BUSINESSES.find(b => b.id === business?.id);

  const handleToggle = (id: string, cost: number, alreadyOwned: boolean) => {
    if (!alreadyOwned && bank.balance < cost) {
      addFloat('Not enough money!', 100, 150, '#EF4444');
      return;
    }
    if (!alreadyOwned) {
      addFloat(`-${formatMoney(cost)}`, 100, 150, '#EF4444');
    }
    toggle(id);
  };

  return (
    <div
      className="panel-slide-up flex flex-col h-full"
      style={{ background: 'linear-gradient(180deg, #1A0533 0%, #0F0A1E 100%)' }}
      role="region"
      aria-label="Automation panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <h2 className="text-white font-black text-base flex items-center gap-2">🤖 Automations</h2>
          <p className="text-violet-400 text-xs">Passive income while you hustle (and sleep)</p>
        </div>
        <button onClick={() => setPanel('none')} className="text-slate-400 hover:text-white text-xl px-2" aria-label="Close automation panel">✕</button>
      </div>

      {player.level < 5 && (
        <div
          className="mx-4 mb-3 py-3 px-4 rounded-2xl text-center"
          style={{ background: 'rgba(139,92,246,0.1)', border: '2px solid rgba(139,92,246,0.2)' }}
          role="status"
        >
          <div className="text-3xl mb-1">🔒</div>
          <p className="text-violet-300 font-bold text-sm">Automations unlock at Level 5</p>
          <p className="text-slate-400 text-xs mt-1">Keep grinding — you&apos;re almost there!</p>
        </div>
      )}

      {/* Passive income summary */}
      {automations.filter(a => a.active).length > 0 && (
        <div
          className="mx-4 mb-3 py-2 px-3 rounded-xl flex items-center gap-2"
          style={{ background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)' }}
          role="status"
          aria-live="polite"
        >
          <span className="text-xl auto-active">⚡</span>
          <div>
            <div className="text-emerald-400 font-black text-sm">
              ${automations
                .filter(a => a.active)
                .reduce((sum, a) => {
                  const def = AUTOMATIONS.find(d => d.id === a.id);
                  return sum + (def?.incomePerMinute ?? 0);
                }, 0)
                .toFixed(0)}/min passive
            </div>
            <div className="text-slate-400 text-xs">{automations.filter(a => a.active).length} bot{automations.filter(a => a.active).length !== 1 ? 's' : ''} running</div>
          </div>
        </div>
      )}

      {/* Automation list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">
        {AUTOMATIONS.map(def => {
          const owned = automations.find(a => a.id === def.id);
          const active = owned?.active ?? false;
          const locked = def.levelRequired > player.level;
          const pcLocked = equipment.pcTier < def.pcTierRequired;
          const canAfford = bank.balance >= def.cost;
          const available = !locked && !pcLocked;
          const pcTierName = PC_TIERS.find(p => p.tier === def.pcTierRequired)?.name ?? '';
          const forCurrentBiz = business ? def.businesses.includes(business.id) : false;

          return (
            <div
              key={def.id}
              className="rounded-2xl p-3"
              style={{
                background: active
                  ? 'rgba(16,185,129,0.1)'
                  : available && !owned
                  ? 'rgba(255,255,255,0.07)'
                  : 'rgba(255,255,255,0.03)',
                border: `2px solid ${active ? 'rgba(16,185,129,0.4)' : available ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
                opacity: locked ? 0.45 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 flex-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${active ? 'auto-active' : ''}`} style={{ background: active ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.07)', border: `2px solid ${active ? '#10B981' : 'rgba(255,255,255,0.1)'}`, color: active ? '#10B981' : '#94A3B8', flexShrink: 0 }}>AI</div>
                  <div>
                    <div className="text-white font-black text-sm">{def.name}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{def.description}</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
                      >
                        +${def.incomePerMinute}/min
                      </span>
                      {pcLocked && !locked && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}
                        >
                          Needs: {pcTierName}
                        </span>
                      )}
                      {locked && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}
                        >
                          🔒 Lv.{def.levelRequired}
                        </span>
                      )}
                      {!forCurrentBiz && !locked && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA' }}
                        >
                          Not for {businessDef?.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {!owned ? (
                    <button
                      onClick={() => handleToggle(def.id, def.cost, false)}
                      disabled={!available || !canAfford || !forCurrentBiz}
                      className="px-3 py-2 rounded-xl text-xs font-black transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: canAfford && available && forCurrentBiz
                          ? 'linear-gradient(135deg, #7C3AED, #6D28D9)'
                          : 'rgba(255,255,255,0.05)',
                        color: canAfford && available ? 'white' : '#64748B',
                        border: `1px solid ${canAfford && available ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        minWidth: 64,
                      }}
                      aria-label={`Buy ${def.name} for ${formatMoney(def.cost)}`}
                    >
                      {formatMoney(def.cost)}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggle(def.id, def.cost, true)}
                      className="px-3 py-2 rounded-xl text-xs font-black transition-all duration-150"
                      style={{
                        background: active ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)',
                        color: active ? '#10B981' : '#94A3B8',
                        border: `2px solid ${active ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.15)'}`,
                      }}
                      aria-label={active ? `Pause ${def.name}` : `Resume ${def.name}`}
                      aria-pressed={active}
                    >
                      {active ? '⏸ Running' : '▶ Paused'}
                    </button>
                  )}
                  {!owned && (
                    <div className="text-xs text-slate-500">
                      {!canAfford ? `Need ${formatMoney(def.cost - bank.balance)} more` : 'Available'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Offline earnings note */}
        <div
          className="mt-2 py-2.5 px-3 rounded-xl text-xs text-slate-500 text-center"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          💤 Automations earn while you&apos;re away (up to 4 hours offline)
        </div>
      </div>
    </div>
  );
}
