'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState, Screen, Panel, Appearance, BusinessId, WallStyle, FloorStyle, PlacedItem, ItemMount } from '@/types/game';
import {
  BUSINESS_TASKS, PC_TIERS, EQUIPMENT_ITEMS, FURNITURE_ITEMS,
  AUTOMATIONS, SKILLS, BUSINESSES, RANDOM_EVENTS,
  XP_PER_LEVEL, XP_AT_LEVEL,
  WALL_STYLES, FLOOR_STYLES, FLOOR_GRID, WALL_GRID,
  getLevelFromXP, getXPInCurrentLevel,
} from '@/config/gameData';

interface GameStore extends GameState {
  setScreen: (screen: Screen) => void;
  setPanel: (panel: Panel) => void;
  initNewGame: (name: string, appearance: Appearance, businessId: BusinessId) => void;
  startTask: (taskId: string) => void;
  cancelTask: () => void;
  checkTaskCompletion: () => { earned: number; xp: number; taskName: string } | null;
  earnMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  earnXP: (amount: number) => void;
  dismissLevelUp: () => void;
  buyAndPlace: (itemId: string) => boolean;
  confirmPlacement: (gridX: number, gridY: number) => boolean;
  cancelPlacement: () => void;
  moveItem: (instanceId: string, gridX: number, gridY: number) => void;
  storeItem: (instanceId: string) => void;
  buyWallStyle: (style: WallStyle) => boolean;
  buyFloorStyle: (style: FloorStyle) => boolean;
  upgradePCTier: (tier: number) => boolean;
  spendSkillPoint: (skillId: string) => boolean;
  toggleAutomation: (id: string) => void;
  tickAutomations: () => number;
  calculateOfflineEarnings: () => number;
  addFloatingText: (text: string, x: number, y: number, color: string) => void;
  removeFloatingText: (id: string) => void;
  updateAppearance: (appearance: Appearance) => void;
  resetGame: () => void;
}

const DEFAULT_STATE: GameState = {
  screen: 'character-creation',
  activePanel: 'none',
  player: { name: 'Player', level: 1, xp: 0, skillPoints: 0, unlockedSkills: [], appearance: { skinTone: 'medium', hairStyle: 'short', hairColor: 'black', outfitId: 'startup-casual' } },
  bank: { balance: 500, lifetimeEarned: 0 },
  business: null,
  office: { floorItems: [], wallItems: [], wallStyle: 'white', floorStyle: 'wood' },
  equipment: { pcTier: 1, ownedItemIds: [] },
  automations: [],
  floatingTexts: [],
  pendingLevelUp: null,
  pendingPlacement: null,
  meta: { lastSavedAt: Date.now(), lastSeenAt: Date.now(), version: 2 },
};

function computeBonuses(state: GameState) {
  let speedBonus = 0, payoutBonus = 0, xpBonus = 0, automationBonus = 0;
  for (const id of state.equipment.ownedItemIds) {
    const item = EQUIPMENT_ITEMS.find(e => e.id === id);
    if (item) { speedBonus += item.speedBonus; payoutBonus += item.payoutBonus; xpBonus += item.xpBonus; }
  }
  const allPlaced = [...state.office.floorItems, ...state.office.wallItems];
  for (const placed of allPlaced) {
    const item = FURNITURE_ITEMS.find(f => f.id === placed.itemId);
    if (item) { speedBonus += item.speedBonus; payoutBonus += item.payoutBonus; xpBonus += item.xpBonus; }
  }
  for (const skillId of state.player.unlockedSkills) {
    const skill = SKILLS.find(s => s.id === skillId);
    if (skill) { speedBonus += skill.speedBonus; payoutBonus += skill.payoutBonus; xpBonus += skill.xpBonus; automationBonus += skill.automationBonus; }
  }
  return { speedBonus, payoutBonus, xpBonus, automationBonus };
}

function isOccupied(items: PlacedItem[], itemId: string, gx: number, gy: number, cols: number, rows: number): boolean {
  const def = FURNITURE_ITEMS.find(f => f.id === itemId);
  const w = def?.gridW ?? 1, h = def?.gridH ?? 1;
  if (gx + w > cols || gy + h > rows) return true;
  for (const placed of items) {
    const pdef = FURNITURE_ITEMS.find(f => f.id === placed.itemId);
    const pw = pdef?.gridW ?? 1, ph = pdef?.gridH ?? 1;
    const xOverlap = gx < placed.gridX + pw && gx + w > placed.gridX;
    const yOverlap = gy < placed.gridY + ph && gy + h > placed.gridY;
    if (xOverlap && yOverlap) return true;
  }
  return false;
}

function autoPlace(items: PlacedItem[], itemId: string, mount: ItemMount): { gridX: number; gridY: number } | null {
  const grid = mount === 'floor' ? FLOOR_GRID : WALL_GRID;
  for (let y = 0; y < grid.rows; y++) {
    for (let x = 0; x < grid.cols; x++) {
      if (!isOccupied(items, itemId, x, y, grid.cols, grid.rows)) return { gridX: x, gridY: y };
    }
  }
  return null;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      setScreen: (screen) => set({ screen }),
      setPanel: (panel) => set(s => ({ activePanel: s.activePanel === panel ? 'none' : panel })),

      initNewGame: (name, appearance, businessId) => {
        const biz = BUSINESSES.find(b => b.id === businessId)!;
        set({ ...DEFAULT_STATE, screen: 'game', activePanel: 'work', player: { ...DEFAULT_STATE.player, name, appearance }, bank: { balance: biz.startingCash, lifetimeEarned: 0 }, business: { id: businessId, activeTask: null }, meta: { lastSavedAt: Date.now(), lastSeenAt: Date.now(), version: 2 } });
      },

      startTask: (taskId) => {
        const s = get();
        if (!s.business || s.business.activeTask) return;
        const tasks = BUSINESS_TASKS[s.business.id];
        const task = tasks.find(t => t.id === taskId);
        if (!task || task.levelRequired > s.player.level) return;
        const { speedBonus } = computeBonuses(s);
        const pcTier = PC_TIERS.find(p => p.tier === s.equipment.pcTier)!;
        const duration = Math.round(task.baseDuration * pcTier.speedMult * (1 - Math.min(speedBonus, 0.8)));
        set(state => ({ business: { ...state.business!, activeTask: { taskId, startedAt: Date.now(), duration } } }));
      },

      cancelTask: () => set(state => ({ business: state.business ? { ...state.business, activeTask: null } : null })),

      checkTaskCompletion: () => {
        const s = get();
        if (!s.business?.activeTask) return null;
        const { taskId, startedAt, duration } = s.business.activeTask;
        if (Date.now() < startedAt + duration) return null;
        const tasks = BUSINESS_TASKS[s.business.id];
        const task = tasks.find(t => t.id === taskId)!;
        const { payoutBonus, xpBonus } = computeBonuses(s);
        const pcTier = PC_TIERS.find(p => p.tier === s.equipment.pcTier)!;
        const earned = Math.round(task.basePayout * pcTier.payoutMult * (1 + payoutBonus));
        const xp = Math.round(task.baseXP * (1 + xpBonus));
        let eventDelta = 0, eventMsg: string | null = null, eventColor = '#10B981';
        for (const ev of RANDOM_EVENTS) {
          if (Math.random() < ev.probability) { eventDelta = ev.moneyDelta; eventMsg = ev.message; eventColor = ev.color; break; }
        }
        const total = Math.max(0, earned + eventDelta);
        set(state => ({ business: { ...state.business!, activeTask: null } }));
        get().earnMoney(total);
        get().earnXP(xp);
        if (eventMsg) setTimeout(() => get().addFloatingText(eventMsg!, 60, 200, eventColor), 200);
        return { earned: total, xp, taskName: task.name };
      },

      earnMoney: (amount) => set(state => ({
        bank: { balance: state.bank.balance + amount, lifetimeEarned: state.bank.lifetimeEarned + (amount > 0 ? amount : 0) },
      })),

      spendMoney: (amount) => {
        if (get().bank.balance < amount) return false;
        set(state => ({ bank: { ...state.bank, balance: state.bank.balance - amount } }));
        return true;
      },

      earnXP: (amount) => {
        const s = get();
        if (s.player.level >= 10) return;
        const newXP = s.player.xp + amount;
        const newLevel = getLevelFromXP(newXP);
        const leveled = newLevel > s.player.level;
        set(state => ({
          player: { ...state.player, xp: newXP, level: newLevel, skillPoints: leveled ? state.player.skillPoints + (newLevel - state.player.level) : state.player.skillPoints },
          pendingLevelUp: leveled ? newLevel : state.pendingLevelUp,
          screen: newLevel >= 10 ? 'end' : state.screen,
        }));
      },

      dismissLevelUp: () => set({ pendingLevelUp: null }),

      buyAndPlace: (itemId) => {
        const s = get();
        const equip = EQUIPMENT_ITEMS.find(e => e.id === itemId);
        if (equip) {
          if (s.equipment.ownedItemIds.includes(itemId)) return false;
          if (equip.levelRequired > s.player.level) return false;
          if (!get().spendMoney(equip.cost)) return false;
          set(state => ({ equipment: { ...state.equipment, ownedItemIds: [...state.equipment.ownedItemIds, itemId] } }));
          return true;
        }
        const furn = FURNITURE_ITEMS.find(f => f.id === itemId);
        if (furn) {
          if (furn.levelRequired > s.player.level) return false;
          if (!get().spendMoney(furn.cost)) return false;
          set({ pendingPlacement: { itemId, mount: furn.mount }, activePanel: 'none' });
          return true;
        }
        return false;
      },

      confirmPlacement: (gridX, gridY) => {
        const s = get();
        if (!s.pendingPlacement) return false;
        const { itemId, mount } = s.pendingPlacement;
        const grid = mount === 'floor' ? FLOOR_GRID : WALL_GRID;
        const existingItems = mount === 'floor' ? s.office.floorItems : s.office.wallItems;
        if (isOccupied(existingItems, itemId, gridX, gridY, grid.cols, grid.rows)) return false;
        const placed: PlacedItem = { instanceId: `${itemId}-${Date.now()}`, itemId, gridX, gridY };
        set(state => ({
          office: {
            ...state.office,
            floorItems: mount === 'floor' ? [...state.office.floorItems, placed] : state.office.floorItems,
            wallItems:  mount === 'wall'  ? [...state.office.wallItems,  placed] : state.office.wallItems,
          },
          pendingPlacement: null,
        }));
        return true;
      },

      cancelPlacement: () => {
        const s = get();
        if (!s.pendingPlacement) return;
        const { itemId, mount } = s.pendingPlacement;
        const existingItems = mount === 'floor' ? s.office.floorItems : s.office.wallItems;
        const pos = autoPlace(existingItems, itemId, mount);
        if (!pos) { set({ pendingPlacement: null }); return; }
        const placed: PlacedItem = { instanceId: `${itemId}-${Date.now()}`, itemId, gridX: pos.gridX, gridY: pos.gridY };
        set(state => ({
          office: {
            ...state.office,
            floorItems: mount === 'floor' ? [...state.office.floorItems, placed] : state.office.floorItems,
            wallItems:  mount === 'wall'  ? [...state.office.wallItems,  placed] : state.office.wallItems,
          },
          pendingPlacement: null,
        }));
      },

      moveItem: (instanceId, gridX, gridY) => {
        const s = get();
        const isFloor = s.office.floorItems.some(p => p.instanceId === instanceId);
        const mount: ItemMount = isFloor ? 'floor' : 'wall';
        const items = isFloor ? s.office.floorItems : s.office.wallItems;
        const itemId = items.find(p => p.instanceId === instanceId)?.itemId ?? '';
        const grid = isFloor ? FLOOR_GRID : WALL_GRID;
        const others = items.filter(p => p.instanceId !== instanceId);
        if (isOccupied(others, itemId, gridX, gridY, grid.cols, grid.rows)) return;
        set(state => ({
          office: {
            ...state.office,
            floorItems: mount === 'floor' ? state.office.floorItems.map(p => p.instanceId === instanceId ? { ...p, gridX, gridY } : p) : state.office.floorItems,
            wallItems:  mount === 'wall'  ? state.office.wallItems.map(p => p.instanceId === instanceId ? { ...p, gridX, gridY } : p) : state.office.wallItems,
          },
        }));
      },

      storeItem: (instanceId) => {
        set(state => ({
          office: {
            ...state.office,
            floorItems: state.office.floorItems.filter(p => p.instanceId !== instanceId),
            wallItems:  state.office.wallItems.filter(p => p.instanceId !== instanceId),
          },
        }));
      },

      buyWallStyle: (style) => {
        const s = get();
        const def = WALL_STYLES[style];
        if (!def || def.levelRequired > s.player.level || s.office.wallStyle === style) return false;
        if (!get().spendMoney(def.cost)) return false;
        set(state => ({ office: { ...state.office, wallStyle: style } }));
        return true;
      },

      buyFloorStyle: (style) => {
        const s = get();
        const def = FLOOR_STYLES[style];
        if (!def || def.levelRequired > s.player.level || s.office.floorStyle === style) return false;
        if (!get().spendMoney(def.cost)) return false;
        set(state => ({ office: { ...state.office, floorStyle: style } }));
        return true;
      },

      upgradePCTier: (tier) => {
        const s = get();
        const tierDef = PC_TIERS.find(p => p.tier === tier);
        if (!tierDef || tier <= s.equipment.pcTier || tierDef.levelRequired > s.player.level) return false;
        const hasHH = s.player.unlockedSkills.includes('t3');
        const cost = hasHH ? Math.round(tierDef.cost * 0.85) : tierDef.cost;
        if (!get().spendMoney(cost)) return false;
        set(state => ({ equipment: { ...state.equipment, pcTier: tier } }));
        return true;
      },

      spendSkillPoint: (skillId) => {
        const s = get();
        if (s.player.skillPoints <= 0) return false;
        const skill = SKILLS.find(sk => sk.id === skillId);
        if (!skill || s.player.unlockedSkills.includes(skillId)) return false;
        if (skill.requires && !s.player.unlockedSkills.includes(skill.requires)) return false;
        if (skill.cost > s.player.skillPoints) return false;
        set(state => ({ player: { ...state.player, skillPoints: state.player.skillPoints - skill.cost, unlockedSkills: [...state.player.unlockedSkills, skillId] } }));
        return true;
      },

      toggleAutomation: (id) => {
        const s = get();
        const def = AUTOMATIONS.find(a => a.id === id);
        if (!def) return;
        const existing = s.automations.find(a => a.id === id);
        if (!existing) {
          if (def.levelRequired > s.player.level || s.equipment.pcTier < def.pcTierRequired) return;
          if (!get().spendMoney(def.cost)) return;
          set(state => ({ automations: [...state.automations, { id, active: true, lastTickAt: Date.now() }] }));
          return;
        }
        set(state => ({ automations: state.automations.map(a => a.id === id ? { ...a, active: !a.active } : a) }));
      },

      tickAutomations: () => {
        const s = get();
        if (!s.business) return 0;
        const now = Date.now();
        let total = 0;
        const { automationBonus } = computeBonuses(s);
        const updated = s.automations.map(auto => {
          if (!auto.active) return auto;
          const def = AUTOMATIONS.find(a => a.id === auto.id);
          if (!def || !def.businesses.includes(s.business!.id)) return auto;
          const elapsed = (now - auto.lastTickAt) / 60000;
          total += Math.round(def.incomePerMinute * elapsed * (1 + automationBonus));
          return { ...auto, lastTickAt: now };
        });
        if (total > 0) {
          set(state => ({ automations: updated, bank: { balance: state.bank.balance + total, lifetimeEarned: state.bank.lifetimeEarned + total } }));
        } else {
          set({ automations: updated });
        }
        return total;
      },

      calculateOfflineEarnings: () => {
        const s = get();
        const now = Date.now();
        const offlineSecs = Math.min((now - s.meta.lastSeenAt) / 1000, 4 * 3600);
        if (offlineSecs < 10 || !s.automations.some(a => a.active)) {
          set(state => ({ meta: { ...state.meta, lastSeenAt: now } }));
          return 0;
        }
        const { automationBonus } = computeBonuses(s);
        let total = 0;
        for (const auto of s.automations) {
          if (!auto.active) continue;
          const def = AUTOMATIONS.find(a => a.id === auto.id);
          if (!def || !def.businesses.includes(s.business?.id ?? 'content-studio')) continue;
          total += Math.round(def.incomePerMinute * (offlineSecs / 60) * (1 + automationBonus));
        }
        const updated = s.automations.map(a => ({ ...a, lastTickAt: now }));
        set(state => ({ automations: updated, bank: { balance: state.bank.balance + total, lifetimeEarned: state.bank.lifetimeEarned + total }, meta: { ...state.meta, lastSeenAt: now } }));
        return total;
      },

      addFloatingText: (text, x, y, color) => {
        const id = `ft-${Date.now()}-${Math.random()}`;
        set(state => ({ floatingTexts: [...state.floatingTexts, { id, text, x, y, color }] }));
        setTimeout(() => get().removeFloatingText(id), 1800);
      },

      removeFloatingText: (id) => set(state => ({ floatingTexts: state.floatingTexts.filter(f => f.id !== id) })),

      updateAppearance: (appearance) => set(state => ({ player: { ...state.player, appearance } })),

      resetGame: () => set({ ...DEFAULT_STATE, screen: 'character-creation' }),
    }),
    {
      name: 'ai-empire-tycoon-save',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
      }),
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { floatingTexts, pendingLevelUp, pendingPlacement, ...rest } = state;
        return rest;
      },
      migrate: (persisted: unknown) => {
        // Migrate v1 saves (placedItems) to v2 (floorItems/wallItems)
        const p = persisted as Record<string, unknown>;
        if (p?.office && typeof p.office === 'object') {
          const office = p.office as Record<string, unknown>;
          if (Array.isArray(office.placedItems) && !office.floorItems) {
            const all = office.placedItems as Array<{ itemId: string; gridX: number; gridY: number; instanceId: string }>;
            const floor = all.filter(i => { const d = FURNITURE_ITEMS.find(f => f.id === i.itemId); return !d || d.mount === 'floor'; });
            const wall  = all.filter(i => { const d = FURNITURE_ITEMS.find(f => f.id === i.itemId); return d?.mount === 'wall'; });
            office.floorItems = floor;
            office.wallItems  = wall;
            delete office.placedItems;
          }
          if (!office.floorItems) office.floorItems = [];
          if (!office.wallItems)  office.wallItems  = [];
        }
        return persisted as GameState;
      },
      version: 2,
    }
  )
);
