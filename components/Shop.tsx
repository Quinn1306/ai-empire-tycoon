'use client';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { ShopTab } from '@/types/game';
import {
  PC_TIERS, EQUIPMENT_ITEMS, FURNITURE_ITEMS,
  WALL_STYLES, FLOOR_STYLES, formatMoney,
} from '@/config/gameData';
import ItemSprite from './sprites/ItemSprite';

// ─── Detail popover ───────────────────────────────────────────────────────────

interface DetailItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  levelRequired: number;
  effects: string[];
  type: 'equip' | 'furniture' | 'pc';
  tier?: number;
}

interface PopoverProps {
  item: DetailItem;
  balance: number;
  canAfford: boolean;
  owned: boolean;
  playerLevel: number;
  onBuy: () => void;
  onClose: () => void;
}

function DetailPopover({ item, balance, canAfford, owned, playerLevel, onBuy, onClose }: PopoverProps) {
  const locked = item.levelRequired > playerLevel;
  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-50 pb-4 px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-5 flex flex-col gap-4"
        style={{ background: 'linear-gradient(180deg, #1E0A3C, #0F0A1E)', border: '2px solid #7C3AED' }}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${item.name} details`}
      >
        {/* Sprite preview */}
        <div className="flex justify-center">
          <div
            className="rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.12)', border: '2px solid rgba(139,92,246,0.25)', padding: 12 }}
          >
            <ItemSprite id={item.id} height={140} />
          </div>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-white font-black text-lg">{item.name}</h3>
          <p className="text-slate-400 text-sm mt-0.5">{item.description}</p>
          {item.effects.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {item.effects.map((e, i) => (
                <span
                  key={i}
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}
                >
                  {e}
                </span>
              ))}
            </div>
          )}
          {locked && (
            <p className="text-amber-400 text-xs font-bold mt-2">Requires Level {item.levelRequired}</p>
          )}
        </div>

        {/* Buy button */}
        <button
          onClick={onBuy}
          disabled={owned || locked || !canAfford}
          className="w-full py-4 rounded-2xl text-base font-black text-white transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: owned ? 'rgba(16,185,129,0.2)'
              : locked ? 'rgba(255,255,255,0.08)'
              : canAfford ? 'linear-gradient(135deg, #7C3AED, #6D28D9)'
              : 'rgba(239,68,68,0.2)',
            border: `2px solid ${owned ? 'rgba(16,185,129,0.4)' : locked ? 'rgba(255,255,255,0.1)' : canAfford ? 'rgba(167,139,250,0.5)' : 'rgba(239,68,68,0.4)'}`,
            boxShadow: !owned && !locked && canAfford ? '0 4px 20px rgba(124,58,237,0.4)' : 'none',
          }}
          aria-label={owned ? 'Already owned' : `Buy ${item.name} for ${formatMoney(item.cost)}`}
        >
          {owned ? 'Already Owned'
            : locked ? `Locked — Level ${item.levelRequired}`
            : !canAfford ? `Need ${formatMoney(item.cost - balance)} more`
            : `Buy & Place — ${formatMoney(item.cost)}`}
        </button>

        <button
          onClick={onClose}
          className="text-slate-500 text-sm text-center hover:text-slate-300"
          aria-label="Close detail view"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ─── Item card ────────────────────────────────────────────────────────────────

interface CardProps {
  id: string;
  name: string;
  description: string;
  cost: number;
  levelRequired: number;
  playerLevel: number;
  balance: number;
  owned: boolean;
  badge?: string;
  onClick: () => void;
}

function ItemCard({ id, name, description, cost, levelRequired, playerLevel, balance, owned, badge, onClick }: CardProps) {
  const locked = levelRequired > playerLevel;
  const canAfford = balance >= cost;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center rounded-2xl p-3 transition-all duration-150 hover:scale-105 active:scale-95"
      style={{
        background: owned ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.05)',
        border: `2px solid ${owned ? 'rgba(16,185,129,0.3)' : locked ? 'rgba(255,255,255,0.06)' : canAfford ? 'rgba(255,255,255,0.12)' : 'rgba(239,68,68,0.25)'}`,
        opacity: locked ? 0.55 : 1,
        minWidth: 0,
      }}
      aria-label={`${name}${locked ? ` — Level ${levelRequired} required` : ` — ${formatMoney(cost)}`}`}
    >
      {/* Sprite on pedestal */}
      <div
        className="relative flex items-end justify-center mb-2"
        style={{
          width: 72, height: 80,
          background: 'rgba(139,92,246,0.08)',
          borderRadius: 12,
          boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)' }}>
          <ItemSprite id={id} height={64} />
        </div>
        {/* Pedestal shadow */}
        <div
          style={{
            position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
            width: 40, height: 4, background: 'rgba(0,0,0,0.3)', borderRadius: '50%', filter: 'blur(3px)',
          }}
        />
      </div>

      {/* Name + price */}
      <div className="text-center w-full">
        <div className="text-white font-bold text-xs leading-tight truncate">{name}</div>
        {badge && <div className="text-violet-400 text-xs mt-0.5">{badge}</div>}
        <div
          className="mt-1.5 text-xs font-black px-2 py-0.5 rounded-full inline-block"
          style={{
            background: owned ? 'rgba(16,185,129,0.15)'
              : locked ? 'rgba(255,255,255,0.05)'
              : canAfford ? 'rgba(139,92,246,0.2)'
              : 'rgba(239,68,68,0.15)',
            color: owned ? '#10B981' : locked ? '#475569' : canAfford ? '#A78BFA' : '#EF4444',
          }}
        >
          {owned ? 'Owned' : locked ? `Lv.${levelRequired}` : formatMoney(cost)}
        </div>
      </div>
    </button>
  );
}

// ─── Shop main ────────────────────────────────────────────────────────────────

export default function Shop() {
  const player     = useGameStore(s => s.player);
  const bank       = useGameStore(s => s.bank);
  const equipment  = useGameStore(s => s.equipment);
  const office     = useGameStore(s => s.office);
  const setPanel   = useGameStore(s => s.setPanel);
  const buyAndPlace = useGameStore(s => s.buyAndPlace);
  const upgradePCTier = useGameStore(s => s.upgradePCTier);
  const buyWallStyle  = useGameStore(s => s.buyWallStyle);
  const buyFloorStyle = useGameStore(s => s.buyFloorStyle);
  const addFloat   = useGameStore(s => s.addFloatingText);

  const [tab, setTab]         = useState<ShopTab>('equipment');
  const [detail, setDetail]   = useState<DetailItem | null>(null);
  const [toast, setToast]     = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 1600);
  }

  function handleBuy(item: DetailItem) {
    const s = useGameStore.getState();
    if (s.bank.balance < item.cost) { showToast('Not enough money!', false); return; }

    let ok = false;
    if (item.type === 'pc' && item.tier !== undefined) {
      ok = upgradePCTier(item.tier);
    } else if (item.type === 'equip' || item.type === 'furniture') {
      ok = buyAndPlace(item.id);
    }

    if (ok) {
      addFloat(`-${formatMoney(item.cost)}`, 100, 150, '#EF4444');
      if (item.type === 'furniture') {
        showToast('Purchased! Place it in your office.', true);
        setDetail(null);
        setPanel('none'); // close shop so player sees placement mode
      } else {
        showToast('Purchased!', true);
        setDetail(null);
      }
    } else {
      showToast('Cannot purchase right now.', false);
    }
  }

  const nextPCTier = PC_TIERS.find(p => p.tier === equipment.pcTier + 1);
  const allFloorWall = [...office.floorItems, ...office.wallItems];

  const TABS: { id: ShopTab; label: string }[] = [
    { id: 'equipment',  label: 'Equipment' },
    { id: 'furniture',  label: 'Furniture' },
    { id: 'wall-decor', label: 'Wall Decor' },
    { id: 'skins',      label: 'Skins' },
  ];

  return (
    <>
      <div
        className="panel-slide-up flex flex-col h-full"
        style={{ background: 'linear-gradient(180deg, #1A0533 0%, #0F0A1E 100%)' }}
        role="region"
        aria-label="Shop"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full" style={{ background: '#7C3AED' }} />
            <h2 className="text-white font-black text-base">Shop</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-black text-sm">{formatMoney(bank.balance)}</span>
            <button onClick={() => setPanel('none')} className="text-slate-400 hover:text-white text-xl px-2" aria-label="Close shop">x</button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className="mx-4 mb-2 py-1.5 px-3 rounded-xl text-xs font-bold text-center flex-shrink-0"
            style={{ background: toast.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', color: toast.ok ? '#10B981' : '#EF4444', border: `1px solid ${toast.ok ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}` }}
            role="alert"
            aria-live="assertive"
          >
            {toast.msg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 px-4 pb-2 flex-shrink-0">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-1.5 rounded-xl text-xs font-bold transition-all duration-150"
              style={{
                background: tab === t.id ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'rgba(255,255,255,0.07)',
                border: `2px solid ${tab === t.id ? '#A78BFA' : 'rgba(255,255,255,0.1)'}`,
                color: tab === t.id ? 'white' : 'rgba(255,255,255,0.55)',
              }}
              aria-pressed={tab === t.id}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">

          {/* ── Equipment tab ── */}
          {tab === 'equipment' && (
            <div className="flex flex-col gap-3">
              {/* PC Upgrade */}
              {nextPCTier && (
                <div>
                  <p className="text-xs font-bold text-violet-400 mb-2 uppercase tracking-wider">PC Upgrade</p>
                  <button
                    onClick={() => setDetail({
                      id: `pc-${nextPCTier.tier}`,
                      name: nextPCTier.name,
                      description: `${Math.round((1 - nextPCTier.speedMult) * 100)}% faster tasks, ${nextPCTier.payoutMult}x payout`,
                      cost: nextPCTier.cost,
                      levelRequired: nextPCTier.levelRequired,
                      effects: [
                        `${Math.round((1 - nextPCTier.speedMult) * 100)}% speed boost`,
                        `${nextPCTier.payoutMult}x payout multiplier`,
                      ],
                      type: 'pc',
                      tier: nextPCTier.tier,
                    })}
                    className="w-full rounded-2xl p-3 flex items-center gap-4 transition-all duration-150 hover:scale-[1.01]"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: `2px solid ${nextPCTier.color}55`,
                    }}
                    aria-label={`Upgrade to ${nextPCTier.name}`}
                  >
                    <ItemSprite id={`pc-${nextPCTier.tier}`} height={72} />
                    <div className="flex-1 text-left">
                      <div className="font-black text-white text-sm">Upgrade to {nextPCTier.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{Math.round((1 - nextPCTier.speedMult) * 100)}% faster · {nextPCTier.payoutMult}x payout</div>
                      {nextPCTier.levelRequired > player.level && (
                        <div className="text-amber-500 text-xs mt-0.5">Requires Level {nextPCTier.levelRequired}</div>
                      )}
                    </div>
                    <div
                      className="flex-shrink-0 font-black text-sm px-3 py-2 rounded-xl"
                      style={{
                        background: bank.balance >= nextPCTier.cost ? `${nextPCTier.color}33` : 'rgba(239,68,68,0.15)',
                        color: bank.balance >= nextPCTier.cost ? nextPCTier.color : '#EF4444',
                        border: `1px solid ${bank.balance >= nextPCTier.cost ? `${nextPCTier.color}55` : 'rgba(239,68,68,0.3)'}`,
                      }}
                    >
                      {formatMoney(nextPCTier.cost)}
                    </div>
                  </button>
                </div>
              )}

              {/* Gear grid */}
              <div>
                <p className="text-xs font-bold text-violet-400 mb-2 uppercase tracking-wider">Gear</p>
                <div className="grid grid-cols-3 gap-2">
                  {EQUIPMENT_ITEMS.map(item => (
                    <ItemCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      cost={item.cost}
                      levelRequired={item.levelRequired}
                      playerLevel={player.level}
                      balance={bank.balance}
                      owned={equipment.ownedItemIds.includes(item.id)}
                      onClick={() => setDetail({
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        cost: item.cost,
                        levelRequired: item.levelRequired,
                        effects: [
                          item.speedBonus  ? `+${Math.round(item.speedBonus  * 100)}% speed`  : '',
                          item.payoutBonus ? `+${Math.round(item.payoutBonus * 100)}% payout` : '',
                          item.xpBonus     ? `+${Math.round(item.xpBonus     * 100)}% XP`     : '',
                        ].filter(Boolean),
                        type: 'equip',
                      })}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Furniture tab ── */}
          {tab === 'furniture' && (
            <div>
              <p className="text-xs font-bold text-violet-400 mb-2 uppercase tracking-wider">Floor Furniture</p>
              <div className="grid grid-cols-3 gap-2">
                {FURNITURE_ITEMS.filter(f => f.mount === 'floor').map(item => {
                  const count = allFloorWall.filter(p => p.itemId === item.id).length;
                  return (
                    <ItemCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      cost={item.cost}
                      levelRequired={item.levelRequired}
                      playerLevel={player.level}
                      balance={bank.balance}
                      owned={false}
                      badge={count > 0 ? `x${count} placed` : undefined}
                      onClick={() => setDetail({
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        cost: item.cost,
                        levelRequired: item.levelRequired,
                        effects: [
                          item.speedBonus  ? `+${Math.round(item.speedBonus  * 100)}% speed`  : '',
                          item.payoutBonus ? `+${Math.round(item.payoutBonus * 100)}% payout` : '',
                          item.xpBonus     ? `+${Math.round(item.xpBonus     * 100)}% XP`     : '',
                        ].filter(Boolean).concat(count > 0 ? [`${count} in room`] : []),
                        type: 'furniture',
                      })}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Wall Decor tab ── */}
          {tab === 'wall-decor' && (
            <div>
              <p className="text-xs font-bold text-violet-400 mb-2 uppercase tracking-wider">Wall Items</p>
              <div className="grid grid-cols-3 gap-2">
                {FURNITURE_ITEMS.filter(f => f.mount === 'wall').map(item => {
                  const count = allFloorWall.filter(p => p.itemId === item.id).length;
                  return (
                    <ItemCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      cost={item.cost}
                      levelRequired={item.levelRequired}
                      playerLevel={player.level}
                      balance={bank.balance}
                      owned={false}
                      badge={count > 0 ? `x${count} placed` : undefined}
                      onClick={() => setDetail({
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        cost: item.cost,
                        levelRequired: item.levelRequired,
                        effects: [
                          item.speedBonus  ? `+${Math.round(item.speedBonus  * 100)}% speed`  : '',
                          item.payoutBonus ? `+${Math.round(item.payoutBonus * 100)}% payout` : '',
                          item.xpBonus     ? `+${Math.round(item.xpBonus     * 100)}% XP`     : '',
                        ].filter(Boolean),
                        type: 'furniture',
                      })}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Skins tab ── */}
          {tab === 'skins' && (
            <div className="flex flex-col gap-4">
              {/* Wall styles */}
              <div>
                <p className="text-xs font-bold text-violet-400 mb-2 uppercase tracking-wider">Wall Paint</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(WALL_STYLES).map(w => {
                    const locked = w.levelRequired > player.level;
                    const active = office.wallStyle === w.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => {
                          if (locked) return;
                          const ok = buyWallStyle(w.id as 'white' | 'blue' | 'green' | 'dark');
                          if (ok) { addFloat(`-${formatMoney(w.cost)}`, 100, 150, '#EF4444'); showToast('Wall updated!', true); }
                          else if (active) showToast('Already active', false);
                          else showToast('Not enough money!', false);
                        }}
                        disabled={locked}
                        className="p-3 rounded-2xl text-left transition-all disabled:opacity-40"
                        style={{ background: active ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)', border: `2px solid ${active ? '#F59E0B' : 'rgba(255,255,255,0.1)'}` }}
                        aria-pressed={active}
                        aria-label={`${w.name} wall${locked ? ` — Level ${w.levelRequired}` : ''}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${w.value}, ${w.bg})`, border: '1px solid rgba(255,255,255,0.15)' }} />
                          <div>
                            <div className="text-white text-xs font-bold">{w.name}</div>
                            <div className="text-slate-400 text-xs">{active ? 'Active' : w.cost === 0 ? 'Free' : formatMoney(w.cost)}{locked ? ` · Lv.${w.levelRequired}` : ''}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Floor styles */}
              <div>
                <p className="text-xs font-bold text-violet-400 mb-2 uppercase tracking-wider">Floor Material</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(FLOOR_STYLES).map(f => {
                    const locked = f.levelRequired > player.level;
                    const active = office.floorStyle === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => {
                          if (locked) return;
                          const ok = buyFloorStyle(f.id as 'wood' | 'carpet' | 'tile' | 'marble');
                          if (ok) { addFloat(`-${formatMoney(f.cost)}`, 100, 150, '#EF4444'); showToast('Floor updated!', true); }
                          else if (active) showToast('Already active', false);
                          else showToast('Not enough money!', false);
                        }}
                        disabled={locked}
                        className="p-3 rounded-2xl text-left transition-all disabled:opacity-40"
                        style={{ background: active ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)', border: `2px solid ${active ? '#F59E0B' : 'rgba(255,255,255,0.1)'}` }}
                        aria-pressed={active}
                        aria-label={`${f.name} floor`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${f.value}, ${f.bg})`, border: '1px solid rgba(255,255,255,0.15)' }} />
                          <div>
                            <div className="text-white text-xs font-bold">{f.name}</div>
                            <div className="text-slate-400 text-xs">{active ? 'Active' : f.cost === 0 ? 'Free' : formatMoney(f.cost)}{locked ? ` · Lv.${f.levelRequired}` : ''}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail popover rendered outside panel flow */}
      {detail && (
        <DetailPopover
          item={detail}
          balance={bank.balance}
          canAfford={bank.balance >= detail.cost}
          owned={detail.type === 'equip' && equipment.ownedItemIds.includes(detail.id)}
          playerLevel={player.level}
          onBuy={() => handleBuy(detail)}
          onClose={() => setDetail(null)}
        />
      )}
    </>
  );
}
