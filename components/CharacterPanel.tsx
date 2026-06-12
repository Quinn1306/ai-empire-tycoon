'use client';
import { useGameStore } from '@/store/gameStore';
import type { Appearance, SkinTone, HairStyle, HairColor, OutfitId } from '@/types/game';
import { SKIN_TONES, HAIR_STYLES, HAIR_COLORS, OUTFITS } from '@/config/gameData';
import CharacterSprite from './CharacterSprite';

export default function CharacterPanel() {
  const player = useGameStore(s => s.player);
  const updateAppearance = useGameStore(s => s.updateAppearance);
  const setPanel = useGameStore(s => s.setPanel);

  const update = (partial: Partial<Appearance>) => {
    updateAppearance({ ...player.appearance, ...partial });
  };

  const availableOutfits = OUTFITS.filter(o => o.levelRequired <= player.level);

  return (
    <div
      className="panel-slide-up flex flex-col h-full"
      style={{ background: 'linear-gradient(180deg, #1A0533 0%, #0F0A1E 100%)' }}
      role="region"
      aria-label="Character customization"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h2 className="text-white font-black text-base flex items-center gap-2">👤 Your Look</h2>
        <button onClick={() => setPanel('none')} className="text-slate-400 hover:text-white text-xl px-2" aria-label="Close character panel">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
        {/* Preview */}
        <div
          className="flex items-center justify-center py-4 rounded-2xl"
          style={{ background: 'rgba(139,92,246,0.1)', border: '2px solid rgba(139,92,246,0.2)' }}
        >
          <CharacterSprite appearance={player.appearance} size={90} idle />
        </div>

        {/* Skin tone */}
        <div>
          <p className="text-violet-300 text-xs font-bold mb-2 uppercase tracking-wider">Skin Tone</p>
          <div className="flex gap-2 flex-wrap" role="group" aria-label="Skin tone">
            {SKIN_TONES.map(s => (
              <button
                key={s.id}
                onClick={() => update({ skinTone: s.id as SkinTone })}
                className="w-9 h-9 rounded-full transition-all duration-150"
                style={{
                  background: s.color,
                  border: player.appearance.skinTone === s.id ? '3px solid #F59E0B' : '3px solid rgba(255,255,255,0.15)',
                  transform: player.appearance.skinTone === s.id ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: player.appearance.skinTone === s.id ? '0 0 10px rgba(245,158,11,0.5)' : 'none',
                }}
                aria-label={s.name}
                aria-pressed={player.appearance.skinTone === s.id}
              />
            ))}
          </div>
        </div>

        {/* Hair style */}
        <div>
          <p className="text-violet-300 text-xs font-bold mb-2 uppercase tracking-wider">Hair Style</p>
          <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Hair style">
            {HAIR_STYLES.map(h => (
              <button
                key={h.id}
                onClick={() => update({ hairStyle: h.id as HairStyle })}
                className="py-1.5 rounded-xl text-xs font-bold transition-all duration-150"
                style={{
                  background: player.appearance.hairStyle === h.id
                    ? 'linear-gradient(135deg, #7C3AED, #6D28D9)'
                    : 'rgba(255,255,255,0.07)',
                  border: `2px solid ${player.appearance.hairStyle === h.id ? '#A78BFA' : 'rgba(255,255,255,0.12)'}`,
                  color: player.appearance.hairStyle === h.id ? 'white' : 'rgba(255,255,255,0.6)',
                }}
                aria-pressed={player.appearance.hairStyle === h.id}
              >
                {h.name}
              </button>
            ))}
          </div>
        </div>

        {/* Hair color */}
        <div>
          <p className="text-violet-300 text-xs font-bold mb-2 uppercase tracking-wider">Hair Color</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Hair color">
            {HAIR_COLORS.map(hc => (
              <button
                key={hc.id}
                onClick={() => update({ hairColor: hc.id as HairColor })}
                className="w-8 h-8 rounded-full transition-all duration-150"
                style={{
                  background: hc.color,
                  border: player.appearance.hairColor === hc.id ? '3px solid #F59E0B' : '3px solid rgba(255,255,255,0.2)',
                  transform: player.appearance.hairColor === hc.id ? 'scale(1.25)' : 'scale(1)',
                  boxShadow: player.appearance.hairColor === hc.id ? '0 0 8px rgba(245,158,11,0.6)' : 'none',
                }}
                aria-label={hc.name}
                aria-pressed={player.appearance.hairColor === hc.id}
              />
            ))}
          </div>
        </div>

        {/* Outfits */}
        <div>
          <p className="text-violet-300 text-xs font-bold mb-2 uppercase tracking-wider">Outfit</p>
          <div className="flex flex-col gap-1.5" role="group" aria-label="Outfit">
            {OUTFITS.map(o => {
              const unlocked = o.levelRequired <= player.level;
              return (
                <button
                  key={o.id}
                  onClick={() => { if (unlocked) update({ outfitId: o.id as OutfitId }); }}
                  disabled={!unlocked}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-all duration-150"
                  style={{
                    background: player.appearance.outfitId === o.id
                      ? 'linear-gradient(135deg, rgba(109,40,217,0.4), rgba(91,33,182,0.3))'
                      : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${player.appearance.outfitId === o.id ? '#A78BFA' : 'rgba(255,255,255,0.1)'}`,
                    opacity: unlocked ? 1 : 0.4,
                  }}
                  aria-pressed={player.appearance.outfitId === o.id}
                  aria-label={`${o.name}${!unlocked ? ` — unlocks at level ${o.levelRequired}` : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded"
                      style={{ background: `linear-gradient(135deg, ${o.bodyColor}, ${o.pantColor})`, border: '1px solid rgba(255,255,255,0.2)' }}
                    />
                    <span className="text-sm font-bold text-white">{o.name}</span>
                  </div>
                  {!unlocked ? (
                    <span className="text-xs text-amber-500 font-bold">🔒 Lv.{o.levelRequired}</span>
                  ) : player.appearance.outfitId === o.id ? (
                    <span className="text-xs text-violet-400 font-bold">✓ Wearing</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
