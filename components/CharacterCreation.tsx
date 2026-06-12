'use client';
import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import type { Appearance, SkinTone, HairStyle, HairColor } from '@/types/game';
import { SKIN_TONES, HAIR_STYLES, HAIR_COLORS, OUTFITS } from '@/config/gameData';
import CharacterSprite from './CharacterSprite';

export default function CharacterCreation() {
  const setScreen = useGameStore(s => s.setScreen);
  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState<Appearance>({
    skinTone: 'medium',
    hairStyle: 'short',
    hairColor: 'black',
    outfitId: 'startup-casual',
  });

  const handleNext = () => {
    if (!name.trim()) return;
    useGameStore.getState().updateAppearance(appearance);
    useGameStore.setState(s => ({ player: { ...s.player, name: name.trim() } }));
    setScreen('business-select');
  };

  return (
    <div
      className="flex flex-col items-center justify-start h-full overflow-y-auto px-4 pt-8 pb-6 gap-6"
      style={{ background: 'linear-gradient(180deg, #1E0A3C 0%, #0F0A1E 100%)' }}
    >
      {/* Title */}
      <div className="text-center">
        <div className="text-4xl mb-1">🏢</div>
        <h1 className="text-2xl font-black text-white" style={{ textShadow: '0 0 20px rgba(139,92,246,0.8)' }}>
          AI EMPIRE TYCOON
        </h1>
        <p className="text-violet-400 text-sm font-medium mt-1">Create your entrepreneur</p>
      </div>

      {/* Preview */}
      <div
        className="flex items-center justify-center rounded-2xl p-4"
        style={{ background: 'rgba(139,92,246,0.15)', border: '3px solid #7C3AED', minWidth: 120 }}
        aria-label="Character preview"
      >
        <CharacterSprite appearance={appearance} size={100} idle />
      </div>

      {/* Name */}
      <div className="w-full max-w-sm">
        <label className="block text-violet-300 text-sm font-bold mb-1" htmlFor="char-name">
          Your Name
        </label>
        <input
          id="char-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Alex, Jordan..."
          maxLength={20}
          className="w-full rounded-xl px-4 py-3 text-white font-semibold text-base outline-none"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '2px solid rgba(139,92,246,0.5)',
          }}
          onFocus={e => (e.target.style.borderColor = '#A78BFA')}
          onBlur={e => (e.target.style.borderColor = 'rgba(139,92,246,0.5)')}
          onKeyDown={e => e.key === 'Enter' && handleNext()}
        />
      </div>

      {/* Skin tone */}
      <div className="w-full max-w-sm">
        <p className="text-violet-300 text-sm font-bold mb-2">Skin Tone</p>
        <div className="flex gap-2" role="group" aria-label="Skin tone">
          {SKIN_TONES.map(s => (
            <button
              key={s.id}
              onClick={() => setAppearance(a => ({ ...a, skinTone: s.id as SkinTone }))}
              className="w-9 h-9 rounded-full transition-transform duration-150"
              style={{
                background: s.color,
                border: appearance.skinTone === s.id ? '3px solid #F59E0B' : '3px solid transparent',
                transform: appearance.skinTone === s.id ? 'scale(1.2)' : 'scale(1)',
                boxShadow: appearance.skinTone === s.id ? '0 0 10px rgba(245,158,11,0.6)' : 'none',
              }}
              aria-label={s.name}
              aria-pressed={appearance.skinTone === s.id}
            />
          ))}
        </div>
      </div>

      {/* Hair style */}
      <div className="w-full max-w-sm">
        <p className="text-violet-300 text-sm font-bold mb-2">Hair Style</p>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Hair style">
          {HAIR_STYLES.map(h => (
            <button
              key={h.id}
              onClick={() => setAppearance(a => ({ ...a, hairStyle: h.id as HairStyle }))}
              className="py-2 px-3 rounded-xl text-sm font-semibold transition-all duration-150"
              style={{
                background: appearance.hairStyle === h.id
                  ? 'linear-gradient(135deg, #7C3AED, #6D28D9)'
                  : 'rgba(255,255,255,0.07)',
                border: `2px solid ${appearance.hairStyle === h.id ? '#A78BFA' : 'rgba(255,255,255,0.15)'}`,
                color: appearance.hairStyle === h.id ? 'white' : 'rgba(255,255,255,0.6)',
              }}
              aria-pressed={appearance.hairStyle === h.id}
            >
              {h.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hair color */}
      <div className="w-full max-w-sm">
        <p className="text-violet-300 text-sm font-bold mb-2">Hair Color</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Hair color">
          {HAIR_COLORS.map(hc => (
            <button
              key={hc.id}
              onClick={() => setAppearance(a => ({ ...a, hairColor: hc.id as HairColor }))}
              className="w-8 h-8 rounded-full transition-transform duration-150"
              style={{
                background: hc.color,
                border: appearance.hairColor === hc.id ? '3px solid #F59E0B' : '3px solid rgba(255,255,255,0.2)',
                transform: appearance.hairColor === hc.id ? 'scale(1.25)' : 'scale(1)',
                boxShadow: appearance.hairColor === hc.id ? '0 0 8px rgba(245,158,11,0.7)' : 'none',
              }}
              aria-label={hc.name}
              aria-pressed={appearance.hairColor === hc.id}
            />
          ))}
        </div>
      </div>

      {/* Outfit */}
      <div className="w-full max-w-sm">
        <p className="text-violet-300 text-sm font-bold mb-2">Starting Outfit</p>
        <div className="grid grid-cols-1 gap-2">
          {OUTFITS.filter(o => o.levelRequired === 1).map(o => (
            <button
              key={o.id}
              onClick={() => setAppearance(a => ({ ...a, outfitId: o.id }))}
              className="py-2.5 px-4 rounded-xl text-sm font-semibold text-left transition-all duration-150"
              style={{
                background: appearance.outfitId === o.id
                  ? 'linear-gradient(135deg, rgba(109,40,217,0.6), rgba(91,33,182,0.6))'
                  : 'rgba(255,255,255,0.05)',
                border: `2px solid ${appearance.outfitId === o.id ? '#A78BFA' : 'rgba(255,255,255,0.1)'}`,
                color: 'white',
              }}
              aria-pressed={appearance.outfitId === o.id}
            >
              {o.name}
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={handleNext}
        disabled={!name.trim()}
        className="w-full max-w-sm py-4 rounded-2xl text-lg font-black text-white transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: name.trim()
            ? 'linear-gradient(135deg, #7C3AED, #6D28D9)'
            : 'rgba(255,255,255,0.1)',
          border: '3px solid rgba(167,139,250,0.5)',
          boxShadow: name.trim() ? '0 4px 20px rgba(124,58,237,0.5)' : 'none',
        }}
        aria-label="Continue to business selection"
      >
        Choose Your Business →
      </button>
    </div>
  );
}
