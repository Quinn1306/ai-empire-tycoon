'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState, Screen, Panel, Appearance, BusinessId, WallStyle, FloorStyle, PlacedItem, FloatingText } from '@/types/game';
import {
  BUSINESS_TASKS, PC_TIERS, EQUIPMENT_ITEMS, FURNITURE_ITEMS,
  AUTOMATIONS, SKILLS, BUSINESSES, RANDOM_EVENTS,
  XP_PER_LEVEL, XP_AT_LEVEL, WALL_STYLES, FLOOR_STYLES,
  getXPForLevel, getLevelFromXP, getXPInCurrentLevel,
} from '@/config/gameData';

interface GameStore extends GameState {
  // Navigation
  setScreen: (screen: Screen) => void;
  setPanel: (panel: Panel) => void;
  // Game Init
  initNewGame: (name: string, appearance: Appearance, businessId: BusinessId) => void;
  // Work
  startTask: (taskId: string) => void;
  cancelTask: () => void;
  checkTaskCompletion: () => { earned: number; xp: number; taskName: string } | null;
  // Money & XP
  earnMoney: (amount: number) => void;
  spendMoney: (amount: number) => boolean;
  earnXP: (amount: number) => void;
  dismissLevelUp: () => void;
  // Shop
  buyItem: (itemId: string) => boolean;
  buyWallStyle: (style: WallStyle) => boolean;
  buyFloorStyle: (style: FloorStyle) => boolean;
  upgradePCTier: (tier: number) => boolean;
  // Furniture placement
  placeItem: (item: PlacedItem) => void;
  removeItem: (instanceId: string) => void;
  // Skills
  spendSkillPoint: (skillId: string) => boolean;
  // Automations
  toggleAutomation: (id: string) => void;
  tickAutomations: () => number;
  calculateOfflineEarnings: () => number;
  // Floating text
  addFloatingText: (text: string, x: number, y: number, color: string) => void;
  removeFloatingText: (id: string) => void;
  // Appearance
  updateAppearance: (appearance: Appearance) => void;
  // Reset
  resetGame: () => void;
}

const DEFAULT_STATE: GameState = {
  screen: 'character-creation',
  activePanel: 'none',
  player: {
    name: 'Player',
    level: 1,
    xp: 0,
    skillPoints: 0,
    unlockedSkills: [],
    appearance: {
      skinTone: 'medium',
      hairStyle: 'short',
      hairColor: 'black',
      outfitId: 'startup-casual',
    },
  },
  bank: { balance: 500, lifetimeEarned: 0 },
  business: null,
  office: {
    placedItems: [],
    wallStyle: 'white',
    floorStyle: 'wood',
  },
  equipment: { pcTier: 1, ownedItemIds: [] },
  automations: [],
  floatingTexts: [],
  pendingLevelUp: null,
  meta: { lastSavedAt: Date.now(), lastSeenAt: Date.now(), version: 1 },
};

function computeBonuses(state: GameState) {
  let speedBonus = 0;
  let payoutBonus = 0;
  let xpBonus = 0;
  let automationBonus = 0;

  // Equipment bonuses
  for (const id of state.equipment.ownedItemIds) {
    const item = EQUIPMENT_ITEMS.find(e => e.id === id);
    if (item) {
      speedBonus += item.speedBonus;
      payoutBonus += item.payoutBonus;
      xpBonus += item.xpBonus;
    }
  }
  // Furniture bonuses
  for (const placed of state.office.placedItems) {
    const item = FURNITURE_ITEMS.find(f => f.id === placed.itemId);
    if (item) {
      speedBonus += item.speedBonus;
      payoutBonus += item.payoutBonus;
      xpBonus += item.xpBonus;
    }
  }
  // Skill bonuses
  for (const skillId of state.player.unlockedSkills) {
    const skill = SKILLS.find(s => s.id === skillId);
    if (skill) {
      speedBonus += skill.speedBonus;
      payoutBonus += skill.payoutBonus;
      xpBonus += skill.xpBonus;
      automationBonus += skill.automationBonus;
    }
  }

  return { speedBonus, payoutBonus, xpBonus, automationBonus };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      setScreen: (screen) => set({ screen }),
      setPanel: (panel) => set(s => ({ activePanel: s.activePanel === panel ? 'none' : panel })),

      initNewGame: (name, appearance, businessId) => {
        const biz = BUSINESSES.find(b => b.id === businessId)!;
        set({
          ...DEFAULT_STATE,
          screen: 'game',
          activePanel: 'work',
          player: { ...DEFAULT_STATE.player, name, appearance },
          bank: { balance: biz.startingCash, lifetimeEarned: 0 },
          business: { id: businessId, activeTask: null },
          meta: { lastSavedAt: Date.now(), lastSeenAt: Date.now(), version: 1 },
        });
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

        set(state => ({
          business: {
            ...state.business!,
            activeTask: { taskId, startedAt: Date.now(), duration },
          },
        }));
      },

      cancelTask: () => {
        set(state => ({
          business: state.business ? { ...state.business, activeTask: null } : null,
        }));
      },

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

        // Check random events
        let eventDelta = 0;
        let eventMsg: string | null = null;
        let eventColor = '#10B981';
        for (const ev of RANDOM_EVENTS) {
          if (Math.random() < ev.probability) {
            eventDelta = ev.moneyDelta;
            eventMsg = `${ev.emoji} ${ev.message}`;
            eventColor = ev.color;
            break;
          }
        }

        const totalEarned = earned + eventDelta;

        set(state => ({
          business: { ...state.business!, activeTask: null },
        }));

        get().earnMoney(Math.max(0, totalEarned));
        get().earnXP(xp);

        if (eventMsg) {
          setTimeout(() => get().addFloatingText(eventMsg!, 60, 200, eventColor), 200);
        }

        return { earned: Math.max(0, totalEarned), xp, taskName: task.name };
      },

      earnMoney: (amount) => {
        set(state => ({
          bank: {
            balance: state.bank.balance + amount,
            lifetimeEarned: state.bank.lifetimeEarned + (amount > 0 ? amount : 0),
          },
        }));
      },

      spendMoney: (amount) => {
        const s = get();
        if (s.bank.balance < amount) return false;
        set(state => ({
          bank: { ...state.bank, balance: state.bank.balance - amount },
        }));
        return true;
      },

      earnXP: (amount) => {
        const s = get();
        if (s.player.level >= 10) return;

        const newTotalXP = s.player.xp + amount;
        const newLevel = getLevelFromXP(newTotalXP);
        const leveled = newLevel > s.player.level;

        set(state => ({
          player: {
            ...state.player,
            xp: newTotalXP,
            level: newLevel,
            skillPoints: leveled ? state.player.skillPoints + (newLevel - state.player.level) : state.player.skillPoints,
          },
          pendingLevelUp: leveled ? newLevel : state.pendingLevelUp,
          screen: newLevel >= 10 ? 'end' : state.screen,
        }));
      },

      dismissLevelUp: () => set({ pendingLevelUp: null }),

      buyItem: (itemId) => {
        const s = get();
        // Check equipment items
        const equip = EQUIPMENT_ITEMS.find(e => e.id === itemId);
        if (equip) {
          if (s.equipment.ownedItemIds.includes(itemId)) return false;
          if (equip.levelRequired > s.player.level) return false;
          if (!get().spendMoney(equip.cost)) return false;
          set(state => ({
            equipment: { ...state.equipment, ownedItemIds: [...state.equipment.ownedItemIds, itemId] },
          }));
          return true;
        }
        // Check furniture/decor items
        const furn = FURNITURE_ITEMS.find(f => f.id === itemId);
        if (furn) {
          if (furn.levelRequired > s.player.level) return false;
          if (!get().spendMoney(furn.cost)) return false;
          // Add to office placed items at a random free-ish position
          const placed: PlacedItem = {
            instanceId: `${itemId}-${Date.now()}`,
            itemId,
            gridX: Math.floor(Math.random() * 4),
            gridY: Math.floor(Math.random() * 3),
          };
          set(state => ({
            office: { ...state.office, placedItems: [...state.office.placedItems, placed] },
          }));
          return true;
        }
        return false;
      },

      buyWallStyle: (style) => {
        const s = get();
        const def = WALL_STYLES[style];
        if (!def || def.levelRequired > s.player.level) return false;
        if (s.office.wallStyle === style) return false;
        if (!get().spendMoney(def.cost)) return false;
        set(state => ({ office: { ...state.office, wallStyle: style } }));
        return true;
      },

      buyFloorStyle: (style) => {
        const s = get();
        const def = FLOOR_STYLES[style];
        if (!def || def.levelRequired > s.player.level) return false;
        if (s.office.floorStyle === style) return false;
        if (!get().spendMoney(def.cost)) return false;
        set(state => ({ office: { ...state.office, floorStyle: style } }));
        return true;
      },

      upgradePCTier: (tier) => {
        const s = get();
        const tierDef = PC_TIERS.find(p => p.tier === tier);
        if (!tierDef) return false;
        if (tier <= s.equipment.pcTier) return false;
        if (tierDef.levelRequired > s.player.level) return false;
        // Check Hardware Hacker skill
        const hasHardwareHacker = s.player.unlockedSkills.includes('t3');
        const cost = hasHardwareHacker ? Math.round(tierDef.cost * 0.85) : tierDef.cost;
        if (!get().spendMoney(cost)) return false;
        set(state => ({ equipment: { ...state.equipment, pcTier: tier } }));
        return true;
      },

      placeItem: (item) => {
        set(state => ({
          office: {
            ...state.office,
            placedItems: state.office.placedItems.map(p =>
              p.instanceId === item.instanceId ? item : p
            ),
          },
        }));
      },

      removeItem: (instanceId) => {
        set(state => ({
          office: {
            ...state.office,
            placedItems: state.office.placedItems.filter(p => p.instanceId !== instanceId),
          },
        }));
      },

      spendSkillPoint: (skillId) => {
        const s = get();
        if (s.player.skillPoints <= 0) return false;
        const skill = SKILLS.find(sk => sk.id === skillId);
        if (!skill) return false;
        if (s.player.unlockedSkills.includes(skillId)) return false;
        if (skill.requires && !s.player.unlockedSkills.includes(skill.requires)) return false;
        if (skill.cost > s.player.skillPoints) return false;
        set(state => ({
          player: {
            ...state.player,
            skillPoints: state.player.skillPoints - skill.cost,
            unlockedSkills: [...state.player.unlockedSkills, skillId],
          },
        }));
        return true;
      },

      toggleAutomation: (id) => {
        const s = get();
        const def = AUTOMATIONS.find(a => a.id === id);
        if (!def) return;
        // Check if owned (bought)
        const existing = s.automations.find(a => a.id === id);
        if (!existing) {
          // Buy it
          if (def.levelRequired > s.player.level) return;
          if (s.equipment.pcTier < def.pcTierRequired) return;
          if (!get().spendMoney(def.cost)) return;
          set(state => ({
            automations: [...state.automations, { id, active: true, lastTickAt: Date.now() }],
          }));
          return;
        }
        set(state => ({
          automations: state.automations.map(a =>
            a.id === id ? { ...a, active: !a.active } : a
          ),
        }));
      },

      tickAutomations: () => {
        const s = get();
        if (!s.business) return 0;
        const now = Date.now();
        let totalEarned = 0;
        const { automationBonus } = computeBonuses(s);

        const updated = s.automations.map(auto => {
          if (!auto.active) return auto;
          const def = AUTOMATIONS.find(a => a.id === auto.id);
          if (!def) return auto;
          // Only tick automations for current business
          if (!def.businesses.includes(s.business!.id)) return auto;

          const elapsed = (now - auto.lastTickAt) / 60000; // minutes
          const earned = Math.round(def.incomePerMinute * elapsed * (1 + automationBonus));
          totalEarned += earned;
          return { ...auto, lastTickAt: now };
        });

        if (totalEarned > 0) {
          set(state => ({
            automations: updated,
            bank: {
              balance: state.bank.balance + totalEarned,
              lifetimeEarned: state.bank.lifetimeEarned + totalEarned,
            },
          }));
        } else if (updated !== s.automations) {
          set({ automations: updated });
        }

        return totalEarned;
      },

      calculateOfflineEarnings: () => {
        const s = get();
        const now = Date.now();
        const offlineSecs = Math.min((now - s.meta.lastSeenAt) / 1000, 4 * 3600);
        if (offlineSecs < 10 || s.automations.filter(a => a.active).length === 0) {
          set(state => ({ meta: { ...state.meta, lastSeenAt: now } }));
          return 0;
        }

        const { automationBonus } = computeBonuses(s);
        let total = 0;
        for (const auto of s.automations) {
          if (!auto.active) continue;
          const def = AUTOMATIONS.find(a => a.id === auto.id);
          if (!def) continue;
          if (!def.businesses.includes(s.business?.id ?? 'content-studio')) continue;
          total += Math.round(def.incomePerMinute * (offlineSecs / 60) * (1 + automationBonus));
        }

        const updated = s.automations.map(a => ({ ...a, lastTickAt: now }));
        set(state => ({
          automations: updated,
          bank: {
            balance: state.bank.balance + total,
            lifetimeEarned: state.bank.lifetimeEarned + total,
          },
          meta: { ...state.meta, lastSeenAt: now },
        }));

        return total;
      },

      addFloatingText: (text, x, y, color) => {
        const id = `ft-${Date.now()}-${Math.random()}`;
        set(state => ({
          floatingTexts: [...state.floatingTexts, { id, text, x, y, color }],
        }));
        setTimeout(() => get().removeFloatingText(id), 1800);
      },

      removeFloatingText: (id) => {
        set(state => ({
          floatingTexts: state.floatingTexts.filter(f => f.id !== id),
        }));
      },

      updateAppearance: (appearance) => {
        set(state => ({ player: { ...state.player, appearance } }));
      },

      resetGame: () => {
        set({ ...DEFAULT_STATE, screen: 'character-creation' });
      },
    }),
    {
      name: 'ai-empire-tycoon-save',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => {
        const { floatingTexts: _, pendingLevelUp: __, ...rest } = state;
        return rest;
      },
    }
  )
);
