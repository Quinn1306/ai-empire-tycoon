import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { EQUIPMENT_ITEMS, FURNITURE_ITEMS } from '@/config/gameData';

const ROOT = resolve(__dirname, '..');
const spriteSource = readFileSync(resolve(ROOT, 'components/sprites/ItemSprite.tsx'), 'utf-8');

// Extract the keys that are registered in SPRITE_REGISTRY by scanning the source
// Matches patterns like: 'pc-1': Pc1  or  "ergo-chair": ErgoChair
const registeredKeys = new Set(
  [...spriteSource.matchAll(/['"]([\w-]+)['"]\s*:\s*\w+/g)].map(m => m[1])
);

describe('SPRITE_REGISTRY completeness', () => {
  const PC_IDS = ['pc-1', 'pc-2', 'pc-3', 'pc-4', 'pc-5', 'pc-6'];

  it('registers all 6 PC tiers', () => {
    for (const id of PC_IDS) {
      expect(registeredKeys, `Missing sprite for "${id}"`).toContain(id);
    }
  });

  it('registers every equipment item', () => {
    for (const item of EQUIPMENT_ITEMS) {
      expect(registeredKeys, `Missing sprite for equipment "${item.id}"`).toContain(item.id);
    }
  });

  it('registers every furniture item', () => {
    for (const item of FURNITURE_ITEMS) {
      expect(registeredKeys, `Missing sprite for furniture "${item.id}"`).toContain(item.id);
    }
  });
});
