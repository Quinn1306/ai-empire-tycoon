'use client';
import { useGameStore } from '@/store/gameStore';
import { SKILLS } from '@/config/gameData';

const BRANCH_COLORS: Record<string, { bg: string; border: string; label: string; icon: string }> = {
  hustle:   { bg: 'rgba(245,158,11,0.15)', border: '#F59E0B', label: 'Hustle',   icon: '💪' },
  tech:     { bg: 'rgba(59,130,246,0.15)', border: '#3B82F6', label: 'Tech',     icon: '⚡' },
  business: { bg: 'rgba(16,185,129,0.15)', border: '#10B981', label: 'Business', icon: '📈' },
};

export default function SkillTree() {
  const player = useGameStore(s => s.player);
  const spendSkillPoint = useGameStore(s => s.spendSkillPoint);
  const setPanel = useGameStore(s => s.setPanel);

  const branches = ['hustle', 'tech', 'business'] as const;

  return (
    <div
      className="panel-slide-up flex flex-col h-full"
      style={{ background: 'linear-gradient(180deg, #1A0533 0%, #0F0A1E 100%)' }}
      role="region"
      aria-label="Skill tree"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div>
          <h2 className="text-white font-black text-base flex items-center gap-2">🧠 Skills</h2>
          <p className="text-violet-400 text-xs">
            {player.skillPoints > 0
              ? <span className="text-amber-400 font-bold">{player.skillPoints} points to spend!</span>
              : 'Level up to earn skill points'}
          </p>
        </div>
        <button onClick={() => setPanel('none')} className="text-slate-400 hover:text-white text-xl px-2" aria-label="Close skills">✕</button>
      </div>

      {/* Available points */}
      {player.skillPoints > 0 && (
        <div
          className="mx-4 mb-3 py-2 px-3 rounded-xl flex items-center gap-2"
          style={{ background: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.4)' }}
          role="status"
          aria-live="polite"
        >
          <span className="text-xl">⭐</span>
          <span className="text-amber-300 font-black text-sm">{player.skillPoints} skill point{player.skillPoints !== 1 ? 's' : ''} available!</span>
        </div>
      )}

      {/* Branches */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
        {branches.map(branch => {
          const branchSkills = SKILLS.filter(s => s.branch === branch);
          const { bg, border, label, icon } = BRANCH_COLORS[branch];

          return (
            <div
              key={branch}
              className="rounded-2xl overflow-hidden"
              style={{ border: `2px solid ${border}33` }}
            >
              {/* Branch header */}
              <div
                className="px-3 py-2 flex items-center gap-2"
                style={{ background: bg }}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-white font-black text-sm">{label}</span>
              </div>

              {/* Skills in branch */}
              <div className="p-2 flex flex-col gap-1.5">
                {branchSkills.map((skill, idx) => {
                  const unlocked = player.unlockedSkills.includes(skill.id);
                  const requiresMet = !skill.requires || player.unlockedSkills.includes(skill.requires);
                  const canUnlock = !unlocked && requiresMet && player.skillPoints >= skill.cost;

                  return (
                    <div key={skill.id} className="flex items-start gap-2">
                      {/* Connector line */}
                      <div className="flex flex-col items-center flex-shrink-0 mt-1">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                          style={{
                            background: unlocked ? border : requiresMet ? bg : 'rgba(255,255,255,0.05)',
                            border: `2px solid ${unlocked ? border : requiresMet ? border + '88' : 'rgba(255,255,255,0.1)'}`,
                            color: unlocked ? 'white' : 'rgba(255,255,255,0.5)',
                          }}
                        >
                          {unlocked ? '✓' : idx + 1}
                        </div>
                        {idx < branchSkills.length - 1 && (
                          <div className="w-0.5 flex-1 my-0.5" style={{ background: unlocked ? border : 'rgba(255,255,255,0.1)', minHeight: 6 }} />
                        )}
                      </div>

                      {/* Skill card */}
                      <button
                        className="flex-1 rounded-xl p-2.5 text-left transition-all duration-150 mb-1"
                        style={{
                          background: unlocked
                            ? bg
                            : canUnlock
                            ? 'rgba(255,255,255,0.08)'
                            : 'rgba(255,255,255,0.03)',
                          border: `2px solid ${unlocked ? border : canUnlock ? border + '55' : 'rgba(255,255,255,0.08)'}`,
                          opacity: !requiresMet && !unlocked ? 0.5 : 1,
                          cursor: canUnlock ? 'pointer' : 'default',
                        }}
                        onClick={() => { if (canUnlock) spendSkillPoint(skill.id); }}
                        disabled={!canUnlock}
                        aria-label={`${skill.name}: ${skill.description}${canUnlock ? ' — click to unlock' : ''}`}
                        aria-pressed={unlocked}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-white text-xs font-bold">{skill.name}</span>
                            <p className="text-slate-400 text-xs mt-0.5">{skill.description}</p>
                            {!requiresMet && !unlocked && (
                              <p className="text-slate-500 text-xs mt-0.5">
                                Requires: {SKILLS.find(s => s.id === skill.requires)?.name}
                              </p>
                            )}
                          </div>
                          {!unlocked && (
                            <div
                              className="flex-shrink-0 ml-2 px-2 py-1 rounded-lg text-xs font-black"
                              style={{
                                background: canUnlock ? border + '33' : 'rgba(255,255,255,0.05)',
                                color: canUnlock ? border : '#64748B',
                                border: `1px solid ${canUnlock ? border + '55' : 'transparent'}`,
                              }}
                            >
                              {skill.cost}pt{skill.cost !== 1 ? 's' : ''}
                            </div>
                          )}
                          {unlocked && (
                            <span className="text-lg">✨</span>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
