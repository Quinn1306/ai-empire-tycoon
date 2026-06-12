'use client';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { WALL_STYLES, FLOOR_STYLES, FURNITURE_ITEMS, PC_TIERS, FLOOR_GRID, WALL_GRID } from '@/config/gameData';
import CharacterSprite from './CharacterSprite';
import ItemSprite from './sprites/ItemSprite';

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

// Cell dimensions must match the placement grids exactly
const CELL = 42; // px per grid cell
const GAP  = 2;  // px gap between cells
const STEP = CELL + GAP; // 44px per grid step

// Half-widths for centering, matching `transform: translateX(-50%)` grids
const WALL_HALF_W  = (WALL_GRID.cols  * STEP) / 2; // 132px
const FLOOR_HALF_W = (FLOOR_GRID.cols * STEP) / 2; // 132px

function itemWidth(gridW: number)  { return gridW  * STEP - GAP; }
function itemHeight(gridH: number) { return gridH * STEP - GAP; }

export default function OfficeScene() {
  const player           = useGameStore(s => s.player);
  const office           = useGameStore(s => s.office);
  const equipment        = useGameStore(s => s.equipment);
  const business         = useGameStore(s => s.business);
  const pendingPlacement = useGameStore(s => s.pendingPlacement);
  const setPanel         = useGameStore(s => s.setPanel);
  const activePanel      = useGameStore(s => s.activePanel);
  const confirmPlacement = useGameStore(s => s.confirmPlacement);
  const cancelPlacement  = useGameStore(s => s.cancelPlacement);
  const storeItem        = useGameStore(s => s.storeItem);

  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const [wallDark, wallLight] = WALL_COLORS[office.wallStyle] ?? WALL_COLORS.white;
  const [floorDark, floorLight] = FLOOR_COLORS[office.floorStyle] ?? FLOOR_COLORS.wood;
  const pcTierDef = PC_TIERS.find(p => p.tier === equipment.pcTier)!;
  const isWorking = !!business?.activeTask;

  const placing       = pendingPlacement;
  const placingMount  = placing?.mount;
  const placingItemId = placing?.itemId ?? '';
  const placingDef    = FURNITURE_ITEMS.find(f => f.id === placingItemId);
  const pw = placingDef?.gridW ?? 1;
  const ph = placingDef?.gridH ?? 1;

  function isOccupied(items: typeof office.floorItems, gx: number, gy: number) {
    for (const placed of items) {
      const def = FURNITURE_ITEMS.find(f => f.id === placed.itemId);
      const w = def?.gridW ?? 1, h = def?.gridH ?? 1;
      if (gx >= placed.gridX && gx < placed.gridX + w &&
          gy >= placed.gridY && gy < placed.gridY + h) return true;
    }
    return false;
  }

  function isValidPlacement(gx: number, gy: number, mount: 'floor' | 'wall') {
    const items = mount === 'floor' ? office.floorItems : office.wallItems;
    const grid  = mount === 'floor' ? FLOOR_GRID : WALL_GRID;
    if (gx + pw > grid.cols || gy + ph > grid.rows) return false;
    for (let dy = 0; dy < ph; dy++) {
      for (let dx = 0; dx < pw; dx++) {
        if (isOccupied(items, gx + dx, gy + dy)) return false;
      }
    }
    return true;
  }

  return (
    <div
      className="relative w-full select-none overflow-hidden"
      style={{ height: 'clamp(240px, 38vw, 340px)', background: wallLight }}
      role="region"
      aria-label="Your office"
      data-testid="office-scene"
    >
      {/* Wall background */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${wallLight} 0%, ${wallDark} 55%)` }} />

      {/* PC tier badge */}
      <div
        className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full z-10"
        style={{ background: pcTierDef?.color ?? '#6B7280', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        {pcTierDef?.name}
      </div>

      {/* ── WALL AREA ─────────────────────────────────────────────── */}

      {/* Wall placement grid */}
      {placing && placingMount === 'wall' && (
        <div
          className="absolute"
          style={{ top: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}
          role="grid"
          aria-label="Wall placement grid"
        >
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${WALL_GRID.cols}, ${CELL}px)`, gap: GAP }}>
            {Array.from({ length: WALL_GRID.rows * WALL_GRID.cols }).map((_, i) => {
              const gx = i % WALL_GRID.cols, gy = Math.floor(i / WALL_GRID.cols);
              const valid = isValidPlacement(gx, gy, 'wall');
              const hovered = hoverCell?.x === gx && hoverCell?.y === gy;
              return (
                <div
                  key={i}
                  style={{
                    width: CELL, height: CELL,
                    background: valid ? (hovered ? 'rgba(16,185,129,0.5)' : 'rgba(16,185,129,0.2)') : 'rgba(239,68,68,0.25)',
                    border: `2px solid ${valid ? (hovered ? '#10B981' : 'rgba(16,185,129,0.5)') : 'rgba(239,68,68,0.4)'}`,
                    borderRadius: 4, cursor: valid ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  onMouseEnter={() => setHoverCell({ x: gx, y: gy })}
                  onMouseLeave={() => setHoverCell(null)}
                  onClick={() => { if (valid) confirmPlacement(gx, gy); }}
                  role="gridcell"
                  aria-label={`Wall cell ${gx},${gy}: ${valid ? 'available' : 'occupied'}`}
                >
                  {hovered && valid && <div style={{ opacity: 0.6 }}><ItemSprite id={placingItemId} height={CELL - 4} /></div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Placed wall items — positioned to match the grid coordinate system exactly */}
      {!placing && office.wallItems.map(item => {
        const def = FURNITURE_ITEMS.find(f => f.id === item.itemId);
        if (!def) return null;
        const w = itemWidth(def.gridW);
        const h = itemHeight(def.gridH);
        const left = `calc(50% - ${WALL_HALF_W}px + ${item.gridX * STEP}px)`;
        const top  = 8 + item.gridY * STEP;
        return (
          <div
            key={item.instanceId}
            data-item-id={item.itemId}
            className="absolute"
            style={{ top, left, width: w, height: h, cursor: 'pointer', zIndex: 5 }}
            title={def.name}
            role="img"
            aria-label={def.name}
            onClick={() => setSelectedItem(selectedItem === item.instanceId ? null : item.instanceId)}
          >
            <ItemSprite id={item.itemId} height={h} />
            {selectedItem === item.instanceId && (
              <div className="absolute -top-8 left-0 z-30" style={{ background: '#1A0533', border: '2px solid #7C3AED', borderRadius: 8, padding: '2px 6px' }}>
                <button
                  className="text-xs text-red-400 font-bold px-1 hover:text-red-300"
                  onClick={e => { e.stopPropagation(); storeItem(item.instanceId); setSelectedItem(null); }}
                  aria-label={`Remove ${def.name}`}
                >
                  Store
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* ── FLOOR AREA ────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '52%', background: `linear-gradient(180deg, ${floorDark} 0%, ${floorLight} 100%)`, borderTop: `4px solid ${floorDark}` }}
      >
        {/* Wood planks */}
        {office.floorStyle === 'wood' && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="absolute w-full" style={{ height: 1, background: 'rgba(255,255,255,0.1)', top: `${(i + 1) * 20}%` }} />
        ))}

        {/* Floor placement grid */}
        {placing && placingMount === 'floor' && (
          <div
            className="absolute"
            style={{ bottom: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}
            role="grid"
            aria-label="Floor placement grid"
          >
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${FLOOR_GRID.cols}, ${CELL}px)`, gap: GAP }}>
              {Array.from({ length: FLOOR_GRID.rows * FLOOR_GRID.cols }).map((_, i) => {
                const gx = i % FLOOR_GRID.cols, gy = Math.floor(i / FLOOR_GRID.cols);
                const valid = isValidPlacement(gx, gy, 'floor');
                const hovered = hoverCell?.x === gx && hoverCell?.y === gy;
                return (
                  <div
                    key={i}
                    style={{
                      width: CELL, height: CELL,
                      background: valid ? (hovered ? 'rgba(16,185,129,0.5)' : 'rgba(16,185,129,0.2)') : 'rgba(239,68,68,0.25)',
                      border: `2px solid ${valid ? (hovered ? '#10B981' : 'rgba(16,185,129,0.5)') : 'rgba(239,68,68,0.4)'}`,
                      borderRadius: 4, cursor: valid ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onMouseEnter={() => setHoverCell({ x: gx, y: gy })}
                    onMouseLeave={() => setHoverCell(null)}
                    onClick={() => { if (valid) confirmPlacement(gx, gy); }}
                    role="gridcell"
                    aria-label={`Floor cell ${gx},${gy}: ${valid ? 'available' : 'occupied'}`}
                  >
                    {hovered && valid && <div style={{ opacity: 0.6 }}><ItemSprite id={placingItemId} height={CELL - 4} /></div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Placed floor items — same coordinate system as the placement grid */}
        {!placing && office.floorItems.map(item => {
          const def = FURNITURE_ITEMS.find(f => f.id === item.itemId);
          if (!def) return null;
          const w = itemWidth(def.gridW);
          const h = itemHeight(def.gridH);
          // Grid is bottom-anchored at 8px. Row 0 is topmost, row (rows-1) is bottommost.
          const left   = `calc(50% - ${FLOOR_HALF_W}px + ${item.gridX * STEP}px)`;
          const bottom = 8 + (FLOOR_GRID.rows - 1 - item.gridY) * STEP;
          return (
            <div
              key={item.instanceId}
              data-item-id={item.itemId}
              className="absolute"
              style={{ bottom, left, width: w, height: h, cursor: 'pointer', zIndex: item.gridY + 1 }}
              title={def.name}
              role="img"
              aria-label={def.name}
              onClick={() => setSelectedItem(selectedItem === item.instanceId ? null : item.instanceId)}
            >
              <ItemSprite id={item.itemId} height={h} />
              {selectedItem === item.instanceId && (
                <div className="absolute -top-8 left-0 z-30" style={{ background: '#1A0533', border: '2px solid #7C3AED', borderRadius: 8, padding: '2px 6px' }}>
                  <button
                    className="text-xs text-red-400 font-bold px-1 hover:text-red-300"
                    onClick={e => { e.stopPropagation(); storeItem(item.instanceId); setSelectedItem(null); }}
                    aria-label={`Remove ${def.name}`}
                  >
                    Store
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Desk + PC */}
        <div className="absolute" style={{ bottom: '24%', left: '50%', transform: 'translateX(-50%)' }}>
          <div className="flex flex-col items-center">
            <button
              onClick={() => setPanel('work')}
              className="transition-transform duration-150 hover:scale-110 pc-screen-glow"
              style={{ filter: `drop-shadow(0 0 ${isWorking ? '14px' : '7px'} rgba(59,130,246,${isWorking ? '0.95' : '0.55'}))` }}
              aria-label="Open work panel"
            >
              <ItemSprite id={`pc-${equipment.pcTier}`} height={54} />
            </button>
            <div style={{ width: 'clamp(80px, 18vw, 130px)', height: 11, background: 'linear-gradient(180deg, #92400E, #78350F)', borderRadius: '3px 3px 0 0', boxShadow: '0 4px 8px rgba(0,0,0,0.5)' }} />
            <div className="flex justify-between" style={{ width: 'clamp(64px, 14vw, 105px)' }}>
              <div style={{ width: 7, height: 18, background: '#78350F', borderRadius: '0 0 3px 3px' }} />
              <div style={{ width: 7, height: 18, background: '#78350F', borderRadius: '0 0 3px 3px' }} />
            </div>
          </div>
        </div>

        {/* Character */}
        <div className="absolute" style={{ bottom: '14%', left: '58%' }}>
          <CharacterSprite appearance={player.appearance} size={56} idle={!isWorking} />
          {isWorking && (
            <div className="absolute -top-2 -right-2 text-xs font-black px-1.5 py-0.5 rounded-full text-white animate-bounce" style={{ background: '#F59E0B', fontSize: 9 }}>
              working
            </div>
          )}
        </div>
      </div>

      {/* Placement controls banner */}
      {placing && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2"
          style={{ background: 'rgba(15,23,42,0.92)', zIndex: 30 }}
          role="status"
          aria-live="polite"
        >
          <div className="text-sm font-bold text-white">
            Placing: <span style={{ color: '#10B981' }}>{placingDef?.name ?? placingItemId}</span>
            <span className="text-slate-400 text-xs ml-2">
              {placingMount === 'floor' ? 'Click a green floor cell' : 'Click a green wall cell'}
            </span>
          </div>
          <button
            onClick={cancelPlacement}
            className="text-xs font-bold px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(139,92,246,0.3)', border: '1px solid #7C3AED', color: '#A78BFA' }}
            aria-label="Auto-place item"
          >
            Auto-place
          </button>
        </div>
      )}

      {/* Idle hint */}
      {!placing && activePanel === 'none' && (
        <button
          onClick={() => setPanel('work')}
          className="absolute bottom-2 right-2 text-xs font-bold px-3 py-1.5 rounded-xl animate-pulse"
          style={{ background: 'rgba(124,58,237,0.7)', border: '2px solid #A78BFA', color: 'white' }}
          aria-label="Open work panel"
        >
          Tap PC to Work
        </button>
      )}
    </div>
  );
}
