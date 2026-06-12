import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '..');

// Covers the main Unicode emoji ranges
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FA9F}\u{1F004}\u{1F0CF}]/u;

function findEmojis(source: string): string[] {
  return source
    .split('\n')
    .map((line, i) => ({ line, num: i + 1 }))
    .filter(({ line }) => EMOJI_REGEX.test(line))
    .map(({ line, num }) => `  Line ${num}: ${line.trim()}`);
}

describe('No emoji in scene/shop components', () => {
  it('Shop.tsx contains no emoji', () => {
    const src = readFileSync(resolve(ROOT, 'components/Shop.tsx'), 'utf-8');
    const hits = findEmojis(src);
    expect(hits, `Emoji found in Shop.tsx:\n${hits.join('\n')}`).toHaveLength(0);
  });

  it('OfficeScene.tsx contains no emoji', () => {
    const src = readFileSync(resolve(ROOT, 'components/OfficeScene.tsx'), 'utf-8');
    const hits = findEmojis(src);
    expect(hits, `Emoji found in OfficeScene.tsx:\n${hits.join('\n')}`).toHaveLength(0);
  });
});
