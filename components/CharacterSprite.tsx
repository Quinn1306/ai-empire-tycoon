'use client';
import type { ReactElement } from 'react';
import type { Appearance } from '@/types/game';
import { SKIN_TONES, HAIR_COLORS, OUTFITS } from '@/config/gameData';

interface Props {
  appearance: Appearance;
  size?: number;
  idle?: boolean;
}

export default function CharacterSprite({ appearance, size = 80, idle = true }: Props) {
  const skinColor = SKIN_TONES.find(s => s.id === appearance.skinTone)?.color ?? '#C88A5C';
  const hairColor = HAIR_COLORS.find(h => h.id === appearance.hairColor)?.color ?? '#1a1a1a';
  const outfit = OUTFITS.find(o => o.id === appearance.outfitId);
  const bodyColor = outfit?.bodyColor ?? '#3B82F6';
  const pantColor = outfit?.pantColor ?? '#1F2937';

  const scale = size / 80;

  const hairPath: Record<string, ReactElement> = {
    short: <rect x="18" y="5" width="24" height="12" rx="4" fill={hairColor} />,
    long:  <><rect x="18" y="5" width="24" height="12" rx="4" fill={hairColor} /><rect x="12" y="15" width="8" height="18" rx="3" fill={hairColor} /><rect x="40" y="15" width="8" height="18" rx="3" fill={hairColor} /></>,
    curly: <><ellipse cx="30" cy="10" rx="14" ry="9" fill={hairColor} /><circle cx="20" cy="12" r="5" fill={hairColor} /><circle cx="40" cy="12" r="5" fill={hairColor} /></>,
    spiky: <><rect x="18" y="5" width="24" height="10" rx="2" fill={hairColor} /><polygon points="22,5 25,0 28,5" fill={hairColor} /><polygon points="28,5 31,0 34,5" fill={hairColor} /><polygon points="34,5 37,0 40,5" fill={hairColor} /></>,
    bun:   <><rect x="20" y="8" width="20" height="10" rx="5" fill={hairColor} /><circle cx="30" cy="4" r="6" fill={hairColor} /></>,
    braids:<><rect x="18" y="5" width="24" height="10" rx="4" fill={hairColor} /><rect x="13" y="14" width="6" height="22" rx="3" fill={hairColor} /><rect x="41" y="14" width="6" height="22" rx="3" fill={hairColor} /></>,
  };

  return (
    <div
      className={idle ? 'char-idle' : ''}
      style={{ width: size, height: size * 1.2, display: 'inline-block' }}
      role="img"
      aria-label="Character"
    >
      <svg
        viewBox="0 0 60 72"
        width={size}
        height={size * 1.2}
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {/* Body */}
        <rect x="18" y="32" width="24" height="20" rx="4" fill={bodyColor} />
        {/* Pants */}
        <rect x="18" y="50" width="10" height="18" rx="3" fill={pantColor} />
        <rect x="32" y="50" width="10" height="18" rx="3" fill={pantColor} />
        {/* Arms */}
        <rect x="8" y="33" width="10" height="14" rx="4" fill={bodyColor} />
        <rect x="42" y="33" width="10" height="14" rx="4" fill={bodyColor} />
        {/* Hands */}
        <circle cx="13" cy="48" r="5" fill={skinColor} />
        <circle cx="47" cy="48" r="5" fill={skinColor} />
        {/* Head */}
        <ellipse cx="30" cy="22" rx="13" ry="14" fill={skinColor} />
        {/* Eyes */}
        <circle cx="25" cy="20" r="2.2" fill="#1a1a1a" />
        <circle cx="35" cy="20" r="2.2" fill="#1a1a1a" />
        <circle cx="25.8" cy="19.2" r="0.8" fill="white" />
        <circle cx="35.8" cy="19.2" r="0.8" fill="white" />
        {/* Smile */}
        <path d="M25 26 Q30 30 35 26" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Hair */}
        {hairPath[appearance.hairStyle] ?? hairPath.short}
      </svg>
    </div>
  );
}
