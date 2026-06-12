'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { BUSINESS_TASKS, PC_TIERS, BUSINESSES, formatMoney } from '@/config/gameData';

export default function WorkPanel() {
  const player      = useGameStore(s => s.player);
  const business    = useGameStore(s => s.business);
  const equipment   = useGameStore(s => s.equipment);
  const startTask   = useGameStore(s => s.startTask);
  const cancelTask  = useGameStore(s => s.cancelTask);
  const checkTaskCompletion = useGameStore(s => s.checkTaskCompletion);
  const addFloatingText = useGameStore(s => s.addFloatingText);
  const setPanel    = useGameStore(s => s.setPanel);

  const [now, setNow] = useState(Date.now());
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    setNow(Date.now());
    const result = checkTaskCompletion();
    if (result) {
      addFloatingText(`+${formatMoney(result.earned)}`, 120, 140, '#10B981');
      setTimeout(() => addFloatingText(`+${result.xp} XP`, 160, 160, '#A78BFA'), 150);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [checkTaskCompletion, addFloatingText]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [tick]);

  if (!business) return null;

  const tasks = BUSINESS_TASKS[business.id];
  const bizDef = BUSINESSES.find(b => b.id === business.id)!;
  const pcTier = PC_TIERS.find(p => p.tier === equipment.pcTier)!;

  const activeTask = business.activeTask;
  let progress = 0;
  let remaining = 0;
  if (activeTask) {
    const elapsed = now - activeTask.startedAt;
    progress = Math.min(100, (elapsed / activeTask.duration) * 100);
    remaining = Math.max(0, Math.ceil((activeTask.duration - elapsed) / 1000));
  }
  const activeTaskDef = activeTask ? tasks.find(t => t.id === activeTask.taskId) : null;

  return (
    <div
      className="panel-slide-up flex flex-col h-full overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1A0533 0%, #0F0A1E 100%)' }}
      role="region"
      aria-label="Work panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{bizDef.emoji}</span>
            <h2 className="text-white font-black text-base">{bizDef.name}</h2>
          </div>
          <p className="text-violet-400 text-xs mt-0.5">
            PC: <span className="font-bold" style={{ color: pcTier.color }}>{pcTier.name}</span>
            {' · '}{Math.round((1 - pcTier.speedMult) * 100)}% speed bonus
          </p>
        </div>
        <button
          onClick={() => setPanel('none')}
          className="text-slate-400 hover:text-white text-xl px-2 py-1 rounded-lg"
          aria-label="Close work panel"
        >
          ✕
        </button>
      </div>

      {/* Active task */}
      {activeTask && activeTaskDef && (
        <div
          className="mx-4 mb-3 rounded-2xl p-3"
          style={{ background: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.4)' }}
          role="status"
          aria-label={`Working on: ${activeTaskDef.name}`}
          aria-live="polite"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{activeTaskDef.emoji}</span>
              <span className="text-white font-bold text-sm">{activeTaskDef.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-black text-sm">⏱ {remaining}s</span>
              <button
                onClick={cancelTask}
                className="text-xs text-red-400 hover:text-red-300 px-2 py-0.5 rounded-lg"
                style={{ border: '1px solid rgba(239,68,68,0.3)' }}
                aria-label="Cancel task"
              >
                Cancel
              </button>
            </div>
          </div>
          <div
            className="relative h-5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
                boxShadow: '0 0 10px rgba(245,158,11,0.7)',
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white" style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.8)' }}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      )}

      {/* Task list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">
        {tasks.map(task => {
          const locked = task.levelRequired > player.level;
          const isBusy = !!activeTask;
          const payout = Math.round(task.basePayout * pcTier.payoutMult);
          const speededDuration = Math.round(task.baseDuration * pcTier.speedMult / 1000);
          const isActive = activeTask?.taskId === task.id;

          return (
            <button
              key={task.id}
              onClick={() => { if (!locked && !isBusy) startTask(task.id); }}
              disabled={locked || (isBusy && !isActive)}
              className="w-full rounded-2xl p-3 text-left transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))'
                  : locked
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(255,255,255,0.07)',
                border: `2px solid ${isActive ? 'rgba(245,158,11,0.5)' : locked ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)'}`,
              }}
              aria-label={locked ? `${task.name} — unlocks at level ${task.levelRequired}` : task.name}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{task.emoji}</span>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {task.name}
                      {locked && (
                        <span className="ml-1 text-xs text-slate-500">🔒 Lv.{task.levelRequired}</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      ⏱ {speededDuration}s · +{task.baseXP} XP
                    </div>
                  </div>
                </div>
                <div
                  className="text-sm font-black px-2.5 py-1 rounded-xl"
                  style={{
                    background: locked ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.15)',
                    color: locked ? '#64748B' : '#10B981',
                    border: `1px solid ${locked ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.3)'}`,
                  }}
                >
                  ${payout}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
