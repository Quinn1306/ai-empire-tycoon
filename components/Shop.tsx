'use client';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { ShopTab } from '@/types/game';
import {
  PC_TIERS, EQUIPMENT_ITEMS, FURNITURE_ITEMS, WALL_STYLES, FLOOR_STYLES,
  formatMoney,
} from '@/config/gameData';

export default function Shop() {
  const player     = useGameStore(s => s.player);
  const bank       = useGameStore(s => s.bank);
  const equipment  = useGameStore(s => s.equipment);
  const office     = useGameStore(s => s.office);
  const setPanel   = useGameStore(s => s.setPanel);
  const buyItem    = useGameStore(s => s.buyItem);
  const upgradePCTier = useGameStore(s => s.upgradePCTier);
  const buyWallStyle  = useGameStore(s => s.buyWallStyle);
  const buyFloorStyle = useGameStore(s => s.buyFloorStyle);
  const addFloatingText = useGameStore(s => s.addFloatingText);

  const [tab, setTab] = useState<ShopTab>('equipment');
  const [flash, setFlash] = useState<string | null>(null);

  const tryBuy = (id: string, cost: number, type: 'item' | 'wall' | 'floor' | 'pc', tier?: number) => {
    if (bank.balance < cost) {
      setFlash('Not enough money!');
      setTimeout(() => setFlash(null), 1500);
      return;
    }
    let ok = false;
    if (type === 'item') ok = buyItem(id);
    else if (type === 'wall') ok = buyWallStyle(id as 'white' | 'blue' | 'green' | 'dark');
    else if (type === 'floor') ok = buyFloorStyle(id as 'wood' | 'carpet' | 'tile' | 'marble');
    else if (type === 'pc' && tier !== undefined) ok = upgradePCTier(tier);

    if (ok) {
      addFloatingText(`-${formatMoney(cost)}`, 100, 150, '#EF4444');
      setFlash('Purchased!');
      setTimeout(() => setFlash(null), 1200);
    } else {
      setFlash('Cannot purchase!');
      setTimeout(() => setFlash(null), 1500);
    }
  };

  const nextPCTier = PC_TIERS.find(p => p.tier === equipment.pcTier + 1);

  const TABS: { id: ShopTab; label: string; icon: string }[] = [
    { id: 'equipment', label: 'Equipment', icon: '⚙️' },
    { id: 'furniture', label: 'Furniture',  icon: '🛋️' },
    { id: 'decor',     label: 'Decor',      icon: '🎨' },
  ];

  return (
    <div
      className="panel-slide-up flex flex-col h-full"
      style={{ background: 'linear-gradient(180deg, #1A0533 0%, #0F0A1E 100%)' }}
      role="region"
      aria-label="Shop"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-white font-black text-base flex items-center gap-2">🛒 Shop</h2>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-black text-sm">{formatMoney(bank.balance)}</span>
          <button onClick={() => setPanel('none')} className="text-slate-400 hover:text-white text-xl px-2 py-1" aria-label="Close shop">✕</button>
        </div>
      </div>

      {/* Flash message */}
      {flash && (
        <div
          className="mx-4 mb-2 text-center py-1.5 rounded-xl text-sm font-bold"
          style={{
            background: flash === 'Purchased!' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
            color: flash === 'Purchased!' ? '#10B981' : '#EF4444',
            border: `1px solid ${flash === 'Purchased!' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
          }}
          role="alert"
          aria-live="assertive"
        >
          {flash}
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-1 px-4 mb-3">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 py-1.5 rounded-xl text-xs font-bold transition-all duration-150"
            style={{
              background: tab === t.id ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'rgba(255,255,255,0.07)',
              border: `2px solid ${tab === t.id ? '#A78BFA' : 'rgba(255,255,255,0.1)'}`,
              color: tab === t.id ? 'white' : 'rgba(255,255,255,0.6)',
            }}
            aria-pressed={tab === t.id}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-2">

        {tab === 'equipment' && (
          <>
            {/* PC upgrade */}
            {nextPCTier && (
              <div className="mb-1">
                <p className="text-xs font-bold text-violet-400 mb-1 uppercase tracking-wider">PC Upgrade</p>
                <ShopCard
                  emoji="💻"
                  name={`Upgrade → ${nextPCTier.name}`}
                  description={`${Math.round((1 - nextPCTier.speedMult) * 100)}% faster · ${nextPCTier.payoutMult}× payout`}
                  cost={nextPCTier.cost}
                  levelRequired={nextPCTier.levelRequired}
                  playerLevel={player.level}
                  balance={bank.balance}
                  owned={false}
                  borderColor={nextPCTier.color}
                  onBuy={() => tryBuy(`pc-${nextPCTier.tier}`, nextPCTier.cost, 'pc', nextPCTier.tier)}
                />
              </div>
            )}

            <p className="text-xs font-bold text-violet-400 mt-1 mb-1 uppercase tracking-wider">Gear</p>
            {EQUIPMENT_ITEMS.map(item => (
              <ShopCard
                key={item.id}
                emoji={item.emoji}
                name={item.name}
                description={[
                  item.speedBonus ? `+${Math.round(item.speedBonus * 100)}% speed` : '',
                  item.payoutBonus ? `+${Math.round(item.payoutBonus * 100)}% payout` : '',
                  item.xpBonus ? `+${Math.round(item.xpBonus * 100)}% XP` : '',
                ].filter(Boolean).join(' · ') || item.description}
                cost={item.cost}
                levelRequired={item.levelRequired}
                playerLevel={player.level}
                balance={bank.balance}
                owned={equipment.ownedItemIds.includes(item.id)}
                onBuy={() => tryBuy(item.id, item.cost, 'item')}
              />
            ))}
          </>
        )}

        {(tab === 'furniture' || tab === 'decor') && (
          <>
            {/* Wall styles */}
            <p className="text-xs font-bold text-violet-400 mb-1 uppercase tracking-wider">Wall Style</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {Object.values(WALL_STYLES).map(w => (
                <button
                  key={w.id}
                  onClick={() => tryBuy(w.id, w.cost, 'wall')}
                  disabled={w.levelRequired > player.level || office.wallStyle === w.id}
                  className="p-2.5 rounded-xl text-left transition-all disabled:opacity-40"
                  style={{
                    background: office.wallStyle === w.id
                      ? `rgba(${w.id === 'dark' ? '255,255,255' : '0,0,0'},0.1)`
                      : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${office.wallStyle === w.id ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
                  }}
                  aria-pressed={office.wallStyle === w.id}
                  aria-label={`${w.name} wall - ${w.cost === 0 ? 'Free' : formatMoney(w.cost)}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded" style={{ background: w.value, border: '1px solid rgba(255,255,255,0.2)' }} />
                    <span className="text-white text-xs font-bold">{w.name}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {office.wallStyle === w.id ? '✓ Active' : w.cost === 0 ? 'Free' : formatMoney(w.cost)}
                    {w.levelRequired > 1 && ` · Lv.${w.levelRequired}`}
                  </div>
                </button>
              ))}
            </div>

            {/* Floor styles */}
            <p className="text-xs font-bold text-violet-400 mb-1 uppercase tracking-wider">Floor Style</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {Object.values(FLOOR_STYLES).map(f => (
                <button
                  key={f.id}
                  onClick={() => tryBuy(f.id, f.cost, 'floor')}
                  disabled={f.levelRequired > player.level || office.floorStyle === f.id}
                  className="p-2.5 rounded-xl text-left transition-all disabled:opacity-40"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `2px solid ${office.floorStyle === f.id ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
                  }}
                  aria-pressed={office.floorStyle === f.id}
                  aria-label={`${f.name} floor`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded" style={{ background: f.value, border: '1px solid rgba(255,255,255,0.2)' }} />
                    <span className="text-white text-xs font-bold">{f.name}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {office.floorStyle === f.id ? '✓ Active' : f.cost === 0 ? 'Free' : formatMoney(f.cost)}
                    {f.levelRequired > 1 && ` · Lv.${f.levelRequired}`}
                  </div>
                </button>
              ))}
            </div>

            {/* Furniture/decor items */}
            <p className="text-xs font-bold text-violet-400 mb-1 uppercase tracking-wider">
              {tab === 'furniture' ? 'Furniture' : 'Decor Items'}
            </p>
            {FURNITURE_ITEMS
              .filter(f => f.category === (tab === 'furniture' ? 'furniture' : 'decor'))
              .map(item => {
                const timesOwned = office.placedItems.filter(p => p.itemId === item.id).length;
                const effects = [
                  item.speedBonus  ? `+${Math.round(item.speedBonus * 100)}% speed`  : '',
                  item.payoutBonus ? `+${Math.round(item.payoutBonus * 100)}% payout` : '',
                  item.xpBonus     ? `+${Math.round(item.xpBonus * 100)}% XP`         : '',
                ].filter(Boolean).join(' · ') || 'Cosmetic';
                return (
                  <ShopCard
                    key={item.id}
                    emoji={item.emoji}
                    name={item.name}
                    description={effects}
                    cost={item.cost}
                    levelRequired={item.levelRequired}
                    playerLevel={player.level}
                    balance={bank.balance}
                    owned={false}
                    badge={timesOwned > 0 ? `×${timesOwned} placed` : undefined}
                    onBuy={() => tryBuy(item.id, item.cost, 'item')}
                  />
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}

interface ShopCardProps {
  emoji: string;
  name: string;
  description: string;
  cost: number;
  levelRequired: number;
  playerLevel: number;
  balance: number;
  owned: boolean;
  borderColor?: string;
  badge?: string;
  onBuy: () => void;
}

function ShopCard({ emoji, name, description, cost, levelRequired, playerLevel, balance, owned, borderColor, badge, onBuy }: ShopCardProps) {
  const locked = levelRequired > playerLevel;
  const canAfford = balance >= cost;
  const disabled = owned || locked;

  return (
    <div
      className="rounded-2xl p-3 flex items-center justify-between gap-2"
      style={{
        background: owned ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.06)',
        border: `2px solid ${owned ? 'rgba(16,185,129,0.3)' : borderColor ? borderColor + '55' : locked ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.12)'}`,
        opacity: locked ? 0.5 : 1,
      }}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <span className="text-xl flex-shrink-0">{emoji}</span>
        <div className="min-w-0">
          <div className="text-white text-sm font-bold truncate">
            {name}
            {badge && <span className="ml-1 text-xs text-violet-400">({badge})</span>}
          </div>
          <div className="text-slate-400 text-xs mt-0.5">{description}</div>
          {locked && <div className="text-amber-500 text-xs mt-0.5">🔒 Unlocks at Lv.{levelRequired}</div>}
        </div>
      </div>
      <button
        onClick={onBuy}
        disabled={disabled}
        className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-black transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: owned
            ? 'rgba(16,185,129,0.2)'
            : !canAfford
            ? 'rgba(239,68,68,0.15)'
            : 'linear-gradient(135deg, #7C3AED, #6D28D9)',
          color: owned ? '#10B981' : !canAfford ? '#EF4444' : 'white',
          border: `1px solid ${owned ? 'rgba(16,185,129,0.3)' : !canAfford ? 'rgba(239,68,68,0.3)' : 'rgba(167,139,250,0.4)'}`,
          minWidth: 64,
        }}
        aria-label={owned ? 'Already owned' : `Buy ${name} for ${formatMoney(cost)}`}
      >
        {owned ? '✓ Owned' : formatMoney(cost)}
      </button>
    </div>
  );
}
