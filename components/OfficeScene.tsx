'use client';
import { useGameStore } from '@/store/gameStore';
import { WALL_STYLES, FLOOR_STYLES, FURNITURE_ITEMS, PC_TIERS } from '@/config/gameData';
import CharacterSprite from './CharacterSprite';

const FLOOR_COLORS: Record<string, [string, string]> = {
  wood:   ['#92400E', '#B45309'],
  carpet: ['#5B21B6', '#7C3AED'],
  tile:   ['#334155', '#475569'],
  marble: ['#CBD5E1', '#E2E8F0'],
};

const WALL_COLORS: Record<string, [string, string]> = {
  white: ['#E2E8F0', '#F8FAFC'],
  blue:  ['#BFDBFE', '#DBEAFE'],
  green: ['#A7F3D0', '#D1FAE5'],
  dark:  ['#0F172A', '#1E293B'],
};

const PC_EMOJI: Record<number, string> = {
  1: '🖥️', 2: '💻', 3: '🖥️', 4: '🖥️', 5: '🗄️', 6: '🏢',
};

export default function OfficeScene() {
  const player    = useGameStore(s => s.player);
  const office    = useGameStore(s => s.office);
  const equipment = useGameStore(s => s.equipment);
  const business  = useGameStore(s => s.business);
  const setPanel  = useGameStore(s => s.setPanel);
  const activePanel = useGameStore(s => s.activePanel);

  const [wallDark, wallLight] = WALL_COLORS[office.wallStyle] ?? WALL_COLORS.white;
  const [floorDark, floorLight] = FLOOR_COLORS[office.floorStyle] ?? FLOOR_COLORS.wood;

  const pcTierDef = PC_TIERS.find(p => p.tier === equipment.pcTier)!;
  const pcName = pcTierDef?.name ?? '90s Beige Box';

  const isWorking = !!business?.activeTask;

  return (
    <div
      className="relative w-full select-none overflow-hidden"
      style={{ height: 'clamp(200px, 35vw, 320px)', background: wallLight, cursor: 'default' }}
      role="region"
      aria-label="Your office"
    >
      {/* Wall gradient */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${wallLight} 0%, ${wallDark} 100%)` }}
      />

      {/* Wall decorations */}
      <div className="absolute top-2 left-3 text-2xl opacity-70">💡</div>
      <div
        className="absolute top-3 right-3 text-2xl"
        style={{ textShadow: '0 0 10px rgba(245,158,11,0.5)' }}
      >
        📈
      </div>
      {office.wallStyle === 'dark' && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-lg">🌙</div>
      )}

      {/* Floor */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '55%',
          background: `linear-gradient(180deg, ${floorDark} 0%, ${floorLight} 100%)`,
          borderTop: `4px solid ${floorDark}`,
        }}
      >
        {/* Floor pattern lines */}
        {office.floorStyle === 'wood' && (
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute w-full h-px" style={{ background: '#FFF', top: `${i * 20}%` }} />
            ))}
          </div>
        )}
        {office.floorStyle === 'tile' && (
          <div className="absolute inset-0 opacity-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="absolute h-full w-px" style={{ background: '#FFF', left: `${(i + 1) * 25}%` }} />
            ))}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="absolute w-full h-px" style={{ background: '#FFF', top: `${(i + 1) * 33}%` }} />
            ))}
          </div>
        )}
      </div>

      {/* Placed items */}
      {office.placedItems.map(item => {
        const def = FURNITURE_ITEMS.find(f => f.id === item.itemId);
        if (!def) return null;
        return (
          <div
            key={item.instanceId}
            className="absolute flex flex-col items-center text-2xl"
            style={{
              left: `${15 + item.gridX * 18}%`,
              bottom: `${28 + item.gridY * 15}%`,
            }}
            title={def.name}
            role="img"
            aria-label={def.name}
          >
            <span>{def.emoji}</span>
          </div>
        );
      })}

      {/* Desk */}
      <div
        className="absolute"
        style={{ bottom: '28%', left: '50%', transform: 'translateX(-50%)' }}
      >
        <div
          className="relative flex flex-col items-center"
          style={{
            width: 'clamp(100px, 25vw, 160px)',
          }}
        >
          {/* PC */}
          <button
            onClick={() => setPanel('work')}
            className="text-4xl mb-1 transition-transform duration-150 hover:scale-110 pc-screen-glow"
            style={{
              filter: `drop-shadow(0 0 ${isWorking ? '12px' : '6px'} rgba(59,130,246,${isWorking ? '0.9' : '0.5'}))`,
            }}
            aria-label={`${pcName} — click to open work panel`}
            title={`${pcName} — tap to work`}
          >
            {PC_EMOJI[equipment.pcTier] ?? '🖥️'}
          </button>
          {/* Desk surface */}
          <div
            className="rounded-t-sm"
            style={{
              width: 'clamp(100px, 25vw, 160px)',
              height: 12,
              background: 'linear-gradient(180deg, #92400E, #78350F)',
              borderRadius: '4px 4px 0 0',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            }}
          />
          {/* Desk legs */}
          <div className="flex justify-between" style={{ width: 'clamp(80px, 20vw, 130px)' }}>
            <div style={{ width: 8, height: 20, background: '#78350F', borderRadius: '0 0 3px 3px' }} />
            <div style={{ width: 8, height: 20, background: '#78350F', borderRadius: '0 0 3px 3px' }} />
          </div>
        </div>
      </div>

      {/* Character */}
      <div
        className="absolute"
        style={{
          bottom: '18%',
          left: '50%',
          transform: 'translateX(-50%) translateX(clamp(30px, 8vw, 60px))',
        }}
        aria-label={`${player.name}'s character`}
      >
        <CharacterSprite appearance={player.appearance} size={60} idle={!isWorking} />
        {isWorking && (
          <div
            className="absolute -top-2 -right-2 text-xs font-black px-1.5 py-0.5 rounded-full text-white animate-bounce"
            style={{ background: '#F59E0B', fontSize: 10 }}
          >
            ⚡
          </div>
        )}
      </div>

      {/* PC tier badge */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
        style={{ background: pcTierDef?.color ?? '#6B7280', border: '1px solid rgba(255,255,255,0.2)' }}
        aria-label={`Current PC: ${pcName}`}
      >
        {pcName}
      </div>

      {/* Work button hint */}
      {activePanel === 'none' && (
        <button
          onClick={() => setPanel('work')}
          className="absolute bottom-2 right-2 text-xs font-bold px-3 py-1.5 rounded-xl text-white animate-pulse"
          style={{ background: 'rgba(124,58,237,0.7)', border: '2px solid #A78BFA' }}
          aria-label="Open work panel"
        >
          Tap PC to Work! 💼
        </button>
      )}
    </div>
  );
}
