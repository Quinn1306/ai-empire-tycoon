import type { BusinessId, WallStyle, FloorStyle, SkinTone, HairStyle, HairColor, OutfitId, ItemMount } from '@/types/game';

export const XP_PER_LEVEL: number[] = [100, 175, 275, 400, 550, 750, 1000, 1350, 1800];
export const XP_AT_LEVEL:  number[] = [0, 100, 275, 550, 950, 1500, 2250, 3250, 4600, 6400];

export function getXPForLevel(level: number): number {
  return XP_PER_LEVEL[level - 1] ?? 9999999;
}
export function getLevelFromXP(totalXP: number): number {
  let level = 1, accumulated = 0;
  for (let i = 0; i < XP_PER_LEVEL.length; i++) {
    if (totalXP >= accumulated + XP_PER_LEVEL[i]) { accumulated += XP_PER_LEVEL[i]; level = i + 2; }
    else break;
  }
  return Math.min(level, 10);
}
export function getXPInCurrentLevel(totalXP: number, level: number): number {
  return totalXP - XP_AT_LEVEL[level - 1];
}

// ─── Grid ──────────────────────────────────────────────────────────────────────
export const FLOOR_GRID = { cols: 6, rows: 3 } as const;
export const WALL_GRID  = { cols: 6, rows: 2 } as const;

// ─── Tasks ─────────────────────────────────────────────────────────────────────
export interface TaskDef {
  id: string;
  name: string;
  baseDuration: number;
  basePayout: number;
  baseXP: number;
  levelRequired: number;
}
export const BUSINESS_TASKS: Record<BusinessId, TaskDef[]> = {
  'content-studio': [
    { id: 'cs-proposal', name: 'Write Client Proposal', baseDuration: 6000,  basePayout: 28, baseXP: 16, levelRequired: 1 },
    { id: 'cs-social',   name: 'Create Social Post',    baseDuration: 3500,  basePayout: 16, baseXP: 10, levelRequired: 1 },
    { id: 'cs-logo',     name: 'Design Logo Draft',     baseDuration: 9000,  basePayout: 50, baseXP: 28, levelRequired: 2 },
    { id: 'cs-blog',     name: 'Write Blog Post',       baseDuration: 11000, basePayout: 65, baseXP: 35, levelRequired: 3 },
    { id: 'cs-video',    name: 'Write Video Script',    baseDuration: 14000, basePayout: 90, baseXP: 48, levelRequired: 5 },
  ],
  'dropshipping': [
    { id: 'ds-research', name: 'Research Products',  baseDuration: 4500,  basePayout: 22, baseXP: 12, levelRequired: 1 },
    { id: 'ds-listing',  name: 'Create Listing',     baseDuration: 7000,  basePayout: 38, baseXP: 22, levelRequired: 1 },
    { id: 'ds-orders',   name: 'Process Orders',     baseDuration: 3000,  basePayout: 20, baseXP: 11, levelRequired: 1 },
    { id: 'ds-ads',      name: 'Run Ad Campaign',    baseDuration: 9000,  basePayout: 55, baseXP: 30, levelRequired: 3 },
    { id: 'ds-optimize', name: 'Optimize Store',     baseDuration: 12000, basePayout: 72, baseXP: 40, levelRequired: 5 },
  ],
  'automation-agency': [
    { id: 'aa-consult',  name: 'Client Consultation', baseDuration: 5500,  basePayout: 32, baseXP: 18, levelRequired: 1 },
    { id: 'aa-workflow', name: 'Build Workflow',       baseDuration: 9000,  basePayout: 58, baseXP: 32, levelRequired: 1 },
    { id: 'aa-docs',     name: 'Write AI Docs',        baseDuration: 7000,  basePayout: 42, baseXP: 24, levelRequired: 2 },
    { id: 'aa-deploy',   name: 'Deploy Bot',           baseDuration: 13000, basePayout: 95, baseXP: 50, levelRequired: 3 },
    { id: 'aa-qa',       name: 'QA Test System',       baseDuration: 8000,  basePayout: 52, baseXP: 28, levelRequired: 5 },
  ],
};

// ─── PC Tiers ─────────────────────────────────────────────────────────────────
export interface PCTierDef {
  tier: number;
  name: string;
  speedMult: number;
  payoutMult: number;
  cost: number;
  levelRequired: number;
  color: string;
}
export const PC_TIERS: PCTierDef[] = [
  { tier: 1, name: '90s Beige Box',    speedMult: 1.00, payoutMult: 1.00, cost: 0,     levelRequired: 1, color: '#C8B9A0' },
  { tier: 2, name: 'Basic Laptop',     speedMult: 0.80, payoutMult: 1.20, cost: 250,   levelRequired: 1, color: '#6B7280' },
  { tier: 3, name: 'Modern Desktop',   speedMult: 0.62, payoutMult: 1.50, cost: 900,   levelRequired: 3, color: '#3B82F6' },
  { tier: 4, name: 'Multi-Monitor Rig',speedMult: 0.47, payoutMult: 1.85, cost: 2800,  levelRequired: 5, color: '#8B5CF6' },
  { tier: 5, name: 'Server Rack',      speedMult: 0.35, payoutMult: 2.30, cost: 9000,  levelRequired: 7, color: '#10B981' },
  { tier: 6, name: 'Mini Data Center', speedMult: 0.25, payoutMult: 3.00, cost: 28000, levelRequired: 9, color: '#F59E0B' },
];

// ─── Equipment ────────────────────────────────────────────────────────────────
export interface EquipmentItemDef {
  id: string;
  name: string;
  description: string;
  cost: number;
  levelRequired: number;
  speedBonus: number;
  payoutBonus: number;
  xpBonus: number;
  category: 'equipment';
}
export const EQUIPMENT_ITEMS: EquipmentItemDef[] = [
  { id: 'ergo-chair',     name: 'Ergo Chair',      description: 'Work faster in comfort',    cost: 180, levelRequired: 1, speedBonus: 0.05, payoutBonus: 0,    xpBonus: 0,    category: 'equipment' },
  { id: 'mech-keyboard',  name: 'Mech Keyboard',   description: 'Satisfying and fast',        cost: 140, levelRequired: 1, speedBonus: 0.04, payoutBonus: 0,    xpBonus: 0,    category: 'equipment' },
  { id: 'coffee-machine', name: 'Coffee Machine',  description: 'Fuel your hustle',           cost: 220, levelRequired: 2, speedBonus: 0.10, payoutBonus: 0,    xpBonus: 0,    category: 'equipment' },
  { id: 'standing-desk',  name: 'Standing Desk',   description: 'Productivity boost',         cost: 350, levelRequired: 2, speedBonus: 0.06, payoutBonus: 0.08, xpBonus: 0,    category: 'equipment' },
  { id: 'second-monitor', name: '2nd Monitor',     description: 'Double your workflow',       cost: 400, levelRequired: 3, speedBonus: 0,    payoutBonus: 0.12, xpBonus: 0,    category: 'equipment' },
  { id: 'whiteboard',     name: 'Whiteboard',      description: 'Plan it out',                cost: 200, levelRequired: 2, speedBonus: 0,    payoutBonus: 0,    xpBonus: 0.05, category: 'equipment' },
  { id: 'pro-phone',      name: 'Pro Phone',       description: 'Close deals on the go',      cost: 500, levelRequired: 4, speedBonus: 0,    payoutBonus: 0.15, xpBonus: 0,    category: 'equipment' },
  { id: 'gaming-chair',   name: 'Gaming Chair',    description: 'Because why not',            cost: 550, levelRequired: 4, speedBonus: 0.08, payoutBonus: 0.08, xpBonus: 0.05, category: 'equipment' },
];

// ─── Furniture / Decor ────────────────────────────────────────────────────────
export interface FurnitureItemDef {
  id: string;
  name: string;
  description: string;
  cost: number;
  levelRequired: number;
  speedBonus: number;
  payoutBonus: number;
  xpBonus: number;
  mount: ItemMount;
  gridW: number;
  gridH: number;
}
export const FURNITURE_ITEMS: FurnitureItemDef[] = [
  { id: 'plant',               name: 'House Plant',      description: 'Green vibes +2% XP',        cost: 60,  levelRequired: 1, speedBonus: 0,    payoutBonus: 0,    xpBonus: 0.02, mount: 'floor', gridW: 1, gridH: 1 },
  { id: 'motivational-poster', name: 'Hustle Poster',    description: '"Rise & Grind" +2% speed',  cost: 35,  levelRequired: 1, speedBonus: 0.02, payoutBonus: 0,    xpBonus: 0,    mount: 'wall',  gridW: 1, gridH: 1 },
  { id: 'bookshelf',           name: 'Bookshelf',        description: 'Knowledge +4% XP',          cost: 150, levelRequired: 1, speedBonus: 0,    payoutBonus: 0,    xpBonus: 0.04, mount: 'floor', gridW: 2, gridH: 1 },
  { id: 'mini-fridge',         name: 'Mini Fridge',      description: 'Stay refreshed +5% speed',  cost: 280, levelRequired: 3, speedBonus: 0.05, payoutBonus: 0,    xpBonus: 0,    mount: 'floor', gridW: 1, gridH: 1 },
  { id: 'led-lights',          name: 'LED Strips',       description: 'Aesthetic +2% payout',      cost: 90,  levelRequired: 1, speedBonus: 0,    payoutBonus: 0.02, xpBonus: 0,    mount: 'wall',  gridW: 2, gridH: 1 },
  { id: 'floor-lamp',          name: 'Floor Lamp',       description: 'Good lighting +2% XP',      cost: 100, levelRequired: 1, speedBonus: 0,    payoutBonus: 0,    xpBonus: 0.02, mount: 'floor', gridW: 1, gridH: 1 },
  { id: 'trophy-shelf',        name: 'Trophy Shelf',     description: 'Show off +5% payout +3% XP',cost: 250, levelRequired: 5, speedBonus: 0,    payoutBonus: 0.05, xpBonus: 0.03, mount: 'wall',  gridW: 2, gridH: 1 },
  { id: 'couch',               name: 'Couch',            description: 'Think big +8% payout',      cost: 500, levelRequired: 4, speedBonus: 0,    payoutBonus: 0.08, xpBonus: 0,    mount: 'floor', gridW: 2, gridH: 1 },
  { id: 'window-view',         name: 'City View Window', description: 'Inspiration +10% payout',   cost: 600, levelRequired: 6, speedBonus: 0,    payoutBonus: 0.10, xpBonus: 0.05, mount: 'wall',  gridW: 2, gridH: 1 },
];

// ─── Wall / Floor Styles ───────────────────────────────────────────────────────
export interface StyleDef { id: string; name: string; cost: number; levelRequired: number; value: string; bg: string; }
export const WALL_STYLES: Record<WallStyle, StyleDef> = {
  white: { id: 'white', name: 'Clean White',  cost: 0,   levelRequired: 1, value: '#F8FAFC', bg: '#E2E8F0' },
  blue:  { id: 'blue',  name: 'Ocean Blue',   cost: 200, levelRequired: 2, value: '#DBEAFE', bg: '#BFDBFE' },
  green: { id: 'green', name: 'Forest Green', cost: 200, levelRequired: 3, value: '#D1FAE5', bg: '#A7F3D0' },
  dark:  { id: 'dark',  name: 'Dark Mode',    cost: 350, levelRequired: 5, value: '#1E293B', bg: '#0F172A' },
};
export const FLOOR_STYLES: Record<FloorStyle, StyleDef> = {
  wood:   { id: 'wood',   name: 'Hardwood',     cost: 0,   levelRequired: 1, value: '#92400E', bg: '#B45309' },
  carpet: { id: 'carpet', name: 'Plush Carpet', cost: 150, levelRequired: 2, value: '#7C3AED', bg: '#6D28D9' },
  tile:   { id: 'tile',   name: 'Cool Tiles',   cost: 150, levelRequired: 3, value: '#475569', bg: '#334155' },
  marble: { id: 'marble', name: 'Marble Floor', cost: 500, levelRequired: 7, value: '#CBD5E1', bg: '#E2E8F0' },
};

// ─── Skills ────────────────────────────────────────────────────────────────────
export interface SkillDef {
  id: string; name: string; description: string;
  branch: 'hustle' | 'tech' | 'business';
  cost: number; requires: string | null;
  speedBonus: number; payoutBonus: number; xpBonus: number;
  passiveBonus: number; automationBonus: number;
}
export const SKILLS: SkillDef[] = [
  { id: 'h1', name: 'Quick Fingers',    description: '+12% task speed',         branch: 'hustle',   cost: 1, requires: null, speedBonus: 0.12, payoutBonus: 0,    xpBonus: 0,    passiveBonus: 0,    automationBonus: 0 },
  { id: 'h2', name: 'Client Whisperer', description: '+15% payout',             branch: 'hustle',   cost: 1, requires: 'h1', speedBonus: 0,    payoutBonus: 0.15, xpBonus: 0,    passiveBonus: 0,    automationBonus: 0 },
  { id: 'h3', name: 'Overtime Mode',    description: '+25% task speed',         branch: 'hustle',   cost: 2, requires: 'h2', speedBonus: 0.25, payoutBonus: 0,    xpBonus: 0,    passiveBonus: 0,    automationBonus: 0 },
  { id: 'h4', name: 'Market Savvy',     description: '+30% payout',             branch: 'hustle',   cost: 2, requires: 'h3', speedBonus: 0,    payoutBonus: 0.30, xpBonus: 0,    passiveBonus: 0,    automationBonus: 0 },
  { id: 'h5', name: 'Hustle Master',    description: '+50% manual income',      branch: 'hustle',   cost: 3, requires: 'h4', speedBonus: 0.15, payoutBonus: 0.50, xpBonus: 0,    passiveBonus: 0,    automationBonus: 0 },
  { id: 't1', name: 'System Optimizer', description: '+10% equipment effect',   branch: 'tech',     cost: 1, requires: null, speedBonus: 0.10, payoutBonus: 0,    xpBonus: 0,    passiveBonus: 0,    automationBonus: 0 },
  { id: 't2', name: 'Code Monkey',      description: 'Automations +20% faster', branch: 'tech',     cost: 1, requires: 't1', speedBonus: 0,    payoutBonus: 0,    xpBonus: 0,    passiveBonus: 0,    automationBonus: 0.20 },
  { id: 't3', name: 'Hardware Hacker',  description: 'PC upgrades 15% cheaper', branch: 'tech',     cost: 2, requires: 't2', speedBonus: 0,    payoutBonus: 0,    xpBonus: 0,    passiveBonus: 0,    automationBonus: 0 },
  { id: 't4', name: 'AI Whisperer',     description: '+30% automation payout',  branch: 'tech',     cost: 2, requires: 't3', speedBonus: 0,    payoutBonus: 0,    xpBonus: 0,    passiveBonus: 0,    automationBonus: 0.30 },
  { id: 't5', name: 'Tech God',         description: 'All automations 2x',      branch: 'tech',     cost: 3, requires: 't4', speedBonus: 0,    payoutBonus: 0,    xpBonus: 0,    passiveBonus: 0,    automationBonus: 1.0 },
  { id: 'b1', name: 'Networking',       description: '+10% passive income',     branch: 'business', cost: 1, requires: null, speedBonus: 0,    payoutBonus: 0,    xpBonus: 0,    passiveBonus: 0.10, automationBonus: 0 },
  { id: 'b2', name: 'Marketing Mind',   description: '+15% client value',       branch: 'business', cost: 1, requires: 'b1', speedBonus: 0,    payoutBonus: 0.15, xpBonus: 0,    passiveBonus: 0,    automationBonus: 0 },
  { id: 'b3', name: 'Investment Sense', description: '+12% XP gain',            branch: 'business', cost: 2, requires: 'b2', speedBonus: 0,    payoutBonus: 0,    xpBonus: 0.12, passiveBonus: 0,    automationBonus: 0 },
  { id: 'b4', name: 'Brand Builder',    description: '+20% passive income',     branch: 'business', cost: 2, requires: 'b3', speedBonus: 0,    payoutBonus: 0,    xpBonus: 0,    passiveBonus: 0.20, automationBonus: 0 },
  { id: 'b5', name: 'Empire Instinct',  description: '+50% ALL income',         branch: 'business', cost: 3, requires: 'b4', speedBonus: 0.20, payoutBonus: 0.50, xpBonus: 0.20, passiveBonus: 0.50, automationBonus: 0 },
];

// ─── Automations ───────────────────────────────────────────────────────────────
export interface AutomationDef {
  id: string; name: string; description: string;
  cost: number; levelRequired: number; pcTierRequired: number;
  incomePerMinute: number; businesses: BusinessId[];
}
export const AUTOMATIONS: AutomationDef[] = [
  { id: 'ai-assistant',      name: 'AI Assistant',       description: 'Auto-completes tasks at 1/min',   cost: 1200,  levelRequired: 5, pcTierRequired: 3, incomePerMinute: 180, businesses: ['content-studio','automation-agency'] },
  { id: 'order-bot',         name: 'Order Bot',          description: 'Processes orders automatically',  cost: 2200,  levelRequired: 6, pcTierRequired: 3, incomePerMinute: 240, businesses: ['dropshipping'] },
  { id: 'content-scheduler', name: 'Content Scheduler',  description: 'Posts content 24/7',              cost: 3800,  levelRequired: 7, pcTierRequired: 4, incomePerMinute: 350, businesses: ['content-studio','dropshipping'] },
  { id: 'client-pipeline',   name: 'Client Pipeline',    description: 'Auto-hunts for new clients',      cost: 5500,  levelRequired: 8, pcTierRequired: 4, incomePerMinute: 480, businesses: ['content-studio','automation-agency','dropshipping'] },
  { id: 'full-auto-stack',   name: 'Full Auto Stack',    description: 'Your empire runs itself',         cost: 12000, levelRequired: 9, pcTierRequired: 5, incomePerMinute: 900, businesses: ['content-studio','automation-agency','dropshipping'] },
];

// ─── Businesses ────────────────────────────────────────────────────────────────
export interface BusinessDef {
  id: BusinessId; name: string; description: string;
  flavor: string; startingCash: number;
}
export const BUSINESSES: BusinessDef[] = [
  { id: 'content-studio',    name: 'AI Content Studio',      description: 'Sell AI-assisted writing & design gigs', flavor: 'Words are your weapon. Clients love your AI-powered content.',         startingCash: 500 },
  { id: 'dropshipping',      name: 'Dropship Empire',         description: 'Build an e-commerce store, zero inventory', flavor: 'Products fly off the digital shelf. You never touch the stock.', startingCash: 500 },
  { id: 'automation-agency', name: 'AI Automation Agency',   description: 'Build AI workflows for businesses',      flavor: "You don't work — you build machines that work for you.",             startingCash: 500 },
];

// ─── Random Events ─────────────────────────────────────────────────────────────
export interface RandomEvent {
  id: string; message: string; moneyDelta: number;
  probability: number; color: string;
}
export const RANDOM_EVENTS: RandomEvent[] = [
  { id: 're1', message: 'Client tipped you! +$50',    moneyDelta: 50,  probability: 0.08, color: '#10B981' },
  { id: 're2', message: 'Viral post! Bonus $120',      moneyDelta: 120, probability: 0.04, color: '#F59E0B' },
  { id: 're3', message: 'PC crashed — task lost!',     moneyDelta: -20, probability: 0.06, color: '#EF4444' },
  { id: 're4', message: 'Referral bonus! +$75',        moneyDelta: 75,  probability: 0.05, color: '#8B5CF6' },
  { id: 're5', message: 'Tax rebate! +$200',           moneyDelta: 200, probability: 0.02, color: '#3B82F6' },
  { id: 're6', message: 'Chargeback! -$30',            moneyDelta: -30, probability: 0.05, color: '#EF4444' },
];

// ─── Character Options ─────────────────────────────────────────────────────────
export const SKIN_TONES: { id: SkinTone; color: string; name: string }[] = [
  { id: 'light',    color: '#FDDBB4', name: 'Light' },
  { id: 'medlight', color: '#E8B98B', name: 'Medium Light' },
  { id: 'medium',   color: '#C88A5C', name: 'Medium' },
  { id: 'meddark',  color: '#9E6236', name: 'Medium Dark' },
  { id: 'dark',     color: '#5C3A1E', name: 'Dark' },
];
export const HAIR_STYLES: { id: HairStyle; name: string }[] = [
  { id: 'short', name: 'Short' }, { id: 'long', name: 'Long' }, { id: 'curly', name: 'Curly' },
  { id: 'spiky', name: 'Spiky' }, { id: 'bun',  name: 'Bun'  }, { id: 'braids', name: 'Braids' },
];
export const HAIR_COLORS: { id: HairColor; color: string; name: string }[] = [
  { id: 'black',  color: '#1a1a1a', name: 'Black'  },
  { id: 'brown',  color: '#5C3317', name: 'Brown'  },
  { id: 'blonde', color: '#F5DEB3', name: 'Blonde' },
  { id: 'red',    color: '#B22222', name: 'Red'    },
  { id: 'white',  color: '#F5F5F5', name: 'White'  },
  { id: 'blue',   color: '#4169E1', name: 'Blue'   },
  { id: 'purple', color: '#8B008B', name: 'Purple' },
  { id: 'green',  color: '#228B22', name: 'Green'  },
];
export const OUTFITS: { id: OutfitId; name: string; levelRequired: number; bodyColor: string; pantColor: string }[] = [
  { id: 'startup-casual', name: 'Startup Casual', levelRequired: 1,  bodyColor: '#3B82F6', pantColor: '#1F2937' },
  { id: 'business-pro',   name: 'Business Pro',   levelRequired: 3,  bodyColor: '#1E293B', pantColor: '#1E293B' },
  { id: 'hacker-hoodie',  name: 'Hacker Hoodie',  levelRequired: 5,  bodyColor: '#111827', pantColor: '#374151' },
  { id: 'ceo-suite',      name: 'CEO Suite',       levelRequired: 8,  bodyColor: '#6D28D9', pantColor: '#4C1D95' },
  { id: 'empire-builder', name: 'Empire Builder',  levelRequired: 10, bodyColor: '#D97706', pantColor: '#92400E' },
];

// ─── Level Unlocks ─────────────────────────────────────────────────────────────
export const LEVEL_UNLOCKS: Record<number, string[]> = {
  2: ['New task: Design Logo Draft', 'New task: Create Listing'],
  3: ['Shop: Modern Desktop unlocked', 'New tasks unlocked'],
  4: ['New equipment: Pro Phone', 'Gaming Chair available'],
  5: ['AUTOMATION UNLOCKED', 'Multi-Monitor Rig available', 'New tasks unlocked'],
  6: ['Order Bot automation available', 'Trophy Shelf unlocked'],
  7: ['Content Scheduler available', 'Server Rack unlocked'],
  8: ['Client Pipeline available', 'CEO Suite outfit unlocked'],
  9: ['Full Auto Stack available', 'Mini Data Center unlocked'],
  10: ['YOU BUILT YOUR FIRST EMPIRE', 'Level 10 reached — you win!'],
};

// ─── Utils ─────────────────────────────────────────────────────────────────────
export function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Math.floor(n)}`;
}
export function formatMoneyFull(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Math.floor(n)}`;
}
