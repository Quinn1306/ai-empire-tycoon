export type SkinTone = 'light' | 'medlight' | 'medium' | 'meddark' | 'dark';
export type HairStyle = 'short' | 'long' | 'curly' | 'spiky' | 'bun' | 'braids';
export type HairColor = 'black' | 'brown' | 'blonde' | 'red' | 'white' | 'blue' | 'purple' | 'green';
export type OutfitId = 'startup-casual' | 'business-pro' | 'hacker-hoodie' | 'ceo-suite' | 'empire-builder';
export type BusinessId = 'content-studio' | 'dropshipping' | 'automation-agency';
export type WallStyle = 'white' | 'blue' | 'green' | 'dark';
export type FloorStyle = 'wood' | 'carpet' | 'tile' | 'marble';
export type Screen = 'loading' | 'character-creation' | 'business-select' | 'game' | 'end';
export type Panel = 'none' | 'work' | 'shop' | 'skills' | 'character' | 'automation';
export type ShopTab = 'equipment' | 'furniture' | 'wall-decor' | 'skins';
export type ItemMount = 'floor' | 'wall';

export interface Appearance {
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: HairColor;
  outfitId: OutfitId;
}

export interface Player {
  name: string;
  level: number;
  xp: number;
  skillPoints: number;
  unlockedSkills: string[];
  appearance: Appearance;
}

export interface Bank {
  balance: number;
  lifetimeEarned: number;
}

export interface ActiveTask {
  taskId: string;
  startedAt: number;
  duration: number;
}

export interface Business {
  id: BusinessId;
  activeTask: ActiveTask | null;
}

export interface PlacedItem {
  instanceId: string;
  itemId: string;
  gridX: number;
  gridY: number;
}

export interface Office {
  floorItems: PlacedItem[];
  wallItems: PlacedItem[];
  wallStyle: WallStyle;
  floorStyle: FloorStyle;
}

export interface Equipment {
  pcTier: number;
  ownedItemIds: string[];
}

export interface Automation {
  id: string;
  active: boolean;
  lastTickAt: number;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export interface PendingPlacement {
  itemId: string;
  mount: ItemMount;
}

export interface GameState {
  screen: Screen;
  activePanel: Panel;
  player: Player;
  bank: Bank;
  business: Business | null;
  office: Office;
  equipment: Equipment;
  automations: Automation[];
  floatingTexts: FloatingText[];
  pendingLevelUp: number | null;
  pendingPlacement: PendingPlacement | null;
  meta: {
    lastSavedAt: number;
    lastSeenAt: number;
    version: number;
  };
}
